import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Spinner, Alert } from 'react-bootstrap';
import CardGastronomia from '../components/CardGastronomia';
import GastronomiaDetalle from '../screens/GastronomiaDetalle';
import axios from 'axios';
import { FaUtensils } from 'react-icons/fa';

const Gastronomia = () => {
    const [busquedaTexto, setBusquedaTexto] = useState('');
    const [gastronomia, setGastronomia] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [recetaSeleccionada, setRecetaSeleccionada] = useState(null);
    const [mostrarDetalle, setMostrarDetalle] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const gastronomiaRes = await axios.get('https://backend-iota-seven-19.vercel.app/api/gastronomia');
                setGastronomia(gastronomiaRes.data);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const gastronomiaFiltrada = gastronomia.filter(item => {
        const cumpleBusqueda = !busquedaTexto || 
            item.Nombre?.toLowerCase().includes(busquedaTexto.toLowerCase()) ||
            item.Descripcion?.toLowerCase().includes(busquedaTexto.toLowerCase()) ||
            item.Origen?.toLowerCase().includes(busquedaTexto.toLowerCase()) ||
            item.Categoria?.toLowerCase().includes(busquedaTexto.toLowerCase()) ||
            item.Ingredientes?.toLowerCase().includes(busquedaTexto.toLowerCase());
        
        return cumpleBusqueda;
    });

    const onVerReceta = (receta) => {
        setRecetaSeleccionada(receta);
        setMostrarDetalle(true);
    };

    const onVolver = () => {
        setMostrarDetalle(false);
        setRecetaSeleccionada(null);
    };

    if (mostrarDetalle) {
        return <GastronomiaDetalle gastronomia={recetaSeleccionada} onVolver={onVolver} />;
    }

    if (loading) return (
        <div style={{ 
            display: 'flex', 
            flexDirection: 'column',
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '100vh',
            backgroundColor: '#f8f9fa'
        }}>
            <Spinner 
                animation="border" 
                style={{ 
                    color: '#9A1E47', 
                    width: '3rem', 
                    height: '3rem',
                    marginBottom: '20px'
                }} 
            />
            <p style={{ color: '#9A1E47', fontSize: '1.1rem', fontWeight: '500' }}>
                Cargando gastronomía...
            </p>
        </div>
    );
    
    if (error) return (
        <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '100vh',
            backgroundColor: '#f8f9fa',
            padding: '20px'
        }}>
            <Alert 
                variant="danger" 
                style={{ 
                    backgroundColor: '#fff',
                    borderColor: '#9A1E47',
                    color: '#9A1E47',
                    maxWidth: '500px',
                    textAlign: 'center',
                    borderRadius: '15px',
                    boxShadow: '0 8px 25px rgba(154, 30, 71, 0.15)'
                }}
            >
                <Alert.Heading>Error al cargar la gastronomía</Alert.Heading>
                <p>{error}</p>
                <button 
                    className="btn btn-outline-danger"
                    style={{ 
                        color: '#9A1E47',
                        borderColor: '#9A1E47',
                        marginTop: '15px',
                        borderRadius: '10px'
                    }}
                    onClick={() => window.location.reload()}
                >
                    Intentar nuevamente
                </button>
            </Alert>
        </div>
    );

    return (
        <div className="container-fluid py-5" style={{ backgroundColor: '#FDF2E0', minHeight: '100vh' }}>
            <Container style={{ maxWidth: '1400px' }}>
                <Row className="mb-5 justify-content-center">
                    <Col xs={12} className="text-center">
                        <h1 className="display-4 fw-bold text-dark mb-3" style={{ 
                                color: '#9A1E47', 
                                fontWeight: '600',
                                fontSize: '2.2rem',
                                marginBottom: '15px',
                                textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
                            }}>
                            Sabores de la Huasteca Hidalguense
                        </h1>
                    </Col>
                </Row>

                <div style={{ 
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '15px',
                    padding: '10px 0',
                    maxWidth: '1200px',
                    margin: '0 auto'
                }}>
                    {gastronomiaFiltrada.length > 0 ? (
                        gastronomiaFiltrada.map((item, index) => (
                            <div key={item._id || item.id || item.idGastronomia || `item-${index}`} style={{
                                transition: 'transform 0.3s ease, box-shadow 0.3s ease'
                            }}>
                                <CardGastronomia 
                                    gastronomia={item} 
                                    onVerReceta={onVerReceta} 
                                />
                            </div>
                        ))
                    ) : (
                        <div style={{ 
                            gridColumn: '1 / -1',
                            display: 'flex',
                            justifyContent: 'center',
                            padding: '60px 40px'
                        }}>
                            <div style={{ 
                                backgroundColor: 'white',
                                borderRadius: '20px',
                                border: '2px solid #0FA89C',
                                boxShadow: '0 8px 25px rgba(154, 30, 71, 0.12)',
                                maxWidth: '600px',
                                width: '100%',
                                padding: '60px 40px',
                                textAlign: 'center'
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
                                    <FaUtensils style={{ 
                                        fontSize: '2rem', 
                                        color: '#9A1E47' 
                                    }} />
                                </div>
                                <h4 style={{ color: '#9A1E47', marginBottom: '15px' }}>
                                    No hay platillos disponibles
                                </h4>
                                <p style={{ color: '#666', margin: 0 }}>
                                    No hay platillos disponibles en este momento
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </Container>
        </div>
    );
};

export default Gastronomia;