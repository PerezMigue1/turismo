// src/components/admin/AdminDashboard.js
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Badge, Button, Form } from 'react-bootstrap';
import { FaUsers, FaEdit, FaTrash, FaSearch, FaSync } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [filtro, setFiltro] = useState({
        rol: '',
        search: ''
    });
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Estilos basados en tu paleta de colores
    const styles = {
        primaryColor: '#9A1E47', // Rojo Guinda
        secondaryColor: '#0FA89C', // Turquesa Agua
        successColor: '#1E8546', // Verde Bosque
        warningColor: '#F28B27', // Naranja Sol
        infoColor: '#50C2C4', // Aqua Claro
        dangerColor: '#D24D1C', // Rojo Naranja Tierra
        lightColor: '#FDF2E0', // Beige Claro
        oliveColor: '#A0C070' // Verde Oliva Claro
    };

    useEffect(() => {
        cargarUsuarios();
    }, []);

    const cargarUsuarios = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/usuarios', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            setUsuarios(data);
            setLoading(false);
        } catch (error) {
            console.error('Error al cargar usuarios:', error);
            setLoading(false);
        }
    };

    const filtrarUsuarios = () => {
        return usuarios.filter(usuario => {
            const cumpleRol = !filtro.rol || usuario.rol === filtro.rol;
            const cumpleBusqueda = !filtro.search || 
                usuario.nombre.toLowerCase().includes(filtro.search.toLowerCase()) ||
                usuario.email.toLowerCase().includes(filtro.search.toLowerCase());
            return cumpleRol && cumpleBusqueda;
        });
    };

    const cambiarRol = async (id, nuevoRol) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:5000/api/usuarios/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ rol: nuevoRol })
            });
            
            if (response.ok) {
                cargarUsuarios();
            } else {
                alert('Error al actualizar el rol');
            }
        } catch (error) {
            console.error('Error al cambiar rol:', error);
        }
    };

    const eliminarUsuario = async (id) => {
        if (window.confirm('¿Estás seguro de eliminar este usuario?')) {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`http://localhost:5000/api/usuarios/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                
                if (response.ok) {
                    cargarUsuarios();
                } else {
                    alert('Error al eliminar el usuario');
                }
            } catch (error) {
                console.error('Error al eliminar usuario:', error);
            }
        }
    };

    return (
        <Container fluid style={{ 
            backgroundColor: styles.lightColor, 
            minHeight: '100vh',
            padding: '20px'
        }}>
            <Row className="mb-4">
                <Col>
                    <h2 style={{ color: styles.primaryColor }}>
                        <FaUsers className="me-2" /> Panel de Administración
                    </h2>
                </Col>
            </Row>

            {/* Estadísticas rápidas */}
            <Row className="mb-4">
                <Col md={3}>
                    <Card style={{ 
                        backgroundColor: styles.primaryColor, 
                        color: 'white',
                        border: 'none'
                    }}>
                        <Card.Body>
                            <Card.Title>Total Usuarios</Card.Title>
                            <Card.Text className="display-6">
                                {usuarios.length}
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={3}>
                    <Card style={{ 
                        backgroundColor: styles.secondaryColor, 
                        color: 'white',
                        border: 'none'
                    }}>
                        <Card.Body>
                            <Card.Title>Administradores</Card.Title>
                            <Card.Text className="display-6">
                                {usuarios.filter(u => u.rol === 'admin').length}
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={3}>
                    <Card style={{ 
                        backgroundColor: styles.successColor, 
                        color: 'white',
                        border: 'none'
                    }}>
                        <Card.Body>
                            <Card.Title>Miembros</Card.Title>
                            <Card.Text className="display-6">
                                {usuarios.filter(u => u.rol === 'miembro').length}
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={3}>
                    <Card style={{ 
                        backgroundColor: styles.warningColor, 
                        color: 'white',
                        border: 'none'
                    }}>
                        <Card.Body>
                            <Card.Title>Turistas</Card.Title>
                            <Card.Text className="display-6">
                                {usuarios.filter(u => u.rol === 'turista').length}
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Filtros */}
            <Card className="mb-4" style={{ backgroundColor: 'white' }}>
                <Card.Body>
                    <Row>
                        <Col md={4}>
                            <Form.Group>
                                <Form.Label>Filtrar por rol</Form.Label>
                                <Form.Select 
                                    value={filtro.rol}
                                    onChange={(e) => setFiltro({...filtro, rol: e.target.value})}
                                    style={{ borderColor: styles.infoColor }}
                                >
                                    <option value="">Todos los roles</option>
                                    <option value="admin">Administradores</option>
                                    <option value="miembro">Miembros</option>
                                    <option value="turista">Turistas</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group>
                                <Form.Label>Buscar usuario</Form.Label>
                                <div className="d-flex">
                                    <Form.Control
                                        type="text"
                                        placeholder="Nombre o email"
                                        value={filtro.search}
                                        onChange={(e) => setFiltro({...filtro, search: e.target.value})}
                                        style={{ borderColor: styles.infoColor }}
                                    />
                                    <Button 
                                        variant="outline-secondary" 
                                        style={{ 
                                            marginLeft: '10px',
                                            borderColor: styles.infoColor,
                                            color: styles.primaryColor
                                        }}
                                    >
                                        <FaSearch />
                                    </Button>
                                </div>
                            </Form.Group>
                        </Col>
                        <Col md={2} className="d-flex align-items-end">
                            <Button 
                                onClick={cargarUsuarios}
                                style={{ 
                                    backgroundColor: styles.primaryColor,
                                    border: 'none'
                                }}
                            >
                                <FaSync className="me-1" /> Actualizar
                            </Button>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>

            {/* Tabla de usuarios */}
            <Card style={{ backgroundColor: 'white' }}>
                <Card.Body>
                    {loading ? (
                        <div className="text-center py-5">
                            <div className="spinner-border" style={{ color: styles.primaryColor }} role="status">
                                <span className="visually-hidden">Cargando...</span>
                            </div>
                        </div>
                    ) : (
                        <Table striped hover responsive>
                            <thead>
                                <tr>
                                    <th>Nombre</th>
                                    <th>Email</th>
                                    <th>Teléfono</th>
                                    <th>Rol</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtrarUsuarios().map(usuario => (
                                    <tr key={usuario._id}>
                                        <td>{usuario.nombre}</td>
                                        <td>{usuario.email}</td>
                                        <td>{usuario.telefono}</td>
                                        <td>
                                            <Badge 
                                                pill 
                                                style={{ 
                                                    backgroundColor: 
                                                        usuario.rol === 'admin' ? styles.primaryColor :
                                                        usuario.rol === 'miembro' ? styles.successColor :
                                                        styles.warningColor
                                                }}
                                            >
                                                {usuario.rol}
                                            </Badge>
                                        </td>
                                        <td>
                                            <Button 
                                                variant="outline-primary" 
                                                size="sm" 
                                                className="me-2"
                                                onClick={() => navigate(`/admin/usuarios/editar/${usuario._id}`)}
                                                style={{ 
                                                    borderColor: styles.infoColor,
                                                    color: styles.primaryColor
                                                }}
                                            >
                                                <FaEdit />
                                            </Button>
                                            <Button 
                                                variant="outline-danger" 
                                                size="sm"
                                                onClick={() => eliminarUsuario(usuario._id)}
                                                style={{ 
                                                    borderColor: styles.dangerColor,
                                                    color: styles.dangerColor
                                                }}
                                            >
                                                <FaTrash />
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    )}
                </Card.Body>
            </Card>
        </Container>
    );
};

export default AdminDashboard;