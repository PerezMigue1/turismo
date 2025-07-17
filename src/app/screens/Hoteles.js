import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Spinner, Alert, InputGroup } from 'react-bootstrap';
import CardHotel from '../components/CardHotel';
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

    // Aplicar ordenamiento
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
            flexDirection: 'column',
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '100vh',
            backgroundColor: '#FEF8ED'
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
                Cargando hoteles...
            </p>
        </div>
    );
    
    if (error) return (
        <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '100vh',
            backgroundColor: '#FEF8ED',
            padding: '20px'
        }}>
            <Alert 
                variant="danger" 
                style={{ 
                    backgroundColor: '#FDF2E0',
                    borderColor: '#9A1E47',
                    color: '#9A1E47',
                    maxWidth: '500px',
                    textAlign: 'center',
                    borderRadius: '15px',
                    boxShadow: '0 8px 25px rgba(154, 30, 71, 0.15)'
                }}
            >
                <Alert.Heading>Error al cargar los hoteles</Alert.Heading>
                <p>{error}</p>
                <Button 
                    variant="outline" 
                    style={{ 
                        color: '#9A1E47',
                        borderColor: '#9A1E47',
                        marginTop: '15px',
                        borderRadius: '10px'
                    }}
                    onClick={() => window.location.reload()}
                >
                    Intentar nuevamente
                </Button>
            </Alert>
        </div>
    );

    return (
        <div style={{
            backgroundColor: '#FEF8ED',
            minHeight: '100vh',
            padding: '40px 0',
        }}>
            <Container style={{ maxWidth: '1400px' }}>
                {/* Encabezado */}
                <Row className="mb-4 justify-content-center">
                    <Col xs={12} className="text-center">
                        <div style={{ position: 'relative', display: 'inline-block' }}>
                            <h1 style={{ 
                                color: '#9A1E47', 
                                fontWeight: '700',
                                fontSize: '2.5rem',
                                marginBottom: '15px',
                                textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
                            }}>
                                
                                Hoteles y Hospedaje
                            </h1>
                           
                        </div>
                       
                    </Col>
                </Row>
                
                {/* Filtros en una línea horizontal */}
                <Row className="mb-4 justify-content-center">
                    <Col xs={12}>
                        <div style={{
                            backgroundColor: 'white',
                            padding: '15px 20px',
                            borderRadius: '15px',
                            boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
                            border: '1px solid #E8E8E8'
                        }}>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '15px',
                                flexWrap: 'wrap'
                            }}>
                                {/* Ordenar por */}
                                <div style={{ 
                                    flex: '0 0 auto',
                                    minWidth: '140px'
                                }}>
                                    <Form.Select
                                        value={ordenamiento}
                                        onChange={(e) => setOrdenamiento(e.target.value)}
                                        style={{ 
                                            borderColor: '#ddd',
                                            backgroundColor: 'white',
                                            color: '#555',
                                            fontWeight: '500',
                                            height: '40px',
                                            borderRadius: '8px',
                                            fontSize: '0.9rem',
                                            minWidth: '140px'
                                        }}
                                    >
                                        <option value="">Ordenar por</option>
                                        <option value="precio-asc">Precio: Menor a Mayor</option>
                                        <option value="precio-desc">Precio: Mayor a Menor</option>
                                        <option value="nombre-asc">Nombre: A-Z</option>
                                        <option value="nombre-desc">Nombre: Z-A</option>
                                    </Form.Select>
                                </div>

                                {/* Filtros */}
                                <div style={{ 
                                    flex: '0 0 auto',
                                    minWidth: '100px'
                                }}>
                                    <Form.Select
                                        value={categoriaFiltro}
                                        onChange={(e) => setCategoriaFiltro(e.target.value)}
                                        style={{ 
                                            borderColor: '#ddd',
                                            backgroundColor: 'white',
                                            color: '#555',
                                            fontWeight: '500',
                                            height: '40px',
                                            borderRadius: '8px',
                                            fontSize: '0.9rem',
                                            minWidth: '100px'
                                        }}
                                    >
                                        <option value="">Filtros</option>
                                        {categorias.map(categoria => (
                                            <option key={categoria.id} value={categoria.Nombre}>
                                                {categoria.Nombre}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </div>

                                {/* Precio */}
                                <div style={{ 
                                    flex: '0 0 auto',
                                    minWidth: '100px'
                                }}>
                                    <Form.Select
                                        value={precioFiltro}
                                        onChange={(e) => setPrecioFiltro(e.target.value)}
                                        style={{ 
                                            borderColor: '#ddd',
                                            backgroundColor: 'white',
                                            color: '#555',
                                            fontWeight: '500',
                                            height: '40px',
                                            borderRadius: '8px',
                                            fontSize: '0.9rem',
                                            minWidth: '100px'
                                        }}
                                    >
                                        <option value="">Precio</option>
                                        <option value="bajo">Hasta $500</option>
                                        <option value="medio">$500 - $1000</option>
                                        <option value="alto">Más de $1000</option>
                                    </Form.Select>
                                </div>

                                {/* Ubicación */}
                                <div style={{ 
                                    flex: '0 0 auto',
                                    minWidth: '120px'
                                }}>
                                    <Form.Select
                                        value={ubicacionFiltro}
                                        onChange={(e) => setUbicacionFiltro(e.target.value)}
                                        style={{ 
                                            borderColor: '#ddd',
                                            backgroundColor: 'white',
                                            color: '#555',
                                            fontWeight: '500',
                                            height: '40px',
                                            borderRadius: '8px',
                                            fontSize: '0.9rem',
                                            minWidth: '120px'
                                        }}
                                    >
                                        <option value="">Ubicación</option>
                                        {ubicaciones.map(ubicacion => (
                                            <option key={ubicacion} value={ubicacion}>
                                                {ubicacion}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </div>

                                {/* Barra de búsqueda */}
                                <div style={{ 
                                    flex: '1 1 400px',
                                    minWidth: '200px'
                                }}>
                                    <InputGroup style={{ 
                                        borderRadius: '8px',
                                        overflow: 'hidden'
                                    }}>
                                        
                                        <Form.Control
                                            type="text"
                                            placeholder="Buscar hoteles..."
                                            value={busquedaTexto}
                                            onChange={(e) => setBusquedaTexto(e.target.value)}
                                            style={{
                                                border: '1px solid #ddd',
                                                borderLeft: 'none',
                                                fontSize: '0.9rem',
                                                height: '40px'
                                            }}
                                        />
                                    </InputGroup>
                                </div>

                                {/* Botón limpiar filtros */}
                                <div style={{ 
                                    flex: '0 0 auto',
                                    marginLeft: 'auto'
                                }}>
                                    <Button
                                        variant="outline-secondary"
                                        size="sm"
                                        onClick={limpiarFiltros}
                                        style={{ 
                                            borderColor: '#ddd', 
                                            color: '#666',
                                            fontWeight: '500',
                                            borderRadius: '8px',
                                            padding: '8px 16px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '5px',
                                            fontSize: '0.85rem',
                                            height: '40px'
                                        }}
                                        disabled={!hayFiltrosActivos}
                                    >
                                        <FaTimes style={{ fontSize: '0.8rem' }} />
                                        Limpiar filtros
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </Col>
                </Row>

                {/* Contador de resultados */}
                <Row className="mb-4">
                    <Col xs={12}>
                        <div style={{ 
                            backgroundColor: '#0FA89C',
                            color: 'white',
                            padding: '12px 20px',
                            borderRadius: '0',
                            fontWeight: '600',
                            boxShadow: '0 3px 10px rgba(15, 168, 156, 0.3)',
                            fontSize: '0.9rem',
                            width: '97%',
                            textAlign: 'center'
                        }}>
                            {hotelesOrdenados.length} {hotelesOrdenados.length === 1 ? 'hotel' : 'hoteles'}
                        </div>
                    </Col>
                </Row>

                {/* Grid de hoteles */}
                <Row className="g-4 justify-content-center">
                    <Col lg={10} xl={12}>
                        {/* Contenedor CSS Grid */}
                        <div 
                            className="hoteles-grid"
                            style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                                gap: '30px',
                                padding: '20px 0',
                                maxWidth: '1200px',
                                margin: '0 auto'
                            }}
                        >
                            {hotelesOrdenados.length > 0 ? (
                                hotelesOrdenados.map(hotel => (
                                    <div 
                                        key={hotel.idHotel}
                                        className="hotel-card-wrapper"
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'center',
                                            transition: 'all 0.3s ease'
                                        }}
                                    >
                                        <CardHotel hotel={hotel} />
                                    </div>
                                ))
                            ) : (
                                <div 
                                    style={{ 
                                        gridColumn: '1 / -1', // Ocupa todo el ancho del grid
                                        display: 'flex',
                                        justifyContent: 'center',
                                        padding: '60px 40px'
                                    }}
                                >
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
                                            backgroundColor: '#FEF8ED',
                                            borderRadius: '50%',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            margin: '0 auto 20px',
                                            border: '3px solid #0FA89C'
                                        }}>
                                            <FaSearchLocation style={{ 
                                                fontSize: '2rem', 
                                                color: '#9A1E47' 
                                            }} />
                                        </div>
                                        <h4 style={{ 
                                            color: '#9A1E47', 
                                            marginBottom: '20px',
                                            fontWeight: '600'
                                        }}>
                                            No encontramos hoteles con estos criterios
                                        </h4>
                                        <p style={{ 
                                            color: '#666', 
                                            marginBottom: '30px',
                                            fontSize: '1.1rem',
                                            lineHeight: '1.6'
                                        }}>
                                            Prueba ajustando los criterios de búsqueda o limpiando los filtros para ver más opciones
                                        </p>
                                        <Button
                                            variant="primary"
                                            onClick={limpiarFiltros}
                                            style={{ 
                                                backgroundColor: '#9A1E47',
                                                borderColor: '#9A1E47',
                                                padding: '12px 30px',
                                                borderRadius: '12px',
                                                fontWeight: '600',
                                                fontSize: '1rem',
                                                boxShadow: '0 4px 15px rgba(154, 30, 71, 0.3)'
                                            }}
                                        >
                                            Mostrar todos los hoteles
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default Hoteles;