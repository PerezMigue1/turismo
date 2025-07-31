import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Alert, Spinner } from 'react-bootstrap';
import { FaBullseye, FaEye, FaLightbulb } from 'react-icons/fa';

const MisionVision = () => {
    const [mision, setMision] = useState(null);
    const [vision, setVision] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        cargarMisionVision();
    }, []);

    const cargarMisionVision = async () => {
        try {
            setLoading(true);
            setError(null);

            // Cargar misión y visión en paralelo
            const [misionResponse, visionResponse] = await Promise.all([
                fetch('https://backend-iota-seven-19.vercel.app/api/misionvision/public/mision'),
                fetch('https://backend-iota-seven-19.vercel.app/api/misionvision/public/vision')
            ]);

            const misionData = await misionResponse.json();
            const visionData = await visionResponse.json();

            if (misionData.success) {
                setMision(misionData.data);
            }

            if (visionData.success) {
                setVision(visionData.data);
            }

        } catch (error) {
            console.error('Error al cargar misión y visión:', error);
            setError('Error al cargar la información. Por favor, intenta de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Spinner animation="border" role="status" style={{ color: '#1E8546' }}>
                    <span className="visually-hidden">Cargando...</span>
                </Spinner>
            </div>
        );
    }

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <main style={{ flex: 1, padding: '40px 0' }}>
                <Container>
                    <Row className="justify-content-center mb-5">
                        <Col lg={8} className="text-center">
                            <h1 style={{
                                color: '#1E8546',
                                fontWeight: 'bold',
                                marginBottom: '20px',
                                fontSize: '2.5rem'
                            }}>
                                Nuestra Misión y Visión
                            </h1>
                            <p style={{
                                color: '#666',
                                fontSize: '1.1rem',
                                lineHeight: '1.6'
                            }}>
                                Conoce los principios que guían nuestro compromiso con el turismo 
                                responsable y el desarrollo sostenible de la Huasteca Hidalguense.
                            </p>
                        </Col>
                    </Row>

                    {error && (
                        <Row className="justify-content-center mb-4">
                            <Col lg={8}>
                                <Alert variant="danger">
                                    {error}
                                </Alert>
                            </Col>
                        </Row>
                    )}

                    <Row className="justify-content-center">
                        <Col lg={10}>
                            <Row>
                                {/* Misión */}
                                <Col lg={6} className="mb-4">
                                    <Card style={{
                                        height: '100%',
                                        border: 'none',
                                        borderRadius: '15px',
                                        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                                        transition: 'transform 0.3s ease'
                                    }}>
                                        <Card.Body style={{ padding: '2rem' }}>
                                            <div style={{
                                                textAlign: 'center',
                                                marginBottom: '1.5rem'
                                            }}>
                                                <div style={{
                                                    width: '80px',
                                                    height: '80px',
                                                    borderRadius: '50%',
                                                    backgroundColor: '#1E8546',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    margin: '0 auto 1rem'
                                                }}>
                                                    <FaBullseye style={{
                                                        fontSize: '2rem',
                                                        color: 'white'
                                                    }} />
                                                </div>
                                                <h3 style={{
                                                    color: '#1E8546',
                                                    fontWeight: 'bold',
                                                    marginBottom: '0.5rem'
                                                }}>
                                                    Misión
                                                </h3>
                                            </div>
                                            
                                            {mision ? (
                                                <>
                                                    <h4 style={{
                                                        color: '#333',
                                                        fontWeight: '600',
                                                        marginBottom: '1rem',
                                                        textAlign: 'center'
                                                    }}>
                                                        {mision.titulo}
                                                    </h4>
                                                    <p style={{
                                                        color: '#666',
                                                        lineHeight: '1.8',
                                                        fontSize: '1rem',
                                                        textAlign: 'justify'
                                                    }}>
                                                        {mision.descripcion}
                                                    </p>
                                                </>
                                            ) : (
                                                <div style={{
                                                    textAlign: 'center',
                                                    color: '#999',
                                                    fontStyle: 'italic'
                                                }}>
                                                    <p>Información de misión no disponible</p>
                                                </div>
                                            )}
                                        </Card.Body>
                                    </Card>
                                </Col>

                                {/* Visión */}
                                <Col lg={6} className="mb-4">
                                    <Card style={{
                                        height: '100%',
                                        border: 'none',
                                        borderRadius: '15px',
                                        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                                        transition: 'transform 0.3s ease'
                                    }}>
                                        <Card.Body style={{ padding: '2rem' }}>
                                            <div style={{
                                                textAlign: 'center',
                                                marginBottom: '1.5rem'
                                            }}>
                                                <div style={{
                                                    width: '80px',
                                                    height: '80px',
                                                    borderRadius: '50%',
                                                    backgroundColor: '#F28B27',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    margin: '0 auto 1rem'
                                                }}>
                                                    <FaEye style={{
                                                        fontSize: '2rem',
                                                        color: 'white'
                                                    }} />
                                                </div>
                                                <h3 style={{
                                                    color: '#F28B27',
                                                    fontWeight: 'bold',
                                                    marginBottom: '0.5rem'
                                                }}>
                                                    Visión
                                                </h3>
                                            </div>
                                            
                                            {vision ? (
                                                <>
                                                    <h4 style={{
                                                        color: '#333',
                                                        fontWeight: '600',
                                                        marginBottom: '1rem',
                                                        textAlign: 'center'
                                                    }}>
                                                        {vision.titulo}
                                                    </h4>
                                                    <p style={{
                                                        color: '#666',
                                                        lineHeight: '1.8',
                                                        fontSize: '1rem',
                                                        textAlign: 'justify'
                                                    }}>
                                                        {vision.descripcion}
                                                    </p>
                                                </>
                                            ) : (
                                                <div style={{
                                                    textAlign: 'center',
                                                    color: '#999',
                                                    fontStyle: 'italic'
                                                }}>
                                                    <p>Información de visión no disponible</p>
                                                </div>
                                            )}
                                        </Card.Body>
                                    </Card>
                                </Col>
                            </Row>
                        </Col>
                    </Row>

                    {/* Sección de valores */}
                    <Row className="justify-content-center mt-5">
                        <Col lg={8} className="text-center">
                            <h2 style={{
                                color: '#1E8546',
                                fontWeight: 'bold',
                                marginBottom: '2rem'
                            }}>
                                Nuestros Valores
                            </h2>
                            <Row>
                                <Col md={4} className="mb-4">
                                    <div style={{
                                        textAlign: 'center',
                                        padding: '1.5rem'
                                    }}>
                                        <FaLightbulb style={{
                                            fontSize: '2.5rem',
                                            color: '#1E8546',
                                            marginBottom: '1rem'
                                        }} />
                                        <h5 style={{
                                            color: '#333',
                                            fontWeight: '600',
                                            marginBottom: '0.5rem'
                                        }}>
                                            Innovación
                                        </h5>
                                        <p style={{
                                            color: '#666',
                                            fontSize: '0.9rem'
                                        }}>
                                            Buscamos constantemente nuevas formas de conectar 
                                            turistas con experiencias auténticas.
                                        </p>
                                    </div>
                                </Col>
                                <Col md={4} className="mb-4">
                                    <div style={{
                                        textAlign: 'center',
                                        padding: '1.5rem'
                                    }}>
                                        <FaBullseye style={{
                                            fontSize: '2.5rem',
                                            color: '#F28B27',
                                            marginBottom: '1rem'
                                        }} />
                                        <h5 style={{
                                            color: '#333',
                                            fontWeight: '600',
                                            marginBottom: '0.5rem'
                                        }}>
                                            Sostenibilidad
                                        </h5>
                                        <p style={{
                                            color: '#666',
                                            fontSize: '0.9rem'
                                        }}>
                                            Promovemos el turismo responsable que beneficia 
                                            a las comunidades locales y preserva el medio ambiente.
                                        </p>
                                    </div>
                                </Col>
                                <Col md={4} className="mb-4">
                                    <div style={{
                                        textAlign: 'center',
                                        padding: '1.5rem'
                                    }}>
                                        <FaEye style={{
                                            fontSize: '2.5rem',
                                            color: '#1E8546',
                                            marginBottom: '1rem'
                                        }} />
                                        <h5 style={{
                                            color: '#333',
                                            fontWeight: '600',
                                            marginBottom: '0.5rem'
                                        }}>
                                            Autenticidad
                                        </h5>
                                        <p style={{
                                            color: '#666',
                                            fontSize: '0.9rem'
                                        }}>
                                            Valoramos y preservamos la cultura y tradiciones 
                                            únicas de la Huasteca Hidalguense.
                                        </p>
                                    </div>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Container>
            </main>
        </div>
    );
};

export default MisionVision; 