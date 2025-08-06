//Hoteles.js
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Spinner, Alert, Form, Button, Pagination } from 'react-bootstrap';
import CardHospedaje from '../components/CardHospedaje';
import DetalleHospedaje from '../screens/DetalleHospedaje';
import axios from 'axios';
import { FaBed } from 'react-icons/fa';

const Hospedajes = () => {
    const [categoriaFiltro, setCategoriaFiltro] = useState('');
    const [ubicacionFiltro, setUbicacionFiltro] = useState('');
    const [huespedesFiltro, setHuespedesFiltro] = useState('');
    const [busquedaTexto, setBusquedaTexto] = useState('');
    const [ordenamiento, setOrdenamiento] = useState('');
    const [hoteles, setHoteles] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [hotelSeleccionado, setHotelSeleccionado] = useState(null);
    const [mostrarDetalle, setMostrarDetalle] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 12; // 3 columnas x 4 filas

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const hotelesRes = await axios.get('https://backend-iota-seven-19.vercel.app/api/hospedaje');
                
                // Filtrar solo hospedajes aceptados
                const hotelesAceptados = hotelesRes.data.filter(hotel => 
                    hotel.estado === 'aceptado'
                );
                setHoteles(hotelesAceptados);
                
                const categoriasUnicas = [...new Set(hotelesAceptados.map(hotel => hotel.Categoria))];
                setCategorias(categoriasUnicas.map(cat => ({ Nombre: cat, idCategoria: cat })));
                
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const hotelesFormateados = hoteles.map(hotel => ({
        idHotel: hotel.idHotel,
        Nombre: hotel.Nombre,
        Imagenes: hotel.Imagenes,
        Ubicacion: hotel.Ubicacion,
        Horario: hotel.Horario,
        Telefono: hotel.Telefono,
        Huespedes: hotel.Huespedes,
        Precio: hotel.Precio,
        Servicios: hotel.Servicios,
        Categoria: hotel.Categoria,
        Descripcion: hotel.Descripcion
    }));

    // Obtener valores únicos para los filtros
    const ubicaciones = Array.from(new Set(hotelesFormateados.map(hotel => {
        const partes = hotel.Ubicacion?.split(',');
        return partes && partes.length > 1 ? partes[partes.length - 2].trim() : hotel.Ubicacion;
    }).filter(Boolean))).sort();
    
    const huespedes = Array.from(new Set(hotelesFormateados.map(hotel => hotel.Huespedes).filter(Boolean))).sort((a, b) => a - b);

    // Filtrar hoteles
    const hotelesFiltrados = hotelesFormateados.filter(hotel => {
        const cumpleBusqueda = !busquedaTexto || 
            hotel.Nombre?.toLowerCase().includes(busquedaTexto.toLowerCase()) ||
            hotel.Descripcion?.toLowerCase().includes(busquedaTexto.toLowerCase()) ||
            hotel.Ubicacion?.toLowerCase().includes(busquedaTexto.toLowerCase());
        
        const cumpleCategoria = !categoriaFiltro || hotel.Categoria === categoriaFiltro;
        const cumpleUbicacion = !ubicacionFiltro || 
            hotel.Ubicacion?.toLowerCase().includes(ubicacionFiltro.toLowerCase());
        const cumpleHuespedes = !huespedesFiltro || hotel.Huespedes === parseInt(huespedesFiltro);
        
        return cumpleBusqueda && cumpleCategoria && cumpleUbicacion && cumpleHuespedes;
    });

    // Ordenar hoteles
    const hotelesOrdenados = [...hotelesFiltrados].sort((a, b) => {
        switch (ordenamiento) {
            case 'nombre-asc':
                return a.Nombre.localeCompare(b.Nombre);
            case 'nombre-desc':
                return b.Nombre.localeCompare(a.Nombre);
            case 'precio-asc':
                return a.Precio - b.Precio;
            case 'precio-desc':
                return b.Precio - a.Precio;
            case 'huespedes-asc':
                return a.Huespedes - b.Huespedes;
            case 'huespedes-desc':
                return b.Huespedes - a.Huespedes;
            default:
                return 0;
        }
    });

    // Lógica de paginación
    const totalPages = Math.ceil(hotelesOrdenados.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = hotelesOrdenados.slice(indexOfFirstItem, indexOfLastItem);

    // Resetear página cuando cambian los filtros
    useEffect(() => {
        setCurrentPage(1);
    }, [busquedaTexto, categoriaFiltro, ubicacionFiltro, huespedesFiltro, ordenamiento]);

    const onVerHotel = (hotel) => {
        setHotelSeleccionado(hotel);
        setMostrarDetalle(true);
    };

    const onVolver = () => {
        setMostrarDetalle(false);
        setHotelSeleccionado(null);
    };

    const limpiarFiltros = () => {
        setCategoriaFiltro('');
        setUbicacionFiltro('');
        setHuespedesFiltro('');
        setBusquedaTexto('');
        setOrdenamiento('');
        setCurrentPage(1);
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    if (mostrarDetalle) {
        return <DetalleHospedaje hotel={hotelSeleccionado} onVolver={onVolver} />;
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
                Error al cargar los hoteles: {error}
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
                        Hoteles y Hospedaje
                    </h1>
                    <p style={{ 
                        color: '#666', 
                        fontSize: '1.1rem', 
                        maxWidth: '600px', 
                        margin: '0 auto',
                        lineHeight: '1.6'
                    }}>
                        Encuentra el lugar perfecto para descansar durante tu visita a la Huasteca. 
                        Desde hoteles boutique hasta hospedajes tradicionales con toda la comodidad que necesitas.
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
                            <option value="huespedes-asc">Huéspedes: Menor a Mayor</option>
                            <option value="huespedes-desc">Huéspedes: Mayor a Menor</option>
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
                            {categorias.map((categoria) => (
                                <option key={categoria.idCategoria} value={categoria.Nombre}>
                                    {categoria.Nombre}
                                </option>
                            ))}
                        </Form.Select>
                        <Form.Select
                            value={ubicacionFiltro}
                            onChange={e => setUbicacionFiltro(e.target.value)}
                            style={{
                                width: '140px',
                                borderColor: '#1E8546',
                                color: '#9A1E47',
                                marginRight: '8px',
                                fontWeight: 600
                            }}
                        >
                            <option value="">Ubicación</option>
                            {ubicaciones.map(ubicacion => (
                                <option key={ubicacion} value={ubicacion}>{ubicacion}</option>
                            ))}
                        </Form.Select>
                        <Form.Select
                            value={huespedesFiltro}
                            onChange={e => setHuespedesFiltro(e.target.value)}
                            style={{
                                width: '140px',
                                borderColor: '#1E8546',
                                color: '#9A1E47',
                                marginRight: '8px',
                                fontWeight: 600
                            }}
                        >
                            <option value="">Huéspedes</option>
                            {huespedes.map(huesped => (
                                <option key={huesped} value={huesped}>{huesped}</option>
                            ))}
                        </Form.Select>
                        <Form.Control
                            type="text"
                            placeholder="Buscar hotel..."
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
                            disabled={!busquedaTexto && !categoriaFiltro && !ubicacionFiltro && !huespedesFiltro && !ordenamiento}
                        >
                            Limpiar filtros
                        </Button>
                    </div>
                </div>

                {/* Contenido */}
                {hotelesOrdenados.length === 0 ? (
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
                            <FaBed style={{ 
                                fontSize: '2rem', 
                                color: '#9A1E47' 
                            }} />
                        </div>
                        <h4 style={{ color: '#9A1E47', marginBottom: '15px' }}>
                            No hay hoteles disponibles
                        </h4>
                        <p style={{ color: '#666', margin: 0 }}>
                            No hay hoteles disponibles con estos criterios
                        </p>
                    </div>
                ) : (
                    <Row xs={1} md={2} lg={3} className="g-4">
                        {currentItems.map(hotel => (
                            <Col key={hotel.idHotel}>
                                <CardHospedaje hotel={hotel} onVerHotel={onVerHotel} />
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
                                Mostrando {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, hotelesOrdenados.length)} de {hotelesOrdenados.length} hoteles
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

export default Hospedajes;