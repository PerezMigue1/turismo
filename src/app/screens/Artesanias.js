// src/screens/Artesanias.js
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Spinner, Alert, Pagination } from 'react-bootstrap';
import ListaArtesanias from '../components/ListaArtesanias';
import axios from 'axios';
import { FaPalette } from 'react-icons/fa';

const Artesanias = () => {
    const [categoriaFiltro, setCategoriaFiltro] = useState('');
    const [origenFiltro, setOrigenFiltro] = useState('');
    const [materialFiltro, setMaterialFiltro] = useState('');
    const [busquedaTexto, setBusquedaTexto] = useState('');
    const [ordenamiento, setOrdenamiento] = useState('');
    const [productos, setProductos] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [artesanos, setArtesanos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 12; // 3 columnas x 4 filas

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Obtener productos y categorías en paralelo
                const [productosRes, categoriasRes, artesanosRes] = await Promise.all([
                    axios.get('https://backend-iota-seven-19.vercel.app/api/productos'),
                    axios.get('https://backend-iota-seven-19.vercel.app/api/categoriaProducto'),
                    axios.get('https://backend-iota-seven-19.vercel.app/api/artesano')
                ]);

                setProductos(productosRes.data);
                setCategorias(categoriasRes.data);
                setArtesanos(artesanosRes.data);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Mapear los datos de la API al formato esperado
    const artesanias = productos.map(producto => {
        const categoria = categorias.find(cat => cat.idCategoria === producto.idCategoria);
        const artesano = artesanos.find(a => a.idArtesano === producto.idArtesano);

        return {
            idProducto: producto.idProducto,
            Nombre: producto.Nombre,
            Descripción: producto.Descripción,
            Precio: producto.Precio,
            Imagen: producto.Imagen,
            idCategoria: producto.idCategoria,
            categoria: categoria ? categoria.Nombre : producto.idCategoria,
            Origen: producto.Origen,
            envio: producto.Disponibilidad === 'En stock',
            valoracion: 4,
            Forma: producto.Forma,
            Dimensiones: producto.Dimensiones,
            Materiales: producto.Materiales,
            Técnica: producto.Técnica,
            Especificaciones: producto.Especificaciones,
            Colores: producto.Colores,
            Disponibilidad: producto.Disponibilidad,
            Comentarios: producto.Comentarios,
            Artesano: artesano || {}
        };
    });

    // Obtener valores únicos para los filtros
    const origenes = Array.from(new Set(artesanias.map(item => item.Origen).filter(Boolean))).sort();
    const materiales = Array.from(new Set(artesanias.flatMap(item => 
        item.Materiales ? item.Materiales.split(',').map(m => m.trim()) : []
    ).filter(Boolean))).sort();

    // Filtrar artesanías
    const artesaniasFiltradas = artesanias.filter(artesania => {
        const cumpleBusqueda = !busquedaTexto || 
            artesania.Nombre?.toLowerCase().includes(busquedaTexto.toLowerCase()) ||
            artesania.Descripción?.toLowerCase().includes(busquedaTexto.toLowerCase()) ||
            artesania.Técnica?.toLowerCase().includes(busquedaTexto.toLowerCase());
        
        const cumpleCategoria = !categoriaFiltro || artesania.idCategoria === categoriaFiltro;
        const cumpleOrigen = !origenFiltro || artesania.Origen === origenFiltro;
        const cumpleMaterial = !materialFiltro || 
            (artesania.Materiales && artesania.Materiales.toLowerCase().includes(materialFiltro.toLowerCase()));
        
        return cumpleBusqueda && cumpleCategoria && cumpleOrigen && cumpleMaterial;
    });

    // Ordenar artesanías
    const artesaniasOrdenadas = [...artesaniasFiltradas].sort((a, b) => {
        switch (ordenamiento) {
            case 'nombre-asc':
                return a.Nombre.localeCompare(b.Nombre);
            case 'nombre-desc':
                return b.Nombre.localeCompare(a.Nombre);
            case 'precio-asc':
                return a.Precio - b.Precio;
            case 'precio-desc':
                return b.Precio - a.Precio;
            case 'origen-asc':
                return a.Origen.localeCompare(b.Origen);
            case 'origen-desc':
                return b.Origen.localeCompare(a.Origen);
            default:
                return 0;
        }
    });

    // Lógica de paginación
    const totalPages = Math.ceil(artesaniasOrdenadas.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = artesaniasOrdenadas.slice(indexOfFirstItem, indexOfLastItem);

    // Resetear página cuando cambian los filtros
    useEffect(() => {
        setCurrentPage(1);
    }, [busquedaTexto, categoriaFiltro, origenFiltro, materialFiltro, ordenamiento]);

    const limpiarFiltros = () => {
        setCategoriaFiltro('');
        setOrigenFiltro('');
        setMaterialFiltro('');
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
                Error al cargar los productos: {error}
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
                        Artesanías de la Huasteca
                    </h1>
                    <p style={{ 
                        color: '#666', 
                        fontSize: '1.1rem', 
                        maxWidth: '600px', 
                        margin: '0 auto',
                        lineHeight: '1.6'
                    }}>
                        Explora las creaciones únicas de nuestros artesanos huastecos. 
                        Cada pieza cuenta una historia y representa la rica tradición cultural de la región.
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
                                <option key={categoria.idCategoria} value={categoria.idCategoria}>
                                    {categoria.Nombre}
                                </option>
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
                            value={materialFiltro}
                            onChange={e => setMaterialFiltro(e.target.value)}
                            style={{
                                width: '140px',
                                borderColor: '#1E8546',
                                color: '#9A1E47',
                                marginRight: '8px',
                                fontWeight: 600
                            }}
                        >
                            <option value="">Material</option>
                            {materiales.map(material => (
                                <option key={material} value={material}>{material}</option>
                            ))}
                        </Form.Select>
                        <Form.Control
                            type="text"
                            placeholder="Buscar artesanía..."
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
                            disabled={!busquedaTexto && !categoriaFiltro && !origenFiltro && !materialFiltro && !ordenamiento}
                        >
                            Limpiar filtros
                        </Button>
                    </div>
                </div>

                {/* Contenido */}
                {artesaniasOrdenadas.length === 0 ? (
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
                            <FaPalette style={{ 
                                fontSize: '2rem', 
                                color: '#9A1E47' 
                            }} />
                        </div>
                        <h4 style={{ color: '#9A1E47', marginBottom: '15px' }}>
                            No hay artesanías disponibles
                        </h4>
                        <p style={{ color: '#666', margin: 0 }}>
                            No hay artesanías disponibles con estos criterios
                        </p>
                    </div>
                ) : (
                    <ListaArtesanias
                        artesanias={currentItems}
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
                                Mostrando {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, artesaniasOrdenadas.length)} de {artesaniasOrdenadas.length} artesanías
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

export default Artesanias;