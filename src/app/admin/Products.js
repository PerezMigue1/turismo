import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
    Table, Button, Form, InputGroup, Badge, Container,
    Row, Col, Card, Spinner, Alert, Toast, Modal
} from 'react-bootstrap';
import {
    FaEye, FaInfoCircle, FaImage,
    FaSearch, FaEdit, FaTrash,
    FaSync, FaPalette, FaUtensils,
    FaBed, FaStore, FaCheck, FaClock,
    FaCheckCircle
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

    // Estados principales
    const [activeSection, setActiveSection] = useState('artesanias');
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('todos');
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [toastVariant, setToastVariant] = useState("success");
    
    // Estados para modales
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [itemDetailLoading, setItemDetailLoading] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deletingItem, setDeletingItem] = useState(null);
    const [editLoading, setEditLoading] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    
    // Configuración de secciones
    const sections = useMemo(() => ({
        artesanias: {
            title: 'Artesanías',
            icon: <FaPalette />,
            api: 'https://backend-iota-seven-19.vercel.app/api/productos',
            itemType: 'producto',
            fields: {
                name: 'Nombre',
                description: 'Descripción',
                price: 'Precio',
                images: 'Imagen',
                user: 'idArtesano',
                category: 'idCategoria',
                origin: 'Origen',
                materials: 'Materiales',
                technique: 'Técnica',
                dimensions: 'Dimensiones',
                colors: 'Colores',
                availability: 'Disponibilidad',
                status: 'estado'
            }
        },
        gastronomia: {
            title: 'Gastronomía',
            icon: <FaUtensils />,
            api: 'https://backend-iota-seven-19.vercel.app/api/gastronomia',
            itemType: 'platillo',
            fields: {
                name: 'nombre',
                description: 'descripcion',
                price: 'precio',
                images: 'imagen',
                user: 'idChef',
                category: 'tipoPlatillo',
                origin: 'regionOrigen',
                occasion: 'ocasion',
                ingredients: 'ingredientes',
                preparation: 'tiempoPreparacion',
                cooking: 'tiempoCoccion',
                portions: 'porciones',
                status: 'estado'
            }
        },
        hospedaje: {
            title: 'Hospedaje',
            icon: <FaBed />,
            api: 'https://backend-iota-seven-19.vercel.app/api/hospedaje',
            itemType: 'hospedaje',
            fields: {
                name: 'Nombre',
                description: 'Descripcion',
                price: 'Precio',
                images: 'Imagenes',
                user: 'idHospedero',
                category: 'Categoria',
                location: 'Ubicacion',
                guests: 'Huespedes',
                services: 'Servicios',
                schedule: 'Horario',
                phone: 'Telefono',
                status: 'estado'
            }
        },
        restaurantes: {
            title: 'Restaurantes',
            icon: <FaStore />,
            api: 'https://backend-iota-seven-19.vercel.app/api/restaurante',
            itemType: 'restaurante',
            fields: {
                name: 'Nombre',
                description: 'Descripcion',
                price: 'Precio',
                images: 'Imagenes',
                user: 'idRestaurante',
                category: 'Tipo',
                location: 'Ubicacion',
                specialty: 'Especialidad',
                municipality: 'Ubicacion.Municipio',
                state: 'Ubicacion.Estado',
                status: 'estado'
            }
        }
    }), []);

    // Función de notificación
    const mostrarToast = (message, variant = "success") => {
        setToastMessage(message);
        setToastVariant(variant);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
    };

    // Cargar items según la sección activa
    const fetchItems = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const currentSection = sections[activeSection];
            const response = await fetch(currentSection.api, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log(`Datos de ${activeSection}:`, data);
            if (data.length > 0) {
                console.log(`Primer item de ${activeSection}:`, data[0]);
                console.log(`Campo de imágenes para ${activeSection}:`, data[0][currentSection.fields.images]);
            }
            setItems(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error fetching items:', error);
            setError('Error de conexión: ' + error.message);
            mostrarToast('Error al cargar datos', 'danger');
        } finally {
            setLoading(false);
        }
    }, [activeSection, sections]);

    // Cargar detalles del item
    const handleShowDetail = async (itemId) => {
        try {
            setItemDetailLoading(true);
            const currentSection = sections[activeSection];
            
            const response = await fetch(`${currentSection.api}/${itemId}`, {
                headers: { 
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            if (data) {
                setSelectedItem(data);
                setShowDetailModal(true);
            } else {
                mostrarToast('Error al cargar detalles', 'danger');
            }
        } catch (error) {
            console.error('Error fetching item details:', error);
            mostrarToast('Error al cargar detalles', 'danger');
        } finally {
            setItemDetailLoading(false);
        }
    };

    // Función para abrir modal de edición
    const handleEdit = (item) => {
        setEditingItem({ ...item });
        setShowEditModal(true);
    };

    // Función para guardar cambios
    const handleSaveEdit = async () => {
        try {
            setEditLoading(true);
            const currentSection = sections[activeSection];
            
            const response = await fetch(`${currentSection.api}/${editingItem._id || editingItem.idProducto}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(editingItem)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            
            if (data.message) {
                mostrarToast('Item actualizado correctamente', 'success');
                setShowEditModal(false);
                setEditingItem(null);
                fetchItems();
            } else {
                throw new Error('Error al actualizar item');
            }
        } catch (error) {
            console.error('Error updating item:', error);
            mostrarToast('Error al actualizar item: ' + error.message, 'danger');
        } finally {
            setEditLoading(false);
        }
    };

    // Función para abrir modal de eliminación
    const handleDelete = (item) => {
        setDeletingItem(item);
        setShowDeleteModal(true);
    };

    // Función para confirmar eliminación
    const handleConfirmDelete = async () => {
        try {
            setDeleteLoading(true);
            const currentSection = sections[activeSection];
            
            const response = await fetch(`${currentSection.api}/${deletingItem._id || deletingItem.idProducto}`, {
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
                mostrarToast('Item eliminado correctamente', 'success');
                setShowDeleteModal(false);
                setDeletingItem(null);
                fetchItems();
            } else {
                throw new Error('Error al eliminar item');
            }
        } catch (error) {
            console.error('Error deleting item:', error);
            mostrarToast('Error al eliminar item: ' + error.message, 'danger');
        } finally {
            setDeleteLoading(false);
        }
    };

    // Función para cambiar el estado de un item
    const handleChangeStatus = async (item, newStatus) => {
        try {
            const currentSection = sections[activeSection];
            const statusField = currentSection.fields.status;
            
            const updatedItem = {
                ...item,
                [statusField]: newStatus
            };

            const response = await fetch(`${currentSection.api}/${item._id || item.idProducto}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedItem)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            
            if (data.message || data.success !== false) {
                const statusText = newStatus === 'aceptado' ? 'aceptado' : 'pendiente';
                mostrarToast(`Estado cambiado a ${statusText}`, 'success');
                fetchItems();
            } else {
                throw new Error('Error al actualizar estado');
            }
        } catch (error) {
            console.error('Error updating status:', error);
            mostrarToast('Error al cambiar estado: ' + error.message, 'danger');
        }
    };

    // Filtrar items
    const filteredItems = items.filter(item => {
        const name = item[sections[activeSection].fields.name] || '';
        const description = item[sections[activeSection].fields.description] || '';
        const status = item[sections[activeSection].fields.status] || 'pendiente';
        
        const matchesSearch =
            name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            description.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = statusFilter === 'todos' || 
                            (statusFilter === 'pendiente' && status === 'pendiente') ||
                            (statusFilter === 'aceptado' && status === 'aceptado');

        return matchesSearch && matchesStatus;
    });

    // Efectos
    useEffect(() => {
        fetchItems();
    }, [fetchItems]);

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
                        onClick={() => fetchItems()}
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
                        <strong>Gestión de {sections[activeSection].title}</strong>
                    </h1>
                    <div style={{ width: '80px', height: '4px', backgroundColor: customStyles.secondary.backgroundColor, borderRadius: '2px' }}></div>
                </Col>
            </Row>

            {/* Selector de secciones */}
            <Card className="mb-4 shadow-sm">
                <Card.Body>
                    <div className="d-flex flex-wrap">
                        {Object.entries(sections).map(([key, section]) => (
                            <Button
                                key={key}
                                variant={activeSection === key ? 'primary' : 'outline-secondary'}
                                className="me-2 mb-2"
                                onClick={() => setActiveSection(key)}
                                style={activeSection === key ? customStyles.primary : {}}
                            >
                                {section.icon} {section.title}
                            </Button>
                        ))}
                    </div>
                </Card.Body>
            </Card>

            {/* Filtros */}
            <Card className="mb-4 shadow-sm">
                <Card.Body>
                    <Row className="align-items-center">
                        <Col md={6}>
                            <div className="d-flex flex-wrap align-items-center">
                                <Button variant="outline-secondary" onClick={fetchItems} className="me-3">
                                    <FaSync className="me-2" /> Actualizar
                                </Button>
                                <div className="d-flex align-items-center">
                                    <span className="me-2 text-muted">Filtrar por estado:</span>
                                    <Form.Select 
                                        size="sm" 
                                        value={statusFilter} 
                                        onChange={(e) => setStatusFilter(e.target.value)}
                                        style={{ width: '130px' }}
                                    >
                                        <option value="todos">Todos</option>
                                        <option value="pendiente">Pendientes</option>
                                        <option value="aceptado">Aceptados</option>
                                    </Form.Select>
                                </div>
                            </div>
                        </Col>
                        <Col md={6} className="d-flex justify-content-end">
                            <div className="d-flex align-items-center">
                                <Badge bg="warning" className="me-2">
                                    <FaClock className="me-1" />
                                    Pendientes: {items.filter(item => (item[sections[activeSection].fields.status] || 'pendiente') === 'pendiente').length}
                                </Badge>
                                <Badge bg="success">
                                    <FaCheckCircle className="me-1" />
                                    Aceptados: {items.filter(item => (item[sections[activeSection].fields.status] || 'pendiente') === 'aceptado').length}
                                </Badge>
                            </div>
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
                            placeholder={`Buscar ${sections[activeSection].itemType}s...`}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <Button variant="outline-secondary" style={customStyles.secondary}>
                            <FaSearch />
                        </Button>
                    </InputGroup>
                </Card.Body>
            </Card>

            {/* Tabla de items */}
            <Card className="shadow-sm">
                <Card.Body className="p-0">
                    <Table responsive hover className="mb-0">
                        <thead style={customStyles.secondary}>
                            <tr className="text-white">
                                <th>Item</th>
                                <th>Usuario</th>
                                <th className="text-center">Estado</th>
                                <th className="text-center">Precio</th>
                                <th className="text-center">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredItems.length > 0 ? (
                                filteredItems.map((item) => (
                                    <tr key={item._id || item.idProducto}>
                                        <td>
                                            <div className="d-flex align-items-center">
                                                {(() => {
                                                    const imageField = sections[activeSection].fields.images;
                                                    const images = item[imageField];
                                                    
                                                    // Manejar diferentes formatos de imágenes
                                                    let imageUrl = null;
                                                    if (Array.isArray(images) && images.length > 0) {
                                                        imageUrl = images[0];
                                                    } else if (typeof images === 'string') {
                                                        imageUrl = images;
                                                    } else if (images && images.url) {
                                                        imageUrl = images.url;
                                                    }
                                                    
                                                    return imageUrl ? (
                                                        <img 
                                                            src={imageUrl} 
                                                            alt="" 
                                                            className="rounded me-3" 
                                                            style={{ width: 50, height: 50, objectFit: 'cover' }}
                                                            onError={(e) => {
                                                                e.target.style.display = 'none';
                                                            }}
                                                        />
                                                    ) : (
                                                        <div 
                                                            className="rounded me-3 d-flex align-items-center justify-content-center"
                                                            style={{ 
                                                                width: 50, 
                                                                height: 50, 
                                                                backgroundColor: '#f8f9fa',
                                                                color: '#6c757d',
                                                                fontSize: '12px'
                                                            }}
                                                        >
                                                            Sin img
                                                        </div>
                                                    );
                                                })()}
                                                <div>
                                                    <div className="fw-bold">{item[sections[activeSection].fields.name] || 'Sin nombre'}</div>
                                                    <small className="text-muted text-truncate d-block" style={{ maxWidth: 200 }}>
                                                        {item[sections[activeSection].fields.description] || ''}
                                                    </small>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="align-middle">{item[sections[activeSection].fields.user] || 'N/A'}</td>
                                        <td className="text-center align-middle">
                                            {(() => {
                                                const status = item[sections[activeSection].fields.status] || 'pendiente';
                                                const isAcepted = status === 'aceptado';
                                                return (
                                                    <Badge 
                                                        bg={isAcepted ? 'success' : 'warning'}
                                                        className="d-flex align-items-center justify-content-center"
                                                        style={{ 
                                                            fontSize: '0.75rem',
                                                            padding: '0.5rem 0.75rem',
                                                            minWidth: '80px'
                                                        }}
                                                    >
                                                        {isAcepted ? <FaCheckCircle className="me-1" /> : <FaClock className="me-1" />}
                                                        {isAcepted ? 'Aceptado' : 'Pendiente'}
                                                    </Badge>
                                                );
                                            })()}
                                        </td>
                                        <td className="text-center align-middle fw-bold" style={{ color: customStyles.success.backgroundColor }}>
                                            ${item[sections[activeSection].fields.price] || 0}
                                        </td>
                                        <td className="text-center align-middle">
                                            <div className="d-flex justify-content-center flex-wrap gap-1">
                                                <Button
                                                    variant="outline-primary"
                                                    size="sm"
                                                    style={{ borderColor: customStyles.info.backgroundColor, color: customStyles.info.backgroundColor }}
                                                    onClick={() => handleShowDetail(item._id || item.idProducto)}
                                                    title="Ver detalles"
                                                >
                                                    <FaEye />
                                                </Button>
                                                <Button
                                                    variant="outline-success"
                                                    size="sm"
                                                    style={{ borderColor: customStyles.success.backgroundColor, color: customStyles.success.backgroundColor }}
                                                    onClick={() => handleEdit(item)}
                                                    title="Editar"
                                                >
                                                    <FaEdit />
                                                </Button>
                                                {(() => {
                                                    const status = item[sections[activeSection].fields.status] || 'pendiente';
                                                    const isAccepted = status === 'aceptado';
                                                    
                                                    return isAccepted ? (
                                                        <Button
                                                            variant="outline-warning"
                                                            size="sm"
                                                            style={{ borderColor: customStyles.warning.backgroundColor, color: customStyles.warning.backgroundColor }}
                                                            onClick={() => handleChangeStatus(item, 'pendiente')}
                                                            title="Marcar como pendiente"
                                                        >
                                                            <FaClock />
                                                        </Button>
                                                    ) : (
                                                        <Button
                                                            variant="outline-success"
                                                            size="sm"
                                                            style={{ borderColor: '#28a745', color: '#28a745' }}
                                                            onClick={() => handleChangeStatus(item, 'aceptado')}
                                                            title="Aceptar"
                                                        >
                                                            <FaCheck />
                                                        </Button>
                                                    );
                                                })()}
                                                <Button
                                                    variant="outline-danger"
                                                    size="sm"
                                                    style={{ borderColor: customStyles.danger.backgroundColor, color: customStyles.danger.backgroundColor }}
                                                    onClick={() => handleDelete(item)}
                                                    title="Eliminar"
                                                >
                                                    <FaTrash />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="text-center py-5">
                                        <FaInfoCircle size={48} style={{ color: customStyles.info.backgroundColor }} className="mb-3" />
                                        <h5>No se encontraron {sections[activeSection].itemType}s</h5>
                                        <p className="text-muted">No hay {sections[activeSection].itemType}s que coincidan con tu búsqueda</p>
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
                    <Modal.Title className="text-white">Detalles del {sections[activeSection].itemType}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {itemDetailLoading ? (
                        <div className="text-center py-4">
                            <Spinner animation="border" style={{ color: customStyles.primary.backgroundColor }} />
                        </div>
                    ) : selectedItem ? (
                        <Row>
                            <Col md={5}>
                                <Card className="mb-4">
                                    <Card.Header style={customStyles.primary} className="text-white">
                                        <FaImage className="me-2" /> Imágenes
                                    </Card.Header>
                                    <Card.Body>
                                        {(() => {
                                            const imageField = sections[activeSection].fields.images;
                                            const images = selectedItem[imageField];
                                            
                                            // Manejar diferentes formatos de imágenes
                                            let imageArray = [];
                                            if (Array.isArray(images)) {
                                                imageArray = images;
                                            } else if (typeof images === 'string') {
                                                imageArray = [images];
                                            } else if (images && images.url) {
                                                imageArray = [images.url];
                                            }
                                            
                                            return imageArray.length > 0 ? (
                                                <Row>
                                                    {imageArray.map((img, index) => (
                                                        <Col xs={6} key={index} className="mb-3">
                                                            <img
                                                                src={img}
                                                                alt={`Imagen ${index + 1}`}
                                                                className="img-fluid rounded border"
                                                                style={{ height: '120px', objectFit: 'cover', width: '100%' }}
                                                                onError={(e) => {
                                                                    e.target.style.display = 'none';
                                                                }}
                                                            />
                                                        </Col>
                                                    ))}
                                                </Row>
                                            ) : (
                                                <div className="text-center py-4">
                                                    <FaImage size={48} style={{ color: customStyles.info.backgroundColor }} className="mb-3" />
                                                    <p>No hay imágenes disponibles</p>
                                                </div>
                                            );
                                        })()}
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
                                                    <p>{selectedItem[sections[activeSection].fields.name] || 'N/A'}</p>
                                                </div>
                                            </Col>
                                            <Col sm={6}>
                                                <div className="mb-3">
                                                    <h6 className="text-muted">Precio</h6>
                                                    <p style={{ color: customStyles.success.backgroundColor, fontWeight: 'bold' }}>
                                                        ${selectedItem[sections[activeSection].fields.price] || 0}
                                                    </p>
                                                </div>
                                            </Col>
                                            <Col sm={6}>
                                                <div className="mb-3">
                                                    <h6 className="text-muted">Usuario</h6>
                                                    <p>{selectedItem[sections[activeSection].fields.user] || 'N/A'}</p>
                                                </div>
                                            </Col>
                                            <Col sm={6}>
                                                <div className="mb-3">
                                                    <h6 className="text-muted">Categoría</h6>
                                                    <p>{selectedItem[sections[activeSection].fields.category] || 'N/A'}</p>
                                                </div>
                                            </Col>
                                            <Col sm={6}>
                                                <div className="mb-3">
                                                    <h6 className="text-muted">Estado</h6>
                                                    {(() => {
                                                        const status = selectedItem[sections[activeSection].fields.status] || 'pendiente';
                                                        const isAcepted = status === 'aceptado';
                                                        return (
                                                            <Badge 
                                                                bg={isAcepted ? 'success' : 'warning'}
                                                                className="d-flex align-items-center justify-content-center"
                                                                style={{ 
                                                                    fontSize: '0.85rem',
                                                                    padding: '0.5rem 0.75rem',
                                                                    maxWidth: '120px'
                                                                }}
                                                            >
                                                                {isAcepted ? <FaCheckCircle className="me-1" /> : <FaClock className="me-1" />}
                                                                {isAcepted ? 'Aceptado' : 'Pendiente'}
                                                            </Badge>
                                                        );
                                                    })()}
                                                </div>
                                            </Col>
                                            {activeSection === 'artesanias' && (
                                                <>
                                                    <Col sm={6}>
                                                        <div className="mb-3">
                                                            <h6 className="text-muted">Origen</h6>
                                                            <p>{selectedItem[sections[activeSection].fields.origin] || 'N/A'}</p>
                                                        </div>
                                                    </Col>
                                                    <Col sm={6}>
                                                        <div className="mb-3">
                                                            <h6 className="text-muted">Materiales</h6>
                                                            <p>{selectedItem[sections[activeSection].fields.materials] || 'N/A'}</p>
                                                        </div>
                                                    </Col>
                                                    <Col sm={6}>
                                                        <div className="mb-3">
                                                            <h6 className="text-muted">Técnica</h6>
                                                            <p>{selectedItem[sections[activeSection].fields.technique] || 'N/A'}</p>
                                                        </div>
                                                    </Col>
                                                    <Col sm={6}>
                                                        <div className="mb-3">
                                                            <h6 className="text-muted">Dimensiones</h6>
                                                            <p>{selectedItem[sections[activeSection].fields.dimensions] || 'N/A'}</p>
                                                        </div>
                                                    </Col>
                                                </>
                                            )}
                                            {activeSection === 'gastronomia' && (
                                                <>
                                                    <Col sm={6}>
                                                        <div className="mb-3">
                                                            <h6 className="text-muted">Origen</h6>
                                                            <p>{selectedItem[sections[activeSection].fields.origin] || 'N/A'}</p>
                                                        </div>
                                                    </Col>
                                                    <Col sm={6}>
                                                        <div className="mb-3">
                                                            <h6 className="text-muted">Ocasión</h6>
                                                            <p>
                                                                {Array.isArray(selectedItem[sections[activeSection].fields.occasion]) 
                                                                    ? selectedItem[sections[activeSection].fields.occasion].join(', ') 
                                                                    : selectedItem[sections[activeSection].fields.occasion] || 'N/A'
                                                                }
                                                            </p>
                                                        </div>
                                                    </Col>
                                                </>
                                            )}
                                            {activeSection === 'hospedaje' && (
                                                <>
                                                    <Col sm={6}>
                                                        <div className="mb-3">
                                                            <h6 className="text-muted">Ubicación</h6>
                                                            <p>{selectedItem[sections[activeSection].fields.location] || 'N/A'}</p>
                                                        </div>
                                                    </Col>
                                                    <Col sm={6}>
                                                        <div className="mb-3">
                                                            <h6 className="text-muted">Huéspedes</h6>
                                                            <p>{selectedItem[sections[activeSection].fields.guests] || 'N/A'}</p>
                                                        </div>
                                                    </Col>
                                                    <Col sm={6}>
                                                        <div className="mb-3">
                                                            <h6 className="text-muted">Servicios</h6>
                                                            <p>{selectedItem[sections[activeSection].fields.services] || 'N/A'}</p>
                                                        </div>
                                                    </Col>
                                                    <Col sm={6}>
                                                        <div className="mb-3">
                                                            <h6 className="text-muted">Horario</h6>
                                                            <p>{selectedItem[sections[activeSection].fields.schedule] || 'N/A'}</p>
                                                        </div>
                                                    </Col>
                                                </>
                                            )}
                                            {activeSection === 'restaurantes' && (
                                                <>
                                                    <Col sm={6}>
                                                        <div className="mb-3">
                                                            <h6 className="text-muted">Ubicación</h6>
                                                            <p>{selectedItem[sections[activeSection].fields.location] || 'N/A'}</p>
                                                        </div>
                                                    </Col>
                                                    <Col sm={6}>
                                                        <div className="mb-3">
                                                            <h6 className="text-muted">Especialidad</h6>
                                                            <p>{selectedItem[sections[activeSection].fields.specialty] || 'N/A'}</p>
                                                        </div>
                                                    </Col>
                                                </>
                                            )}
                                        </Row>
                                    </Card.Body>
                                </Card>

                                <Card className="mb-4">
                                    <Card.Header style={customStyles.primary} className="text-white">
                                        <FaInfoCircle className="me-2" /> Descripción
                                    </Card.Header>
                                    <Card.Body>
                                        <p>{selectedItem[sections[activeSection].fields.description] || 'No disponible'}</p>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                    ) : (
                        <Alert variant="danger">No se pudieron cargar los detalles</Alert>
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
                    <Modal.Title><FaEdit className="me-2" /> Editar {sections[activeSection].itemType}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {editingItem && (
                        <Form>
                            <Row>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Nombre</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={editingItem[sections[activeSection].fields.name] || ''}
                                            onChange={(e) => setEditingItem({...editingItem, [sections[activeSection].fields.name]: e.target.value})}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Precio</Form.Label>
                                        <Form.Control
                                            type="number"
                                            value={editingItem[sections[activeSection].fields.price] || ''}
                                            onChange={(e) => setEditingItem({...editingItem, [sections[activeSection].fields.price]: parseFloat(e.target.value)})}
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Form.Group className="mb-3">
                                <Form.Label>Descripción</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    value={editingItem[sections[activeSection].fields.description] || ''}
                                    onChange={(e) => setEditingItem({...editingItem, [sections[activeSection].fields.description]: e.target.value})}
                                />
                            </Form.Group>
                            
                            {activeSection === 'artesanias' && (
                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Origen</Form.Label>
                                            <Form.Control
                                                type="text"
                                                value={editingItem[sections[activeSection].fields.origin] || ''}
                                                onChange={(e) => setEditingItem({...editingItem, [sections[activeSection].fields.origin]: e.target.value})}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Materiales</Form.Label>
                                            <Form.Control
                                                type="text"
                                                value={editingItem[sections[activeSection].fields.materials] || ''}
                                                onChange={(e) => setEditingItem({...editingItem, [sections[activeSection].fields.materials]: e.target.value})}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Técnica</Form.Label>
                                            <Form.Control
                                                type="text"
                                                value={editingItem[sections[activeSection].fields.technique] || ''}
                                                onChange={(e) => setEditingItem({...editingItem, [sections[activeSection].fields.technique]: e.target.value})}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Dimensiones</Form.Label>
                                            <Form.Control
                                                type="text"
                                                value={editingItem[sections[activeSection].fields.dimensions] || ''}
                                                onChange={(e) => setEditingItem({...editingItem, [sections[activeSection].fields.dimensions]: e.target.value})}
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>
                            )}
                            
                            {activeSection === 'gastronomia' && (
                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Origen</Form.Label>
                                            <Form.Control
                                                type="text"
                                                value={editingItem[sections[activeSection].fields.origin] || ''}
                                                onChange={(e) => setEditingItem({...editingItem, [sections[activeSection].fields.origin]: e.target.value})}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Categoría</Form.Label>
                                            <Form.Control
                                                type="text"
                                                value={editingItem[sections[activeSection].fields.category] || ''}
                                                onChange={(e) => setEditingItem({...editingItem, [sections[activeSection].fields.category]: e.target.value})}
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>
                            )}
                            
                            {activeSection === 'hospedaje' && (
                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Ubicación</Form.Label>
                                            <Form.Control
                                                type="text"
                                                value={editingItem[sections[activeSection].fields.location] || ''}
                                                onChange={(e) => setEditingItem({...editingItem, [sections[activeSection].fields.location]: e.target.value})}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Huéspedes</Form.Label>
                                            <Form.Control
                                                type="number"
                                                value={editingItem[sections[activeSection].fields.guests] || ''}
                                                onChange={(e) => setEditingItem({...editingItem, [sections[activeSection].fields.guests]: parseInt(e.target.value)})}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Servicios</Form.Label>
                                            <Form.Control
                                                type="text"
                                                value={editingItem[sections[activeSection].fields.services] || ''}
                                                onChange={(e) => setEditingItem({...editingItem, [sections[activeSection].fields.services]: e.target.value})}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Horario</Form.Label>
                                            <Form.Control
                                                type="text"
                                                value={editingItem[sections[activeSection].fields.schedule] || ''}
                                                onChange={(e) => setEditingItem({...editingItem, [sections[activeSection].fields.schedule]: e.target.value})}
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>
                            )}
                            
                            {activeSection === 'restaurantes' && (
                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Ubicación</Form.Label>
                                            <Form.Control
                                                type="text"
                                                value={editingItem[sections[activeSection].fields.location] || ''}
                                                onChange={(e) => setEditingItem({...editingItem, [sections[activeSection].fields.location]: e.target.value})}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Especialidad</Form.Label>
                                            <Form.Control
                                                type="text"
                                                value={editingItem[sections[activeSection].fields.specialty] || ''}
                                                onChange={(e) => setEditingItem({...editingItem, [sections[activeSection].fields.specialty]: e.target.value})}
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>
                            )}
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
                    {deletingItem && (
                        <div className="text-center">
                            <FaTrash size={48} style={{ color: customStyles.danger.backgroundColor }} className="mb-3" />
                            <h5>¿Estás seguro de que quieres eliminar este {sections[activeSection].itemType}?</h5>
                            <p className="text-muted">
                                <strong>{deletingItem[sections[activeSection].fields.name]}</strong>
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