import React, { useState, useEffect } from 'react';
import {
    Table, Button, Form, InputGroup, Badge, Container,
    Row, Col, Card, Spinner, Alert, Toast, Modal
} from 'react-bootstrap';
import {
    FaEye, FaEdit, FaTrash, FaPlus, FaSearch, FaInfoCircle, FaImage
} from 'react-icons/fa';
import FestividadForm from './FestividadForm';

const API_URL = 'https://backend-iota-seven-19.vercel.app/api/festividades';

const customStyles = {
    primary: { backgroundColor: '#9A1E47', borderColor: '#9A1E47' },
    secondary: { backgroundColor: '#0FA89C', borderColor: '#0FA89C' },
    success: { backgroundColor: '#1E8546', borderColor: '#1E8546' },
    warning: { backgroundColor: '#F28B27', borderColor: '#F28B27' },
    danger: { backgroundColor: '#D24D1C', borderColor: '#D24D1C' },
    info: { backgroundColor: '#50C2C4', borderColor: '#50C2C4' },
    light: { backgroundColor: '#FDF2E0', borderColor: '#FDF2E0' }
};

const FestividadesAdmin = () => {
    const [festividades, setFestividades] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [toastVariant, setToastVariant] = useState("success");
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [selectedFestividad, setSelectedFestividad] = useState(null);
    const [showFormModal, setShowFormModal] = useState(false);
    const [editFestividad, setEditFestividad] = useState(null);
    const [detailLoading, setDetailLoading] = useState(false);

    const mostrarToast = (message, variant = "success") => {
        setToastMessage(message);
        setToastVariant(variant);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
    };

    const fetchFestividades = async () => {
        setLoading(true);
        try {
            const res = await fetch(API_URL);
            const data = await res.json();
            setFestividades(Array.isArray(data) ? data : []);
            setError('');
        } catch (err) {
            setError('Error al cargar festividades');
            setFestividades([]);
            mostrarToast('Error al cargar festividades', 'danger');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFestividades();
    }, []);

    const filteredFestividades = festividades.filter(f => {
        const nombre = f.nombre || '';
        const descripcion = f.descripcion || '';
        return (
            nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
            descripcion.toLowerCase().includes(searchTerm.toLowerCase())
        );
    });

    const handleShowDetail = (festividad) => {
        setSelectedFestividad(festividad);
        setShowDetailModal(true);
    };

    const handleEdit = (festividad) => {
        setEditFestividad(festividad);
        setShowFormModal(true);
    };

    const handleCreate = () => {
        setEditFestividad(null);
        setShowFormModal(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('¿Seguro que deseas eliminar esta festividad?')) return;
        try {
            await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
            mostrarToast('Festividad eliminada', 'success');
            fetchFestividades();
        } catch (err) {
            mostrarToast('Error al eliminar festividad', 'danger');
        }
    };

    const handleSave = () => {
        setShowFormModal(false);
        setEditFestividad(null);
        fetchFestividades();
        mostrarToast('Festividad guardada', 'success');
    };

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
                        <strong>Gestión de Festividades</strong>
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
                                <Button
                                    variant={'primary'}
                                    className="me-2 mb-2"
                                    style={customStyles.primary}
                                >
                                    Todos
                                </Button>
                            </div>
                        </Col>
                        <Col md={4} className="d-flex justify-content-end">
                            <Button variant="primary" style={customStyles.primary} onClick={handleCreate}>
                                <FaPlus className="me-2" /> Nueva Festividad
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
                            placeholder="Buscar festividades..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <Button variant="outline-secondary" style={customStyles.secondary}>
                            <FaSearch />
                        </Button>
                    </InputGroup>
                </Card.Body>
            </Card>

            {/* Tabla de festividades */}
            <Card className="shadow-sm">
                <Card.Body className="p-0">
                    <Table responsive hover className="mb-0">
                        <thead style={customStyles.secondary}>
                            <tr className="text-white">
                                <th>Nombre</th>
                                <th>Descripción</th>
                                <th>Imagen</th>
                                <th>Municipios</th>
                                <th>Tipo</th>
                                <th className="text-center">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredFestividades.length > 0 ? (
                                filteredFestividades.map((f) => (
                                    <tr key={f._id}>
                                        <td>{f.nombre}</td>
                                        <td>{f.descripcion?.substring(0, 50)}...</td>
                                        <td>
                                            {Array.isArray(f.Imagen) && f.Imagen.length > 0 ? (
                                                <img src={f.Imagen[0]} alt="img" style={{ width: 50, height: 40, objectFit: 'cover', borderRadius: 4 }} />
                                            ) : (
                                                <FaImage size={24} style={{ color: customStyles.info.backgroundColor }} />
                                            )}
                                        </td>
                                        <td>{Array.isArray(f.municipios) ? f.municipios.join(', ') : ''}</td>
                                        <td>{f.tipo}</td>
                                        <td className="text-center">
                                            <Button
                                                variant="outline-primary"
                                                size="sm"
                                                className="me-2"
                                                style={{ borderColor: customStyles.info.backgroundColor, color: customStyles.info.backgroundColor }}
                                                onClick={() => handleShowDetail(f)}
                                            >
                                                <FaEye />
                                            </Button>
                                            <Button
                                                variant="outline-success"
                                                size="sm"
                                                className="me-2"
                                                style={{ borderColor: customStyles.success.backgroundColor, color: customStyles.success.backgroundColor }}
                                                onClick={() => handleEdit(f)}
                                            >
                                                <FaEdit />
                                            </Button>
                                            <Button
                                                variant="outline-danger"
                                                size="sm"
                                                style={{ borderColor: customStyles.danger.backgroundColor, color: customStyles.danger.backgroundColor }}
                                                onClick={() => handleDelete(f._id)}
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
                                        <h5>No se encontraron festividades</h5>
                                        <p className="text-muted">No hay festividades que coincidan con tu búsqueda</p>
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
                    <Modal.Title className="text-white">Detalles de la Festividad</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {detailLoading ? (
                        <div className="text-center py-4">
                            <Spinner animation="border" style={{ color: customStyles.primary.backgroundColor }} />
                        </div>
                    ) : selectedFestividad ? (
                        <Row>
                            <Col md={5}>
                                <Card className="mb-4">
                                    <Card.Header style={customStyles.primary} className="text-white">
                                        <FaImage className="me-2" /> Imágenes
                                    </Card.Header>
                                    <Card.Body>
                                        {selectedFestividad.Imagen?.length > 0 ? (
                                            <Row>
                                                {selectedFestividad.Imagen.map((img, index) => (
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
                                            <Col sm={12}>
                                                <div className="mb-3">
                                                    <h6 className="text-muted">Nombre</h6>
                                                    <p>{selectedFestividad.nombre}</p>
                                                </div>
                                            </Col>
                                            <Col sm={12}>
                                                <div className="mb-3">
                                                    <h6 className="text-muted">Fecha</h6>
                                                    <p>{selectedFestividad.fecha?.inicio} {selectedFestividad.fecha?.duracion_dias && `(Duración: ${selectedFestividad.fecha.duracion_dias} días)`}</p>
                                                </div>
                                            </Col>
                                            <Col sm={12}>
                                                <div className="mb-3">
                                                    <h6 className="text-muted">Municipios</h6>
                                                    <p>{Array.isArray(selectedFestividad.municipios) ? selectedFestividad.municipios.join(', ') : ''}</p>
                                                </div>
                                            </Col>
                                            <Col sm={12}>
                                                <div className="mb-3">
                                                    <h6 className="text-muted">Tipo</h6>
                                                    <p>{selectedFestividad.tipo}</p>
                                                </div>
                                            </Col>
                                            <Col sm={12}>
                                                <div className="mb-3">
                                                    <h6 className="text-muted">Origen</h6>
                                                    <p>{selectedFestividad.origen}</p>
                                                </div>
                                            </Col>
                                            <Col sm={12}>
                                                <div className="mb-3">
                                                    <h6 className="text-muted">Actividades</h6>
                                                    <p>{Array.isArray(selectedFestividad.actividades) ? selectedFestividad.actividades.join(', ') : ''}</p>
                                                </div>
                                            </Col>
                                            <Col sm={12}>
                                                <div className="mb-3">
                                                    <h6 className="text-muted">Elementos Culturales</h6>
                                                    <p>{Array.isArray(selectedFestividad.elementosCulturales) ? selectedFestividad.elementosCulturales.join(', ') : ''}</p>
                                                </div>
                                            </Col>
                                            <Col sm={12}>
                                                <div className="mb-3">
                                                    <h6 className="text-muted">Importancia</h6>
                                                    <p>{selectedFestividad.importancia}</p>
                                                </div>
                                            </Col>
                                            <Col sm={12}>
                                                <div className="mb-3">
                                                    <h6 className="text-muted">Fuentes</h6>
                                                    <ul>
                                                        {Array.isArray(selectedFestividad.fuentes) && selectedFestividad.fuentes.map((fuente, idx) => (
                                                            <li key={idx}><a href={fuente.url} target="_blank" rel="noopener noreferrer">{fuente.titulo}</a></li>
                                                        ))}
                                                    </ul>
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
                                        <p>{selectedFestividad.descripcion || 'No disponible'}</p>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                    ) : (
                        <Alert variant="danger">No se pudieron cargar los detalles de la festividad</Alert>
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

            {/* Modal de Formulario */}
            <Modal show={showFormModal} onHide={() => setShowFormModal(false)} size="lg" centered>
                <Modal.Header closeButton style={customStyles.secondary}>
                    <Modal.Title className="text-white">{editFestividad ? 'Editar Festividad' : 'Nueva Festividad'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <FestividadForm
                        festividad={editFestividad}
                        onClose={() => setShowFormModal(false)}
                        onSave={handleSave}
                    />
                </Modal.Body>
            </Modal>
        </Container>
    );
};

export default FestividadesAdmin;
