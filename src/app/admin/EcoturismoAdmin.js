import React, { useState, useEffect } from 'react';
import {
    Container, Row, Col, Card, Button, Modal, Form,
    Alert, Spinner, Table, Badge, InputGroup
} from 'react-bootstrap';
import { FaPlus, FaEdit, FaTrash, FaEye, FaSearch, FaMountain } from 'react-icons/fa';

const EcoturismoAdmin = () => {
    const [ecoturismo, setEcoturismo] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [formData, setFormData] = useState({
        nombre: '',
        descripcion: '',
        ubicacion: '',
        coordenadas: {
            latitud: 0,
            longitud: 0
        },
        categoria: 'senderismo',
        dificultad: 'moderado',
        duracion: '',
        distancia: '',
        altitud: '',
        clima: '',
        mejor_epoca: '',
        equipamiento: [],
        servicios_disponibles: [],
        flora: '',
        fauna: '',
        imagenes: [],
        precio_entrada: 0,
        horarios: {
            apertura: '',
            cierre: ''
        },
        contacto: {
            telefono: '',
            email: '',
            sitio_web: ''
        },
        restricciones: '',
        recomendaciones: '',
        estado: 'activo',
        destacado: false,
        calificacion: 0,
        visitas: 0
    });

    const categorias = [
        { value: 'senderismo', label: 'Senderismo' },
        { value: 'cascadas', label: 'Cascadas' },
        { value: 'observacion_aves', label: 'Observación de Aves' },
        { value: 'camping', label: 'Camping' },
        { value: 'espeleologia', label: 'Espeleología' },
        { value: 'rafting', label: 'Rafting' },
        { value: 'ciclismo', label: 'Ciclismo' },
        { value: 'fotografia', label: 'Fotografía' }
    ];

    const dificultades = [
        { value: 'facil', label: 'Fácil' },
        { value: 'moderado', label: 'Moderado' },
        { value: 'dificil', label: 'Difícil' },
        { value: 'experto', label: 'Experto' }
    ];

    const estados = [
        { value: 'activo', label: 'Activo' },
        { value: 'inactivo', label: 'Inactivo' },
        { value: 'mantenimiento', label: 'Mantenimiento' }
    ];

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
        cargarEcoturismo();
    }, []);

    const cargarEcoturismo = async () => {
        try {
            setLoading(true);
            setError(null);

            const token = getToken();
            if (!token) {
                setError('No hay token de autenticación. Por favor, inicia sesión.');
                setLoading(false);
                return;
            }

            const response = await fetch('https://backend-iota-seven-19.vercel.app/api/ecoturismo/admin', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (data.success) {
                setEcoturismo(data.data);
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
                ? `https://backend-iota-seven-19.vercel.app/api/ecoturismo/admin/${editingItem._id}`
                : 'https://backend-iota-seven-19.vercel.app/api/ecoturismo/admin';
            
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
                cargarEcoturismo();
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
            nombre: item.nombre || '',
            descripcion: item.descripcion || '',
            ubicacion: item.ubicacion || '',
            coordenadas: item.coordenadas || { latitud: 0, longitud: 0 },
            categoria: item.categoria || 'senderismo',
            dificultad: item.dificultad || 'moderado',
            duracion: item.duracion || '',
            distancia: item.distancia || '',
            altitud: item.altitud || '',
            clima: item.clima || '',
            mejor_epoca: item.mejor_epoca || '',
            equipamiento: item.equipamiento || [],
            servicios_disponibles: item.servicios_disponibles || [],
            flora: item.flora || '',
            fauna: item.fauna || '',
            imagenes: item.imagenes || [],
            precio_entrada: item.precio_entrada || 0,
            horarios: item.horarios || { apertura: '', cierre: '' },
            contacto: item.contacto || { telefono: '', email: '', sitio_web: '' },
            restricciones: item.restricciones || '',
            recomendaciones: item.recomendaciones || '',
            estado: item.estado || 'activo',
            destacado: item.destacado || false,
            calificacion: item.calificacion || 0,
            visitas: item.visitas || 0
        });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('¿Estás seguro de que quieres eliminar este destino de ecoturismo?')) {
            return;
        }

        try {
            const token = getToken();
            if (!token) {
                setError('No hay token de autenticación. Por favor, inicia sesión.');
                return;
            }

            const response = await fetch(`https://backend-iota-seven-19.vercel.app/api/ecoturismo/admin/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (data.success) {
                cargarEcoturismo();
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
            nombre: '',
            descripcion: '',
            ubicacion: '',
            coordenadas: { latitud: 0, longitud: 0 },
            categoria: 'senderismo',
            dificultad: 'moderado',
            duracion: '',
            distancia: '',
            altitud: '',
            clima: '',
            mejor_epoca: '',
            equipamiento: [],
            servicios_disponibles: [],
            flora: '',
            fauna: '',
            imagenes: [],
            precio_entrada: 0,
            horarios: { apertura: '', cierre: '' },
            contacto: { telefono: '', email: '', sitio_web: '' },
            restricciones: '',
            recomendaciones: '',
            estado: 'activo',
            destacado: false,
            calificacion: 0,
            visitas: 0
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
        const cat = categorias.find(c => c.value === categoria);
        return cat ? cat.label : categoria;
    };

    const getCategoriaColor = (categoria) => {
        const colores = {
            'senderismo': 'success',
            'cascadas': 'info',
            'observacion_aves': 'warning',
            'camping': 'secondary',
            'espeleologia': 'dark',
            'rafting': 'danger',
            'ciclismo': 'primary',
            'fotografia': 'info'
        };
        return colores[categoria] || 'secondary';
    };

    const getDificultadColor = (dificultad) => {
        const colores = {
            'facil': 'success',
            'moderado': 'warning',
            'dificil': 'danger',
            'experto': 'dark'
        };
        return colores[dificultad] || 'secondary';
    };

    const getEstadoColor = (estado) => {
        const colores = {
            'activo': 'success',
            'inactivo': 'secondary',
            'mantenimiento': 'warning'
        };
        return colores[estado] || 'secondary';
    };

    const filtrarEcoturismo = () => {
        if (!searchTerm.trim()) return ecoturismo;
        
        const termino = searchTerm.toLowerCase();
        return ecoturismo.filter(item => 
            item.nombre.toLowerCase().includes(termino) ||
            item.ubicacion.toLowerCase().includes(termino) ||
            item.categoria.toLowerCase().includes(termino)
        );
    };

    const ecoturismoFiltrado = filtrarEcoturismo();

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
                            <FaMountain style={{ marginRight: '0.5rem' }} />
                            Gestión de Ecoturismo
                        </h2>
                        <Button
                            onClick={handleShowModal}
                            style={{
                                backgroundColor: '#1E8546',
                                borderColor: '#1E8546'
                            }}
                        >
                            <FaPlus /> Nuevo Destino
                        </Button>
                    </div>
                </Col>
            </Row>

            {error && (
                <Alert variant="danger" onClose={() => setError(null)} dismissible>
                    {error}
                </Alert>
            )}

            {/* Búsqueda */}
            <Row className="mb-4">
                <Col md={6}>
                    <InputGroup>
                        <Form.Control
                            type="search"
                            placeholder="Buscar destinos..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <Button variant="outline-secondary">
                            <FaSearch />
                        </Button>
                    </InputGroup>
                </Col>
            </Row>

            <Row>
                <Col>
                    <Card>
                        <Card.Body>
                            <Table responsive striped hover>
                                <thead>
                                    <tr>
                                        <th>Nombre</th>
                                        <th>Ubicación</th>
                                        <th>Categoría</th>
                                        <th>Dificultad</th>
                                        <th>Estado</th>
                                        <th>Destacado</th>
                                        <th>Calificación</th>
                                        <th>Visitas</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {ecoturismoFiltrado.map((item) => (
                                        <tr key={item._id}>
                                            <td>
                                                <div>
                                                    <strong>{item.nombre}</strong>
                                                    <br />
                                                    <small style={{ color: '#666' }}>
                                                        {item.descripcion.length > 100 
                                                            ? `${item.descripcion.substring(0, 100)}...` 
                                                            : item.descripcion
                                                        }
                                                    </small>
                                                </div>
                                            </td>
                                            <td>{item.ubicacion}</td>
                                            <td>
                                                <Badge bg={getCategoriaColor(item.categoria)}>
                                                    {getCategoriaLabel(item.categoria)}
                                                </Badge>
                                            </td>
                                            <td>
                                                <Badge bg={getDificultadColor(item.dificultad)}>
                                                    {item.dificultad}
                                                </Badge>
                                            </td>
                                            <td>
                                                <Badge bg={getEstadoColor(item.estado)}>
                                                    {item.estado}
                                                </Badge>
                                            </td>
                                            <td>
                                                <Badge bg={item.destacado ? 'warning' : 'secondary'}>
                                                    {item.destacado ? 'Sí' : 'No'}
                                                </Badge>
                                            </td>
                                            <td>
                                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                                    <span style={{ marginRight: '0.25rem' }}>⭐</span>
                                                    {item.calificacion.toFixed(1)}
                                                </div>
                                            </td>
                                            <td>{item.visitas}</td>
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

                            {ecoturismoFiltrado.length === 0 && (
                                <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
                                    <FaMountain style={{ fontSize: '3rem', color: '#ccc', marginBottom: '1rem' }} />
                                    <p>No hay destinos de ecoturismo registrados</p>
                                </div>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Modal para crear/editar */}
            <Modal show={showModal} onHide={handleCloseModal} size="xl">
                <Modal.Header closeButton>
                    <Modal.Title>
                        {editingItem ? 'Editar Destino de Ecoturismo' : 'Nuevo Destino de Ecoturismo'}
                    </Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleSubmit}>
                    <Modal.Body>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Nombre *</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={formData.nombre}
                                        onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                                        required
                                        maxLength={200}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Ubicación *</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={formData.ubicacion}
                                        onChange={(e) => setFormData({...formData, ubicacion: e.target.value})}
                                        required
                                        maxLength={300}
                                    />
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
                                maxLength={2000}
                            />
                        </Form.Group>

                        <Row>
                            <Col md={4}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Categoría *</Form.Label>
                                    <Form.Select
                                        value={formData.categoria}
                                        onChange={(e) => setFormData({...formData, categoria: e.target.value})}
                                        required
                                    >
                                        {categorias.map((categoria) => (
                                            <option key={categoria.value} value={categoria.value}>
                                                {categoria.label}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col md={4}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Dificultad *</Form.Label>
                                    <Form.Select
                                        value={formData.dificultad}
                                        onChange={(e) => setFormData({...formData, dificultad: e.target.value})}
                                        required
                                    >
                                        {dificultades.map((dificultad) => (
                                            <option key={dificultad.value} value={dificultad.value}>
                                                {dificultad.label}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col md={4}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Estado</Form.Label>
                                    <Form.Select
                                        value={formData.estado}
                                        onChange={(e) => setFormData({...formData, estado: e.target.value})}
                                    >
                                        {estados.map((estado) => (
                                            <option key={estado.value} value={estado.value}>
                                                {estado.label}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row>
                            <Col md={4}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Duración *</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={formData.duracion}
                                        onChange={(e) => setFormData({...formData, duracion: e.target.value})}
                                        required
                                        maxLength={100}
                                        placeholder="Ej: 2-3 horas"
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={4}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Distancia *</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={formData.distancia}
                                        onChange={(e) => setFormData({...formData, distancia: e.target.value})}
                                        required
                                        maxLength={100}
                                        placeholder="Ej: 5 km"
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={4}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Altitud</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={formData.altitud}
                                        onChange={(e) => setFormData({...formData, altitud: e.target.value})}
                                        maxLength={100}
                                        placeholder="Ej: 1,200 msnm"
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Clima</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={formData.clima}
                                        onChange={(e) => setFormData({...formData, clima: e.target.value})}
                                        maxLength={200}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Mejor Época</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={formData.mejor_epoca}
                                        onChange={(e) => setFormData({...formData, mejor_epoca: e.target.value})}
                                        maxLength={200}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Flora</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={3}
                                        value={formData.flora}
                                        onChange={(e) => setFormData({...formData, flora: e.target.value})}
                                        maxLength={500}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Fauna</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={3}
                                        value={formData.fauna}
                                        onChange={(e) => setFormData({...formData, fauna: e.target.value})}
                                        maxLength={500}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Restricciones</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={3}
                                        value={formData.restricciones}
                                        onChange={(e) => setFormData({...formData, restricciones: e.target.value})}
                                        maxLength={500}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Recomendaciones</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={3}
                                        value={formData.recomendaciones}
                                        onChange={(e) => setFormData({...formData, recomendaciones: e.target.value})}
                                        maxLength={500}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row>
                            <Col md={4}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Precio de Entrada</Form.Label>
                                    <Form.Control
                                        type="number"
                                        value={formData.precio_entrada}
                                        onChange={(e) => setFormData({...formData, precio_entrada: parseFloat(e.target.value) || 0})}
                                        min="0"
                                        step="0.01"
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={4}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Horario Apertura</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={formData.horarios.apertura}
                                        onChange={(e) => setFormData({
                                            ...formData, 
                                            horarios: {...formData.horarios, apertura: e.target.value}
                                        })}
                                        maxLength={50}
                                        placeholder="Ej: 8:00 AM"
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={4}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Horario Cierre</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={formData.horarios.cierre}
                                        onChange={(e) => setFormData({
                                            ...formData, 
                                            horarios: {...formData.horarios, cierre: e.target.value}
                                        })}
                                        maxLength={50}
                                        placeholder="Ej: 6:00 PM"
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row>
                            <Col md={4}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Teléfono</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={formData.contacto.telefono}
                                        onChange={(e) => setFormData({
                                            ...formData, 
                                            contacto: {...formData.contacto, telefono: e.target.value}
                                        })}
                                        maxLength={20}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={4}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control
                                        type="email"
                                        value={formData.contacto.email}
                                        onChange={(e) => setFormData({
                                            ...formData, 
                                            contacto: {...formData.contacto, email: e.target.value}
                                        })}
                                        maxLength={100}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={4}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Sitio Web</Form.Label>
                                    <Form.Control
                                        type="url"
                                        value={formData.contacto.sitio_web}
                                        onChange={(e) => setFormData({
                                            ...formData, 
                                            contacto: {...formData.contacto, sitio_web: e.target.value}
                                        })}
                                        maxLength={200}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Coordenadas - Latitud</Form.Label>
                                    <Form.Control
                                        type="number"
                                        value={formData.coordenadas.latitud}
                                        onChange={(e) => setFormData({
                                            ...formData, 
                                            coordenadas: {...formData.coordenadas, latitud: parseFloat(e.target.value) || 0}
                                        })}
                                        step="any"
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Coordenadas - Longitud</Form.Label>
                                    <Form.Control
                                        type="number"
                                        value={formData.coordenadas.longitud}
                                        onChange={(e) => setFormData({
                                            ...formData, 
                                            coordenadas: {...formData.coordenadas, longitud: parseFloat(e.target.value) || 0}
                                        })}
                                        step="any"
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Equipamiento (separado por comas)</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={formData.equipamiento.join(', ')}
                                        onChange={(e) => setFormData({
                                            ...formData, 
                                            equipamiento: e.target.value.split(',').map(item => item.trim()).filter(item => item)
                                        })}
                                        placeholder="Ej: Botas, Mochila, Agua"
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Servicios Disponibles (separado por comas)</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={formData.servicios_disponibles.join(', ')}
                                        onChange={(e) => setFormData({
                                            ...formData, 
                                            servicios_disponibles: e.target.value.split(',').map(item => item.trim()).filter(item => item)
                                        })}
                                        placeholder="Ej: Guía, Transporte, Alimentación"
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Imágenes (URLs separadas por comas)</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={formData.imagenes.join(', ')}
                                        onChange={(e) => setFormData({
                                            ...formData, 
                                            imagenes: e.target.value.split(',').map(item => item.trim()).filter(item => item)
                                        })}
                                        placeholder="https://ejemplo.com/imagen1.jpg, https://ejemplo.com/imagen2.jpg"
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Check
                                        type="switch"
                                        id="destacado-switch"
                                        label="Destacado"
                                        checked={formData.destacado}
                                        onChange={(e) => setFormData({...formData, destacado: e.target.checked})}
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

export default EcoturismoAdmin; 