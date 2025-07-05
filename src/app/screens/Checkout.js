// src/screens/Checkout.js
import React, { useState, useContext } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { FaArrowLeft, FaCreditCard, FaMapMarkerAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { CartContext } from '../Navigation/CartContext';

const Checkout = () => {
    const { carrito, vaciarCarrito } = useContext(CartContext);
    const token = localStorage.getItem("token");

    const [formData, setFormData] = useState({
        nombre: '',
        email: '',
        direccion: '',
        ciudad: '',
        codigoPostal: '',
        metodoPago: '',
        numeroTarjeta: '',
        vencimiento: '',
        cvv: '',
        cuentaPaypal: '',
        referenciaTransferencia: ''
    });

    const [ordenCompletada, setOrdenCompletada] = useState(false);
    const userData = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;

    if (userData?.rol === 'turista') {
        return (
            <Container className="py-5" style={{ backgroundColor: "#FDF2E0", minHeight: "100vh" }}>
                <Row className="justify-content-center">
                    <Col md={8}>
                        <Card className="p-4 text-center" style={{ backgroundColor: "white" }}>
                            <h3 style={{ color: "#D24D1C" }}>Acceso Restringido</h3>
                            <p>Los usuarios con rol <strong>turista</strong> no pueden completar compras.</p>
                            <Link to="/perfil">
                                <Button variant="primary" style={{ backgroundColor: "#9A1E47", border: "none" }}>
                                    Volver al Perfil
                                </Button>
                            </Link>
                        </Card>
                    </Col>
                </Row>
            </Container>
        );
    }

    const metodoPagoMap = {
        tarjeta: "Tarjeta",
        paypal: "PayPal",
        transferencia: "Transferencia"
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const calcularTotal = () => {
        return carrito.reduce((total, item) => total + (item.precio * item.cantidad), 0);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (carrito.length === 0) {
            alert("Tu carrito está vacío.");
            return;
        }

        // Validaciones manuales de campos de pago
        if (formData.metodoPago === "tarjeta") {
            if (!formData.numeroTarjeta || !formData.vencimiento || !formData.cvv) {
                alert("Por favor completa todos los campos de la tarjeta.");
                return;
            }
        } else if (formData.metodoPago === "paypal") {
            if (!formData.cuentaPaypal) {
                alert("Por favor ingresa tu cuenta de PayPal.");
                return;
            }
        } else if (formData.metodoPago === "transferencia") {
            if (!formData.referenciaTransferencia) {
                alert("Por favor ingresa la referencia de transferencia.");
                return;
            }
        }

        // Preparar los productos
        const productos = carrito.map(item => ({
            idProducto: item.id,
            Nombre: item.nombre,
            Imagen: item.imagen || '',
            Precio: item.precio,
            Cantidad: item.cantidad
        }));

        const subtotal = parseFloat(productos.reduce((acc, p) => acc + (p.Precio * p.Cantidad), 0).toFixed(2));
        const envio = 5.00;
        const total = parseFloat((subtotal + envio).toFixed(2));

        let detallesPago = {};
        console.log("📋 formData:", formData);

        if (formData.metodoPago === "tarjeta") {
            const tarjetaRegex = /^\d{16}$/;
            const cvvRegex = /^\d{3}$/;
            const vencimientoRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;

            if (!formData.numeroTarjeta.match(tarjetaRegex)) {
                alert("El número de tarjeta debe tener 16 dígitos.");
                return;
            }

            if (!formData.vencimiento.match(vencimientoRegex)) {
                alert("La fecha de vencimiento debe tener el formato MM/AA.");
                return;
            }

            if (!formData.cvv.match(cvvRegex)) {
                alert("El CVV debe tener 3 dígitos.");
                return;
            }

            detallesPago = {
                numeroTarjeta: formData.numeroTarjeta,
                vencimiento: formData.vencimiento,
                cvv: formData.cvv
            };
        } else if (formData.metodoPago === "paypal") {
            detallesPago = {
                cuentaPaypal: formData.cuentaPaypal
            };
        } else if (formData.metodoPago === "transferencia") {
            detallesPago = {
                referenciaTransferencia: formData.referenciaTransferencia
            };
        }

        const pedido = {
            productos,
            direccionEnvio: {
                Nombre: formData.nombre,
                Email: formData.email,
                Direccion: formData.direccion,
                Ciudad: formData.ciudad,
                CodigoPostal: formData.codigoPostal
            },
            metodoPago: metodoPagoMap[formData.metodoPago],
            detallesPago: detallesPago,
            subtotal,
            envio,
            total
        };

        console.log("📋 Pedido a enviar:", pedido); // Agrega este log para depuración

        try {
            const response = await fetch("http://localhost:5000/api/pedidos", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(pedido)
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.mensaje || data.error || "No se pudo crear el pedido");

            localStorage.setItem("ultimoPedidoId", data._id);
            vaciarCarrito();
            setOrdenCompletada(true);

        } catch (error) {
            console.error("❌ Error creando el pedido:", error);
            alert("Error al procesar el pedido: " + error.message);
        }
    };


    const renderCamposPago = () => {
        switch (formData.metodoPago) {
            case 'tarjeta':
                return (
                    <>
                        <Form.Group controlId="numeroTarjeta" className="mb-2">
                            <Form.Label>Número de Tarjeta</Form.Label>
                            <Form.Control type="text" name="numeroTarjeta" value={formData.numeroTarjeta}
                                onChange={(e) => setFormData({
                                    ...formData,
                                    numeroTarjeta: e.target.value.replace(/[^\d]/g, '').slice(0, 16)
                                })}
                                required />
                        </Form.Group>
                        <Row>
                            <Col>
                                <Form.Group controlId="vencimiento" className="mb-2">
                                    <Form.Label>Vencimiento</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="vencimiento"
                                        placeholder="MM/AA"
                                        maxLength={5}
                                        value={formData.vencimiento}
                                        onChange={(e) => {
                                            let value = e.target.value.replace(/[^\d]/g, "");

                                            if (value.length >= 3) {
                                                value = value.slice(0, 2) + "/" + value.slice(2, 4);
                                            }

                                            setFormData({ ...formData, vencimiento: value });
                                        }}
                                        required
                                    />
                                </Form.Group>

                            </Col>
                            <Col>
                                <Form.Group controlId="cvv" className="mb-2">
                                    <Form.Label>CVV</Form.Label>
                                    <Form.Control type="text" name="cvv" value={formData.cvv}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            cvv: e.target.value.replace(/[^\d]/g, '').slice(0, 3)
                                        })}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                    </>
                );
            case 'paypal':
                return (
                    <Form.Group controlId="cuentaPaypal" className="mb-3">
                        <Form.Label>Correo de PayPal</Form.Label>
                        <Form.Control type="email" name="cuentaPaypal" value={formData.cuentaPaypal} onChange={handleChange} required />
                    </Form.Group>
                );
            case 'transferencia':
                return (
                    <Form.Group controlId="referenciaTransferencia" className="mb-3">
                        <Form.Label>Referencia de Transferencia</Form.Label>
                        <Form.Control type="text" name="referenciaTransferencia" value={formData.referenciaTransferencia} onChange={handleChange} required />
                    </Form.Group>
                );
            default:
                return null;
        }
    };

    if (ordenCompletada) {
        return (
            <Container style={{ backgroundColor: '#FDF2E0', minHeight: '100vh', padding: '30px 0' }}>
                <Row className="justify-content-center">
                    <Col md={8}>
                        <Alert variant="success" className="text-center" style={{ backgroundColor: '#1E8546', color: 'white' }}>
                            <h4>¡Pago Completado con Éxito!</h4>
                            <p>Tu orden ha sido procesada correctamente. Hemos enviado los detalles a tu correo electrónico.</p>
                            <Link to="/confirmacion">
                                <Button variant="light" style={{ color: '#1E8546', marginTop: '15px' }}>
                                    Ver Confirmación
                                </Button>
                            </Link>
                        </Alert>
                    </Col>
                </Row>
            </Container>
        );
    }

    return (
        <Container style={{ backgroundColor: '#FDF2E0', minHeight: '100vh', padding: '30px 0' }}>
            <Row>
                <Col md={8}>
                    <Card className="mb-4" style={{ backgroundColor: 'white' }}>
                        <Card.Body>
                            <h3 style={{ color: '#9A1E47' }}>Información de Envío</h3>
                            <Form onSubmit={handleSubmit}>
                                <Row className="mb-3">
                                    <Col md={6}>
                                        <Form.Group controlId="nombre">
                                            <Form.Label>Nombre Completo</Form.Label>
                                            <Form.Control type="text" name="nombre" value={formData.nombre} onChange={handleChange} required />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group controlId="email">
                                            <Form.Label>Correo Electrónico</Form.Label>
                                            <Form.Control type="email" name="email" value={formData.email} onChange={handleChange} required />
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Form.Group controlId="direccion" className="mb-3">
                                    <Form.Label><FaMapMarkerAlt className="me-2" /> Dirección</Form.Label>
                                    <Form.Control type="text" name="direccion" value={formData.direccion} onChange={handleChange} required />
                                </Form.Group>

                                <Row className="mb-3">
                                    <Col md={6}>
                                        <Form.Group controlId="ciudad">
                                            <Form.Label>Ciudad</Form.Label>
                                            <Form.Control type="text" name="ciudad" value={formData.ciudad} onChange={handleChange} required />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group controlId="codigoPostal">
                                            <Form.Label>Código Postal</Form.Label>
                                            <Form.Control type="text" name="codigoPostal" value={formData.codigoPostal} onChange={handleChange} required />
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <h3 style={{ color: '#9A1E47', marginTop: '30px' }}>Método de Pago</h3>
                                <Form.Group controlId="metodoPago" className="mb-3">
                                    <Form.Check type="radio" label="Tarjeta de Crédito/Débito" name="metodoPago" value="tarjeta" checked={formData.metodoPago === 'tarjeta'} onChange={handleChange} />
                                    <Form.Check type="radio" label="PayPal" name="metodoPago" value="paypal" checked={formData.metodoPago === 'paypal'} onChange={handleChange} />
                                    <Form.Check type="radio" label="Transferencia Bancaria" name="metodoPago" value="transferencia" checked={formData.metodoPago === 'transferencia'} onChange={handleChange} />
                                </Form.Group>

                                {renderCamposPago()}

                                <div className="d-flex justify-content-between mt-4">
                                    <Link to="/carrito">
                                        <Button variant="outline-primary">
                                            <FaArrowLeft className="me-2" /> Volver al Carrito
                                        </Button>
                                    </Link>
                                    <Button type="submit" style={{ backgroundColor: '#9A1E47', border: 'none' }}>
                                        <FaCreditCard className="me-2" /> Confirmar Pedido y Pagar
                                    </Button>
                                </div>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={4}>
                    <Card style={{ backgroundColor: 'white' }}>
                        <Card.Body>
                            <h4 style={{ color: '#9A1E47' }}>Resumen de Orden</h4>
                            {carrito.map((item) => (
                                <div key={item.id} className="d-flex justify-content-between mb-2">
                                    <span>{item.nombre} x {item.cantidad}</span>
                                    <span>${(item.precio * item.cantidad).toFixed(2)}</span>
                                </div>
                            ))}
                            <hr />
                            <div className="d-flex justify-content-between fw-bold">
                                <span>Subtotal:</span>
                                <span>${calcularTotal().toFixed(2)}</span>
                            </div>
                            <div className="d-flex justify-content-between fw-bold">
                                <span>Envío:</span>
                                <span>$5.00</span>
                            </div>
                            <hr />
                            <div className="d-flex justify-content-between fw-bold">
                                <span>Total:</span>
                                <span style={{ color: '#9A1E47' }}>${(calcularTotal() + 5).toFixed(2)}</span>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default Checkout;
