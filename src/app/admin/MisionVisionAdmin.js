import React, { useState, useEffect } from 'react';
import {
    Container, Row, Col, Card, Button, Modal, Form,
    Alert, Spinner, Table, Badge
} from 'react-bootstrap';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';

const MisionVisionAdmin = () => {
    const [misionVision, setMisionVision] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [formData, setFormData] = useState({
        titulo: '',
        descripcion: '',
        tipo: 'mision',
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
        cargarMisionVision();
    }, []);

    const cargarMisionVision = async () => {
        try {
            setLoading(true);
            setError(null);

            const token = getToken();
            if (!token) {
                setError('No hay token de autenticación. Por favor, inicia sesión.');
                setLoading(false);
                return;
            }

            const response = await fetch('https://backend-iota-seven-19.vercel.app/api/misionvision/admin', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (data.success) {
                setMisionVision(data.data);
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
                ? `https://backend-iota-seven-19.vercel.app/api/misionvision/admin/${editingItem._id}`
                : 'https://backend-iota-seven-19.vercel.app/api/misionvision/admin';
            
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
                cargarMisionVision();
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
            titulo: item.titulo,
            descripcion: item.descripcion,
            tipo: item.tipo,
            activo: item.activo,
            orden: item.orden
        });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('¿Estás seguro de que quieres eliminar este elemento?')) {
            return;
        }

        try {
            const token = getToken();
            if (!token) {
                setError('No hay token de autenticación. Por favor, inicia sesión.');
                return;
            }

            const response = await fetch(`https://backend-iota-seven-19.vercel.app/api/misionvision/admin/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (data.success) {
                cargarMisionVision();
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
            titulo: '',
            descripcion: '',
            tipo: 'mision',
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

    const getTipoLabel = (tipo) => {
        return tipo === 'mision' ? 'Misión' : 'Visión';
    };

    const getTipoColor = (tipo) => {
        return tipo === 'mision' ? 'primary' : 'success';
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
                                Gestión de Misión y Visión
                            </h2>
                            <Button
                                onClick={handleShowModal}
                                style={{
                                    backgroundColor: '#1E8546',
                                    borderColor: '#1E8546'
                                }}
                            >
                                <FaPlus /> Nueva Misión/Visión
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
                                            <th>Título</th>
                                            <th>Tipo</th>
                                            <th>Estado</th>
                                            <th>Orden</th>
                                            <th>Fecha Creación</th>
                                            <th>Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {misionVision.map((item) => (
                                            <tr key={item._id}>
                                                <td>
                                                    <div>
                                                        <strong>{item.titulo}</strong>
                                                        <br />
                                                        <small style={{ color: '#666' }}>
                                                            {item.descripcion.length > 100 
                                                                ? `${item.descripcion.substring(0, 100)}...` 
                                                                : item.descripcion
                                                            }
                                                        </small>
                                                    </div>
                                                </td>
                                                <td>
                                                    <Badge bg={getTipoColor(item.tipo)}>
                                                        {getTipoLabel(item.tipo)}
                                                    </Badge>
                                                </td>
                                                <td>
                                                    <Badge bg={item.activo ? 'success' : 'secondary'}>
                                                        {item.activo ? 'Activo' : 'Inactivo'}
                                                    </Badge>
                                                </td>
                                                <td>{item.orden}</td>
                                                <td>
                                                    {new Date(item.createdAt).toLocaleDateString('es-ES')}
                                                </td>
                                                <td>
                                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                        <Button
                                                            size="sm"
                                                            variant="outline-primary"
                                                            onClick={() => handleEdit(item)}
                                                        >
                                                            <FaEdit />
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="outline-danger"
                                                            onClick={() => handleDelete(item._id)}
                                                        >
                                                            <FaTrash />
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>

                                {misionVision.length === 0 && (
                                    <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
                                        <p>No hay elementos de misión o visión registrados</p>
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
                            {editingItem ? 'Editar Misión/Visión' : 'Nueva Misión/Visión'}
                        </Modal.Title>
                    </Modal.Header>
                    <Form onSubmit={handleSubmit}>
                        <Modal.Body>
                            <Row>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Título *</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={formData.titulo}
                                            onChange={(e) => setFormData({...formData, titulo: e.target.value})}
                                            required
                                            maxLength={100}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Tipo *</Form.Label>
                                        <Form.Select
                                            value={formData.tipo}
                                            onChange={(e) => setFormData({...formData, tipo: e.target.value})}
                                            required
                                        >
                                            <option value="mision">Misión</option>
                                            <option value="vision">Visión</option>
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Form.Group className="mb-3">
                                <Form.Label>Descripción *</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={4}
                                    value={formData.descripcion}
                                    onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
                                    required
                                    maxLength={1000}
                                />
                                <Form.Text className="text-muted">
                                    {formData.descripcion.length}/1000 caracteres
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

export default MisionVisionAdmin; 