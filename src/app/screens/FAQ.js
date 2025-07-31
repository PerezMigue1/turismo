import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Alert, Spinner, Badge, Accordion, Button, ButtonGroup } from 'react-bootstrap';
import { FaQuestionCircle, FaSearch, FaFilter } from 'react-icons/fa';

const FAQ = () => {
    const [faqs, setFaqs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [categoriaActiva, setCategoriaActiva] = useState('todas');
    const [busqueda, setBusqueda] = useState('');

    const categorias = [
        { id: 'todas', label: 'Todas', color: 'primary' },
        { id: 'general', label: 'General', color: 'info' },
        { id: 'reservas', label: 'Reservas', color: 'success' },
        { id: 'pagos', label: 'Pagos', color: 'warning' },
        { id: 'servicios', label: 'Servicios', color: 'secondary' },
        { id: 'tecnico', label: 'Técnico', color: 'danger' },
        { id: 'cuenta', label: 'Cuenta', color: 'dark' }
    ];

    useEffect(() => {
        cargarFAQs();
    }, []);

    const cargarFAQs = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await fetch('https://backend-iota-seven-19.vercel.app/api/faq/public');
            const data = await response.json();

            if (data.success) {
                setFaqs(data.data);
            } else {
                setError(data.message || 'Error al cargar las preguntas frecuentes');
            }
        } catch (error) {
            console.error('Error:', error);
            setError('Error de conexión');
        } finally {
            setLoading(false);
        }
    };

    const getCategoriaLabel = (categoria) => {
        const cat = categorias.find(c => c.id === categoria);
        return cat ? cat.label : categoria;
    };

    const getCategoriaColor = (categoria) => {
        const cat = categorias.find(c => c.id === categoria);
        return cat ? cat.color : 'secondary';
    };

    const filtrarFAQs = () => {
        let faqsFiltradas = faqs;

        // Filtrar por categoría
        if (categoriaActiva !== 'todas') {
            faqsFiltradas = faqsFiltradas.filter(faq => faq.categoria === categoriaActiva);
        }

        // Filtrar por búsqueda
        if (busqueda.trim()) {
            const termino = busqueda.toLowerCase();
            faqsFiltradas = faqsFiltradas.filter(faq => 
                faq.pregunta.toLowerCase().includes(termino) ||
                faq.respuesta.toLowerCase().includes(termino)
            );
        }

        return faqsFiltradas;
    };

    const faqsFiltradas = filtrarFAQs();

    if (loading) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
                <main style={{ flex: 1, padding: '40px 0' }}>
                    <Container>
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
                            <Spinner animation="border" role="status" style={{ color: '#1E8546' }}>
                                <span className="visually-hidden">Cargando...</span>
                            </Spinner>
                        </div>
                    </Container>
                </main>
            </div>
        );
    }

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <main style={{ flex: 1, padding: '40px 0' }}>
                <Container>
                    <Row className="mb-5">
                        <Col>
                            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                                <h1 style={{ 
                                    color: '#1E8546', 
                                    fontWeight: 'bold',
                                    marginBottom: '1rem'
                                }}>
                                    Preguntas Frecuentes
                                </h1>
                                <p style={{ 
                                    color: '#666', 
                                    fontSize: '1.1rem',
                                    maxWidth: '600px',
                                    margin: '0 auto'
                                }}>
                                    Encuentra respuestas a las preguntas más comunes sobre nuestros servicios
                                </p>
                            </div>
                        </Col>
                    </Row>

                    {error && (
                        <Alert variant="danger" className="mb-4">
                            {error}
                        </Alert>
                    )}

                    {/* Barra de búsqueda */}
                    <Row className="mb-4">
                        <Col md={8} className="mx-auto">
                            <div style={{ position: 'relative' }}>
                                <FaSearch style={{
                                    position: 'absolute',
                                    left: '15px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    color: '#666',
                                    zIndex: 1
                                }} />
                                <input
                                    type="text"
                                    placeholder="Buscar preguntas..."
                                    value={busqueda}
                                    onChange={(e) => setBusqueda(e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '12px 45px',
                                        border: '2px solid #e9ecef',
                                        borderRadius: '25px',
                                        fontSize: '1rem',
                                        outline: 'none',
                                        transition: 'border-color 0.3s'
                                    }}
                                    onFocus={(e) => e.target.style.borderColor = '#1E8546'}
                                    onBlur={(e) => e.target.style.borderColor = '#e9ecef'}
                                />
                            </div>
                        </Col>
                    </Row>

                    {/* Filtros por categoría */}
                    <Row className="mb-4">
                        <Col>
                            <div style={{ textAlign: 'center' }}>
                                <p style={{ marginBottom: '1rem', color: '#666' }}>
                                    <FaFilter style={{ marginRight: '0.5rem' }} />
                                    Filtrar por categoría:
                                </p>
                                <ButtonGroup>
                                    {categorias.map((categoria) => (
                                        <Button
                                            key={categoria.id}
                                            variant={categoriaActiva === categoria.id ? categoria.color : 'outline-' + categoria.color}
                                            onClick={() => setCategoriaActiva(categoria.id)}
                                            style={{ margin: '0 0.25rem' }}
                                        >
                                            {categoria.label}
                                        </Button>
                                    ))}
                                </ButtonGroup>
                            </div>
                        </Col>
                    </Row>

                    {faqsFiltradas.length === 0 ? (
                        <Row>
                            <Col>
                                <Card>
                                    <Card.Body style={{ textAlign: 'center', padding: '3rem' }}>
                                        <FaQuestionCircle style={{ fontSize: '3rem', color: '#ccc', marginBottom: '1rem' }} />
                                        <p style={{ color: '#666', fontSize: '1.1rem' }}>
                                            {busqueda.trim() 
                                                ? `No se encontraron preguntas que coincidan con "${busqueda}"`
                                                : 'No hay preguntas frecuentes disponibles en esta categoría.'
                                            }
                                        </p>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                    ) : (
                        <Row>
                            <Col>
                                <Accordion>
                                    {faqsFiltradas.map((faq, index) => (
                                        <Accordion.Item key={faq._id} eventKey={index.toString()}>
                                            <Accordion.Header>
                                                <div style={{ 
                                                    display: 'flex', 
                                                    alignItems: 'center', 
                                                    gap: '1rem',
                                                    width: '100%'
                                                }}>
                                                    <span style={{ color: '#1E8546', fontSize: '1.2rem' }}>
                                                        <FaQuestionCircle />
                                                    </span>
                                                    <div style={{ flex: 1 }}>
                                                        <h5 style={{ margin: 0, fontWeight: 'bold' }}>
                                                            {faq.pregunta}
                                                        </h5>
                                                        <Badge bg={getCategoriaColor(faq.categoria)} style={{ fontSize: '0.8rem' }}>
                                                            {getCategoriaLabel(faq.categoria)}
                                                        </Badge>
                                                    </div>
                                                </div>
                                            </Accordion.Header>
                                            <Accordion.Body>
                                                <div style={{ 
                                                    padding: '1rem',
                                                    backgroundColor: '#f8f9fa',
                                                    borderRadius: '8px',
                                                    border: '1px solid #e9ecef'
                                                }}>
                                                    <div style={{ 
                                                        whiteSpace: 'pre-wrap',
                                                        lineHeight: '1.6',
                                                        color: '#333'
                                                    }}>
                                                        {faq.respuesta}
                                                    </div>
                                                    <div style={{ 
                                                        marginTop: '1rem',
                                                        paddingTop: '1rem',
                                                        borderTop: '1px solid #dee2e6',
                                                        fontSize: '0.9rem',
                                                        color: '#666'
                                                    }}>
                                                        <strong>Última actualización:</strong> {new Date(faq.updatedAt).toLocaleDateString('es-ES')}
                                                    </div>
                                                </div>
                                            </Accordion.Body>
                                        </Accordion.Item>
                                    ))}
                                </Accordion>
                            </Col>
                        </Row>
                    )}

                    <Row className="mt-5">
                        <Col>
                            <Card style={{ backgroundColor: '#f8f9fa', border: '1px solid #e9ecef' }}>
                                <Card.Body style={{ textAlign: 'center' }}>
                                    <p style={{ margin: 0, color: '#666' }}>
                                        ¿No encontraste la respuesta que buscabas? 
                                        <br />
                                        <strong>Contáctanos:</strong> soporte@aventurahuasteca.com
                                    </p>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </main>
        </div>
    );
};

export default FAQ; 