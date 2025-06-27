// src/screens/Carrito.js
import React, { useContext, useEffect, useState  } from 'react';
import { Container, Row, Col, Card, Button, Table, Form, Alert } from 'react-bootstrap';
import { FaTrash, FaArrowLeft, FaCreditCard, FaSignInAlt } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../Navigation/CartContext';

const Carrito = () => {
    const { carrito, actualizarCantidad, eliminarDelCarrito } = useContext(CartContext);
    const navigate = useNavigate();
    const [showLoginAlert, setShowLoginAlert] = useState(false);

    // Verificar autenticación al cargar el componente
    useEffect(() => {
        if (!localStorage.getItem('token')) {
            setShowLoginAlert(true);
        }
    }, []);

    const calcularTotal = () => {
        return carrito.reduce((total, item) => total + (item.precio * item.cantidad), 0);
    };

    const handleCheckout = () => {
        if (!localStorage.getItem('token')) {
            setShowLoginAlert(true);
            return;
        }
        navigate('/checkout');
    };

    if (!localStorage.getItem('token')) {
        return (
            <Container style={{ backgroundColor: '#FDF2E0', minHeight: '100vh', padding: '30px 0' }}>
                <Row className="mb-4">
                    <Col>
                        <h2 style={{ color: '#9A1E47' }}>Tu Carrito de Compras</h2>
                    </Col>
                </Row>
                
                <Row>
                    <Col className="text-center">
                        <Card style={{ backgroundColor: 'white', padding: '40px' }}>
                            {showLoginAlert && (
                                <Alert variant="warning" onClose={() => setShowLoginAlert(false)} dismissible>
                                    Debes iniciar sesión para ver tu carrito
                                </Alert>
                            )}
                            <h4 style={{ color: '#9A1E47' }}>Inicia sesión para acceder a tu carrito</h4>
                            <Link to="/login">
                                <Button 
                                    variant="primary" 
                                    style={{ 
                                        backgroundColor: '#9A1E47', 
                                        border: 'none', 
                                        marginTop: '20px',
                                        display: 'inline-flex',
                                        alignItems: 'center'
                                    }}
                                >
                                    <FaSignInAlt className="me-2" />
                                    Iniciar Sesión
                                </Button>
                            </Link>
                            <div className="mt-3">
                                <span style={{ color: '#555' }}>¿No tienes cuenta? </span>
                                <Link to="/registro" style={{ color: '#1E8546' }}>Regístrate aquí</Link>
                            </div>
                        </Card>
                    </Col>
                </Row>
            </Container>
        );
    }

    return (
        <Container style={{ backgroundColor: '#FDF2E0', minHeight: '100vh', padding: '30px 0' }}>
            <Row className="mb-4">
                <Col>
                    <h2 style={{ color: '#9A1E47' }}>Tu Carrito de Compras</h2>
                </Col>
            </Row>

            {carrito.length === 0 ? (
                <Row>
                    <Col className="text-center">
                        <Card style={{ backgroundColor: 'white', padding: '40px' }}>
                            <h4 style={{ color: '#9A1E47' }}>Tu carrito está vacío</h4>
                            <Link to="/artesanias">
                                <Button variant="primary" style={{ backgroundColor: '#9A1E47', border: 'none', marginTop: '20px' }}>
                                    Explorar Artesanías
                                </Button>
                            </Link>
                        </Card>
                    </Col>
                </Row>
            ) : (
                <>
                    <Row>
                        <Col md={8}>
                            <Card style={{ backgroundColor: 'white' }}>
                                <Card.Body>
                                    <Table responsive>
                                        <thead>
                                            <tr>
                                                <th>Producto</th>
                                                <th>Precio</th>
                                                <th>Cantidad</th>
                                                <th>Subtotal</th>
                                                <th></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {carrito.map((item) => (
                                                <tr key={item.id}>
                                                    <td>
                                                        <div className="d-flex align-items-center">
                                                            <img
                                                                src={item.imagen}
                                                                alt={item.nombre}
                                                                style={{ width: '50px', height: '50px', objectFit: 'cover', marginRight: '15px' }}
                                                            />
                                                            {item.nombre}
                                                        </div>
                                                    </td>
                                                    <td>${item.precio}</td>
                                                    <td>
                                                        <Form.Control
                                                            type="number"
                                                            min="1"
                                                            value={item.cantidad}
                                                            onChange={(e) => actualizarCantidad(item.id, parseInt(e.target.value))}
                                                            style={{ width: '70px' }}
                                                        />
                                                    </td>
                                                    <td>${item.precio * item.cantidad}</td>
                                                    <td>
                                                        <Button
                                                            variant="danger"
                                                            size="sm"
                                                            onClick={() => eliminarDelCarrito(item.id)}
                                                        >
                                                            <FaTrash />
                                                        </Button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </Table>
                                </Card.Body>
                            </Card>
                        </Col>

                        <Col md={4}>
                            <Card style={{ backgroundColor: 'white' }}>
                                <Card.Body>
                                    <h4 style={{ color: '#9A1E47' }}>Resumen de Compra</h4>
                                    <div className="d-flex justify-content-between mt-4">
                                        <span>Subtotal:</span>
                                        <span>${calcularTotal()}</span>
                                    </div>
                                    <div className="d-flex justify-content-between mt-2">
                                        <span>Envío:</span>
                                        <span>$0</span>
                                    </div>
                                    <hr />
                                    <div className="d-flex justify-content-between fw-bold">
                                        <span>Total:</span>
                                        <span style={{ color: '#9A1E47' }}>${calcularTotal()}</span>
                                    </div>

                                    <Button
                                        variant="primary"
                                        className="w-100 mt-4"
                                        style={{ backgroundColor: '#9A1E47', border: 'none' }}
                                        onClick={handleCheckout}
                                    >
                                        <FaCreditCard className="me-2" />
                                        Proceder al Pago
                                    </Button>

                                    <Link to="/artesanias">
                                        <Button variant="outline-primary" className="w-100 mt-2">
                                            <FaArrowLeft className="me-2" />
                                            Seguir Comprando
                                        </Button>
                                    </Link>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </>
            )}
        </Container>
    );
};

export default Carrito;