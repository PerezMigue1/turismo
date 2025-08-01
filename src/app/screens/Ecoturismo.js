// src/screens/Ecoturismo.js
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Spinner, Alert, Pagination } from 'react-bootstrap';
import ListaEcoturismo from '../components/ListaEcoturismo';
import axios from 'axios';
import { FaMountain } from 'react-icons/fa';

const Ecoturismo = () => {
    const [categoriaFiltro, setCategoriaFiltro] = useState('');
    const [dificultadFiltro, setDificultadFiltro] = useState('');
    const [busquedaTexto, setBusquedaTexto] = useState('');
    const [ordenamiento, setOrdenamiento] = useState('');
    const [ecoturismos, setEcoturismos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 12; // 3 columnas x 4 filas

    useEffect(() => {
        const fetchEcoturismos = async () => {
            try {
                const response = await axios.get('https://backend-iota-seven-19.vercel.app/api/ecoturismo/public');
                if (response.data.success) {
                    setEcoturismos(response.data.data);
                } else {
                    setError(response.data.message || 'Error al cargar los destinos');
                }
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchEcoturismos();
    }, []);

    // Obtener valores únicos para los filtros
    const categorias = Array.from(new Set(ecoturismos.map(item => item.categoria).filter(Boolean))).sort();
    const dificultades = Array.from(new Set(ecoturismos.map(item => item.dificultad).filter(Boolean))).sort();

    // Filtrar ecoturismos
    const ecoturismosFiltrados = ecoturismos.filter(ecoturismo => {
        const cumpleBusqueda = !busquedaTexto || 
            ecoturismo.nombre?.toLowerCase().includes(busquedaTexto.toLowerCase()) ||
            ecoturismo.descripcion?.toLowerCase().includes(busquedaTexto.toLowerCase()) ||
            ecoturismo.ubicacion?.toLowerCase().includes(busquedaTexto.toLowerCase());
        
        const cumpleCategoria = !categoriaFiltro || ecoturismo.categoria === categoriaFiltro;
        const cumpleDificultad = !dificultadFiltro || ecoturismo.dificultad === dificultadFiltro;
        
        return cumpleBusqueda && cumpleCategoria && cumpleDificultad;
    });

    // Ordenar ecoturismos
    const ecoturismosOrdenados = [...ecoturismosFiltrados].sort((a, b) => {
        switch (ordenamiento) {
            case 'nombre-asc':
                return a.nombre.localeCompare(b.nombre);
            case 'nombre-desc':
                return b.nombre.localeCompare(a.nombre);
            case 'precio-asc':
                return (a.precio_entrada || 0) - (b.precio_entrada || 0);
            case 'precio-desc':
                return (b.precio_entrada || 0) - (a.precio_entrada || 0);
            case 'dificultad-asc':
                return a.dificultad.localeCompare(b.dificultad);
            case 'dificultad-desc':
                return b.dificultad.localeCompare(a.dificultad);
            default:
                return 0;
        }
    });

    // Lógica de paginación
    const totalPages = Math.ceil(ecoturismosOrdenados.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = ecoturismosOrdenados.slice(indexOfFirstItem, indexOfLastItem);

    // Resetear página cuando cambian los filtros
    useEffect(() => {
        setCurrentPage(1);
    }, [busquedaTexto, categoriaFiltro, dificultadFiltro, ordenamiento]);

    const limpiarFiltros = () => {
        setCategoriaFiltro('');
        setDificultadFiltro('');
        setBusquedaTexto('');
        setOrdenamiento('');
        setCurrentPage(1);
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

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
                Error al cargar los destinos: {error}
            </div>
        </div>
    );

    return (
        <div style={{
            backgroundColor: '#FDF2E0',
            minHeight: '100vh',
            padding: '20px 0',
        }}>
            <Container className="py-4" style={{
                backgroundColor: '#FDF2E0',
                padding: '20px',
                borderRadius: '8px'
            }}>
                {/* Título y descripción */}
                <div className="text-center mb-5">
                    <h1 style={{ color: '#9A1E47', marginBottom: '15px', fontSize: '2.5rem', fontWeight: '700' }}>
                        Ecoturismo en la Huasteca
                    </h1>
                    <p style={{ 
                        color: '#666', 
                        fontSize: '1.1rem', 
                        maxWidth: '600px', 
                        margin: '0 auto',
                        lineHeight: '1.6'
                    }}>
                        Explora los destinos naturales más impresionantes de la región huasteca. 
                        Descubre cascadas, senderos, y experiencias únicas en contacto con la naturaleza.
                    </p>
                </div>

                {/* Filtros */}
                <div className="d-flex justify-content-center mb-4">
                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
                        <Form.Select
                            value={ordenamiento}
                            onChange={e => setOrdenamiento(e.target.value)}
                            style={{
                                width: '160px',
                                borderColor: '#1E8546',
                                color: '#9A1E47',
                                marginRight: '8px',
                                fontWeight: 600
                            }}
                        >
                            <option value="">Ordenar por</option>
                            <option value="nombre-asc">Nombre: A-Z</option>
                            <option value="nombre-desc">Nombre: Z-A</option>
                            <option value="precio-asc">Precio: Menor a Mayor</option>
                            <option value="precio-desc">Precio: Mayor a Menor</option>
                            <option value="dificultad-asc">Dificultad: Fácil a Difícil</option>
                            <option value="dificultad-desc">Dificultad: Difícil a Fácil</option>
                        </Form.Select>
                        <Form.Select
                            value={categoriaFiltro}
                            onChange={e => setCategoriaFiltro(e.target.value)}
                            style={{
                                width: '140px',
                                borderColor: '#1E8546',
                                color: '#9A1E47',
                                marginRight: '8px',
                                fontWeight: 600
                            }}
                        >
                            <option value="">Categoría</option>
                            {categorias.map(categoria => (
                                <option key={categoria} value={categoria}>
                                    {categoria.replace('_', ' ').toUpperCase()}
                                </option>
                            ))}
                        </Form.Select>
                        <Form.Select
                            value={dificultadFiltro}
                            onChange={e => setDificultadFiltro(e.target.value)}
                            style={{
                                width: '140px',
                                borderColor: '#1E8546',
                                color: '#9A1E47',
                                marginRight: '8px',
                                fontWeight: 600
                            }}
                        >
                            <option value="">Dificultad</option>
                            {dificultades.map(dificultad => (
                                <option key={dificultad} value={dificultad}>
                                    {dificultad.charAt(0).toUpperCase() + dificultad.slice(1)}
                                </option>
                            ))}
                        </Form.Select>
                        <Form.Control
                            type="text"
                            placeholder="Buscar destino..."
                            value={busquedaTexto}
                            onChange={e => setBusquedaTexto(e.target.value)}
                            style={{
                                width: '180px',
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
                            disabled={!busquedaTexto && !categoriaFiltro && !dificultadFiltro && !ordenamiento}
                        >
                            Limpiar filtros
                        </Button>
                    </div>
                </div>

                {/* Contenido */}
                {ecoturismosOrdenados.length === 0 ? (
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
                            <FaMountain style={{ 
                                fontSize: '2rem', 
                                color: '#9A1E47' 
                            }} />
                        </div>
                        <h4 style={{ color: '#9A1E47', marginBottom: '15px' }}>
                            No hay destinos disponibles
                        </h4>
                        <p style={{ color: '#666', margin: 0 }}>
                            No hay destinos de ecoturismo disponibles con estos criterios
                        </p>
                    </div>
                ) : (
                    <ListaEcoturismo
                        ecoturismos={currentItems}
                    />
                )}

                {/* Paginación */}
                {totalPages > 1 && (
                    <div className="d-flex justify-content-center mt-4">
                        <div className="text-center">
                            <p style={{ 
                                color: '#9A1E47', 
                                marginBottom: '15px',
                                fontSize: '0.9rem',
                                fontWeight: '500'
                            }}>
                                Mostrando {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, ecoturismosOrdenados.length)} de {ecoturismosOrdenados.length} destinos
                            </p>
                            <Pagination style={{ margin: 0 }}>
                                <Pagination.Prev 
                                    onClick={() => handlePageChange(currentPage - 1)} 
                                    disabled={currentPage === 1}
                                    style={{
                                        color: currentPage === 1 ? '#ccc' : '#9A1E47',
                                        borderColor: '#1E8546'
                                    }}
                                />
                                {Array.from({ length: totalPages }, (_, i) => (
                                    <Pagination.Item 
                                        key={i + 1} 
                                        active={i + 1 === currentPage}
                                        onClick={() => handlePageChange(i + 1)}
                                        style={{
                                            backgroundColor: i + 1 === currentPage ? '#9A1E47' : 'transparent',
                                            borderColor: '#1E8546',
                                            color: i + 1 === currentPage ? 'white' : '#9A1E47'
                                        }}
                                    >
                                        {i + 1}
                                    </Pagination.Item>
                                ))}
                                <Pagination.Next 
                                    onClick={() => handlePageChange(currentPage + 1)} 
                                    disabled={currentPage === totalPages}
                                    style={{
                                        color: currentPage === totalPages ? '#ccc' : '#9A1E47',
                                        borderColor: '#1E8546'
                                    }}
                                />
                            </Pagination>
                        </div>
                    </div>
                )}
            </Container>
        </div>
    );
};

export default Ecoturismo; 