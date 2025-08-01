import React, { useState, useEffect } from 'react';
import {
    Container, Row, Col, Card, Button, Modal, Form,
    Alert, Spinner, Table, Badge
} from 'react-bootstrap';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';

const FAQAdmin = () => {
    const [faqs, setFaqs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [formData, setFormData] = useState({
        pregunta: '',
        respuesta: '',
        categoria: 'general',
        activo: true,
        orden: 0
    });

    // Función para obtener el token
    const getToken = () => {
        const user = localStorage.getItem('user');
        if (user) {
            const userData = JSON.parse(user);
            return userData.token;
        }
        return null;
    };

    useEffect(() => {
        cargarFAQs();
    }, []);

    const cargarFAQs = async () => {
        try {
            setLoading(true);
            setError(null);

            const token = getToken();
            if (!token) {
                setError('No hay token de autenticación. Por favor, inicia sesión.');
                setLoading(false);
                return;
            }

            const response = await fetch('https://backend-iota-seven-19.vercel.app/api/faq/admin', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (data.success) {
                setFaqs(data.data);
            } else {
                setError(data.message || 'Error al cargar los datos');
            }
        } catch (error) {
            console.error('Error:', error);
            setError('Error de conexión');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const token = getToken();
            if (!token) {
                setError('No hay token de autenticación. Por favor, inicia sesión.');
                return;
            }

            const url = editingItem 
                ? `https://backend-iota-seven-19.vercel.app/api/faq/admin/${editingItem._id}`
                : 'https://backend-iota-seven-19.vercel.app/api/faq/admin';
            
            const method = editingItem ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (data.success) {
                setShowModal(false);
                setEditingItem(null);
                resetForm();
                cargarFAQs();
            } else {
                setError(data.message || 'Error al guardar');
            }
        } catch (error) {
            console.error('Error:', error);
            setError('Error de conexión');
        }
    };

    const handleEdit = (item) => {
        setEditingItem(item);
        setFormData({
            pregunta: item.pregunta,
            respuesta: item.respuesta,
            categoria: item.categoria,
            activo: item.activo,
            orden: item.orden
        });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('¿Estás seguro de que quieres eliminar esta pregunta frecuente?')) {
            return;
        }

        try {
            const token = getToken();
            if (!token) {
                setError('No hay token de autenticación. Por favor, inicia sesión.');
                return;
            }

            const response = await fetch(`https://backend-iota-seven-19.vercel.app/api/faq/admin/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (data.success) {
                cargarFAQs();
            } else {
                setError(data.message || 'Error al eliminar');
            }
        } catch (error) {
            console.error('Error:', error);
            setError('Error de conexión');
        }
    };

    const resetForm = () => {
        setFormData({
            pregunta: '',
            respuesta: '',
            categoria: 'general',
            activo: true,
            orden: 0
        });
    };

    const handleShowModal = () => {
        setEditingItem(null);
        resetForm();
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingItem(null);
        resetForm();
    };

    const getCategoriaLabel = (categoria) => {
        const categorias = {
            'general': 'General',
            'servicios': 'Servicios',
            'tecnico': 'Técnico',
            'cuenta': 'Cuenta'
        };
        return categorias[categoria] || categoria;
    };

    const getCategoriaColor = (categoria) => {
        const colores = {
            'general': 'info',
            'servicios': 'secondary',
            'tecnico': 'danger',
            'cuenta': 'dark'
        };
        return colores[categoria] || 'secondary';
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
                <Spinner animation="border" role="status" style={{ color: '#1E8546' }}>
                    <span className="visually-hidden">Cargando...</span>
                </Spinner>
            </div>
        );
    }

    return (
        <Container fluid>
            <Row className="mb-4">
                <Col>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '1rem'
                    }}>
                        <h2 style={{ color: '#1E8546', fontWeight: 'bold' }}>
                            Gestión de Preguntas Frecuentes
                        </h2>
                        <Button
                            onClick={handleShowModal}
                            style={{
                                backgroundColor: '#1E8546',
                                borderColor: '#1E8546'
                            }}
                        >
                            <FaPlus /> Nueva Pregunta
                        </Button>
                    </div>
                </Col>
            </Row>

            {error && (
                <Alert variant="danger" onClose={() => setError(null)} dismissible>
                    {error}
                </Alert>
            )}

            <Row>
                <Col>
                    <Card>
                        <Card.Body>
                            <Table responsive striped hover>
                                <thead>
                                    <tr>
                                        <th>Pregunta</th>
                                        <th>Categoría</th>
                                        <th>Estado</th>
                                        <th>Orden</th>
                                        <th>Fecha Creación</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {faqs.map((faq) => (
                                        <tr key={faq._id}>
                                            <td>
                                                <div>
                                                    <strong>{faq.pregunta}</strong>
                                                    <br />
                                                    <small style={{ color: '#666' }}>
                                                        {faq.respuesta.length > 100 
                                                            ? `${faq.respuesta.substring(0, 100)}...` 
                                                            : faq.respuesta
                                                        }
                                                    </small>
                                                </div>
                                            </td>
                                            <td>
                                                <Badge bg={getCategoriaColor(faq.categoria)}>
                                                    {getCategoriaLabel(faq.categoria)}
                                                </Badge>
                                            </td>
                                            <td>
                                                <Badge bg={faq.activo ? 'success' : 'secondary'}>
                                                    {faq.activo ? 'Activo' : 'Inactivo'}
                                                </Badge>
                                            </td>
                                            <td>{faq.orden}</td>
                                            <td>
                                                {new Date(faq.createdAt).toLocaleDateString('es-ES')}
                                            </td>
                                            <td>
                                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                    <Button
                                                        size="sm"
                                                        variant="outline-primary"
                                                        onClick={() => handleEdit(faq)}
                                                    >
                                                        <FaEdit />
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="outline-danger"
                                                        onClick={() => handleDelete(faq._id)}
                                                    >
                                                        <FaTrash />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>

                            {faqs.length === 0 && (
                                <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
                                    <p>No hay preguntas frecuentes registradas</p>
                                </div>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Modal para crear/editar */}
            <Modal show={showModal} onHide={handleCloseModal} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>
                        {editingItem ? 'Editar Pregunta Frecuente' : 'Nueva Pregunta Frecuente'}
                    </Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleSubmit}>
                    <Modal.Body>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Pregunta *</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={formData.pregunta}
                                        onChange={(e) => setFormData({...formData, pregunta: e.target.value})}
                                        required
                                        maxLength={200}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Categoría *</Form.Label>
                                    <Form.Select
                                        value={formData.categoria}
                                        onChange={(e) => setFormData({...formData, categoria: e.target.value})}
                                        required
                                    >
                                        <option value="general">General</option>
                                        <option value="servicios">Servicios</option>
                                        <option value="tecnico">Técnico</option>
                                        <option value="cuenta">Cuenta</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                        </Row>

                        <Form.Group className="mb-3">
                            <Form.Label>Respuesta *</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={6}
                                value={formData.respuesta}
                                onChange={(e) => setFormData({...formData, respuesta: e.target.value})}
                                required
                                maxLength={2000}
                            />
                            <Form.Text className="text-muted">
                                {formData.respuesta.length}/2000 caracteres
                            </Form.Text>
                        </Form.Group>

                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Orden</Form.Label>
                                    <Form.Control
                                        type="number"
                                        value={formData.orden}
                                        onChange={(e) => setFormData({...formData, orden: parseInt(e.target.value) || 0})}
                                        min="0"
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Check
                                        type="switch"
                                        id="activo-switch"
                                        label="Activo"
                                        checked={formData.activo}
                                        onChange={(e) => setFormData({...formData, activo: e.target.checked})}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseModal}>
                            Cancelar
                        </Button>
                        <Button 
                            type="submit"
                            style={{
                                backgroundColor: '#1E8546',
                                borderColor: '#1E8546'
                            }}
                        >
                            {editingItem ? 'Actualizar' : 'Crear'}
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </Container>
    );
};

export default FAQAdmin; 