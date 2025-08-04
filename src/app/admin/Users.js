import React, { useState, useEffect } from 'react';
import {
    Table, Button, Form, InputGroup, Badge, Container,
    Row, Col, Card, Spinner, Alert, Toast, Modal
} from 'react-bootstrap';
import {
    FaEye, FaInfoCircle,
    FaSearch, FaEdit, FaTrash, FaPlus, FaUser
} from 'react-icons/fa';

const Users = () => {
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
    
    // Estados para editar/eliminar
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deletingUser, setDeletingUser] = useState(null);
    const [editLoading, setEditLoading] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);

    // Función de notificación
    const mostrarToast = (message, variant = "success") => {
        setToastMessage(message);
        setToastVariant(variant);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
    };

    // Cargar usuarios
        useEffect(() => {
        const fetchUsers = async () => {
            try {
                setLoading(true);
                setError(null);

                const response = await fetch('https://backend-iota-seven-19.vercel.app/api/usuarios', {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();

                // La API devuelve directamente el array de usuarios
                if (Array.isArray(data)) {
                    setUsers(data);
                } else {
                    setError('Formato de respuesta inválido');
                    mostrarToast('Error al cargar usuarios', 'danger');
                }
            } catch (error) {
                console.error('Error fetching users:', error);
                setError('Error de conexión: ' + error.message);
                mostrarToast('Error al cargar usuarios', 'danger');
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    // Cargar detalles del usuario
    const handleShowDetail = async (userId) => {
        try {
            setUserDetailLoading(true);

            const response = await fetch(`https://backend-iota-seven-19.vercel.app/api/usuarios/${userId}`, {
                headers: { 
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            if (data) {
                setSelectedUser(data);
                setShowDetailModal(true);
            } else {
                mostrarToast('Error al cargar detalles del usuario', 'danger');
            }
        } catch (error) {
            console.error('Error fetching user details:', error);
            mostrarToast('Error al cargar detalles del usuario', 'danger');
        } finally {
            setUserDetailLoading(false);
        }
    };

    // Función para abrir modal de edición
    const handleEdit = (user) => {
        // Asegurar que el usuario tenga un array de roles
        const userWithRoles = {
            ...user,
            rol: Array.isArray(user.rol) ? user.rol : [user.rol || 'turista']
        };
        setEditingUser(userWithRoles);
        setShowEditModal(true);
    };

    // Función para guardar cambios del usuario
    const handleSaveEdit = async () => {
        try {
            setEditLoading(true);
            
            // Validar que al menos un rol esté seleccionado
            if (!editingUser.rol || editingUser.rol.length === 0) {
                mostrarToast('Debe seleccionar al menos un rol', 'danger');
                setEditLoading(false);
                return;
            }
            
            // Asegurar que roles sea siempre un array
            const userDataToSend = {
                ...editingUser,
                rol: Array.isArray(editingUser.rol) ? editingUser.rol : [editingUser.rol || 'turista']
            };
            
            const response = await fetch(`https://backend-iota-seven-19.vercel.app/api/usuarios/${editingUser._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userDataToSend)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            
            if (data.message) {
                mostrarToast('Usuario actualizado correctamente', 'success');
                setShowEditModal(false);
                setEditingUser(null);
                // Recargar usuarios sin recargar la página
                const updatedUsers = users.map(user => 
                    user._id === editingUser._id ? { ...user, ...userDataToSend } : user
                );
                setUsers(updatedUsers);
            } else {
                throw new Error('Error al actualizar usuario');
            }
        } catch (error) {
            console.error('Error updating user:', error);
            mostrarToast('Error al actualizar usuario: ' + error.message, 'danger');
        } finally {
            setEditLoading(false);
        }
    };

    // Función para abrir modal de eliminación
    const handleDelete = (user) => {
        setDeletingUser(user);
        setShowDeleteModal(true);
    };

    // Función para confirmar eliminación
    const handleConfirmDelete = async () => {
        try {
            setDeleteLoading(true);
            
            const response = await fetch(`https://backend-iota-seven-19.vercel.app/api/usuarios/${deletingUser._id}`, {
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
                mostrarToast('Usuario eliminado correctamente', 'success');
                setShowDeleteModal(false);
                setDeletingUser(null);
                // Recargar usuarios sin recargar la página
                const updatedUsers = users.filter(user => user._id !== deletingUser._id);
                setUsers(updatedUsers);
            } else {
                throw new Error('Error al eliminar usuario');
            }
        } catch (error) {
            console.error('Error deleting user:', error);
            mostrarToast('Error al eliminar usuario: ' + error.message, 'danger');
        } finally {
            setDeleteLoading(false);
        }
    };

    // Filtrar usuarios
    const filteredUsers = users.filter(user =>
        (user.nombre && user.nombre.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase()))
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
                                        <td>{user._id ? user._id.substring(0, 8) + '...' : 'N/A'}</td>
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
                                                {user.nombre || 'Sin nombre'}
                                            </div>
                                        </td>
                                        <td>{user.email || 'N/A'}</td>
                                        <td className="text-center">
                                            <div>
                                                {Array.isArray(user.rol) ? (
                                                    user.rol.map((rol, index) => (
                                                        <Badge 
                                                            key={index} 
                                                            pill 
                                                            style={customStyles.warning}
                                                            className="me-1 mb-1"
                                                        >
                                                            {rol}
                                                        </Badge>
                                                    ))
                                                ) : (
                                                    <Badge pill style={customStyles.warning}>
                                                        {user.rol || 'usuario'}
                                                    </Badge>
                                                )}
                                            </div>
                                        </td>
                                        <td className="text-center">
                                            <Badge pill style={user.estado === 'activo' ? customStyles.success : { backgroundColor: '#6c757d' }}>
                                                {user.estado || 'activo'}
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
                                                onClick={() => handleEdit(user)}
                                            >
                                                <FaEdit />
                                            </Button>
                                            <Button
                                                variant="outline-danger"
                                                size="sm"
                                                style={{ borderColor: customStyles.danger.backgroundColor, color: customStyles.danger.backgroundColor }}
                                                onClick={() => handleDelete(user)}
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

            {/* Modal de Detalles */}
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
                                        <h4>{selectedUser.nombre || 'Sin nombre'}</h4>
                                        <Badge
                                            pill
                                            style={selectedUser.estado === 'activo' ? customStyles.success : { backgroundColor: '#6c757d' }}
                                            className="mb-2"
                                        >
                                            {selectedUser.estado || 'activo'}
                                        </Badge>
                                        <div className="mb-2">
                                            {Array.isArray(selectedUser.rol) ? (
                                                selectedUser.rol.map((rol, index) => (
                                                    <Badge 
                                                        key={index} 
                                                        pill 
                                                        style={customStyles.warning}
                                                        className="me-1 mb-1"
                                                    >
                                                        {rol}
                                                    </Badge>
                                                ))
                                            ) : (
                                                <Badge pill style={customStyles.warning}>
                                                    {selectedUser.rol || 'usuario'}
                                                </Badge>
                                            )}
                                        </div>
                                    </Card.Body>
                                </Card>

                                <Card>
                                    <Card.Header style={customStyles.primary} className="text-white">
                                        <FaInfoCircle className="me-2" /> Contacto
                                    </Card.Header>
                                    <Card.Body>
                                        <p><strong>Email:</strong> {selectedUser.email || 'N/A'}</p>
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
                                                    <p>{selectedUser._id || 'N/A'}</p>
                                                </div>
                                                <div className="mb-3">
                                                    <h6 className="text-muted">Registrado el</h6>
                                                    <p>{selectedUser.createdAt ? new Date(selectedUser.createdAt).toLocaleDateString() : 'N/A'}</p>
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
                                                <p>{selectedUser.tecnicas ? selectedUser.tecnicas.join(', ') : 'N/A'}</p>
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
                                                    <p>{selectedUser.createdAt ? new Date(selectedUser.createdAt).toLocaleDateString() : 'N/A'}</p>
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

            {/* Modal de Edición */}
            <Modal show={showEditModal} onHide={() => setShowEditModal(false)} size="lg" centered>
                <Modal.Header closeButton style={customStyles.primary} className="text-white">
                    <Modal.Title><FaEdit className="me-2" /> Editar Usuario</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {editingUser && (
                        <Form>
                            <Row>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Nombre</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={editingUser.nombre || ''}
                                            onChange={(e) => setEditingUser({...editingUser, nombre: e.target.value})}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Email</Form.Label>
                                        <Form.Control
                                            type="email"
                                            value={editingUser.email || ''}
                                            onChange={(e) => setEditingUser({...editingUser, email: e.target.value})}
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Teléfono</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={editingUser.telefono || ''}
                                            onChange={(e) => setEditingUser({...editingUser, telefono: e.target.value})}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Edad</Form.Label>
                                        <Form.Control
                                            type="number"
                                            value={editingUser.edad || ''}
                                            onChange={(e) => setEditingUser({...editingUser, edad: parseInt(e.target.value)})}
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Sexo</Form.Label>
                                        <Form.Select
                                            value={editingUser.sexo || 'Masculino'}
                                            onChange={(e) => setEditingUser({...editingUser, sexo: e.target.value})}
                                        >
                                            <option value="Masculino">Masculino</option>
                                            <option value="Femenino">Femenino</option>
                                            <option value="Otro">Otro</option>
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Roles</Form.Label>
                                        <div>
                                            {['turista', 'artesano', 'hospedero', 'chef', 'restaurante', 'admin'].map((rol) => (
                                                <Form.Check
                                                    key={rol}
                                                    type="checkbox"
                                                    id={`rol-${rol}`}
                                                    label={rol.charAt(0).toUpperCase() + rol.slice(1)}
                                                    checked={editingUser.rol ? editingUser.rol.includes(rol) : false}
                                                    onChange={(e) => {
                                                        const currentRoles = editingUser.rol || [];
                                                        if (e.target.checked) {
                                                            setEditingUser({
                                                                ...editingUser,
                                                                rol: [...currentRoles, rol]
                                                            });
                                                        } else {
                                                            setEditingUser({
                                                                ...editingUser,
                                                                rol: currentRoles.filter(r => r !== rol)
                                                            });
                                                        }
                                                    }}
                                                />
                                            ))}
                                        </div>
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Form.Group className="mb-3">
                                <Form.Label>Dirección</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={editingUser.direccion || ''}
                                    onChange={(e) => setEditingUser({...editingUser, direccion: e.target.value})}
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
                    {deletingUser && (
                        <div className="text-center">
                            <FaTrash size={48} style={{ color: customStyles.danger.backgroundColor }} className="mb-3" />
                            <h5>¿Estás seguro de que quieres eliminar este usuario?</h5>
                            <p className="text-muted">
                                <strong>{deletingUser.nombre}</strong> ({deletingUser.email})
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

export default Users;