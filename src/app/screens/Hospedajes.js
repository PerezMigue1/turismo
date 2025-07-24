//Hoteles.js
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Spinner, Alert, InputGroup } from 'react-bootstrap';
import CardHotel from '../components/CardHospedaje';
import HotelesDetalle from '../screens/DetalleHospedaje';
import axios from 'axios';
import { FaFilter, FaTimes, FaSearchLocation, FaMapMarkerAlt, FaSearch, FaSort } from 'react-icons/fa';

const Hoteles = () => {
    const [categoriaFiltro, setCategoriaFiltro] = useState('');
    const [ubicacionFiltro, setUbicacionFiltro] = useState('');
    const [precioFiltro, setPrecioFiltro] = useState('');
    const [busquedaTexto, setBusquedaTexto] = useState('');
    const [ordenamiento, setOrdenamiento] = useState('');
    const [hoteles, setHoteles] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [ubicaciones, setUbicaciones] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [hotelSeleccionada, setHotelSeleccionada] = useState(null);
    const [mostrarDetalle, setMostrarDetalle] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const hotelesRes = await axios.get('https://backend-iota-seven-19.vercel.app/api/hospedaje');
                setHoteles(hotelesRes.data);
                
                const categoriasUnicas = [...new Set(hotelesRes.data.map(hotel => hotel.Categoria))];
                setCategorias(categoriasUnicas.map(cat => ({ Nombre: cat, id: cat })));
                
                const ubicacionesUnicas = [...new Set(hotelesRes.data.map(hotel => {
                    const partes = hotel.Ubicacion.split(',');
                    return partes.length > 2 ? `${partes[partes.length - 2].trim()}, ${partes[partes.length - 1].trim()}` : hotel.Ubicacion;
                }))];
                setUbicaciones(ubicacionesUnicas);
                
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const hotelesFormateados = hoteles.map(hotel => ({
        id: hotel.idHotel,
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
        ubicacionCorta: (() => {
            const partes = hotel.Ubicacion.split(',');
            return partes.length > 2 ? `${partes[partes.length - 2].trim()}, ${partes[partes.length - 1].trim()}` : hotel.Ubicacion;
        })()
    }));

    const hotelesFiltrados = hotelesFormateados.filter(hotel => {
        const cumpleCategoria = !categoriaFiltro || hotel.Categoria === categoriaFiltro;
        const cumpleUbicacion = !ubicacionFiltro || hotel.ubicacionCorta === ubicacionFiltro;
        const cumplePrecio = !precioFiltro || (() => {
            switch(precioFiltro) {
                case 'bajo': return hotel.Precio <= 500;
                case 'medio': return hotel.Precio > 500 && hotel.Precio <= 1000;
                case 'alto': return hotel.Precio > 1000;
                default: return true;
            }
        })();
        const cumpleBusqueda = !busquedaTexto || 
            hotel.Nombre.toLowerCase().includes(busquedaTexto.toLowerCase()) ||
            hotel.Ubicacion.toLowerCase().includes(busquedaTexto.toLowerCase()) ||
            hotel.Categoria.toLowerCase().includes(busquedaTexto.toLowerCase()) ||
            hotel.Servicios.toLowerCase().includes(busquedaTexto.toLowerCase());
        
        return cumpleCategoria && cumpleUbicacion && cumplePrecio && cumpleBusqueda;
    });

    const onVerHotel = (hotel) => {
        setHotelSeleccionada(hotel);
        setMostrarDetalle(true);
    };

    const onVolver = () => {
        setMostrarDetalle(false);
        setHotelSeleccionada(null);
    };

    if (mostrarDetalle) {
        return <HotelesDetalle hotel={hotelSeleccionada} onVolver={onVolver} />;
    }

    const hotelesOrdenados = [...hotelesFiltrados].sort((a, b) => {
        switch(ordenamiento) {
            case 'precio-asc':
                return a.Precio - b.Precio;
            case 'precio-desc':
                return b.Precio - a.Precio;
            case 'nombre-asc':
                return a.Nombre.localeCompare(b.Nombre);
            case 'nombre-desc':
                return b.Nombre.localeCompare(a.Nombre);
            default:
                return 0;
        }
    });

    const limpiarFiltros = () => {
        setCategoriaFiltro('');
        setUbicacionFiltro('');
        setPrecioFiltro('');
        setBusquedaTexto('');
        setOrdenamiento('');
    };

    const hayFiltrosActivos = categoriaFiltro || ubicacionFiltro || precioFiltro || busquedaTexto;

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
                <div className="d-flex justify-content-between mb-4">
                    <h2 style={{ color: '#9A1E47' }}>Hoteles y Hospedaje</h2>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <Form.Select
                            value={ordenamiento}
                            onChange={(e) => setOrdenamiento(e.target.value)}
                            style={{
                                width: '160px',
                                borderColor: '#1E8546',
                                color: '#9A1E47',
                                marginRight: '8px'
                            }}
                        >
                            <option value="">Ordenar por</option>
                            <option value="precio-asc">Precio: Menor a Mayor</option>
                            <option value="precio-desc">Precio: Mayor a Menor</option>
                            <option value="nombre-asc">Nombre: A-Z</option>
                            <option value="nombre-desc">Nombre: Z-A</option>
                        </Form.Select>
                        <Form.Select
                            value={categoriaFiltro}
                            onChange={(e) => setCategoriaFiltro(e.target.value)}
                            style={{
                                width: '120px',
                                borderColor: '#1E8546',
                                color: '#9A1E47',
                                marginRight: '8px'
                            }}
                        >
                            <option value="">Categoría</option>
                            {categorias.map(categoria => (
                                <option key={categoria.id} value={categoria.Nombre}>
                                    {categoria.Nombre}
                                </option>
                            ))}
                        </Form.Select>
                        <Form.Select
                            value={precioFiltro}
                            onChange={(e) => setPrecioFiltro(e.target.value)}
                            style={{
                                width: '110px',
                                borderColor: '#1E8546',
                                color: '#9A1E47',
                                marginRight: '8px'
                            }}
                        >
                            <option value="">Precio</option>
                            <option value="bajo">Hasta $500</option>
                            <option value="medio">$500 - $1000</option>
                            <option value="alto">Más de $1000</option>
                        </Form.Select>
                        <Form.Select
                            value={ubicacionFiltro}
                            onChange={(e) => setUbicacionFiltro(e.target.value)}
                            style={{
                                width: '140px',
                                borderColor: '#1E8546',
                                color: '#9A1E47',
                                marginRight: '8px'
                            }}
                        >
                            <option value="">Ubicación</option>
                            {ubicaciones.map(ubicacion => (
                                <option key={ubicacion} value={ubicacion}>
                                    {ubicacion}
                                </option>
                            ))}
                        </Form.Select>
                        <Form.Control
                            type="text"
                            placeholder="Buscar hoteles..."
                            value={busquedaTexto}
                            onChange={(e) => setBusquedaTexto(e.target.value)}
                            style={{
                                width: '180px',
                                borderColor: '#1E8546',
                                color: '#9A1E47',
                                marginRight: '8px'
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
                            disabled={!hayFiltrosActivos}
                        >
                            <FaTimes style={{ fontSize: '0.8rem' }} /> Limpiar filtros
                        </Button>
                    </div>
                </div>
                {hotelesOrdenados.length === 0 ? (
                    <div style={{
                        textAlign: 'center',
                        padding: '40px',
                        color: '#9A1E47',
                        backgroundColor: '#FEF8ED',
                        borderRadius: '8px',
                        border: '1px dashed #9A1E47'
                    }}>
                        No se encontraron hoteles con estos criterios
                    </div>
                ) : (
                    <Row xs={1} md={2} lg={3} className="g-4">
                        {hotelesOrdenados.map(hotel => (
                            <Col key={hotel.idHotel}>
                                <CardHotel hotel={hotel} onVerHotel={onVerHotel} />
                            </Col>
                        ))}
                    </Row>
                )}
            </Container>
        </div>
    );
};

export default Hoteles;