import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Alert, Badge, ListGroup, Form, Spinner, Tab, Tabs, Carousel } from 'react-bootstrap';
import { FaArrowLeft, FaMapMarkerAlt, FaStar, FaUtensils, FaClock, FaInfoCircle } from 'react-icons/fa';

const GastronomiaDetalle = ({ gastronomia, onVolver }) => {
    const [activeTab, setActiveTab] = useState('descripcion');
    const [nombre, setNombre] = useState('');
    const [correo, setCorreo] = useState('');
    const [telefono, setTelefono] = useState('');
    const [comentario, setComentario] = useState('');
    const [mensajeEnviado, setMensajeEnviado] = useState(null);

    if (!gastronomia) {
        return (
            <Container style={{ backgroundColor: '#FDF2E0', padding: '30px 0', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Alert variant="warning">
                    No se encontró la receta
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
                        {Array.isArray(gastronomia.imagen) && gastronomia.imagen.length > 1 ? (
                            <Carousel interval={3000} pause={false} indicators controls>
                                {gastronomia.imagen.map((img, i) => (
                                    <Carousel.Item key={i}>
                                        <img
                                            src={img}
                                            alt={`Imagen ${i + 1}`}
                                            className="d-block w-100"
                                            style={{ objectFit: 'cover', height: '500px' }}
                                            onError={(e) => e.target.src = '/placeholder-food.jpg'}
                                        />
                                    </Carousel.Item>
                                ))}
                            </Carousel>
                        ) : (
                            <Card.Img
                                variant="top"
                                src={gastronomia.imagen?.url || gastronomia.imagen}
                                alt={gastronomia.nombre}
                                style={{ maxHeight: '500px', objectFit: 'cover', borderBottom: '3px solid #F28B27' }}
                                onError={(e) => e.target.src = '/placeholder-food.jpg'}
                            />
                        )}
                    </Card>

                    <Card className="mb-4" style={{ borderColor: '#0FA89C' }}>
                        <Card.Body style={{ backgroundColor: '#FDF2E0' }}>
                            <Tabs defaultActiveKey="descripcion" id="gastronomia-tabs" className="mb-3">
                                <Tab eventKey="descripcion" title="Descripción">
                                    <h4 style={{ color: '#9A1E47', marginTop: '15px' }}>Descripción del platillo</h4>
                                    <p style={{ color: '#555' }}>{gastronomia.descripcion}</p>

                                    {gastronomia.historiaOrigen && (
                                        <>
                                            <h4 style={{ color: '#9A1E47', marginTop: '20px' }}>Historia del platillo</h4>
                                            <p style={{ color: '#555' }}>{gastronomia.historiaOrigen}</p>
                                        </>
                                    )}
                                </Tab>

                                <Tab eventKey="ingredientes" title="Ingredientes & Receta">
                                    <h4 style={{ color: '#9A1E47', marginTop: '15px' }}>Ingredientes principales</h4>
                                    <ListGroup variant="flush">
                                        {gastronomia.ingredientes?.length > 0 ? (
                                            gastronomia.ingredientes.map((ing, i) => (
                                                <ListGroup.Item key={i} style={{ backgroundColor: 'transparent', color: '#555', borderColor: '#50C2C4' }}>
                                                    {ing}
                                                </ListGroup.Item>
                                            ))
                                        ) : (
                                            <ListGroup.Item style={{ backgroundColor: 'transparent', color: '#555', borderColor: '#50C2C4' }}>
                                                No se especifican ingredientes
                                            </ListGroup.Item>
                                        )}
                                    </ListGroup>

                                    {gastronomia.receta?.pasos && (
                                        <>
                                            <h4 style={{ color: '#9A1E47', marginTop: '20px' }}>Pasos de preparación</h4>
                                            <ol className="ps-3">
                                                {gastronomia.receta.pasos.map((paso, i) => (
                                                    <li key={i} className="mb-2" style={{ color: '#555' }}>{paso}</li>
                                                ))}
                                            </ol>
                                        </>
                                    )}
                                </Tab>

                                <Tab eventKey="info" title="Información adicional">
                                    <h4 style={{ color: '#9A1E47', marginTop: '15px' }}>Detalles del platillo</h4>
                                    <ListGroup variant="flush">
                                        <ListGroup.Item style={{ backgroundColor: 'transparent', color: '#555', borderColor: '#50C2C4' }}>
                                            <strong>Tipo de platillo:</strong> {gastronomia.tipoPlatillo || 'No especificado'}
                                        </ListGroup.Item>
                                        <ListGroup.Item style={{ backgroundColor: 'transparent', color: '#555', borderColor: '#50C2C4' }}>
                                            <strong>Región de origen:</strong> {gastronomia.regionOrigen || 'No especificado'}
                                        </ListGroup.Item>
                                        {gastronomia.receta && (
                                            <>
                                                <ListGroup.Item style={{ backgroundColor: 'transparent', color: '#555', borderColor: '#50C2C4' }}>
                                                    <strong>Tiempo de preparación:</strong> {gastronomia.receta.tiempoPreparacionMinutos} min
                                                </ListGroup.Item>
                                                <ListGroup.Item style={{ backgroundColor: 'transparent', color: '#555', borderColor: '#50C2C4' }}>
                                                    <strong>Tiempo de cocción:</strong> {gastronomia.receta.tiempoCoccionHoras} h
                                                </ListGroup.Item>
                                                <ListGroup.Item style={{ backgroundColor: 'transparent', color: '#555', borderColor: '#50C2C4' }}>
                                                    <strong>Porciones:</strong> {gastronomia.receta.porciones}
                                                </ListGroup.Item>
                                            </>
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
                            <h3 style={{ color: '#9A1E47' }}>{gastronomia.nombre}</h3>
                            <div className="d-flex align-items-center mb-3">
                                <Badge style={{ backgroundColor: '#1E8546', marginRight: '10px' }}>{gastronomia.tipoPlatillo}</Badge>
                                <div style={{ color: '#F28B27' }}>
                                    {[...Array(5)].map((_, i) => (
                                        <FaStar key={i} color={i < 4 ? '#F28B27' : '#ddd'} />
                                    ))}
                                    <small style={{ color: '#A0C070', marginLeft: '5px' }}>(15 reseñas)</small>
                                </div>
                            </div>
                            <div className="d-flex align-items-center mb-3" style={{ color: '#0FA89C' }}>
                                <FaMapMarkerAlt className="me-2" />
                                <span>Originario de {gastronomia.regionOrigen}</span>
                            </div>

                            {/* Tiempo de preparación */}
                            {gastronomia.receta && (
                                <div className="row text-muted mb-3">
                                    <div className="col-6 d-flex align-items-center">
                                        <FaClock className="me-2" /> {gastronomia.receta.tiempoPreparacionMinutos} min
                                    </div>
                                    <div className="col-6 d-flex align-items-center">
                                        <FaClock className="me-2" /> {gastronomia.receta.tiempoCoccionHoras} h
                                    </div>
                                </div>
                            )}

                            {/* Ubicaciones */}
                            {gastronomia.ubicacionDondeEncontrar?.length > 0 && (
                                <>
                                    <h6 className="text-danger mt-4 mb-2 d-flex align-items-center">
                                        <FaMapMarkerAlt className="me-2" /> Dónde encontrarlo
                                    </h6>
                                    {gastronomia.ubicacionDondeEncontrar.map((lugar, i) => (
                                        <div key={i} className="mb-3">
                                            <p><strong>Lugar:</strong> {lugar.nombreLugar}</p>
                                            <p><strong>Tipo:</strong> {lugar.tipoLugar}</p>
                                            <p><strong>Dirección:</strong> {lugar.direccion}</p>
                                        </div>
                                    ))}
                                </>
                            )}

                            {/* Consejos */}
                            {gastronomia.consejosServir?.length > 0 && (
                                <>
                                    <h6 className="text-danger mt-4 mb-2 d-flex align-items-center">
                                        <FaUtensils className="me-2" /> Consejos para servir
                                    </h6>
                                    <ul>
                                        {gastronomia.consejosServir.map((consejo, i) => (
                                            <li key={i} className="text-muted mb-1">• {consejo}</li>
                                        ))}
                                    </ul>
                                </>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Row className="justify-content-center">
                <Col md={15}>
                    <Card className="sticky-top" style={{ top: '20px', borderColor: '#0FA89C', marginTop: '50px' }}>
                        <Card.Body style={{ backgroundColor: '#FDF2E0' }}>
                            <h4 style={{ color: '#9A1E47', marginBottom: '20px' }}>¿Tienes dudas sobre esta receta?</h4>

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

export default GastronomiaDetalle;
