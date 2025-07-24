import React, { useState, useEffect } from 'react';
import {
    Table, Button, Form, InputGroup, Badge, Container,
    Row, Col, Card, Spinner, Alert, Toast, Modal
} from 'react-bootstrap';
import {
    FaEye, FaInfoCircle,
    FaSearch, FaEdit, FaTrash, FaPlus, FaUser
} from 'react-icons/fa';
import axios from 'axios';
import { useAuth } from '../Navigation/AuthContext';

const Users = () => {
    // Estilos idénticos a ProductoRevision
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
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [toastVariant, setToastVariant] = useState("success");
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [userDetailLoading, setUserDetailLoading] = useState(false);

    const { currentUser } = useAuth();

    // Función de notificación idéntica
    const mostrarToast = (message, variant = "success") => {
        setToastMessage(message);
        setToastVariant(variant);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
    };

    // Cargar detalles del usuario
    const handleShowDetail = async (userId) => {
        try {
            setUserDetailLoading(true);
            const token = currentUser?.token;
            const response = await axios.get(`https://backend-iota-seven-19.vercel.app/api/usuarios/${userId}/detalles`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setSelectedUser(response.data);
            setShowDetailModal(true);
        } catch (error) {
            mostrarToast('Error al cargar detalles del usuario', 'danger');
        } finally {
            setUserDetailLoading(false);
        }
    };

        useEffect(() => {
        const fetchUsers = async () => {
            try {
                const token = currentUser?.token;
                const response = await axios.get('https://backend-iota-seven-19.vercel.app/api/usuarios', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setUsers(response.data);
            } catch (error) {
                setError('Error al cargar usuarios');
                mostrarToast('Error al cargar usuarios', 'danger');
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, [currentUser]);

    const filteredUsers = users.filter(user =>
        user.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
            {/* Toast Notification (idéntico) */}
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
                        <strong>Gestión de Usuarios</strong>
                    </h1>
                    <div style={{ width: '80px', height: '4px', backgroundColor: customStyles.secondary.backgroundColor, borderRadius: '2px' }}></div>
                </Col>
            </Row>

            {/* Búsqueda y botón */}
            <Card className="mb-4 shadow-sm">
                <Card.Body>
                    <Row className="align-items-center">
                        <Col md={8}>
                            <InputGroup>
                                <Form.Control
                                    type="search"
                                    placeholder="Buscar usuarios..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                <Button variant="outline-secondary" style={customStyles.secondary}>
                                    <FaSearch />
                                </Button>
                            </InputGroup>
                        </Col>
                        <Col md={4} className="d-flex justify-content-end">
                            <Button variant="primary" style={customStyles.primary}>
                                <FaPlus className="me-2" /> Nuevo Usuario
                            </Button>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>

            {/* Tabla de usuarios */}
            <Card className="shadow-sm">
                <Card.Body className="p-0">
                    <Table responsive hover className="mb-0">
                        <thead style={customStyles.secondary}>
                            <tr className="text-white">
                                <th>ID</th>
                                <th>Usuario</th>
                                <th>Email</th>
                                <th className="text-center">Rol</th>
                                <th className="text-center">Estado</th>
                                <th className="text-center">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.length > 0 ? (
                                filteredUsers.map((user) => (
                                    <tr key={user._id}>
                                        <td>{user._id.substring(0, 8)}...</td>
                                        <td>
                                            <div className="d-flex align-items-center">
                                                <div
                                                    className="rounded-circle d-flex align-items-center justify-content-center me-2"
                                                    style={{
                                                        width: '36px',
                                                        height: '36px',
                                                        backgroundColor: customStyles.info.backgroundColor,
                                                        color: 'white'
                                                    }}
                                                >
                                                    <FaUser />
                                                </div>
                                                {user.nombre}
                                            </div>
                                        </td>
                                        <td>{user.email}</td>
                                        <td className="text-center">
                                            <Badge pill style={customStyles.warning}>
                                                {user.rol}
                                            </Badge>
                                        </td>
                                        <td className="text-center">
                                            <Badge pill style={user.estado === 'activo' ? customStyles.success : { backgroundColor: '#6c757d' }}>
                                                {user.estado}
                                            </Badge>
                                        </td>
                                        <td className="text-center">
                                            <Button
                                                variant="outline-primary"
                                                size="sm"
                                                className="me-2"
                                                style={{ borderColor: customStyles.info.backgroundColor, color: customStyles.info.backgroundColor }}
                                                onClick={() => handleShowDetail(user._id)}
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
                                        <h5>No se encontraron usuarios</h5>
                                        <p className="text-muted">No hay usuarios que coincidan con tu búsqueda</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>

            {/* Modal de Detalles (estilo idéntico) */}
            <Modal show={showDetailModal} onHide={() => setShowDetailModal(false)} size="lg" centered>
                <Modal.Header closeButton style={customStyles.secondary}>
                    <Modal.Title className="text-white">Detalles del Usuario</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {userDetailLoading ? (
                        <div className="text-center py-4">
                            <Spinner animation="border" style={{ color: customStyles.primary.backgroundColor }} />
                        </div>
                    ) : selectedUser ? (
                        <Row>
                            <Col md={4}>
                                <Card className="mb-4 text-center">
                                    <Card.Header style={customStyles.primary} className="text-white">
                                        <FaUser className="me-2" /> Perfil
                                    </Card.Header>
                                    <Card.Body>
                                        <div
                                            className="rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3"
                                            style={{
                                                width: '120px',
                                                height: '120px',
                                                backgroundColor: customStyles.info.backgroundColor,
                                                color: 'white',
                                                fontSize: '2.5rem'
                                            }}
                                        >
                                            <FaUser />
                                        </div>
                                        <h4>{selectedUser.nombre}</h4>
                                        <Badge
                                            pill
                                            style={selectedUser.estado === 'activo' ? customStyles.success : { backgroundColor: '#6c757d' }}
                                            className="mb-2"
                                        >
                                            {selectedUser.estado}
                                        </Badge>
                                        <p className="text-muted">{selectedUser.rol}</p>
                                    </Card.Body>
                                </Card>

                                <Card>
                                    <Card.Header style={customStyles.primary} className="text-white">
                                        <FaInfoCircle className="me-2" /> Contacto
                                    </Card.Header>
                                    <Card.Body>
                                        <p><strong>Email:</strong> {selectedUser.email}</p>
                                        <p><strong>Teléfono:</strong> {selectedUser.telefono || 'N/A'}</p>
                                        <p><strong>Dirección:</strong> {selectedUser.direccion || 'N/A'}</p>
                                    </Card.Body>
                                </Card>
                            </Col>

                            <Col md={8}>
                                <Card className="mb-4">
                                    <Card.Header style={customStyles.primary} className="text-white">
                                        <FaInfoCircle className="me-2" /> Información
                                    </Card.Header>
                                    <Card.Body>
                                        <Row>
                                            <Col md={6}>
                                                <div className="mb-3">
                                                    <h6 className="text-muted">ID</h6>
                                                    <p>{selectedUser._id}</p>
                                                </div>
                                                <div className="mb-3">
                                                    <h6 className="text-muted">Registrado el</h6>
                                                    <p>{new Date(selectedUser.createdAt).toLocaleDateString()}</p>
                                                </div>
                                            </Col>
                                            <Col md={6}>
                                                <div className="mb-3">
                                                    <h6 className="text-muted">Documento</h6>
                                                    <p>{selectedUser.documento || 'N/A'}</p>
                                                </div>
                                                <div className="mb-3">
                                                    <h6 className="text-muted">Tipo de documento</h6>
                                                    <p>{selectedUser.tipoDocumento || 'N/A'}</p>
                                                </div>
                                            </Col>
                                        </Row>
                                    </Card.Body>
                                </Card>

                                {selectedUser.rol === 'artesano' && (
                                    <Card className="mb-4">
                                        <Card.Header style={customStyles.primary} className="text-white">
                                            <FaInfoCircle className="me-2" /> Información de Artesano
                                        </Card.Header>
                                        <Card.Body>
                                            <div className="mb-3">
                                                <h6 className="text-muted">Biografía</h6>
                                                <p>{selectedUser.biografia || 'No disponible'}</p>
                                            </div>
                                            <div className="mb-3">
                                                <h6 className="text-muted">Técnicas</h6>
                                                <p>{selectedUser.tecnicas?.join(', ') || 'N/A'}</p>
                                            </div>
                                            <div>
                                                <h6 className="text-muted">Experiencia</h6>
                                                <p>{selectedUser.experiencia || 'N/A'}</p>
                                            </div>
                                        </Card.Body>
                                    </Card>
                                )}

                                <Card>
                                    <Card.Header style={customStyles.primary} className="text-white">
                                        <FaInfoCircle className="me-2" /> Estadísticas
                                    </Card.Header>
                                    <Card.Body>
                                        <Row>
                                            <Col md={6}>
                                                <div className="mb-3">
                                                    <h6 className="text-muted">Productos creados</h6>
                                                    <p>{selectedUser.productosCount || 0}</p>
                                                </div>
                                                <div>
                                                    <h6 className="text-muted">Pedidos realizados</h6>
                                                    <p>{selectedUser.pedidosCount || 0}</p>
                                                </div>
                                            </Col>
                                            <Col md={6}>
                                                <div className="mb-3">
                                                    <h6 className="text-muted">Valoraciones</h6>
                                                    <p>{selectedUser.rating || 'N/A'}</p>
                                                </div>
                                                <div>
                                                    <h6 className="text-muted">Miembro desde</h6>
                                                    <p>{new Date(selectedUser.createdAt).toLocaleDateString()}</p>
                                                </div>
                                            </Col>
                                        </Row>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                    ) : (
                        <Alert variant="danger">No se pudieron cargar los detalles del usuario</Alert>
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

export default Users;