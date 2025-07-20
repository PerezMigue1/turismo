import React, { useState, useEffect } from 'react';
import {
    Table, Button, Form, InputGroup, Badge, Container,
    Row, Col, Card, Spinner, Alert, Toast, Modal
} from 'react-bootstrap';
import {
    FaCheck, FaTimes, FaEye, FaInfoCircle, FaImage,
    FaExclamationTriangle, FaSearch, FaEdit, FaTrash, FaPlus
} from 'react-icons/fa';
import axios from 'axios';
import { useAuth } from '../Navigation/AuthContext';

const Products = () => {
    // Estilos personalizados idénticos a ProductoRevision
    const customStyles = {
        primary: { backgroundColor: '#9A1E47', borderColor: '#9A1E47' }, // Rojo Guinda
        secondary: { backgroundColor: '#0FA89C', borderColor: '#0FA89C' }, // Turquesa Agua
        success: { backgroundColor: '#1E8546', borderColor: '#1E8546' }, // Verde Bosque
        warning: { backgroundColor: '#F28B27', borderColor: '#F28B27' }, // Naranja Sol
        danger: { backgroundColor: '#D24D1C', borderColor: '#D24D1C' }, // Rojo Naranja Tierra
        info: { backgroundColor: '#50C2C4', borderColor: '#50C2C4' }, // Aqua Claro
        light: { backgroundColor: '#FDF2E0', borderColor: '#FDF2E0' } // Beige Claro
    };

    // Estados (igual que antes)
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState('all');
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [toastVariant, setToastVariant] = useState("success");
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [productDetailLoading, setProductDetailLoading] = useState(false);

    const { currentUser } = useAuth();

    // Función para mostrar notificaciones (idéntica a ProductoRevision)
    const mostrarToast = (message, variant = "success") => {
        setToastMessage(message);
        setToastVariant(variant);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
    };

    // Función para cargar detalles del producto
    const handleShowDetail = async (productId) => {
        try {
            setProductDetailLoading(true);
            const token = currentUser?.token;
            const response = await axios.get(`https://backend-iota-seven-19.vercel.app/api/productos/${productId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setSelectedProduct(response.data);
            setShowDetailModal(true);
        } catch (error) {
            mostrarToast('Error al cargar detalles del producto', 'danger');
        } finally {
            setProductDetailLoading(false);
        }
    };

        useEffect(() => {
        const fetchProducts = async () => {
            try {
                const token = currentUser?.token;
                const response = await axios.get('https://backend-iota-seven-19.vercel.app/api/productos', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                const validProducts = response.data.filter(p => p.Nombre && p.Descripción);
                setProducts(validProducts);
            } catch (error) {
                setError('Error al cargar productos');
                mostrarToast('Error al cargar productos', 'danger');
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [currentUser]);

    const filteredProducts = products.filter(product => {
        const nombre = product.Nombre || '';
        const descripcion = product.Descripción || '';
        const matchesSearch =
            nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
            descripcion.toLowerCase().includes(searchTerm.toLowerCase());

        if (filter === 'all') return matchesSearch;
        if (filter === 'published') return matchesSearch && product.estado === 'aprobado';
        if (filter === 'pending') return matchesSearch && product.estado === 'pendiente';
        if (filter === 'rejected') return matchesSearch && product.estado === 'rechazado';
        return matchesSearch;
    });

    if (loading) {
        return (
            <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
                <Spinner animation="border" style={{ color: customStyles.success.backgroundColor }} />
            </Container>
        );
    }

    if (error) {
        return (
            <Container className="mt-4">
                <Alert variant="danger">{error}</Alert>
            </Container>
        );
    }

    return (
        <Container fluid className="py-4" style={customStyles.light}>
            {/* Toast Notification (idéntico a ProductoRevision) */}
            <div style={{ position: 'fixed', top: '20px', right: '20px', zIndex: 9999 }}>
                <Toast
                    show={showToast}
                    onClose={() => setShowToast(false)}
                    delay={3000}
                    autohide
                    style={customStyles[toastVariant]}
                >
                    <Toast.Header style={customStyles[toastVariant]} className="text-white">
                        <strong className="me-auto">Notificación</strong>
                    </Toast.Header>
                    <Toast.Body className="text-white">{toastMessage}</Toast.Body>
                </Toast>
            </div>

            {/* Header (estilo idéntico) */}
            <Row className="mb-4">
                <Col>
                    <h1 style={{ color: customStyles.primary.backgroundColor }}>
                        <strong>Gestión de Productos</strong>
                    </h1>
                    <div style={{ width: '80px', height: '4px', backgroundColor: customStyles.secondary.backgroundColor, borderRadius: '2px' }}></div>
                </Col>
            </Row>

            {/* Filtros y búsqueda */}
            <Card className="mb-4 shadow-sm">
                <Card.Body>
                    <Row className="align-items-center">
                        <Col md={8}>
                            <div className="d-flex flex-wrap">
                                {['all', 'published', 'pending', 'rejected'].map((filtro) => (
                                    <Button
                                        key={filtro}
                                        variant={filter === filtro ? 'primary' : 'outline-secondary'}
                                        className="me-2 mb-2"
                                        onClick={() => setFilter(filtro)}
                                        style={filter === filtro ? customStyles[
                                            filtro === 'published' ? 'success' :
                                                filtro === 'pending' ? 'warning' :
                                                    filtro === 'rejected' ? 'danger' : 'primary'
                                        ] : {}}
                                    >
                                        {filtro === 'all' ? 'Todos' :
                                            filtro === 'published' ? 'Publicados' :
                                                filtro === 'pending' ? 'Pendientes' : 'Rechazados'}
                                    </Button>
                                ))}
                            </div>
                        </Col>
                        <Col md={4} className="d-flex justify-content-end">
                            <Button variant="primary" style={customStyles.primary}>
                                <FaPlus className="me-2" /> Nuevo Producto
                            </Button>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>

            {/* Barra de búsqueda */}
            <Card className="mb-4 shadow-sm">
                <Card.Body>
                    <InputGroup>
                        <Form.Control
                            type="search"
                            placeholder="Buscar productos..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <Button variant="outline-secondary" style={customStyles.secondary}>
                            <FaSearch />
                        </Button>
                    </InputGroup>
                </Card.Body>
            </Card>

            {/* Tabla de productos */}
            <Card className="shadow-sm">
                <Card.Body className="p-0">
                    <Table responsive hover className="mb-0">
                        <thead style={customStyles.secondary}>
                            <tr className="text-white">
                                <th>ID</th>
                                <th>Producto</th>
                                <th>Descripción</th>
                                <th className="text-center">Precio</th>
                                <th className="text-center">Estado</th>
                                <th className="text-center">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredProducts.length > 0 ? (
                                filteredProducts.map((product) => (
                                    <tr key={product.idProducto}>
                                        <td>{product.idProducto}</td>
                                        <td>{product.Nombre}</td>
                                        <td>{product.Descripción?.substring(0, 50)}...</td>
                                        <td className="text-center" style={{ color: customStyles.success.backgroundColor, fontWeight: 'bold' }}>
                                            ${product.Precio}
                                        </td>
                                        <td className="text-center">
                                            <Badge pill style={
                                                product.estado === 'aprobado' ? customStyles.success :
                                                    product.estado === 'pendiente' ? customStyles.warning :
                                                        customStyles.danger
                                            }>
                                                {product.estado}
                                            </Badge>
                                        </td>
                                        <td className="text-center">
                                            <Button
                                                variant="outline-primary"
                                                size="sm"
                                                className="me-2"
                                                style={{ borderColor: customStyles.info.backgroundColor, color: customStyles.info.backgroundColor }}
                                                onClick={() => handleShowDetail(product.idProducto)}
                                            >
                                                <FaEye />
                                            </Button>
                                            <Button
                                                variant="outline-success"
                                                size="sm"
                                                className="me-2"
                                                style={{ borderColor: customStyles.success.backgroundColor, color: customStyles.success.backgroundColor }}
                                            >
                                                <FaEdit />
                                            </Button>
                                            <Button
                                                variant="outline-danger"
                                                size="sm"
                                                style={{ borderColor: customStyles.danger.backgroundColor, color: customStyles.danger.backgroundColor }}
                                            >
                                                <FaTrash />
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="text-center py-5">
                                        <FaInfoCircle size={48} style={{ color: customStyles.info.backgroundColor }} className="mb-3" />
                                        <h5>No se encontraron productos</h5>
                                        <p className="text-muted">No hay productos que coincidan con tu búsqueda</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>

            {/* Modal de Detalles (estilo idéntico a ProductoRevision) */}
            <Modal show={showDetailModal} onHide={() => setShowDetailModal(false)} size="lg" centered>
                <Modal.Header closeButton style={customStyles.secondary}>
                    <Modal.Title className="text-white">Detalles del Producto</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {productDetailLoading ? (
                        <div className="text-center py-4">
                            <Spinner animation="border" style={{ color: customStyles.primary.backgroundColor }} />
                        </div>
                    ) : selectedProduct ? (
                        <Row>
                            <Col md={5}>
                                <Card className="mb-4">
                                    <Card.Header style={customStyles.primary} className="text-white">
                                        <FaImage className="me-2" /> Imágenes
                                    </Card.Header>
                                    <Card.Body>
                                        {selectedProduct.Imagen?.length > 0 ? (
                                            <Row>
                                                {selectedProduct.Imagen.map((img, index) => (
                                                    <Col xs={6} key={index} className="mb-3">
                                                        <img
                                                            src={img}
                                                            alt={`Imagen ${index + 1}`}
                                                            className="img-fluid rounded border"
                                                            style={{ height: '120px', objectFit: 'cover', width: '100%' }}
                                                        />
                                                    </Col>
                                                ))}
                                            </Row>
                                        ) : (
                                            <div className="text-center py-4">
                                                <FaImage size={48} style={{ color: customStyles.info.backgroundColor }} className="mb-3" />
                                                <p>No hay imágenes disponibles</p>
                                            </div>
                                        )}
                                    </Card.Body>
                                </Card>
                            </Col>

                            <Col md={7}>
                                <Card className="mb-4">
                                    <Card.Header style={customStyles.primary} className="text-white">
                                        <FaInfoCircle className="me-2" /> Información Básica
                                    </Card.Header>
                                    <Card.Body>
                                        <Row>
                                            <Col sm={6}>
                                                <div className="mb-3">
                                                    <h6 className="text-muted">Nombre</h6>
                                                    <p>{selectedProduct.Nombre}</p>
                                                </div>
                                            </Col>
                                            <Col sm={6}>
                                                <div className="mb-3">
                                                    <h6 className="text-muted">Precio</h6>
                                                    <p style={{ color: customStyles.success.backgroundColor, fontWeight: 'bold' }}>
                                                        ${selectedProduct.Precio}
                                                    </p>
                                                </div>
                                            </Col>
                                            <Col sm={6}>
                                                <div className="mb-3">
                                                    <h6 className="text-muted">Estado</h6>
                                                    <Badge pill style={
                                                        selectedProduct.estado === 'aprobado' ? customStyles.success :
                                                            selectedProduct.estado === 'pendiente' ? customStyles.warning :
                                                                customStyles.danger
                                                    }>
                                                        {selectedProduct.estado}
                                                    </Badge>
                                                </div>
                                            </Col>
                                            <Col sm={6}>
                                                <div className="mb-3">
                                                    <h6 className="text-muted">Creado el</h6>
                                                    <p>{new Date(selectedProduct.createdAt).toLocaleDateString()}</p>
                                                </div>
                                            </Col>
                                        </Row>
                                    </Card.Body>
                                </Card>

                                <Card className="mb-4">
                                    <Card.Header style={customStyles.primary} className="text-white">
                                        <FaInfoCircle className="me-2" /> Descripción
                                    </Card.Header>
                                    <Card.Body>
                                        <p>{selectedProduct.Descripción || 'No disponible'}</p>
                                    </Card.Body>
                                </Card>

                                <Row>
                                    <Col md={6}>
                                        <Card className="mb-4">
                                            <Card.Header style={customStyles.primary} className="text-white">
                                                <FaInfoCircle className="me-2" /> Especificaciones
                                            </Card.Header>
                                            <Card.Body>
                                                <div className="mb-3">
                                                    <h6 className="text-muted">Materiales</h6>
                                                    <p>{selectedProduct.Materiales || 'N/A'}</p>
                                                </div>
                                                <div className="mb-3">
                                                    <h6 className="text-muted">Técnica</h6>
                                                    <p>{selectedProduct.Técnica || 'N/A'}</p>
                                                </div>
                                                <div>
                                                    <h6 className="text-muted">Dimensiones</h6>
                                                    <p>{selectedProduct.Dimensiones || 'N/A'}</p>
                                                </div>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                    <Col md={6}>
                                        <Card>
                                            <Card.Header style={customStyles.primary} className="text-white">
                                                <FaInfoCircle className="me-2" /> Detalles Adicionales
                                            </Card.Header>
                                            <Card.Body>
                                                <div className="mb-3">
                                                    <h6 className="text-muted">Colores</h6>
                                                    <p>
                                                        {Array.isArray(selectedProduct.Colores)
                                                            ? selectedProduct.Colores.join(", ")
                                                            : selectedProduct.Colores || "N/A"}
                                                    </p>
                                                </div>
                                                <div className="mb-3">
                                                    <h6 className="text-muted">Etiquetas</h6>
                                                    <p>
                                                        {Array.isArray(selectedProduct.Etiquetas)
                                                            ? selectedProduct.Etiquetas.join(", ")
                                                            : selectedProduct.Etiquetas || "N/A"}
                                                    </p>
                                                </div>
                                                <div>
                                                    <h6 className="text-muted">Disponibilidad</h6>
                                                    <p>{selectedProduct.Disponibilidad || 'N/A'}</p>
                                                </div>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    ) : (
                        <Alert variant="danger">No se pudieron cargar los detalles del producto</Alert>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        onClick={() => setShowDetailModal(false)}
                        style={customStyles.primary}
                    >
                        Cerrar
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default Products;