import React, { useState, useEffect } from 'react';
import ListaRestaurantes from '../components/ListaRestaurantes';
import axios from 'axios';
import { Container, Row, Col, Form } from 'react-bootstrap';

const Restaurantes = () => {
    const [restaurantes, setRestaurantes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [busqueda, setBusqueda] = useState('');
    const [municipioFiltro, setMunicipioFiltro] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get('https://backend-iota-seven-19.vercel.app/api/restaurante');
                setRestaurantes(res.data);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Obtener lista única de municipios
    const municipios = Array.from(new Set(restaurantes.map(r => r.Ubicacion?.Municipio).filter(Boolean)));

    // Filtrar restaurantes por búsqueda y municipio
    const restaurantesFiltrados = restaurantes.filter(r => {
        const coincideBusqueda = r.Nombre.toLowerCase().includes(busqueda.toLowerCase());
        const coincideMunicipio = municipioFiltro ? r.Ubicacion?.Municipio === municipioFiltro : true;
        return coincideBusqueda && coincideMunicipio;
    });

    if (loading) return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            backgroundColor: '#FDF2E0'
        }}>
            <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Cargando...</span>
            </div>
        </div>
    );

    if (error) return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            backgroundColor: '#FDF2E0',
            color: '#9A1E47'
        }}>
            <div className="alert alert-danger" role="alert">
                Error al cargar los restaurantes: {error}
            </div>
        </div>
    );

    return (
        <div style={{
            backgroundColor: '#FDF2E0',
            minHeight: '100vh',
            padding: '20px 0',
        }}>
            <Container style={{ marginBottom: 24 }}>
                <Row className="align-items-end g-3">
                    <Col xs={12} md={6} lg={4}>
                        <Form.Group controlId="busquedaRestaurante">
                            <Form.Label style={{ color: '#9A1E47', fontWeight: 600 }}>Buscar restaurante</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Nombre del restaurante..."
                                value={busqueda}
                                onChange={e => setBusqueda(e.target.value)}
                            />
                        </Form.Group>
                    </Col>
                    <Col xs={12} md={6} lg={4}>
                        <Form.Group controlId="filtroMunicipio">
                            <Form.Label style={{ color: '#9A1E47', fontWeight: 600 }}>Filtrar por municipio</Form.Label>
                            <Form.Select
                                value={municipioFiltro}
                                onChange={e => setMunicipioFiltro(e.target.value)}
                            >
                                <option value="">Todos los municipios</option>
                                {municipios.map(mun => (
                                    <option key={mun} value={mun}>{mun}</option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                    </Col>
                </Row>
            </Container>
            <ListaRestaurantes restaurantes={restaurantesFiltrados} />
        </div>
    );
};

export default Restaurantes; 