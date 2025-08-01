// src/screens/DetalleEcoturismo.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Alert, Badge, ListGroup, Spinner, Carousel, Tab, Tabs } from 'react-bootstrap';
import { FaArrowLeft, FaMapMarkerAlt, FaClock, FaMountain, FaStar, FaThermometerHalf, FaCalendarAlt, FaPhone, FaEnvelope, FaInfoCircle, FaTags } from 'react-icons/fa';
import axios from 'axios';

const DetalleEcoturismo = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [ecoturismo, setEcoturismo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchEcoturismo = async () => {
            try {
                const response = await axios.get(`https://backend-iota-seven-19.vercel.app/api/ecoturismo/public/${id}`);
                if (response.data.success) {
                    setEcoturismo(response.data.data);
                } else {
                    setError(response.data.message || 'Error al cargar el destino');
                }
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchEcoturismo();
    }, [id]);

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
                    Error al cargar el destino: {error}
                    <Button variant="link" onClick={() => window.location.reload()}>Intentar de nuevo</Button>
                </Alert>
            </Container>
        );
    }

    if (!ecoturismo) {
        return (
            <Container style={{ backgroundColor: '#FDF2E0', padding: '30px 0', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Alert variant="warning">
                    Destino no encontrado
                    <Button variant="link" onClick={() => navigate('/ecoturismo')}>Volver al catálogo</Button>
                </Alert>
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
                        {Array.isArray(ecoturismo.imagenes) && ecoturismo.imagenes.length > 1 ? (
                            <Carousel interval={3000} pause={false} indicators controls>
                                {ecoturismo.imagenes.map((img, i) => (
                                    <Carousel.Item key={i}>
                                        <img
                                            src={img}
                                            alt={`Imagen ${i + 1}`}
                                            className="d-block w-100"
                                            style={{ objectFit: 'cover', height: '500px' }}
                                            onError={(e) => e.target.src = '/placeholder-product.jpg'}
                                        />
                                    </Carousel.Item>
                                ))}
                            </Carousel>
                        ) : (
                            <Card.Img
                                variant="top"
                                src={Array.isArray(ecoturismo.imagenes) ? ecoturismo.imagenes[0] : ecoturismo.imagenes}
                                alt={ecoturismo.nombre}
                                style={{ maxHeight: '500px', objectFit: 'cover', borderBottom: '3px solid #F28B27' }}
                                onError={(e) => e.target.src = '/placeholder-product.jpg'}
                            />
                        )}
                    </Card>

                    <Card className="mb-4" style={{ borderColor: '#0FA89C' }}>
                        <Card.Body style={{ backgroundColor: '#FDF2E0' }}>
                            <Tabs defaultActiveKey="descripcion" id="ecoturismo-tabs" className="mb-3">
                                <Tab eventKey="descripcion" title="Descripción">
                                    <h4 style={{ color: '#9A1E47', marginTop: '15px' }}>Descripción del destino</h4>
                                    <p style={{ color: '#555' }}>{ecoturismo.descripcion}</p>

                                    <h4 style={{ color: '#9A1E47', marginTop: '20px' }}>Información adicional</h4>
                                    <p style={{ color: '#555' }}>{ecoturismo.recomendaciones || 'No hay información adicional'}</p>
                                </Tab>

                                <Tab eventKey="especificaciones" title="Especificaciones">
                                    <h4 style={{ color: '#9A1E47', marginTop: '15px' }}>Detalles del destino</h4>
                                    <ListGroup variant="flush">
                                        <ListGroup.Item style={{ backgroundColor: 'transparent', color: '#555', borderColor: '#50C2C4' }}>
                                            <strong>Duración:</strong> {ecoturismo.duracion || 'No especificado'}
                                        </ListGroup.Item>
                                        <ListGroup.Item style={{ backgroundColor: 'transparent', color: '#555', borderColor: '#50C2C4' }}>
                                            <strong>Distancia:</strong> {ecoturismo.distancia || 'No especificado'}
                                        </ListGroup.Item>
                                        <ListGroup.Item style={{ backgroundColor: 'transparent', color: '#555', borderColor: '#50C2C4' }}>
                                            <strong>Altitud:</strong> {ecoturismo.altitud || 'No especificado'}
                                        </ListGroup.Item>
                                        <ListGroup.Item style={{ backgroundColor: 'transparent', color: '#555', borderColor: '#50C2C4' }}>
                                            <strong>Clima:</strong> {ecoturismo.clima || 'No especificado'}
                                        </ListGroup.Item>
                                        <ListGroup.Item style={{ backgroundColor: 'transparent', color: '#555', borderColor: '#50C2C4' }}>
                                            <strong>Mejor época:</strong> {ecoturismo.mejor_epoca || 'No especificado'}
                                        </ListGroup.Item>
                                    </ListGroup>
                                </Tab>

                                <Tab eventKey="equipamiento" title="Equipamiento y Servicios">
                                    <div className="d-flex align-items-center mb-3" style={{ color: '#0FA89C' }}>
                                        <FaMountain className="me-2" size={20} />
                                        <h5 style={{ margin: 0 }}>Equipamiento Recomendado</h5>
                                    </div>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginBottom: '20px' }}>
                                        {ecoturismo.equipamiento && ecoturismo.equipamiento.length > 0 ? (
                                            ecoturismo.equipamiento.map((equipo, index) => (
                                                <Badge key={index} bg="info" style={{ backgroundColor: '#50C2C4' }}>
                                                    {equipo}
                                                </Badge>
                                            ))
                                        ) : (
                                            <p style={{ color: '#555' }}>No especificado</p>
                                        )}
                                    </div>

                                    <div className="d-flex align-items-center mb-3" style={{ color: '#0FA89C' }}>
                                        <FaTags className="me-2" size={20} />
                                        <h5 style={{ margin: 0 }}>Servicios Disponibles</h5>
                                    </div>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                                        {ecoturismo.servicios_disponibles && ecoturismo.servicios_disponibles.length > 0 ? (
                                            ecoturismo.servicios_disponibles.map((servicio, index) => (
                                                <Badge key={index} bg="success" style={{ backgroundColor: '#1E8546' }}>
                                                    {servicio}
                                                </Badge>
                                            ))
                                        ) : (
                                            <p style={{ color: '#555' }}>No especificado</p>
                                        )}
                                    </div>
                                </Tab>

                                <Tab eventKey="naturaleza" title="Flora y Fauna">
                                    <h4 style={{ color: '#9A1E47', marginTop: '15px' }}>Biodiversidad</h4>
                                    <ListGroup variant="flush">
                                        <ListGroup.Item style={{ backgroundColor: 'transparent', color: '#555', borderColor: '#50C2C4' }}>
                                            <strong>Flora:</strong> {ecoturismo.flora || 'No especificado'}
                                        </ListGroup.Item>
                                        <ListGroup.Item style={{ backgroundColor: 'transparent', color: '#555', borderColor: '#50C2C4' }}>
                                            <strong>Fauna:</strong> {ecoturismo.fauna || 'No especificado'}
                                        </ListGroup.Item>
                                    </ListGroup>
                                </Tab>

                                <Tab eventKey="restricciones" title="Restricciones y Recomendaciones">
                                    <h4 style={{ color: '#9A1E47', marginTop: '15px' }}>Información importante</h4>
                                    <ListGroup variant="flush">
                                        <ListGroup.Item style={{ backgroundColor: 'transparent', color: '#555', borderColor: '#50C2C4' }}>
                                            <strong>Restricciones:</strong> {ecoturismo.restricciones || 'No hay restricciones especiales'}
                                        </ListGroup.Item>
                                        <ListGroup.Item style={{ backgroundColor: 'transparent', color: '#555', borderColor: '#50C2C4' }}>
                                            <strong>Recomendaciones:</strong> {ecoturismo.recomendaciones || 'No hay recomendaciones especiales'}
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
                            <h3 style={{ color: '#9A1E47' }}>{ecoturismo.nombre}</h3>
                            <div className="d-flex align-items-center mb-3">
                                <Badge style={{ backgroundColor: '#1E8546', marginRight: '10px' }}>
                                    {ecoturismo.categoria.replace('_', ' ').toUpperCase()}
                                </Badge>
                                <Badge style={{ backgroundColor: '#F28B27', marginRight: '10px' }}>
                                    {ecoturismo.dificultad.toUpperCase()}
                                </Badge>
                                <div style={{ color: '#F28B27' }}>
                                    {[...Array(5)].map((_, i) => (
                                        <FaStar key={i} color={i < (ecoturismo.calificacion || 4) ? '#F28B27' : '#ddd'} />
                                    ))}
                                    <small style={{ color: '#A0C070', marginLeft: '5px' }}>({ecoturismo.visitas || 0} visitas)</small>
                                </div>
                            </div>
                            <div className="d-flex align-items-center mb-3" style={{ color: '#0FA89C' }}>
                                <FaMapMarkerAlt className="me-2" />
                                <span>{ecoturismo.ubicacion}</span>
                            </div>
                            <div className="d-flex align-items-baseline mb-3">
                                <h2 style={{ color: '#9A1E47', marginRight: '15px' }}>
                                    {ecoturismo.precio_entrada ? `$${parseFloat(ecoturismo.precio_entrada).toFixed(2)}` : 'Gratis'}
                                </h2>
                            </div>

                            {/* Información de contacto */}
                            <div style={{
                                backgroundColor: '#FEF8ED',
                                border: '1px solid #F28B27',
                                borderRadius: '10px',
                                padding: '15px',
                                marginTop: '20px'
                            }}>
                                <h5 style={{ color: '#9A1E47', marginBottom: '15px' }}>Información de Contacto</h5>
                                <p><strong>Teléfono:</strong> {ecoturismo.contacto?.telefono || 'N/D'}</p>
                                <p><strong>Email:</strong> {ecoturismo.contacto?.email || 'N/D'}</p>
                                {ecoturismo.contacto?.sitio_web && (
                                    <p><strong>Sitio Web:</strong> <a href={ecoturismo.contacto.sitio_web} target="_blank" rel="noopener noreferrer" style={{ color: '#1E8546' }}>{ecoturismo.contacto.sitio_web}</a></p>
                                )}
                                <p><strong>Horarios:</strong> {
                                    ecoturismo.horarios && typeof ecoturismo.horarios === 'object'
                                        ? `${ecoturismo.horarios.apertura || 'N/D'} - ${ecoturismo.horarios.cierre || 'N/D'}`
                                        : ecoturismo.horarios || 'N/D'
                                }</p>
                            </div>

                            {/* Información adicional */}
                            <div style={{
                                backgroundColor: '#FEF8ED',
                                border: '1px solid #F28B27',
                                borderRadius: '10px',
                                padding: '15px',
                                marginTop: '20px'
                            }}>
                                <h5 style={{ color: '#9A1E47', marginBottom: '15px' }}>Información Adicional</h5>
                                <div className="d-flex align-items-center mb-2">
                                    <FaClock style={{ color: '#1E8546', marginRight: '8px' }} />
                                    <span style={{ color: '#555' }}>{ecoturismo.duracion}</span>
                                </div>
                                <div className="d-flex align-items-center mb-2">
                                    <FaMountain style={{ color: '#1E8546', marginRight: '8px' }} />
                                    <span style={{ color: '#555' }}>{ecoturismo.distancia}</span>
                                </div>
                                <div className="d-flex align-items-center mb-2">
                                    <FaThermometerHalf style={{ color: '#1E8546', marginRight: '8px' }} />
                                    <span style={{ color: '#555' }}>{ecoturismo.altitud}</span>
                                </div>
                                <div className="d-flex align-items-center">
                                    <FaCalendarAlt style={{ color: '#1E8546', marginRight: '8px' }} />
                                    <span style={{ color: '#555' }}>{ecoturismo.mejor_epoca}</span>
                                </div>
                                {ecoturismo.coordenadas && (
                                    <div className="d-flex align-items-center mt-2">
                                        <FaMapMarkerAlt style={{ color: '#1E8546', marginRight: '8px' }} />
                                        <span style={{ color: '#555' }}>
                                            {ecoturismo.coordenadas.latitud}, {ecoturismo.coordenadas.longitud}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default DetalleEcoturismo; 