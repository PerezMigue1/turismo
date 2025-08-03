import { Container, Row, Col, Card, Button, Alert, Badge, ListGroup, Form, Spinner, Tab, Tabs, Carousel } from 'react-bootstrap';
import { FaArrowLeft, FaMapMarkerAlt, FaStar, FaBed, FaPhone, FaClock, FaInfoCircle } from 'react-icons/fa';
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const DetalleHospedaje = ({ hotel: hotelProp, onVolver }) => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [hotel, setHotel] = useState(hotelProp || null);
    const [loading, setLoading] = useState(!hotelProp && !!id);
    const [error, setError] = useState(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const [nombre, setNombre] = useState('');
    const [correo, setCorreo] = useState('');
    const [telefono, setTelefono] = useState('');
    const [comentario, setComentario] = useState('');
    const [mensajeEnviado, setMensajeEnviado] = useState(null);

    useEffect(() => {
        if (!hotelProp && id) {
            const fetchHotel = async () => {
                try {
                    const res = await axios.get(`https://backend-iota-seven-19.vercel.app/api/hospedaje/${id}`);
                    setHotel(res.data);
                    setLoading(false);
                } catch (err) {
                    setError('No se encontró el hotel.');
                    setLoading(false);
                }
            };
            fetchHotel();
        }
    }, [id, hotelProp]);

    const handleEnviarComentario = async (e) => {
        e.preventDefault();
        try {
            // Aquí va la lógica para enviar comentarios
            setMensajeEnviado("Comentario enviado correctamente.");
            setNombre('');
            setCorreo('');
            setTelefono('');
            setComentario('');
        } catch (error) {
            setMensajeEnviado("Error al enviar el comentario.");
            console.error(error);
        }
    };

    const renderServicios = () => {
        if (!hotel?.Servicios) return null;
        return (
            <ListGroup variant="flush">
                {hotel.Servicios.split(',').map((servicio, index) => (
                    <ListGroup.Item key={index} style={{ backgroundColor: 'transparent', color: '#555', borderColor: '#50C2C4' }}>
                        {servicio.trim()}
                    </ListGroup.Item>
                ))}
            </ListGroup>
        );
    };

    if (loading) {
        return <Container className="py-5 text-center"><Spinner animation="border" /></Container>;
    }

    if (error || !hotel) {
        return (
            <Container className="py-5 text-center">
                <Alert variant="warning">
                    {error || 'No se encontró el hotel.'}
                    <Button onClick={() => (onVolver ? onVolver() : navigate(-1))} variant="link" className="ms-2">
                        Volver
                    </Button>
                </Alert>
            </Container>
        );
    }

    return (
        <Container style={{ backgroundColor: '#FDF2E0', padding: '30px 0', minHeight: '100vh' }}>
            <Button variant="link" onClick={() => (onVolver ? onVolver() : navigate(-1))} style={{ color: '#9A1E47', marginBottom: '20px' }}>
                <FaArrowLeft /> Volver al catálogo
            </Button>

            <Row>
                <Col md={7}>
                    <Card className="mb-4" style={{ borderColor: '#0FA89C' }}>
                        {hotel.Imagenes && hotel.Imagenes.length > 1 ? (
                            <Carousel activeIndex={currentImageIndex} onSelect={setCurrentImageIndex} interval={3000}>
                                {hotel.Imagenes.map((img, idx) => (
                                    <Carousel.Item key={idx}>
                                        <img
                                            src={img}
                                            alt={`Imagen ${idx + 1}`}
                                            className="d-block w-100"
                                            style={{ objectFit: 'cover', height: '500px' }}
                                            onError={(e) => e.target.src = '/placeholder-hotel.jpg'}
                                        />
                                    </Carousel.Item>
                                ))}
                            </Carousel>
                        ) : (
                            <Card.Img
                                variant="top"
                                src={hotel.Imagenes?.[0] || '/placeholder-hotel.jpg'}
                                alt="Imagen del hotel"
                                style={{ maxHeight: '500px', objectFit: 'cover' }}
                                onError={(e) => e.target.src = '/placeholder-hotel.jpg'}
                            />
                        )}
                    </Card>

                    {hotel.Imagenes?.length > 1 && (
                        <div className="d-flex gap-2 mb-4 flex-wrap">
                            {hotel.Imagenes.map((img, idx) => (
                                <img
                                    key={idx}
                                    src={img}
                                    alt={`Miniatura ${idx + 1}`}
                                    className={`img-thumbnail ${currentImageIndex === idx ? 'border border-danger' : ''}`}
                                    style={{ width: 75, height: 75, objectFit: 'cover', cursor: 'pointer' }}
                                    onClick={() => setCurrentImageIndex(idx)}
                                    onError={(e) => e.target.src = '/placeholder-hotel.jpg'}
                                />
                            ))}
                        </div>
                    )}

                    <Card className="mb-4" style={{ borderColor: '#0FA89C' }}>
                        <Card.Body style={{ backgroundColor: '#FDF2E0' }}>
                            <Tabs defaultActiveKey="descripcion" id="hotel-tabs" className="mb-3">
                                <Tab eventKey="descripcion" title="Descripción">
                                    <h4 style={{ color: '#9A1E47' }}>Descripción del hotel</h4>
                                    <p style={{ color: '#555' }}>{hotel.Descripcion || 'No hay descripción disponible'}</p>
                                </Tab>
                                <Tab eventKey="servicios" title="Servicios">
                                    <h4 style={{ color: '#9A1E47' }}>Servicios incluidos</h4>
                                    {renderServicios()}
                                </Tab>
                                <Tab eventKey="info" title="Información adicional">
                                    <h4 style={{ color: '#9A1E47' }}>Detalles del hotel</h4>
                                    <ListGroup variant="flush">
                                        <ListGroup.Item style={{ backgroundColor: 'transparent', color: '#555', borderColor: '#50C2C4' }}>
                                            <strong>Categoría:</strong> {hotel.Categoria || 'N/D'}
                                        </ListGroup.Item>
                                        <ListGroup.Item style={{ backgroundColor: 'transparent', color: '#555', borderColor: '#50C2C4' }}>
                                            <strong>Capacidad:</strong> {hotel.Huespedes || 'N/D'}
                                        </ListGroup.Item>
                                        <ListGroup.Item style={{ backgroundColor: 'transparent', color: '#555', borderColor: '#50C2C4' }}>
                                            <strong>Teléfono:</strong> {hotel.Telefono || 'N/D'}
                                        </ListGroup.Item>
                                        <ListGroup.Item style={{ backgroundColor: 'transparent', color: '#555', borderColor: '#50C2C4' }}>
                                            <strong>Horario:</strong> {hotel.Horario || 'N/D'}
                                        </ListGroup.Item>
                                    </ListGroup>
                                </Tab>
                            </Tabs>
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={5}>
                    <Card className="sticky-top" style={{ top: '20px', borderColor: '#0FA89C' }}>
                        <Card.Body style={{ backgroundColor: '#FDF2E0' }}>
                            <h3 style={{ color: '#9A1E47' }}>{hotel.Nombre || 'Hotel sin nombre'}</h3>
                            <div className="d-flex align-items-center mb-3">
                                <Badge style={{ backgroundColor: '#1E8546', marginRight: '10px' }}>{hotel.Categoria}</Badge>
                                <div style={{ color: '#F28B27' }}>
                                    {[...Array(5)].map((_, i) => (
                                        <FaStar key={i} color={i < 4 ? '#F28B27' : '#ddd'} />
                                    ))}
                                    <small style={{ color: '#A0C070', marginLeft: '5px' }}>(15 reseñas)</small>
                                </div>
                            </div>
                            <div className="d-flex align-items-center mb-3" style={{ color: '#0FA89C' }}>
                                <FaMapMarkerAlt className="me-2" />
                                <span>{hotel.Ubicacion || 'Ubicación no disponible'}</span>
                            </div>
                            <div className="d-flex align-items-baseline mb-3">
                                <h2 style={{ color: '#9A1E47', marginRight: '15px' }}>${hotel.Precio || 0}</h2>
                                <small style={{ color: '#666' }}>MXN por noche</small>
                            </div>

                            <div style={{ backgroundColor: '#FEF8ED', border: '1px solid #F28B27', borderRadius: '10px', padding: '15px', marginTop: '20px' }}>
                                <h5 style={{ color: '#9A1E47' }}>Información de contacto</h5>
                                <p><strong>Teléfono:</strong> {hotel.Telefono || 'N/D'}</p>
                                <p><strong>Horario:</strong> {hotel.Horario || 'N/D'}</p>
                                <p><strong>Capacidad:</strong> {hotel.Huespedes || 'N/D'} huéspedes</p>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Row className="justify-content-center">
                <Col md={15}>
                    <Card className="sticky-top" style={{ top: '20px', borderColor: '#0FA89C', marginTop: '50px' }}>
                        <Card.Body style={{ backgroundColor: '#FDF2E0' }}>
                            <h4 style={{ color: '#9A1E47' }}>¿Tienes dudas o deseas hacer una reserva?</h4>
                            {mensajeEnviado && (
                                <Alert variant={mensajeEnviado.includes("Error") ? "danger" : "success"}>
                                    {mensajeEnviado}
                                </Alert>
                            )}
                            <Form onSubmit={handleEnviarComentario}>
                                <Form.Group controlId="formNombre" className="mb-3">
                                    <Form.Label>Nombre</Form.Label>
                                    <Form.Control type="text" placeholder="Tu nombre" required value={nombre} onChange={(e) => setNombre(e.target.value)} />
                                </Form.Group>
                                <Form.Group controlId="formCorreo" className="mb-3">
                                    <Form.Label>Correo electrónico</Form.Label>
                                    <Form.Control type="email" placeholder="tu@email.com" required value={correo} onChange={(e) => setCorreo(e.target.value)} />
                                </Form.Group>
                                <Form.Group controlId="formTelefono" className="mb-3">
                                    <Form.Label>Teléfono</Form.Label>
                                    <Form.Control type="text" placeholder="Opcional" value={telefono} onChange={(e) => setTelefono(e.target.value)} />
                                </Form.Group>
                                <Form.Group controlId="formComentario" className="mb-3">
                                    <Form.Label>Comentario</Form.Label>
                                    <Form.Control as="textarea" rows={4} placeholder="Escribe tu mensaje..." required value={comentario} onChange={(e) => setComentario(e.target.value)} />
                                </Form.Group>
                                <Button type="submit" variant="primary" style={{ backgroundColor: '#9A1E47', borderColor: '#9A1E47' }}>
                                    Enviar mensaje
                                </Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default DetalleHospedaje;
