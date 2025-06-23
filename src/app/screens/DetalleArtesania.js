// src/screens/DetalleArtesania.js
import React, { useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Alert, Badge, ListGroup, Form } from 'react-bootstrap';
import { FaShoppingCart, FaArrowLeft, FaCreditCard, FaMapMarkerAlt } from 'react-icons/fa';
import { FaStar } from 'react-icons/fa';
import tenango from "../image/Yahualica.png";
import { CartContext } from '../Navigation/CartContext';

const DetalleArtesania = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [cantidad, setCantidad] = useState(1);
    const [metodoPago, setMetodoPago] = useState('mercadoPago');
    const [showSuccess, setShowSuccess] = useState(false);
    const { agregarAlCarrito } = useContext(CartContext);

    const productos = [
        {
            id: '1',
            nombre: 'Bordado Tenango',
            descripcion: 'Bordado tradicional de la comunidad Otomí con diseños coloridos de flora y fauna local.',
            precio: 350,
            precioOriginal: 450,
            valoracion: 4,
            reseñas: 15,
            categoria: 'Textiles',
            comunidad: 'Tenango de Doria',
            imagen: tenango,
            envio: true,
            costoEnvio: 50,
            tecnica: 'Bordado a mano',
            tiempoElaboracion: '2 semanas',
            materiales: 'Hilo de algodón, tela manta',
            medidas: '50x70 cm',
            historia: 'Esta técnica se transmite de generación en generación en la comunidad Otomí de Tenango de Doria.',
        },
        {
            id: '2',
            nombre: 'Máscara de Carnaval',
            descripcion: 'Mascara tallada en madera de copal, pintada a mano con colores vibrantes.',
            precio: 520,
            precioOriginal: 600,
            valoracion: 5,
            reseñas: 22,
            categoria: 'Madera',
            comunidad: 'Huejutla',
            imagen: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/63/Alebrije_Zapoteco.jpg/640px-Alebrije_Zapoteco.jpg',
            envio: true,
            costoEnvio: 70,
            tecnica: 'Tallado y pintura a mano',
            tiempoElaboracion: '1 semana',
            materiales: 'Madera de copal, pintura acrílica',
            medidas: '20x15x10 cm',
            historia: 'Máscara tallada en madera utilizada en las danzas tradicionales de la Huasteca.',
        }
    ];

    const artesania = productos.find((prod) => prod.id === id) || productos[0];

    const handleSubmit = (e) => {
        e.preventDefault();
        agregarAlCarrito({ ...artesania, cantidad });
        setShowSuccess(true);
    };

    const handleAgregarAlCarrito = () => {
        agregarAlCarrito({ ...artesania, cantidad: 1 });
    };

    if (showSuccess) {
        return (
            <Container style={{ backgroundColor: '#FDF2E0', padding: '30px 0', minHeight: '100vh' }}>
                <Row className="justify-content-center">
                    <Col md={8}>
                        <Alert variant="success" style={{ backgroundColor: '#1E8546', color: 'white', textAlign: 'center' }}>
                            <h4>¡Compra realizada con éxito!</h4>
                            <p>El producto ha sido agregado a tu carrito.</p>
                            <div className="d-flex justify-content-center gap-3 mt-3">
                                <Button variant="light" style={{ color: '#1E8546' }} onClick={() => navigate('/carrito')}>
                                    Ver carrito
                                </Button>
                                <Button variant="outline-light" onClick={() => navigate('/artesanias')}>
                                    Seguir comprando
                                </Button>
                            </div>
                        </Alert>
                    </Col>
                </Row>
            </Container>
        );
    }

    return (
        <Container style={{ backgroundColor: '#FDF2E0', padding: '30px 0', minHeight: '100vh' }}>
            <Button
                variant="link"
                onClick={() => navigate(-1)}
                style={{ color: '#9A1E47', textDecoration: 'none', marginBottom: '20px' }}
            >
                <FaArrowLeft /> Volver al catálogo
            </Button>

            <Row>
                <Col md={7}>
                    <Card className="mb-4" style={{ borderColor: '#0FA89C' }}>
                        <Card.Img
                            variant="top"
                            src={artesania.imagen}
                            style={{
                                maxHeight: '500px',
                                objectFit: 'cover',
                                borderBottom: '3px solid #F28B27'
                            }}
                        />
                    </Card>
                    <Card className="mb-4" style={{ borderColor: '#0FA89C' }}>
                        <Card.Body style={{ backgroundColor: '#FDF2E0' }}>
                            <h4 style={{ color: '#9A1E47' }}>Historia y técnica</h4>
                            <p style={{ color: '#555' }}>{artesania.historia}</p>
                            <hr style={{ borderColor: '#50C2C4' }} />
                            <h5 style={{ color: '#9A1E47' }}>Detalles técnicos</h5>
                            <ListGroup variant="flush">
                                {[`Técnica: ${artesania.tecnica}`, `Materiales: ${artesania.materiales}`, `Tiempo de elaboración: ${artesania.tiempoElaboracion}`, `Medidas: ${artesania.medidas}`].map((item, index) => (
                                    <ListGroup.Item key={index} style={{ backgroundColor: 'transparent', color: '#555', borderColor: '#50C2C4' }}>
                                        {item}
                                    </ListGroup.Item>
                                ))}
                            </ListGroup>
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={5}>
                    <Card className="sticky-top" style={{ top: '20px', borderColor: '#0FA89C' }}>
                        <Card.Body style={{ backgroundColor: '#FDF2E0' }}>
                            <h3 style={{ color: '#9A1E47' }}>{artesania.nombre}</h3>
                            <div className="d-flex align-items-center mb-3">
                                <Badge style={{ backgroundColor: '#1E8546', marginRight: '10px' }}>{artesania.categoria}</Badge>
                                <div style={{ color: '#F28B27' }}>
                                    {[...Array(5)].map((_, i) => (
                                        <FaStar key={i} color={i < artesania.valoracion ? '#F28B27' : '#ddd'} />
                                    ))}
                                    <small style={{ color: '#A0C070', marginLeft: '5px' }}>({artesania.reseñas} reseñas)</small>
                                </div>
                            </div>
                            <div className="d-flex align-items-center mb-3" style={{ color: '#0FA89C' }}>
                                <FaMapMarkerAlt className="me-2" />
                                <span>Elaborado en {artesania.comunidad}</span>
                            </div>
                            <div className="d-flex align-items-baseline mb-4">
                                <h2 style={{ color: '#9A1E47', marginRight: '15px' }}>${artesania.precio}</h2>
                                {artesania.precioOriginal && (
                                    <small style={{ color: '#A0C070', textDecoration: 'line-through' }}>
                                        ${artesania.precioOriginal}
                                    </small>
                                )}
                            </div>

                            <Form onSubmit={handleSubmit}>
                                <Form.Group className="mb-3">
                                    <Form.Label style={{ color: '#9A1E47' }}>Cantidad</Form.Label>
                                    <div className="d-flex align-items-center">
                                        <Button variant="outline-secondary" onClick={() => setCantidad(Math.max(1, cantidad - 1))} style={{ borderColor: '#9A1E47', color: '#9A1E47' }}>
                                            -
                                        </Button>
                                        <Form.Control
                                            type="number"
                                            min="1"
                                            value={cantidad}
                                            onChange={(e) => setCantidad(Math.max(1, parseInt(e.target.value) || 1))}
                                            className="mx-2 text-center"
                                            style={{ width: '60px', borderColor: '#9A1E47', color: '#9A1E47' }}
                                        />
                                        <Button variant="outline-secondary" onClick={() => setCantidad(cantidad + 1)} style={{ borderColor: '#9A1E47', color: '#9A1E47' }}>
                                            +
                                        </Button>
                                    </div>
                                </Form.Group>

                                {artesania.envio && (
                                    <div className="mb-3 p-3 rounded" style={{ backgroundColor: '#50C2C4', color: 'white' }}>
                                        <div className="d-flex justify-content-between">
                                            <span>Envío:</span>
                                            <span>${artesania.costoEnvio}</span>
                                        </div>
                                        <small>Disponible para toda la república</small>
                                    </div>
                                )}

                                <Form.Group className="mb-4">
                                    <Form.Label style={{ color: '#9A1E47' }}>Método de pago</Form.Label>
                                    <Form.Select
                                        value={metodoPago}
                                        onChange={(e) => setMetodoPago(e.target.value)}
                                        style={{ borderColor: '#9A1E47', color: '#9A1E47' }}
                                    >
                                        <option value="mercadoPago">Mercado Pago</option>
                                        <option value="paypal">PayPal</option>
                                        <option value="tarjeta">Tarjeta de crédito/débito</option>
                                        <option value="transferencia">Transferencia bancaria</option>
                                    </Form.Select>
                                </Form.Group>

                                <div className="mb-4 p-3 rounded" style={{ backgroundColor: '#A0C070', color: 'white' }}>
                                    <div className="d-flex justify-content-between mb-2">
                                        <span>Subtotal:</span>
                                        <span>${artesania.precio * cantidad}</span>
                                    </div>
                                    {artesania.envio && (
                                        <div className="d-flex justify-content-between mb-2">
                                            <span>Envío:</span>
                                            <span>${artesania.costoEnvio}</span>
                                        </div>
                                    )}
                                    <div className="d-flex justify-content-between fw-bold">
                                        <span>Total:</span>
                                        <span>${artesania.precio * cantidad + (artesania.envio ? artesania.costoEnvio : 0)}</span>
                                    </div>
                                </div>

                                <Button type="submit" style={{ width: '100%', backgroundColor: '#9A1E47', borderColor: '#9A1E47', padding: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                                    <FaCreditCard /> Comprar ahora
                                </Button>

                                <Button
                                    style={{ width: '100%', backgroundColor: '#9A1E47', border: 'none', marginTop: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
                                    onClick={handleAgregarAlCarrito}
                                >
                                    <FaShoppingCart className="me-2" />
                                    Añadir al Carrito
                                </Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default DetalleArtesania;
