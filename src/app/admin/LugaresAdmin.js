import React, { useState, useEffect, useRef } from 'react';
import {
    Container, Row, Col, Card, Button, Modal, Form,
    Alert, Spinner, Table, Badge, InputGroup
} from 'react-bootstrap';
import { FaPlus, FaEdit, FaTrash, FaEye, FaSearch, FaMapMarkedAlt, FaUpload, FaImage, FaTimes } from 'react-icons/fa';

const LugaresAdmin = () => {
    const [lugares, setLugares] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [uploadingImages, setUploadingImages] = useState(false);
    const [imagePreviewUrls, setImagePreviewUrls] = useState([]);
    const fileInputRef = useRef(null);
    const [formData, setFormData] = useState({
        Nombre: '',
        Descripcion: '',
        Horarios: '',
        Costo: '',
        NivelDeDificultad: '',
        Categoria: '',
        LinkEducativos: '',
        Ubicacion: {
            Estado: '',
            Municipio: '',
            Coordenadas: {
                lat: '',
                lng: ''
            }
        },
        Imagen: []
    });

    const nivelesDificultad = [
        { value: 'Fácil', label: 'Fácil' },
        { value: 'Moderado', label: 'Moderado' },
        { value: 'Difícil', label: 'Difícil' },
        { value: 'Experto', label: 'Experto' }
    ];

    const categorias = [
        { value: 'Cascadas', label: 'Cascadas' },
        { value: 'Ríos', label: 'Ríos' },
        { value: 'Montañas', label: 'Montañas' },
        { value: 'Cuevas', label: 'Cuevas' },
        { value: 'Sitios Históricos', label: 'Sitios Históricos' },
        { value: 'Miradores', label: 'Miradores' },
        { value: 'Parques', label: 'Parques' },
        { value: 'Museos', label: 'Museos' },
        { value: 'Iglesias', label: 'Iglesias' },
        { value: 'Plazas', label: 'Plazas' },
        { value: 'Monumentos', label: 'Monumentos' },
        { value: 'Ruinas', label: 'Ruinas Arqueológicas' },
        { value: 'Lagos', label: 'Lagos' },
        { value: 'Playas', label: 'Playas' },
        { value: 'Bosques', label: 'Bosques' },
        { value: 'Selva', label: 'Selva' },
        { value: 'Desierto', label: 'Desierto' },
        { value: 'Volcanes', label: 'Volcanes' },
        { value: 'Termas', label: 'Aguas Termales' },
        { value: 'Balnearios', label: 'Balnearios' },
        { value: 'Jardines', label: 'Jardines' },
        { value: 'Zoológicos', label: 'Zoológicos' },
        { value: 'Acuarios', label: 'Acuarios' },
        { value: 'Planetarios', label: 'Planetarios' },
        { value: 'Observatorios', label: 'Observatorios' },
        { value: 'Teatros', label: 'Teatros' },
        { value: 'Auditorios', label: 'Auditorios' },
        { value: 'Centros Culturales', label: 'Centros Culturales' },
        { value: 'Bibliotecas', label: 'Bibliotecas' },
        { value: 'Archivos', label: 'Archivos Históricos' },
        { value: 'Fortalezas', label: 'Fortalezas' },
        { value: 'Castillos', label: 'Castillos' },
        { value: 'Haciendas', label: 'Haciendas' },
        { value: 'Pueblos Mágicos', label: 'Pueblos Mágicos' },
        { value: 'Barrios Históricos', label: 'Barrios Históricos' },
        { value: 'Calles Peatonales', label: 'Calles Peatonales' },
        { value: 'Mercados', label: 'Mercados Tradicionales' },
        { value: 'Templos', label: 'Templos' },
        { value: 'Santuario', label: 'Santuario' },
        { value: 'Capillas', label: 'Capillas' },
        { value: 'Conventos', label: 'Conventos' },
        { value: 'Cementerios', label: 'Cementerios Históricos' },
        { value: 'Puentes', label: 'Puentes Históricos' },
        { value: 'Acueductos', label: 'Acueductos' },
        { value: 'Torres', label: 'Torres' },
        { value: 'Faro', label: 'Faro' },
        { value: 'Puertos', label: 'Puertos' },
        { value: 'Estaciones', label: 'Estaciones de Tren' },
        { value: 'Aeropuertos', label: 'Aeropuertos' },
        { value: 'Terminales', label: 'Terminales de Autobús' },
        { value: 'Centros Comerciales', label: 'Centros Comerciales' },
        { value: 'Galerías', label: 'Galerías de Arte' },
        { value: 'Talleres', label: 'Talleres Artesanales' },
        { value: 'Fábricas', label: 'Fábricas Históricas' },
        { value: 'Mineras', label: 'Mineras' },
        { value: 'Plantaciones', label: 'Plantaciones' },
        { value: 'Viñedos', label: 'Viñedos' },
        { value: 'Otros', label: 'Otros' }
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
        cargarLugares();
    }, []);

    const cargarLugares = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await fetch('https://backend-iota-seven-19.vercel.app/api/lugares');
            const data = await response.json();

            if (Array.isArray(data)) {
                setLugares(data);
            } else {
                setError('Error al cargar los datos');
            }
        } catch (error) {
            console.error('Error:', error);
            setError('Error de conexión');
        } finally {
            setLoading(false);
        }
    };

    // Función para preparar FormData con imágenes
    const prepareFormData = (data, files) => {
        const formData = new FormData();
        
        // Procesar LinkEducativos
        const linkEducativosArray = data.LinkEducativos ? data.LinkEducativos.split(',').map(item => item.trim()).filter(item => item) : [];
        
        // Agregar todos los campos del formulario EXCEPTO Imagen
        Object.keys(data).forEach(key => {
            if (key !== 'Imagen') {
                if (key === 'Ubicacion') {
                    // Los objetos se envían como JSON string
                    formData.append(key, JSON.stringify(data[key]));
                } else if (key === 'LinkEducativos') {
                    // Enviar como array procesado
                    formData.append(key, JSON.stringify(linkEducativosArray));
                } else {
                    formData.append(key, data[key]);
                }
            }
        });
        
        // Agregar imágenes existentes como JSON string
        if (data.Imagen && data.Imagen.length > 0) {
            formData.append('imagenesExistentes', JSON.stringify(data.Imagen));
        }
        
        // Agregar archivos de imagen nuevos
        if (files && files.length > 0) {
            files.forEach(file => {
                formData.append('Imagen', file);
            });
        }
        
        return formData;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            setUploadingImages(true);
            setError(null);
            
            const token = getToken();
            if (!token) {
                setError('No hay token de autenticación. Por favor, inicia sesión.');
                return;
            }

            // Obtener archivos seleccionados
            const fileInput = fileInputRef.current;
            const selectedFiles = fileInput ? Array.from(fileInput.files) : [];
            
            // Preparar FormData
            const formDataToSend = prepareFormData(formData, selectedFiles);

            const url = editingItem 
                ? `https://backend-iota-seven-19.vercel.app/api/lugares/admin/${editingItem._id}`
                : 'https://backend-iota-seven-19.vercel.app/api/lugares/admin';
            
            const method = editingItem ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Authorization': `Bearer ${token}`
                    // No incluir Content-Type para FormData
                },
                body: formDataToSend
            });

            const data = await response.json();

            if (data.success) {
                setShowModal(false);
                setEditingItem(null);
                resetForm();
                setImagePreviewUrls([]);
                cargarLugares();
            } else {
                setError(data.message || 'Error al guardar');
            }
        } catch (error) {
            console.error('Error:', error);
            setError('Error de conexión');
        } finally {
            setUploadingImages(false);
        }
    };

    const handleEdit = (item) => {
        setEditingItem(item);
        setFormData({
            Nombre: item.Nombre || '',
            Descripcion: item.Descripcion || '',
            Horarios: item.Horarios || '',
            Costo: item.Costo || '',
            NivelDeDificultad: item.NivelDeDificultad || '',
            Categoria: item.Categoria || '',
            LinkEducativos: Array.isArray(item.LinkEducativos) ? item.LinkEducativos.join(', ') : (item.LinkEducativos || ''),
            Ubicacion: item.Ubicacion || {
                Estado: '',
                Municipio: '',
                Coordenadas: { lat: '', lng: '' }
            },
            Imagen: item.Imagen || []
        });
        // Mostrar preview de imágenes existentes
        setImagePreviewUrls(item.Imagen || []);
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('¿Estás seguro de que quieres eliminar este lugar turístico?')) {
            return;
        }

        try {
            const token = getToken();
            if (!token) {
                setError('No hay token de autenticación. Por favor, inicia sesión.');
                return;
            }

            const response = await fetch(`https://backend-iota-seven-19.vercel.app/api/lugares/admin/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (data.success) {
                cargarLugares();
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
            Nombre: '',
            Descripcion: '',
            Horarios: '',
            Costo: '',
            NivelDeDificultad: '',
            Categoria: '',
            LinkEducativos: '',
            Ubicacion: {
                Estado: '',
                Municipio: '',
                Coordenadas: { lat: '', lng: '' }
            },
            Imagen: []
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
        setImagePreviewUrls([]);
        // Limpiar input de archivos
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    // Función para manejar la selección de archivos
    const handleFileSelect = (event) => {
        const files = Array.from(event.target.files);
        
        // Crear URLs de preview
        const previews = files.map(file => URL.createObjectURL(file));
        setImagePreviewUrls(prev => [...prev, ...previews]);
        
        // Guardar archivos para subir después
        setFormData(prev => ({
            ...prev,
            Imagen: [...prev.Imagen, ...files.map(file => file.name)] // Placeholder
        }));
    };

    // Función para eliminar imagen de preview
    const removeImagePreview = (index) => {
        setImagePreviewUrls(prev => prev.filter((_, i) => i !== index));
        setFormData(prev => ({
            ...prev,
            Imagen: prev.Imagen.filter((_, i) => i !== index)
        }));
    };

    // Función para abrir selector de archivos
    const openFileSelector = () => {
        fileInputRef.current?.click();
    };

    const getNivelDificultadColor = (nivel) => {
        const colores = {
            'Fácil': 'success',
            'Moderado': 'warning',
            'Difícil': 'danger',
            'Experto': 'dark'
        };
        return colores[nivel] || 'secondary';
    };

    const filtrarLugares = () => {
        if (!searchTerm.trim()) return lugares;
        
        const termino = searchTerm.toLowerCase();
        return lugares.filter(item => 
            item.Nombre?.toLowerCase().includes(termino) ||
            item.Ubicacion?.Municipio?.toLowerCase().includes(termino) ||
            item.Categoria?.toLowerCase().includes(termino)
        );
    };

    const lugaresFiltrados = filtrarLugares();

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
                            <FaMapMarkedAlt style={{ marginRight: '0.5rem' }} />
                            Gestión de Lugares Turísticos
                        </h2>
                        <Button
                            onClick={handleShowModal}
                            style={{
                                backgroundColor: '#1E8546',
                                borderColor: '#1E8546'
                            }}
                        >
                            <FaPlus /> Nuevo Lugar
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
                            placeholder="Buscar lugares..."
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
                                        <th>Costo</th>
                                        <th>Imágenes</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {lugaresFiltrados.map((item) => (
                                        <tr key={item._id}>
                                            <td>
                                                <div>
                                                    <strong>{item.Nombre}</strong>
                                                    <br />
                                                    <small style={{ color: '#666' }}>
                                                        {item.Descripcion?.length > 100 
                                                            ? `${item.Descripcion.substring(0, 100)}...` 
                                                            : item.Descripcion
                                                        }
                                                    </small>
                                                </div>
                                            </td>
                                            <td>
                                                <div>
                                                    <strong>{item.Ubicacion?.Municipio}</strong>
                                                    <br />
                                                    <small style={{ color: '#666' }}>
                                                        {item.Ubicacion?.Estado}
                                                    </small>
                                                </div>
                                            </td>
                                            <td>
                                                <Badge bg="info">
                                                    {item.Categoria}
                                                </Badge>
                                            </td>
                                            <td>
                                                <Badge bg={getNivelDificultadColor(item.NivelDeDificultad)}>
                                                    {item.NivelDeDificultad}
                                                </Badge>
                                            </td>
                                            <td>{item.Costo}</td>
                                            <td>
                                                <Badge bg="secondary">
                                                    {item.Imagen?.length || 0} imágenes
                                                </Badge>
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

                            {lugaresFiltrados.length === 0 && (
                                <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
                                    <FaMapMarkedAlt style={{ fontSize: '3rem', color: '#ccc', marginBottom: '1rem' }} />
                                    <p>No hay lugares turísticos registrados</p>
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
                        {editingItem ? 'Editar Lugar Turístico' : 'Nuevo Lugar Turístico'}
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
                                        value={formData.Nombre}
                                        onChange={(e) => setFormData({...formData, Nombre: e.target.value})}
                                        required
                                        maxLength={200}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Categoría *</Form.Label>
                                    <Form.Select
                                        value={formData.Categoria}
                                        onChange={(e) => setFormData({...formData, Categoria: e.target.value})}
                                        required
                                    >
                                        <option value="">Seleccionar categoría</option>
                                        {categorias.map((categoria) => (
                                            <option key={categoria.value} value={categoria.value}>
                                                {categoria.label}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                        </Row>

                        <Form.Group className="mb-3">
                            <Form.Label>Descripción</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={4}
                                value={formData.Descripcion}
                                onChange={(e) => setFormData({...formData, Descripcion: e.target.value})}
                                maxLength={1000}
                            />
                        </Form.Group>

                        <Row>
                            <Col md={4}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Horarios</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={formData.Horarios}
                                        onChange={(e) => setFormData({...formData, Horarios: e.target.value})}
                                        maxLength={200}
                                        placeholder="Ej: Lunes a Domingo 8:00 AM - 6:00 PM"
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={4}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Costo</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={formData.Costo}
                                        onChange={(e) => setFormData({...formData, Costo: e.target.value})}
                                        maxLength={100}
                                        placeholder="Ej: $50 MXN"
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={4}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Nivel de Dificultad</Form.Label>
                                    <Form.Select
                                        value={formData.NivelDeDificultad}
                                        onChange={(e) => setFormData({...formData, NivelDeDificultad: e.target.value})}
                                    >
                                        <option value="">Seleccionar nivel</option>
                                        {nivelesDificultad.map((nivel) => (
                                            <option key={nivel.value} value={nivel.value}>
                                                {nivel.label}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Estado</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={formData.Ubicacion.Estado}
                                        onChange={(e) => setFormData({
                                            ...formData, 
                                            Ubicacion: {...formData.Ubicacion, Estado: e.target.value}
                                        })}
                                        maxLength={100}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Municipio</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={formData.Ubicacion.Municipio}
                                        onChange={(e) => setFormData({
                                            ...formData, 
                                            Ubicacion: {...formData.Ubicacion, Municipio: e.target.value}
                                        })}
                                        maxLength={100}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Latitud</Form.Label>
                                    <Form.Control
                                        type="number"
                                        value={formData.Ubicacion.Coordenadas.lat}
                                        onChange={(e) => setFormData({
                                            ...formData, 
                                            Ubicacion: {
                                                ...formData.Ubicacion, 
                                                Coordenadas: {...formData.Ubicacion.Coordenadas, lat: e.target.value}
                                            }
                                        })}
                                        step="any"
                                        placeholder="Ej: 20.87766"
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Longitud</Form.Label>
                                    <Form.Control
                                        type="number"
                                        value={formData.Ubicacion.Coordenadas.lng}
                                        onChange={(e) => setFormData({
                                            ...formData, 
                                            Ubicacion: {
                                                ...formData.Ubicacion, 
                                                Coordenadas: {...formData.Ubicacion.Coordenadas, lng: e.target.value}
                                            }
                                        })}
                                        step="any"
                                        placeholder="Ej: -98.59296"
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row>
                            <Col md={12}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Imágenes</Form.Label>
                                    <div style={{ 
                                        border: '2px dashed #ccc', 
                                        borderRadius: '8px', 
                                        padding: '20px', 
                                        textAlign: 'center',
                                        backgroundColor: '#f8f9fa'
                                    }}>
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            multiple
                                            accept="image/*"
                                            onChange={handleFileSelect}
                                            style={{ display: 'none' }}
                                        />
                                        <Button
                                            variant="outline-primary"
                                            onClick={openFileSelector}
                                            style={{ marginBottom: '10px' }}
                                        >
                                            <FaUpload /> Seleccionar Imágenes
                                        </Button>
                                        <p style={{ margin: '0', color: '#666', fontSize: '14px' }}>
                                            Formatos permitidos: JPG, PNG, JPEG, WEBP, GIF (máx. 5MB por imagen)
                                        </p>
                                    </div>
                                </Form.Group>
                            </Col>
                        </Row>

                        {/* Preview de imágenes */}
                        {imagePreviewUrls.length > 0 && (
                            <Row>
                                <Col md={12}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Vista Previa de Imágenes</Form.Label>
                                        <div style={{ 
                                            display: 'flex', 
                                            flexWrap: 'wrap', 
                                            gap: '10px',
                                            maxHeight: '200px',
                                            overflowY: 'auto'
                                        }}>
                                            {imagePreviewUrls.map((url, index) => (
                                                <div key={index} style={{ 
                                                    position: 'relative',
                                                    width: '120px',
                                                    height: '120px',
                                                    border: '1px solid #ddd',
                                                    borderRadius: '8px',
                                                    overflow: 'hidden'
                                                }}>
                                                    <img
                                                        src={url}
                                                        alt={`Preview ${index + 1}`}
                                                        style={{
                                                            width: '100%',
                                                            height: '100%',
                                                            objectFit: 'cover'
                                                        }}
                                                    />
                                                    <Button
                                                        size="sm"
                                                        variant="danger"
                                                        style={{
                                                            position: 'absolute',
                                                            top: '5px',
                                                            right: '5px',
                                                            width: '24px',
                                                            height: '24px',
                                                            padding: '0',
                                                            borderRadius: '50%'
                                                        }}
                                                        onClick={() => removeImagePreview(index)}
                                                    >
                                                        <FaTimes size={12} />
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                    </Form.Group>
                                </Col>
                            </Row>
                        )}

                        <Row>
                            <Col md={12}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Links Educativos (URLs separadas por comas)</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={formData.LinkEducativos}
                                        onChange={(e) => setFormData({
                                            ...formData, 
                                            LinkEducativos: e.target.value
                                        })}
                                        placeholder="https://ejemplo1.com, https://ejemplo2.com"
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseModal} disabled={uploadingImages}>
                            Cancelar
                        </Button>
                        <Button 
                            type="submit"
                            disabled={uploadingImages}
                            style={{
                                backgroundColor: '#1E8546',
                                borderColor: '#1E8546'
                            }}
                        >
                            {uploadingImages ? (
                                <>
                                    <Spinner animation="border" size="sm" style={{ marginRight: '8px' }} />
                                    {editingItem ? 'Actualizando...' : 'Creando...'}
                                </>
                            ) : (
                                editingItem ? 'Actualizar' : 'Crear'
                            )}
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </Container>
    );
};

export default LugaresAdmin; 