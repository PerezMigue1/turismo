// src/screens/DetalleArtesania.js
import React, { useState, useContext, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Alert, Badge, ListGroup, Form, Spinner, Tab, Tabs } from 'react-bootstrap';
import { FaShoppingCart, FaArrowLeft, FaCreditCard, FaMapMarkerAlt, FaStar, FaTruck, FaCalendarAlt, FaTags } from 'react-icons/fa';
import axios from 'axios';
import { CartContext } from '../Navigation/CartContext';

const DetalleArtesania = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [cantidad, setCantidad] = useState(1);
    const [metodoPago, setMetodoPago] = useState('mercadoPago');
    const [showSuccess, setShowSuccess] = useState(false);
    const [artesania, setArtesania] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { agregarAlCarrito } = useContext(CartContext);

    useEffect(() => {
        const fetchProducto = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/productos/${id}`);
                setArtesania(response.data);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchProducto();
    }, [id]);

    const handleSubmit = (e) => {
        e.preventDefault();
        agregarAlCarrito({ 
            id: artesania.idProducto,
            nombre: artesania.Nombre,
            precio: artesania.Precio,
            imagen: artesania.Imagen,
            categoria: artesania.idCategoria,
            cantidad 
        });
        setShowSuccess(true);
    };

    const handleAgregarAlCarrito = () => {
        agregarAlCarrito({ 
            id: artesania.idProducto,
            nombre: artesania.Nombre,
            precio: artesania.Precio,
            imagen: artesania.Imagen,
            categoria: artesania.idCategoria,
            cantidad: 1
        });
    };

    if (loading) {
        return (
            <Container style={{ backgroundColor: '#FDF2E0', padding: '30px 0', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Spinner animation="border" variant="primary" />
            </Container>
        );
    }

    if (error) {
        return (
            <Container style={{ backgroundColor: '#FDF2E0', padding: '30px 0', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Alert variant="danger">
                    Error al cargar el producto: {error}
                    <Button variant="link" onClick={() => window.location.reload()}>Intentar de nuevo</Button>
                </Alert>
            </Container>
        );
    }

    if (!artesania) {
        return (
            <Container style={{ backgroundColor: '#FDF2E0', padding: '30px 0', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Alert variant="warning">
                    Producto no encontrado
                    <Button variant="link" onClick={() => navigate('/artesanias')}>Volver al catálogo</Button>
                </Alert>
            </Container>
        );
    }

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

    // Función para formatear la fecha de llegada estimada
    const formatFecha = (fechaString) => {
        if (!fechaString) return 'No especificado';
        const fecha = new Date(fechaString);
        return fecha.toLocaleDateString('es-MX', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    };

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
                            src={artesania.Imagen}
                            style={{
                                maxHeight: '500px',
                                objectFit: 'cover',
                                borderBottom: '3px solid #F28B27'
                            }}
                            alt={artesania.Nombre}
                            onError={(e) => {
                                e.target.src = '/placeholder-product.jpg';
                            }}
                        />
                    </Card>
                    
                    <Card className="mb-4" style={{ borderColor: '#0FA89C' }}>
                        <Card.Body style={{ backgroundColor: '#FDF2E0' }}>
                            <Tabs defaultActiveKey="descripcion" id="product-tabs" className="mb-3">
                                <Tab eventKey="descripcion" title="Descripción">
                                    <h4 style={{ color: '#9A1E47', marginTop: '15px' }}>Descripción del producto</h4>
                                    <p style={{ color: '#555' }}>{artesania.Descripción}</p>
                                    
                                    <h4 style={{ color: '#9A1E47', marginTop: '20px' }}>Comentarios adicionales</h4>
                                    <p style={{ color: '#555' }}>{artesania.Comentarios || 'No hay comentarios adicionales'}</p>
                                </Tab>
                                
                                <Tab eventKey="especificaciones" title="Especificaciones">
                                    <h4 style={{ color: '#9A1E47', marginTop: '15px' }}>Detalles técnicos</h4>
                                    <ListGroup variant="flush">
                                        <ListGroup.Item style={{ backgroundColor: 'transparent', color: '#555', borderColor: '#50C2C4' }}>
                                            <strong>Forma:</strong> {artesania.Forma || 'No especificado'}
                                        </ListGroup.Item>
                                        <ListGroup.Item style={{ backgroundColor: 'transparent', color: '#555', borderColor: '#50C2C4' }}>
                                            <strong>Dimensiones:</strong> {artesania["Largo x Ancho"] || 'No especificado'}
                                        </ListGroup.Item>
                                        <ListGroup.Item style={{ backgroundColor: 'transparent', color: '#555', borderColor: '#50C2C4' }}>
                                            <strong>Materiales:</strong> {artesania.Materiales || 'No especificado'}
                                        </ListGroup.Item>
                                        <ListGroup.Item style={{ backgroundColor: 'transparent', color: '#555', borderColor: '#50C2C4' }}>
                                            <strong>Técnica de elaboración:</strong> {artesania.Técnica || 'No especificado'}
                                        </ListGroup.Item>
                                    </ListGroup>
                                </Tab>
                                
                                <Tab eventKey="envio" title="Envío y disponibilidad">
                                    <div className="d-flex align-items-center mb-3" style={{ color: '#0FA89C' }}>
                                        <FaTruck className="me-2" size={20} />
                                        <h5 style={{ margin: 0 }}>Disponibilidad: 
                                            <Badge bg={artesania.Disponibilidad === 'En stock' ? 'success' : 'danger'} className="ms-2">
                                                {artesania.Disponibilidad}
                                            </Badge>
                                        </h5>
                                    </div>
                                    
                                    {artesania["Tiempo-estimado-llegada"] && (
                                        <div className="d-flex align-items-center mb-3" style={{ color: '#0FA89C' }}>
                                            <FaCalendarAlt className="me-2" size={20} />
                                            <h5 style={{ margin: 0 }}>Tiempo estimado de llegada: {formatFecha(artesania["Tiempo-estimado-llegada"])}</h5>
                                        </div>
                                    )}
                                    
                                    <div className="d-flex align-items-center" style={{ color: '#0FA89C' }}>
                                        <FaTags className="me-2" size={20} />
                                        <div>
                                            <h5 style={{ margin: 0 }}>Etiquetas:</h5>
                                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginTop: '5px' }}>
                                                {artesania.Etiquetas?.split(', ').map((tag, index) => (
                                                    <Badge key={index} bg="info" style={{ backgroundColor: '#50C2C4' }}>
                                                        {tag.trim()}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </Tab>
                            </Tabs>
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={5}>
                    <Card className="sticky-top" style={{ top: '20px', borderColor: '#0FA89C' }}>
                        <Card.Body style={{ backgroundColor: '#FDF2E0' }}>
                            <h3 style={{ color: '#9A1E47' }}>{artesania.Nombre}</h3>
                            <div className="d-flex align-items-center mb-3">
                                <Badge style={{ backgroundColor: '#1E8546', marginRight: '10px' }}>{artesania.idCategoria}</Badge>
                                <div style={{ color: '#F28B27' }}>
                                    {[...Array(5)].map((_, i) => (
                                        <FaStar key={i} color={i < 4 ? '#F28B27' : '#ddd'} />
                                    ))}
                                    <small style={{ color: '#A0C070', marginLeft: '5px' }}>(15 reseñas)</small>
                                </div>
                            </div>
                            <div className="d-flex align-items-center mb-3" style={{ color: '#0FA89C' }}>
                                <FaMapMarkerAlt className="me-2" />
                                <span>Elaborado en {artesania.Origen || 'origen no especificado'}</span>
                            </div>
                            <div className="d-flex align-items-baseline mb-4">
                                <h2 style={{ color: '#9A1E47', marginRight: '15px' }}>${artesania.Precio.toFixed(2)}</h2>
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

                                {artesania.Disponibilidad === 'En stock' && (
                                    <div className="mb-3 p-3 rounded" style={{ backgroundColor: '#50C2C4', color: 'white' }}>
                                        <div className="d-flex justify-content-between">
                                            <span>Envío:</span>
                                            <span>$50.00</span>
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
                                        <span>${(artesania.Precio * cantidad).toFixed(2)}</span>
                                    </div>
                                    {artesania.Disponibilidad === 'En stock' && (
                                        <div className="d-flex justify-content-between mb-2">
                                            <span>Envío:</span>
                                            <span>$50.00</span>
                                        </div>
                                    )}
                                    <div className="d-flex justify-content-between fw-bold">
                                        <span>Total:</span>
                                        <span>${(artesania.Precio * cantidad + (artesania.Disponibilidad === 'En stock' ? 50 : 0)).toFixed(2)}</span>
                                    </div>
                                </div>

                                <Button 
                                    type="submit" 
                                    style={{ 
                                        width: '100%', 
                                        backgroundColor: '#9A1E47', 
                                        borderColor: '#9A1E47', 
                                        padding: '12px', 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        justifyContent: 'center', 
                                        gap: '10px' 
                                    }}
                                    disabled={artesania.Disponibilidad !== 'En stock'}
                                >
                                    <FaCreditCard /> 
                                    {artesania.Disponibilidad === 'En stock' ? 'Comprar ahora' : 'Producto agotado'}
                                </Button>

                                <Button
                                    style={{ 
                                        width: '100%', 
                                        backgroundColor: '#9A1E47', 
                                        border: 'none', 
                                        marginTop: '20px', 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        justifyContent: 'center', 
                                        gap: '10px' 
                                    }}
                                    onClick={handleAgregarAlCarrito}
                                    disabled={artesania.Disponibilidad !== 'En stock'}
                                >
                                    <FaShoppingCart className="me-2" />
                                    {artesania.Disponibilidad === 'En stock' ? 'Añadir al Carrito' : 'No disponible'}
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