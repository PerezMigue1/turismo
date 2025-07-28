import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Spinner, Alert, Form, Button, Pagination } from 'react-bootstrap';
import CardGastronomia from '../components/CardGastronomia';
import GastronomiaDetalle from '../screens/GastronomiaDetalle';
import axios from 'axios';
import { FaUtensils } from 'react-icons/fa';

const Gastronomia = () => {
    const [busquedaTexto, setBusquedaTexto] = useState('');
    const [categoriaFiltro, setCategoriaFiltro] = useState('');
    const [origenFiltro, setOrigenFiltro] = useState('');
    const [ocasionFiltro, setOcasionFiltro] = useState('');
    const [ordenamiento, setOrdenamiento] = useState('');
    const [gastronomia, setGastronomia] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [recetaSeleccionada, setRecetaSeleccionada] = useState(null);
    const [mostrarDetalle, setMostrarDetalle] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 12; // 3 columnas x 4 filas

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const gastronomiaRes = await axios.get('https://backend-iota-seven-19.vercel.app/api/gastronomia');
                console.log('Datos de gastronomía cargados:', gastronomiaRes.data);
                console.log('Primer elemento de ejemplo:', gastronomiaRes.data[0]);
                console.log('Campos disponibles en el primer elemento:', Object.keys(gastronomiaRes.data[0] || {}));
                setGastronomia(gastronomiaRes.data);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Obtener valores únicos para los filtros
    const categorias = Array.from(new Set(gastronomia.map(item => item.tipoPlatillo).filter(Boolean))).sort();
    const origenes = Array.from(new Set(gastronomia.map(item => item.regionOrigen).filter(Boolean))).sort();
    const ocasiones = Array.from(new Set(gastronomia.flatMap(item => 
        Array.isArray(item.ocasion) ? item.ocasion : [item.ocasion]
    ).filter(Boolean))).sort();

    console.log('Categorías disponibles:', categorias);
    console.log('Orígenes disponibles:', origenes);
    console.log('Ocasiones disponibles:', ocasiones);
    console.log('Filtros activos:', { categoriaFiltro, origenFiltro, ocasionFiltro, busquedaTexto, ordenamiento });

    // Filtrar gastronomía
    const gastronomiaFiltrada = gastronomia.filter(item => {
        const cumpleBusqueda = !busquedaTexto || 
            item.nombre?.toLowerCase().includes(busquedaTexto.toLowerCase()) ||
            item.descripcion?.toLowerCase().includes(busquedaTexto.toLowerCase()) ||
            item.tipoPlatillo?.toLowerCase().includes(busquedaTexto.toLowerCase()) ||
            item.regionOrigen?.toLowerCase().includes(busquedaTexto.toLowerCase()) ||
            (Array.isArray(item.ocasion) ? 
                item.ocasion.some(ocasion => ocasion.toLowerCase().includes(busquedaTexto.toLowerCase())) :
                item.ocasion?.toLowerCase().includes(busquedaTexto.toLowerCase())
            );
        
        const cumpleCategoria = !categoriaFiltro || item.tipoPlatillo === categoriaFiltro;
        const cumpleOrigen = !origenFiltro || item.regionOrigen === origenFiltro;
        const cumpleOcasion = !ocasionFiltro || 
            (Array.isArray(item.ocasion) ? item.ocasion.includes(ocasionFiltro) : item.ocasion === ocasionFiltro);
        
        // Debug para búsqueda
        if (busquedaTexto && cumpleBusqueda) {
            console.log('Elemento encontrado en búsqueda:', item.nombre, 'por término:', busquedaTexto);
        }
        
        return cumpleBusqueda && cumpleCategoria && cumpleOrigen && cumpleOcasion;
    });

    console.log('Elementos filtrados:', gastronomiaFiltrada.length, 'de', gastronomia.length, 'total');
    console.log('Texto de búsqueda:', busquedaTexto);

    // Ordenar gastronomía
    const gastronomiaOrdenada = [...gastronomiaFiltrada].sort((a, b) => {
        switch (ordenamiento) {
            case 'nombre-asc':
                return a.nombre.localeCompare(b.nombre);
            case 'nombre-desc':
                return b.nombre.localeCompare(a.nombre);
            case 'origen-asc':
                return a.regionOrigen.localeCompare(b.regionOrigen);
            case 'origen-desc':
                return b.regionOrigen.localeCompare(a.regionOrigen);
            default:
                return 0;
        }
    });

    // Lógica de paginación
    const totalPages = Math.ceil(gastronomiaOrdenada.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = gastronomiaOrdenada.slice(indexOfFirstItem, indexOfLastItem);

    // Resetear página cuando cambian los filtros
    useEffect(() => {
        setCurrentPage(1);
    }, [busquedaTexto, categoriaFiltro, origenFiltro, ocasionFiltro, ordenamiento]);

    const onVerReceta = (receta) => {
        setRecetaSeleccionada(receta);
        setMostrarDetalle(true);
    };

    const onVolver = () => {
        setMostrarDetalle(false);
        setRecetaSeleccionada(null);
    };

    const limpiarFiltros = () => {
        setBusquedaTexto('');
        setCategoriaFiltro('');
        setOrigenFiltro('');
        setOcasionFiltro('');
        setOrdenamiento('');
        setCurrentPage(1);
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    if (mostrarDetalle) {
        return <GastronomiaDetalle gastronomia={recetaSeleccionada} onVolver={onVolver} />;
    }

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
                Error al cargar la gastronomía: {error}
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
                        Gastronomía de la Huasteca
                    </h1>
                    <p style={{ 
                        color: '#666', 
                        fontSize: '1.1rem', 
                        maxWidth: '600px', 
                        margin: '0 auto',
                        lineHeight: '1.6'
                    }}>
                        Descubre los sabores auténticos y tradicionales de la región Huasteca. 
                        Desde platillos típicos hasta recetas ancestrales que han pasado de generación en generación.
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
                            <option value="origen-asc">Origen: A-Z</option>
                            <option value="origen-desc">Origen: Z-A</option>
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
                                <option key={categoria} value={categoria}>{categoria}</option>
                            ))}
                        </Form.Select>
                        <Form.Select
                            value={origenFiltro}
                            onChange={e => setOrigenFiltro(e.target.value)}
                            style={{
                                width: '140px',
                                borderColor: '#1E8546',
                                color: '#9A1E47',
                                marginRight: '8px',
                                fontWeight: 600
                            }}
                        >
                            <option value="">Origen</option>
                            {origenes.map(origen => (
                                <option key={origen} value={origen}>{origen}</option>
                            ))}
                        </Form.Select>
                        <Form.Select
                            value={ocasionFiltro}
                            onChange={e => setOcasionFiltro(e.target.value)}
                            style={{
                                width: '140px',
                                borderColor: '#1E8546',
                                color: '#9A1E47',
                                marginRight: '8px',
                                fontWeight: 600
                            }}
                        >
                            <option value="">Ocasión</option>
                            {ocasiones.map(ocasion => (
                                <option key={ocasion} value={ocasion}>{ocasion}</option>
                            ))}
                        </Form.Select>
                        <Form.Control
                            type="text"
                            placeholder="Buscar platillo..."
                            value={busquedaTexto}
                            onChange={e => {
                                console.log('Texto de búsqueda cambiando a:', e.target.value);
                                setBusquedaTexto(e.target.value);
                            }}
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
                            disabled={!busquedaTexto && !categoriaFiltro && !origenFiltro && !ocasionFiltro && !ordenamiento}
                        >
                            Limpiar filtros
                        </Button>
                    </div>
                </div>

                {/* Contenido */}
                {gastronomiaOrdenada.length === 0 ? (
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
                            No hay platillos disponibles
                        </h4>
                        <p style={{ color: '#666', margin: 0 }}>
                            No hay platillos disponibles con estos criterios
                        </p>
                    </div>
                ) : (
                    <Row xs={1} md={2} lg={3} className="g-4">
                        {currentItems.map((item, index) => (
                            <Col key={item._id || item.id || item.idGastronomia || `item-${index}`}>
                                <CardGastronomia 
                                    gastronomia={item} 
                                    onVerReceta={onVerReceta} 
                                />
                            </Col>
                        ))}
                    </Row>
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
                                Mostrando {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, gastronomiaOrdenada.length)} de {gastronomiaOrdenada.length} platillos
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

export default Gastronomia;