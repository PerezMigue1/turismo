// src/components/admin/EditarUsuario.js
import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Alert, Row, Col, Card } from 'react-bootstrap';
import { FaArrowLeft, FaSave } from 'react-icons/fa';
import { useNavigate, useParams } from 'react-router-dom';

const EditarUsuario = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [usuario, setUsuario] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    
    // Estilos basados en tu paleta
    const styles = {
        primaryColor: '#9A1E47',
        secondaryColor: '#0FA89C',
        lightColor: '#FDF2E0'
    };

    useEffect(() => {
        const cargarUsuario = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`http://localhost:5000/api/usuarios/${id}/perfil`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const data = await response.json();
                setUsuario(data);
                setLoading(false);
            } catch (error) {
                console.error('Error al cargar usuario:', error);
                setError('Error al cargar los datos del usuario');
                setLoading(false);
            }
        };

        cargarUsuario();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:5000/api/usuarios/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(usuario)
            });

            if (response.ok) {
                setSuccess('Usuario actualizado correctamente');
                setTimeout(() => {
                    navigate('/admin/usuarios');
                }, 1500);
            } else {
                const errorData = await response.json();
                setError(errorData.message || 'Error al actualizar el usuario');
            }
        } catch (error) {
            console.error('Error al actualizar usuario:', error);
            setError('Error de conexión con el servidor');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUsuario(prev => ({
            ...prev,
            [name]: value
        }));
    };

    if (loading) {
        return (
            <Container style={{ backgroundColor: styles.lightColor, minHeight: '100vh', padding: '20px' }}>
                <div className="text-center py-5">
                    <div className="spinner-border" style={{ color: styles.primaryColor }} role="status">
                        <span className="visually-hidden">Cargando...</span>
                    </div>
                </div>
            </Container>
        );
    }

    if (!usuario) {
        return (
            <Container style={{ backgroundColor: styles.lightColor, minHeight: '100vh', padding: '20px' }}>
                <Alert variant="danger">Usuario no encontrado</Alert>
            </Container>
        );
    }

    return (
        <Container style={{ backgroundColor: styles.lightColor, minHeight: '100vh', padding: '20px' }}>
            <Button 
                variant="outline-secondary" 
                onClick={() => navigate('/admin/usuarios')}
                className="mb-4"
                style={{ borderColor: styles.secondaryColor, color: styles.primaryColor }}
            >
                <FaArrowLeft className="me-2" /> Volver
            </Button>

            <Card style={{ backgroundColor: 'white' }}>
                <Card.Body>
                    <h3 style={{ color: styles.primaryColor }}>Editar Usuario</h3>
                    
                    {error && <Alert variant="danger">{error}</Alert>}
                    {success && <Alert variant="success">{success}</Alert>}

                    <Form onSubmit={handleSubmit}>
                        <Row className="mb-3">
                            <Col md={6}>
                                <Form.Group controlId="nombre">
                                    <Form.Label>Nombre</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="nombre"
                                        value={usuario.nombre || ''}
                                        onChange={handleChange}
                                        required
                                        style={{ borderColor: styles.secondaryColor }}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group controlId="email">
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control
                                        type="email"
                                        name="email"
                                        value={usuario.email || ''}
                                        onChange={handleChange}
                                        required
                                        disabled
                                        style={{ borderColor: styles.secondaryColor }}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row className="mb-3">
                            <Col md={6}>
                                <Form.Group controlId="telefono">
                                    <Form.Label>Teléfono</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="telefono"
                                        value={usuario.telefono || ''}
                                        onChange={handleChange}
                                        required
                                        style={{ borderColor: styles.secondaryColor }}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group controlId="rol">
                                    <Form.Label>Rol</Form.Label>
                                    <Form.Select
                                        name="rol"
                                        value={usuario.rol || 'turista'}
                                        onChange={handleChange}
                                        required
                                        style={{ borderColor: styles.secondaryColor }}
                                    >
                                        <option value="admin">Administrador</option>
                                        <option value="miembro">Miembro</option>
                                        <option value="turista">Turista</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                        </Row>

                        <div className="d-flex justify-content-end mt-4">
                            <Button 
                                type="submit" 
                                style={{ 
                                    backgroundColor: styles.primaryColor, 
                                    border: 'none' 
                                }}
                            >
                                <FaSave className="me-2" /> Guardar Cambios
                            </Button>
                        </div>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default EditarUsuario;