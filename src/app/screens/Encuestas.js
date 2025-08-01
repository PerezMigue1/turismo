// src/screens/Encuestas.js
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, Spinner, Alert, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FaClipboardList, FaCalendarAlt, FaUsers, FaTag, FaArrowRight } from 'react-icons/fa';

const Encuestas = () => {
    const [encuestas, setEncuestas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [categoriaFiltro, setCategoriaFiltro] = useState('');
    const [busquedaTexto, setBusquedaTexto] = useState('');

    useEffect(() => {
        const fetchEncuestas = async () => {
            try {
                const response = await axios.get('https://backend-iota-seven-19.vercel.app/api/encuestas/public');
                if (response.data.success) {
                    setEncuestas(response.data.data);
                } else {
                    setError(response.data.message || 'Error al cargar las encuestas');
                }
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchEncuestas();
    }, []);

    // Obtener valores únicos para los filtros
    const categorias = Array.from(new Set(encuestas.map(item => item.categoria).filter(Boolean))).sort();

    // Filtrar encuestas
    const encuestasFiltradas = encuestas.filter(encuesta => {
        const cumpleBusqueda = !busquedaTexto || 
            encuesta.titulo?.toLowerCase().includes(busquedaTexto.toLowerCase()) ||
            encuesta.descripcion?.toLowerCase().includes(busquedaTexto.toLowerCase());
        
        const cumpleCategoria = !categoriaFiltro || encuesta.categoria === categoriaFiltro;
        
        return cumpleBusqueda && cumpleCategoria;
    });

    const getCategoriaColor = (categoria) => {
        const colores = {
            'turismo': 'primary',
            'servicios': 'success',
            'experiencia_usuario': 'info',
            'satisfaccion': 'warning',
            'mejoras': 'danger',
            'general': 'secondary'
        };
        return colores[categoria] || 'primary';
    };

    const getCategoriaLabel = (categoria) => {
        const labels = {
            'turismo': 'Turismo',
            'servicios': 'Servicios',
            'experiencia_usuario': 'Experiencia de Usuario',
            'satisfaccion': 'Satisfacción',
            'mejoras': 'Mejoras',
            'general': 'General'
        };
        return labels[categoria] || categoria;
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const limpiarFiltros = () => {
        setCategoriaFiltro('');
        setBusquedaTexto('');
    };

    if (loading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                backgroundColor: '#FDF2E0'
            }}>
                <Spinner animation="border" variant="primary" />
            </div>
        );
    }

    if (error) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                backgroundColor: '#FDF2E0',
                color: '#9A1E47'
            }}>
                <Alert variant="danger">
                    Error al cargar las encuestas: {error}
                </Alert>
            </div>
        );
    }

    return (
        <div style={{
            backgroundColor: '#FDF2E0',
            minHeight: '100vh',
            padding: '20px 0',
        }}>
            <Container className="py-4">
                {/* Título y descripción */}
                <div className="text-center mb-5">
                    <h1 style={{ color: '#9A1E47', marginBottom: '15px', fontSize: '2.5rem', fontWeight: '700' }}>
                        Encuestas y Opiniones
                    </h1>
                    <p style={{ 
                        color: '#666', 
                        fontSize: '1.1rem', 
                        maxWidth: '600px', 
                        margin: '0 auto',
                        lineHeight: '1.6'
                    }}>
                        Tu opinión es muy importante para nosotros. Participa en nuestras encuestas 
                        y ayúdanos a mejorar nuestros servicios turísticos.
                    </p>
                </div>

                {/* Filtros */}
                <div className="d-flex justify-content-center mb-4">
                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
                        <Form.Select
                            value={categoriaFiltro}
                            onChange={e => setCategoriaFiltro(e.target.value)}
                            style={{
                                width: '200px',
                                borderColor: '#1E8546',
                                color: '#9A1E47',
                                marginRight: '8px',
                                fontWeight: 600
                            }}
                        >
                            <option value="">Todas las categorías</option>
                            {categorias.map(categoria => (
                                <option key={categoria} value={categoria}>
                                    {getCategoriaLabel(categoria)}
                                </option>
                            ))}
                        </Form.Select>
                        <Form.Control
                            type="text"
                            placeholder="Buscar encuesta..."
                            value={busquedaTexto}
                            onChange={e => setBusquedaTexto(e.target.value)}
                            style={{
                                width: '250px',
                                borderColor: '#1E8546',
                                color: '#9A1E47',
                                marginRight: '8px',
                                fontWeight: 600
                            }}
                        />
                        <Button
                            variant="outline-secondary"
                            size="sm"
                            onClick={limpiarFiltros}
                            style={{
                                borderColor: '#9A1E47',
                                color: '#9A1E47',
                                fontWeight: '500',
                                borderRadius: '8px',
                                padding: '8px 16px',
                                fontSize: '0.85rem',
                                height: '40px'
                            }}
                            disabled={!busquedaTexto && !categoriaFiltro}
                        >
                            Limpiar filtros
                        </Button>
                    </div>
                </div>

                {/* Contenido */}
                {encuestasFiltradas.length === 0 ? (
                    <div style={{
                        textAlign: 'center',
                        padding: '40px',
                        color: '#9A1E47',
                        backgroundColor: '#FEF8ED',
                        borderRadius: '8px',
                        border: '1px dashed #9A1E47'
                    }}>
                        <div style={{
                            width: '80px',
                            height: '80px',
                            backgroundColor: '#f8f9fa',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 20px',
                            border: '3px solid #0FA89C'
                        }}>
                            <FaClipboardList style={{ 
                                fontSize: '2rem', 
                                color: '#9A1E47' 
                            }} />
                        </div>
                        <h4 style={{ color: '#9A1E47', marginBottom: '15px' }}>
                            No hay encuestas disponibles
                        </h4>
                        <p style={{ color: '#666', margin: 0 }}>
                            No hay encuestas activas en este momento. ¡Vuelve pronto!
                        </p>
                    </div>
                ) : (
                    <Row xs={1} md={2} lg={3} className="g-4">
                        {encuestasFiltradas.map((encuesta) => (
                            <Col key={encuesta._id}>
                                <Card className="h-100" style={{
                                    border: '2px solid #0FA89C',
                                    borderRadius: '10px',
                                    overflow: 'hidden',
                                    boxShadow: '0 4px 12px rgba(154, 30, 71, 0.15)',
                                    transition: 'transform 0.3s, box-shadow 0.3s',
                                    backgroundColor: 'white',
                                }}>
                                    {encuesta.imagen && (
                                        <Card.Img
                                            variant="top"
                                            src={encuesta.imagen}
                                            style={{
                                                height: '200px',
                                                objectFit: 'cover',
                                                borderBottom: '3px solid #F28B27'
                                            }}
                                            alt={encuesta.titulo}
                                            onError={(e) => {
                                                e.target.style.display = 'none';
                                            }}
                                        />
                                    )}

                                    <Card.Body className="d-flex flex-column" style={{ backgroundColor: '#FEF8ED' }}>
                                        <div className="mb-2">
                                            <Badge bg={getCategoriaColor(encuesta.categoria)} className="me-2">
                                                {getCategoriaLabel(encuesta.categoria)}
                                            </Badge>
                                            {encuesta.tags && encuesta.tags.length > 0 && (
                                                <Badge bg="light" text="dark">
                                                    <FaTag style={{ marginRight: '3px' }} />
                                                    {encuesta.tags.length} tags
                                                </Badge>
                                            )}
                                        </div>

                                        <Card.Title style={{ color: '#9A1E47', minHeight: '48px' }}>
                                            {encuesta.titulo}
                                        </Card.Title>

                                        <Card.Text className="flex-grow-1" style={{ color: '#555', minHeight: '60px' }}>
                                            {encuesta.descripcion?.substring(0, 120)}...
                                        </Card.Text>

                                        <div className="mb-3">
                                            <div style={{ color: '#666', fontSize: '0.9rem', display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
                                                <FaCalendarAlt style={{ marginRight: '5px', color: '#1E8546' }} />
                                                Finaliza: {formatDate(encuesta.fecha_fin)}
                                            </div>
                                            <div style={{ color: '#666', fontSize: '0.9rem', display: 'flex', alignItems: 'center' }}>
                                                <FaUsers style={{ marginRight: '5px', color: '#F28B27' }} />
                                                {encuesta.respuestas_actuales || 0} respuestas
                                            </div>
                                        </div>

                                        <div className="d-grid gap-2">
                                            <Link to={`/encuestas/${encuesta._id}`}>
                                                <Button
                                                    variant="outline"
                                                    style={{
                                                        color: '#9A1E47',
                                                        borderColor: '#9A1E47',
                                                        width: '100%'
                                                    }}
                                                >
                                                    Participar <FaArrowRight style={{ marginLeft: '5px' }} />
                                                </Button>
                                            </Link>
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                )}
            </Container>
        </div>
    );
};

export default Encuestas; 