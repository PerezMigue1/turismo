import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Spinner, Alert, Pagination } from 'react-bootstrap';
import ListaRestaurantes from '../components/ListaRestaurantes';
import axios from 'axios';
import { FaUtensils } from 'react-icons/fa';

const Restaurantes = () => {
    const [restaurantes, setRestaurantes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [busquedaTexto, setBusquedaTexto] = useState('');
    const [municipioFiltro, setMunicipioFiltro] = useState('');
    const [tipoFiltro, setTipoFiltro] = useState('');
    const [precioFiltro, setPrecioFiltro] = useState('');
    const [ordenamiento, setOrdenamiento] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 12; // 3 columnas x 4 filas

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get('https://backend-iota-seven-19.vercel.app/api/restaurante');
                
                // Filtrar solo restaurantes aceptados
                const restaurantesAceptados = res.data.filter(restaurante => 
                    restaurante.estado === 'aceptado'
                );
                setRestaurantes(restaurantesAceptados);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Obtener valores únicos para los filtros
    const municipios = Array.from(new Set(restaurantes.map(r => r.Ubicacion?.Municipio).filter(Boolean))).sort();
    const tipos = Array.from(new Set(restaurantes.map(r => r.Tipo).filter(Boolean))).sort();
    const precios = Array.from(new Set(restaurantes.map(r => r.Precio).filter(Boolean))).sort();

    // Filtrar restaurantes
    const restaurantesFiltrados = restaurantes.filter(r => {
        const cumpleBusqueda = !busquedaTexto || 
            r.Nombre?.toLowerCase().includes(busquedaTexto.toLowerCase()) ||
            r.Descripcion?.toLowerCase().includes(busquedaTexto.toLowerCase()) ||
            r.Especialidad?.toLowerCase().includes(busquedaTexto.toLowerCase());
        
        const coincideMunicipio = !municipioFiltro || r.Ubicacion?.Municipio === municipioFiltro;
        const coincideTipo = !tipoFiltro || r.Tipo === tipoFiltro;
        const coincidePrecio = !precioFiltro || r.Precio === precioFiltro;
        
        return cumpleBusqueda && coincideMunicipio && coincideTipo && coincidePrecio;
    });

    // Ordenar restaurantes
    const restaurantesOrdenados = [...restaurantesFiltrados].sort((a, b) => {
        switch (ordenamiento) {
            case 'nombre-asc':
                return a.Nombre.localeCompare(b.Nombre);
            case 'nombre-desc':
                return b.Nombre.localeCompare(a.Nombre);
            case 'precio-asc':
                return a.Precio - b.Precio;
            case 'precio-desc':
                return b.Precio - a.Precio;
            case 'municipio-asc':
                return a.Ubicacion?.Municipio.localeCompare(b.Ubicacion?.Municipio);
            case 'municipio-desc':
                return b.Ubicacion?.Municipio.localeCompare(a.Ubicacion?.Municipio);
            default:
                return 0;
        }
    });

    // Lógica de paginación
    const totalPages = Math.ceil(restaurantesOrdenados.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = restaurantesOrdenados.slice(indexOfFirstItem, indexOfLastItem);

    // Resetear página cuando cambian los filtros
    useEffect(() => {
        setCurrentPage(1);
    }, [busquedaTexto, municipioFiltro, tipoFiltro, precioFiltro, ordenamiento]);

    const limpiarFiltros = () => {
        setBusquedaTexto('');
        setMunicipioFiltro('');
        setTipoFiltro('');
        setPrecioFiltro('');
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
            <Container className="py-4" style={{
                backgroundColor: '#FDF2E0',
                padding: '20px',
                borderRadius: '8px'
            }}>
                {/* Título y descripción */}
                <div className="text-center mb-5">
                    <h1 style={{ color: '#9A1E47', marginBottom: '15px', fontSize: '2.5rem', fontWeight: '700' }}>
                        Restaurantes de la Huasteca
                    </h1>
                    <p style={{ 
                        color: '#666', 
                        fontSize: '1.1rem', 
                        maxWidth: '600px', 
                        margin: '0 auto',
                        lineHeight: '1.6'
                    }}>
                        Disfruta de la mejor gastronomía local en nuestros restaurantes seleccionados. 
                        Desde cocina tradicional hasta fusiones modernas con los ingredientes más frescos de la región.
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
                            <option value="municipio-asc">Municipio: A-Z</option>
                            <option value="municipio-desc">Municipio: Z-A</option>
                        </Form.Select>
                        <Form.Select
                            value={municipioFiltro}
                            onChange={e => setMunicipioFiltro(e.target.value)}
                            style={{
                                width: '140px',
                                borderColor: '#1E8546',
                                color: '#9A1E47',
                                marginRight: '8px',
                                fontWeight: 600
                            }}
                        >
                            <option value="">Municipio</option>
                            {municipios.map(mun => (
                                <option key={mun} value={mun}>{mun}</option>
                            ))}
                        </Form.Select>
                        <Form.Select
                            value={tipoFiltro}
                            onChange={e => setTipoFiltro(e.target.value)}
                            style={{
                                width: '140px',
                                borderColor: '#1E8546',
                                color: '#9A1E47',
                                marginRight: '8px',
                                fontWeight: 600
                            }}
                        >
                            <option value="">Tipo</option>
                            {tipos.map(tipo => (
                                <option key={tipo} value={tipo}>{tipo}</option>
                            ))}
                        </Form.Select>
                        <Form.Select
                            value={precioFiltro}
                            onChange={e => setPrecioFiltro(e.target.value)}
                            style={{
                                width: '140px',
                                borderColor: '#1E8546',
                                color: '#9A1E47',
                                marginRight: '8px',
                                fontWeight: 600
                            }}
                        >
                            <option value="">Precio</option>
                            {precios.map(precio => (
                                <option key={precio} value={precio}>{precio}</option>
                            ))}
                        </Form.Select>
                        <Form.Control
                            type="text"
                            placeholder="Buscar restaurante..."
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
                            disabled={!busquedaTexto && !municipioFiltro && !tipoFiltro && !precioFiltro && !ordenamiento}
                        >
                            Limpiar filtros
                        </Button>
                    </div>
                </div>

                {/* Contenido */}
                {restaurantesOrdenados.length === 0 ? (
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
                            <FaUtensils style={{ 
                                fontSize: '2rem', 
                                color: '#9A1E47' 
                            }} />
                        </div>
                        <h4 style={{ color: '#9A1E47', marginBottom: '15px' }}>
                            No hay restaurantes disponibles
                        </h4>
                        <p style={{ color: '#666', margin: 0 }}>
                            No hay restaurantes disponibles con estos criterios
                        </p>
                    </div>
                ) : (
                    <ListaRestaurantes restaurantes={currentItems} />
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
                                Mostrando {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, restaurantesOrdenados.length)} de {restaurantesOrdenados.length} restaurantes
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

export default Restaurantes; 