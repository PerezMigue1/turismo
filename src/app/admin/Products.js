import React, { useState, useEffect } from 'react';
import {
    Table, Button, Form, InputGroup, Badge, Container,
    Row, Col, Card, Spinner, Alert, Toast, Modal
} from 'react-bootstrap';
import {
    FaEye, FaInfoCircle, FaImage,
    FaSearch, FaEdit, FaTrash, FaPlus
} from 'react-icons/fa';

const Products = () => {
    // Estilos personalizados
    const customStyles = {
        primary: { backgroundColor: '#9A1E47', borderColor: '#9A1E47' },
        secondary: { backgroundColor: '#0FA89C', borderColor: '#0FA89C' },
        success: { backgroundColor: '#1E8546', borderColor: '#1E8546' },
        warning: { backgroundColor: '#F28B27', borderColor: '#F28B27' },
        danger: { backgroundColor: '#D24D1C', borderColor: '#D24D1C' },
        info: { backgroundColor: '#50C2C4', borderColor: '#50C2C4' },
        light: { backgroundColor: '#FDF2E0', borderColor: '#FDF2E0' }
    };

    // Estados
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
    
    // Estados para editar/eliminar
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deletingProduct, setDeletingProduct] = useState(null);
    const [editLoading, setEditLoading] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);

    // Función de notificación
    const mostrarToast = (message, variant = "success") => {
        setToastMessage(message);
        setToastVariant(variant);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
    };

    // Cargar productos
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                setError(null);

                const response = await fetch('https://backend-iota-seven-19.vercel.app/api/productos', {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();

                // La API devuelve directamente el array de productos
                if (Array.isArray(data)) {
                    const validProducts = data.filter(p => p.Nombre && p.Descripción);
                    setProducts(validProducts);
                } else {
                    setError('Formato de respuesta inválido');
                    mostrarToast('Error al cargar productos', 'danger');
                }
            } catch (error) {
                console.error('Error fetching products:', error);
                setError('Error de conexión: ' + error.message);
                mostrarToast('Error al cargar productos', 'danger');
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    // Función para cargar detalles del producto
    const handleShowDetail = async (productId) => {
        try {
            setProductDetailLoading(true);

            const response = await fetch(`https://backend-iota-seven-19.vercel.app/api/productos/${productId}`, {
                headers: { 
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            if (data) {
                setSelectedProduct(data);
                setShowDetailModal(true);
            } else {
                mostrarToast('Error al cargar detalles del producto', 'danger');
            }
        } catch (error) {
            console.error('Error fetching product details:', error);
            mostrarToast('Error al cargar detalles del producto', 'danger');
        } finally {
            setProductDetailLoading(false);
        }
    };

    // Función para abrir modal de edición
    const handleEdit = (product) => {
        setEditingProduct({ ...product });
        setShowEditModal(true);
    };

    // Función para guardar cambios del producto
    const handleSaveEdit = async () => {
        try {
            setEditLoading(true);
            
            const response = await fetch(`https://backend-iota-seven-19.vercel.app/api/productos/${editingProduct.idProducto}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(editingProduct)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            
            if (data.message) {
                mostrarToast('Producto actualizado correctamente', 'success');
                setShowEditModal(false);
                setEditingProduct(null);
                // Recargar productos
                window.location.reload();
            } else {
                throw new Error('Error al actualizar producto');
            }
        } catch (error) {
            console.error('Error updating product:', error);
            mostrarToast('Error al actualizar producto: ' + error.message, 'danger');
        } finally {
            setEditLoading(false);
        }
    };

    // Función para abrir modal de eliminación
    const handleDelete = (product) => {
        setDeletingProduct(product);
        setShowDeleteModal(true);
    };

    // Función para confirmar eliminación
    const handleConfirmDelete = async () => {
        try {
            setDeleteLoading(true);
            
            const response = await fetch(`https://backend-iota-seven-19.vercel.app/api/productos/${deletingProduct.idProducto}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            
            if (data.message) {
                mostrarToast('Producto eliminado correctamente', 'success');
                setShowDeleteModal(false);
                setDeletingProduct(null);
                // Recargar productos
                window.location.reload();
            } else {
                throw new Error('Error al eliminar producto');
            }
        } catch (error) {
            console.error('Error deleting product:', error);
            mostrarToast('Error al eliminar producto: ' + error.message, 'danger');
        } finally {
            setDeleteLoading(false);
        }
    };

    // Filtrar productos
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
                <Alert variant="danger">
                    <h5>Error</h5>
                    <p>{error}</p>
                    <Button 
                        variant="outline-danger" 
                        onClick={() => window.location.reload()}
                    >
                        Reintentar
                    </Button>
                </Alert>
            </Container>
        );
    }

    return (
        <Container fluid className="py-4" style={customStyles.light}>
            {/* Toast Notification */}
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

            {/* Header */}
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
                                    <tr key={product.idProducto || product._id}>
                                        <td>{product.idProducto || product._id || 'N/A'}</td>
                                        <td>{product.Nombre || 'Sin nombre'}</td>
                                        <td>{(product.Descripción || '').substring(0, 50)}...</td>
                                        <td className="text-center" style={{ color: customStyles.success.backgroundColor, fontWeight: 'bold' }}>
                                            ${product.Precio || 0}
                                        </td>
                                        <td className="text-center">
                                            <Badge pill style={
                                                product.estado === 'aprobado' ? customStyles.success :
                                                    product.estado === 'pendiente' ? customStyles.warning :
                                                        customStyles.danger
                                            }>
                                                {product.estado || 'pendiente'}
                                            </Badge>
                                        </td>
                                        <td className="text-center">
                                            <Button
                                                variant="outline-primary"
                                                size="sm"
                                                className="me-2"
                                                style={{ borderColor: customStyles.info.backgroundColor, color: customStyles.info.backgroundColor }}
                                                onClick={() => handleShowDetail(product.idProducto || product._id)}
                                            >
                                                <FaEye />
                                            </Button>
                                            <Button
                                                variant="outline-success"
                                                size="sm"
                                                className="me-2"
                                                style={{ borderColor: customStyles.success.backgroundColor, color: customStyles.success.backgroundColor }}
                                                onClick={() => handleEdit(product)}
                                            >
                                                <FaEdit />
                                            </Button>
                                            <Button
                                                variant="outline-danger"
                                                size="sm"
                                                style={{ borderColor: customStyles.danger.backgroundColor, color: customStyles.danger.backgroundColor }}
                                                onClick={() => handleDelete(product)}
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

            {/* Modal de Detalles */}
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
                                        {selectedProduct.Imagen && selectedProduct.Imagen.length > 0 ? (
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
                                                    <p>{selectedProduct.Nombre || 'N/A'}</p>
                                                </div>
                                            </Col>
                                            <Col sm={6}>
                                                <div className="mb-3">
                                                    <h6 className="text-muted">Precio</h6>
                                                    <p style={{ color: customStyles.success.backgroundColor, fontWeight: 'bold' }}>
                                                        ${selectedProduct.Precio || 0}
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
                                                        {selectedProduct.estado || 'pendiente'}
                                                    </Badge>
                                                </div>
                                            </Col>
                                            <Col sm={6}>
                                                <div className="mb-3">
                                                    <h6 className="text-muted">Creado el</h6>
                                                    <p>{selectedProduct.createdAt ? new Date(selectedProduct.createdAt).toLocaleDateString() : 'N/A'}</p>
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

            {/* Modal de Edición */}
            <Modal show={showEditModal} onHide={() => setShowEditModal(false)} size="lg" centered>
                <Modal.Header closeButton style={customStyles.primary} className="text-white">
                    <Modal.Title><FaEdit className="me-2" /> Editar Producto</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {editingProduct && (
                        <Form>
                            <Row>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Nombre del Producto</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={editingProduct.Nombre || ''}
                                            onChange={(e) => setEditingProduct({...editingProduct, Nombre: e.target.value})}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Precio</Form.Label>
                                        <Form.Control
                                            type="number"
                                            value={editingProduct.Precio || ''}
                                            onChange={(e) => setEditingProduct({...editingProduct, Precio: parseFloat(e.target.value)})}
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Form.Group className="mb-3">
                                <Form.Label>Descripción</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    value={editingProduct.Descripción || ''}
                                    onChange={(e) => setEditingProduct({...editingProduct, Descripción: e.target.value})}
                                />
                            </Form.Group>
                            <Row>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Materiales</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={editingProduct.Materiales || ''}
                                            onChange={(e) => setEditingProduct({...editingProduct, Materiales: e.target.value})}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Técnica</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={editingProduct.Técnica || ''}
                                            onChange={(e) => setEditingProduct({...editingProduct, Técnica: e.target.value})}
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Dimensiones</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={editingProduct.Dimensiones || ''}
                                            onChange={(e) => setEditingProduct({...editingProduct, Dimensiones: e.target.value})}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Disponibilidad</Form.Label>
                                        <Form.Select
                                            value={editingProduct.Disponibilidad || 'En stock'}
                                            onChange={(e) => setEditingProduct({...editingProduct, Disponibilidad: e.target.value})}
                                        >
                                            <option value="En stock">En stock</option>
                                            <option value="Agotado">Agotado</option>
                                            <option value="Bajo pedido">Bajo pedido</option>
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Form.Group className="mb-3">
                                <Form.Label>Colores (separados por comas)</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={Array.isArray(editingProduct.Colores) ? editingProduct.Colores.join(', ') : editingProduct.Colores || ''}
                                    onChange={(e) => setEditingProduct({...editingProduct, Colores: e.target.value.split(',').map(c => c.trim())})}
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Etiquetas (separadas por comas)</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={Array.isArray(editingProduct.Etiquetas) ? editingProduct.Etiquetas.join(', ') : editingProduct.Etiquetas || ''}
                                    onChange={(e) => setEditingProduct({...editingProduct, Etiquetas: e.target.value.split(',').map(t => t.trim())})}
                                />
                            </Form.Group>
                        </Form>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowEditModal(false)}>
                        Cancelar
                    </Button>
                    <Button 
                        onClick={handleSaveEdit} 
                        style={customStyles.success}
                        disabled={editLoading}
                    >
                        {editLoading ? <Spinner animation="border" size="sm" /> : 'Guardar Cambios'}
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Modal de Eliminación */}
            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
                <Modal.Header closeButton style={customStyles.danger} className="text-white">
                    <Modal.Title><FaTrash className="me-2" /> Confirmar Eliminación</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {deletingProduct && (
                        <div className="text-center">
                            <FaTrash size={48} style={{ color: customStyles.danger.backgroundColor }} className="mb-3" />
                            <h5>¿Estás seguro de que quieres eliminar este producto?</h5>
                            <p className="text-muted">
                                <strong>{deletingProduct.Nombre}</strong>
                            </p>
                            <p className="text-danger">
                                <small>Esta acción no se puede deshacer.</small>
                            </p>
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
                        Cancelar
                    </Button>
                    <Button 
                        variant="danger" 
                        onClick={handleConfirmDelete}
                        disabled={deleteLoading}
                    >
                        {deleteLoading ? <Spinner animation="border" size="sm" /> : 'Eliminar'}
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default Products;