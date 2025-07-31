import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Alert, Spinner, Badge, Accordion } from 'react-bootstrap';
import { FaShieldAlt, FaFileContract, FaCookieBite, FaInfoCircle } from 'react-icons/fa';

const Politicas = () => {
    const [politicas, setPoliticas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        cargarPoliticas();
    }, []);

    const cargarPoliticas = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await fetch('https://backend-iota-seven-19.vercel.app/api/politicas/public');
            const data = await response.json();

            if (data.success) {
                setPoliticas(data.data);
            } else {
                setError(data.message || 'Error al cargar las políticas');
            }
        } catch (error) {
            console.error('Error:', error);
            setError('Error de conexión');
        } finally {
            setLoading(false);
        }
    };

    const getTipoIcon = (tipo) => {
        switch (tipo) {
            case 'privacidad':
                return <FaShieldAlt />;
            case 'terminos':
                return <FaFileContract />;
            case 'cookies':
                return <FaCookieBite />;
            case 'uso':
                return <FaInfoCircle />;
            default:
                return <FaInfoCircle />;
        }
    };

    const getTipoLabel = (tipo) => {
        switch (tipo) {
            case 'privacidad':
                return 'Política de Privacidad';
            case 'terminos':
                return 'Términos y Condiciones';
            case 'cookies':
                return 'Política de Cookies';
            case 'uso':
                return 'Términos de Uso';
            default:
                return tipo;
        }
    };

    const getTipoColor = (tipo) => {
        switch (tipo) {
            case 'privacidad':
                return 'primary';
            case 'terminos':
                return 'success';
            case 'cookies':
                return 'warning';
            case 'uso':
                return 'info';
            default:
                return 'secondary';
        }
    };

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
                                    Políticas y Términos
                                </h1>
                                <p style={{ 
                                    color: '#666', 
                                    fontSize: '1.1rem',
                                    maxWidth: '600px',
                                    margin: '0 auto'
                                }}>
                                    Conoce nuestras políticas y términos que rigen el uso de nuestra plataforma
                                </p>
                            </div>
                        </Col>
                    </Row>

                    {error && (
                        <Alert variant="danger" className="mb-4">
                            {error}
                        </Alert>
                    )}

                    {politicas.length === 0 ? (
                        <Row>
                            <Col>
                                <Card>
                                    <Card.Body style={{ textAlign: 'center', padding: '3rem' }}>
                                        <p style={{ color: '#666', fontSize: '1.1rem' }}>
                                            No hay políticas disponibles en este momento.
                                        </p>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                    ) : (
                        <Row>
                            <Col>
                                <Accordion>
                                    {politicas.map((politica, index) => (
                                        <Accordion.Item key={politica._id} eventKey={index.toString()}>
                                            <Accordion.Header>
                                                <div style={{ 
                                                    display: 'flex', 
                                                    alignItems: 'center', 
                                                    gap: '1rem',
                                                    width: '100%'
                                                }}>
                                                    <span style={{ color: '#1E8546', fontSize: '1.2rem' }}>
                                                        {getTipoIcon(politica.tipo)}
                                                    </span>
                                                    <div style={{ flex: 1 }}>
                                                        <h5 style={{ margin: 0, fontWeight: 'bold' }}>
                                                            {politica.titulo}
                                                        </h5>
                                                        <Badge bg={getTipoColor(politica.tipo)} style={{ fontSize: '0.8rem' }}>
                                                            {getTipoLabel(politica.tipo)}
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
                                                        {politica.descripcion}
                                                    </div>
                                                    <div style={{ 
                                                        marginTop: '1rem',
                                                        paddingTop: '1rem',
                                                        borderTop: '1px solid #dee2e6',
                                                        fontSize: '0.9rem',
                                                        color: '#666'
                                                    }}>
                                                        <strong>Última actualización:</strong> {new Date(politica.updatedAt).toLocaleDateString('es-ES')}
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
                                        Si tienes alguna pregunta sobre nuestras políticas, no dudes en contactarnos.
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

export default Politicas; 