import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Alert, Badge, ListGroup, Form, Spinner, Tab, Tabs, Carousel } from 'react-bootstrap';
import { FaArrowLeft, FaMapMarkerAlt, FaStar, FaCalendar, FaInfoCircle, FaUsers } from 'react-icons/fa';

const DetalleFestividades = ({ festividad, onVolver }) => {
    const [nombre, setNombre] = useState('');
    const [correo, setCorreo] = useState('');
    const [telefono, setTelefono] = useState('');
    const [comentario, setComentario] = useState('');
    const [mensajeEnviado, setMensajeEnviado] = useState(null);

    if (!festividad) {
        return (
            <Container style={{ backgroundColor: '#FDF2E0', padding: '30px 0', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Alert variant="warning">
                    No se encontró la festividad
                    <Button variant="link" onClick={onVolver}>Volver</Button>
                </Alert>
            </Container>
        );
    }

    const handleEnviarComentario = async (e) => {
        e.preventDefault();
        try {
            // Aquí puedes implementar la lógica para enviar comentarios
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

    const imagenes = festividad.Imagen || [];

    return (
        <Container style={{ backgroundColor: '#FDF2E0', padding: '30px 0', minHeight: '100vh' }}>
            <Button
                variant="link"
                onClick={onVolver}
                style={{ color: '#9A1E47', textDecoration: 'none', marginBottom: '20px' }}
            >
                <FaArrowLeft /> Volver al catálogo
            </Button>

            <Row>
                <Col md={7}>
                    <Card className="mb-4" style={{ borderColor: '#0FA89C' }}>
                        {Array.isArray(imagenes) && imagenes.length > 1 ? (
                            <Carousel interval={3000} pause={false} indicators controls>
                                {imagenes.map((img, i) => (
                                    <Carousel.Item key={i}>
                                        <img
                                            src={img}
                                            alt={`Imagen ${i + 1}`}
                                            className="d-block w-100"
                                            style={{ objectFit: 'cover', height: '500px' }}
                                            onError={(e) => e.target.src = '/festividad-default.jpg'}
                                        />
                                    </Carousel.Item>
                                ))}
                            </Carousel>
                        ) : (
                            <Card.Img
                                variant="top"
                                src={imagenes[0] || "/festividad-default.jpg"}
                                alt={festividad.nombre}
                                style={{ maxHeight: '500px', objectFit: 'cover', borderBottom: '3px solid #F28B27' }}
                                onError={(e) => e.target.src = '/festividad-default.jpg'}
                            />
                        )}
                    </Card>

                    {imagenes.length > 1 && (
                        <div className="d-flex gap-2 mb-4 flex-wrap">
                            {imagenes.map((img, idx) => (
                                <img
                                    key={idx}
                                    src={img}
                                    alt={`Miniatura ${idx + 1}`}
                                    className="img-thumbnail"
                                    style={{ width: 75, height: 75, objectFit: 'cover', cursor: 'pointer' }}
                                    onError={(e) => e.target.src = '/festividad-default.jpg'}
                                />
                            ))}
                        </div>
                    )}

                    <Card className="mb-4" style={{ borderColor: '#0FA89C' }}>
                        <Card.Body style={{ backgroundColor: '#FDF2E0' }}>
                            <Tabs defaultActiveKey="descripcion" id="festividad-tabs" className="mb-3">
                                <Tab eventKey="descripcion" title="Descripción">
                                    <h4 style={{ color: '#9A1E47', marginTop: '15px' }}>Descripción de la festividad</h4>
                                    <p style={{ color: '#555' }}>{festividad.descripcion}</p>
                                </Tab>

                                <Tab eventKey="actividades" title="Actividades">
                                    <h4 style={{ color: '#9A1E47', marginTop: '15px' }}>Actividades principales</h4>
                                    <ListGroup variant="flush">
                                        {festividad.actividades?.length > 0 ? (
                                            festividad.actividades.map((actividad, i) => (
                                                <ListGroup.Item key={i} style={{ backgroundColor: 'transparent', color: '#555', borderColor: '#50C2C4' }}>
                                                    {actividad}
                                                </ListGroup.Item>
                                            ))
                                        ) : (
                                            <ListGroup.Item style={{ backgroundColor: 'transparent', color: '#555', borderColor: '#50C2C4' }}>
                                                No se especifican actividades
                                            </ListGroup.Item>
                                        )}
                                    </ListGroup>
                                </Tab>

                                <Tab eventKey="elementos" title="Elementos culturales">
                                    <h4 style={{ color: '#9A1E47', marginTop: '15px' }}>Elementos culturales</h4>
                                    <ListGroup variant="flush">
                                        {festividad.elementosCulturales?.length > 0 ? (
                                            festividad.elementosCulturales.map((elemento, i) => (
                                                <ListGroup.Item key={i} style={{ backgroundColor: 'transparent', color: '#555', borderColor: '#50C2C4' }}>
                                                    {elemento}
                                                </ListGroup.Item>
                                            ))
                                        ) : (
                                            <ListGroup.Item style={{ backgroundColor: 'transparent', color: '#555', borderColor: '#50C2C4' }}>
                                                No se especifican elementos culturales
                                            </ListGroup.Item>
                                        )}
                                    </ListGroup>
                                </Tab>

                                <Tab eventKey="fuentes" title="Fuentes">
                                    <h4 style={{ color: '#9A1E47', marginTop: '15px' }}>Fuentes de información</h4>
                                    <ListGroup variant="flush">
                                        {festividad.fuentes?.length > 0 ? (
                                            festividad.fuentes.map((fuente, i) => (
                                                <ListGroup.Item key={i} style={{ backgroundColor: 'transparent', color: '#555', borderColor: '#50C2C4' }}>
                                                    <a href={fuente.url} target="_blank" rel="noopener noreferrer" style={{ color: '#0FA89C' }}>
                                                        {fuente.titulo}
                                                    </a>
                                                </ListGroup.Item>
                                            ))
                                        ) : (
                                            <ListGroup.Item style={{ backgroundColor: 'transparent', color: '#555', borderColor: '#50C2C4' }}>
                                                No se especifican fuentes
                                            </ListGroup.Item>
                                        )}
                                    </ListGroup>
                                </Tab>
                            </Tabs>
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={5}>
                    <Card className="sticky-top" style={{ top: '20px', borderColor: '#0FA89C' }}>
                        <Card.Body style={{ backgroundColor: '#FDF2E0' }}>
                            <h3 style={{ color: '#9A1E47' }}>{festividad.nombre}</h3>
                            <div className="d-flex align-items-center mb-3">
                                <Badge style={{ backgroundColor: '#1E8546', marginRight: '10px' }}>{festividad.tipo}</Badge>
                                <div style={{ color: '#F28B27' }}>
                                    {[...Array(5)].map((_, i) => (
                                        <FaStar key={i} color={i < 4 ? '#F28B27' : '#ddd'} />
                                    ))}
                                    <small style={{ color: '#A0C070', marginLeft: '5px' }}>(15 reseñas)</small>
                                </div>
                            </div>
                            <div className="d-flex align-items-center mb-3" style={{ color: '#0FA89C' }}>
                                <FaMapMarkerAlt className="me-2" />
                                <span>{festividad.municipios?.join(", ") || 'Ubicación no disponible'}</span>
                            </div>

                            {/* Información de fechas */}
                            {festividad.fecha && (
                                <div className="mb-3">
                                    <h6 style={{ color: '#9A1E47', marginBottom: '10px' }}>
                                        <FaCalendar className="me-2" />
                                        Fechas de celebración
                                    </h6>
                                    <p style={{ color: '#555', margin: 0 }}>
                                        <strong>Inicio:</strong> {festividad.fecha.inicio}
                                    </p>
                                    <p style={{ color: '#555', margin: 0 }}>
                                        <strong>Fin:</strong> {festividad.fecha.fin}
                                    </p>
                                </div>
                            )}

                            {/* Información adicional */}
                            <div style={{
                                backgroundColor: '#FEF8ED',
                                border: '1px solid #F28B27',
                                borderRadius: '10px',
                                padding: '15px',
                                marginTop: '20px'
                            }}>
                                <h5 style={{ color: '#9A1E47', marginBottom: '15px' }}>Información adicional</h5>
                                <p><strong>Origen:</strong> {festividad.origen || 'N/D'}</p>
                                <p><strong>Importancia:</strong> {festividad.importancia || 'N/D'}</p>
                                <p><strong>Municipios:</strong> {festividad.municipios?.join(", ") || 'N/D'}</p>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Row className="justify-content-center">
                <Col md={15}>
                    <Card className="sticky-top" style={{ top: '20px', borderColor: '#0FA89C', marginTop: '50px' }}>
                        <Card.Body style={{ backgroundColor: '#FDF2E0' }}>
                            <h4 style={{ color: '#9A1E47', marginBottom: '20px' }}>¿Tienes dudas sobre esta festividad?</h4>

                            {mensajeEnviado && (
                                <Alert variant={mensajeEnviado.includes("Error") ? "danger" : "success"}>
                                    {mensajeEnviado}
                                </Alert>
                            )}

                            <Form onSubmit={handleEnviarComentario}>
                                <Form.Group controlId="formNombre" className="mb-3">
                                    <Form.Label>Nombre</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Tu nombre"
                                        required
                                        value={nombre}
                                        onChange={(e) => setNombre(e.target.value)}
                                    />
                                </Form.Group>

                                <Form.Group controlId="formCorreo" className="mb-3">
                                    <Form.Label>Correo electrónico</Form.Label>
                                    <Form.Control
                                        type="email"
                                        placeholder="tu@email.com"
                                        required
                                        value={correo}
                                        onChange={(e) => setCorreo(e.target.value)}
                                    />
                                </Form.Group>

                                <Form.Group controlId="formTelefono" className="mb-3">
                                    <Form.Label>Teléfono</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Opcional"
                                        value={telefono}
                                        onChange={(e) => setTelefono(e.target.value)}
                                    />
                                </Form.Group>

                                <Form.Group controlId="formComentario" className="mb-3">
                                    <Form.Label>Comentario</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={4}
                                        placeholder="Escribe tu mensaje..."
                                        required
                                        value={comentario}
                                        onChange={(e) => setComentario(e.target.value)}
                                    />
                                </Form.Group>

                                <Button type="submit" variant="primary" style={{ backgroundColor: '#9A1E47', borderColor: '#9A1E47' }}>
                                    Enviar comentario
                                </Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default DetalleFestividades;