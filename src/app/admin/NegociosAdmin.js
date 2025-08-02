import React, { useState, useEffect, useRef } from 'react';
import {
    Container, Row, Col, Card, Button, Modal, Form,
    Alert, Spinner, Table, Badge, InputGroup
} from 'react-bootstrap';
import { FaPlus, FaEdit, FaTrash, FaEye, FaSearch, FaStore, FaUpload, FaImage, FaTimes, FaStar } from 'react-icons/fa';

const NegociosAdmin = () => {
    const [negocios, setNegocios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [uploadingImages, setUploadingImages] = useState(false);
    const [imagePreviewUrls, setImagePreviewUrls] = useState([]);
    const [newImageFiles, setNewImageFiles] = useState([]);
    const fileInputRef = useRef(null);
    const [formData, setFormData] = useState({
        Nombre: '',
        Categoria: '',
        Descripcion: '',
        Ubicacion: {
            Estado: '',
            Municipio: '',
            Coordenadas: {
                lat: '',
                lng: ''
            },
            Direccion: ''
        },
        RedesSociales: {
            Facebook: '',
            Instagram: '',
            WhatsApp: ''
        },
        Promociones: '',
        Reseñas: [],
        Imagenes: [],
        Horario: '',
        Contacto: '',
        Recomendado: false
    });

    const categorias = [
        { value: 'Restaurantes', label: 'Restaurantes' },
        { value: 'Hoteles', label: 'Hoteles' },
        { value: 'Tiendas', label: 'Tiendas' },
        { value: 'Servicios', label: 'Servicios' },
        { value: 'Entretenimiento', label: 'Entretenimiento' },
        { value: 'Salud', label: 'Salud' },
        { value: 'Educación', label: 'Educación' },
        { value: 'Transporte', label: 'Transporte' },
        { value: 'Gastronomía', label: 'Gastronomía' },
        { value: 'Hospedaje', label: 'Hospedaje' },
        { value: 'Comercio', label: 'Comercio' },
        { value: 'Turismo', label: 'Turismo' },
        { value: 'Artesanías', label: 'Artesanías' },
        { value: 'Cafeterías', label: 'Cafeterías' },
        { value: 'Bares', label: 'Bares' },
        { value: 'Farmacias', label: 'Farmacias' },
        { value: 'Gasolineras', label: 'Gasolineras' },
        { value: 'Bancos', label: 'Bancos' },
        { value: 'Oficinas', label: 'Oficinas' },
        { value: 'Talleres', label: 'Talleres' },
        { value: 'Estéticas', label: 'Estéticas' },
        { value: 'Gimnasios', label: 'Gimnasios' },
        { value: 'Museos', label: 'Museos' },
        { value: 'Teatros', label: 'Teatros' },
        { value: 'Cines', label: 'Cines' },
        { value: 'Parques', label: 'Parques' },
        { value: 'Iglesias', label: 'Iglesias' },
        { value: 'Escuelas', label: 'Escuelas' },
        { value: 'Universidades', label: 'Universidades' },
        { value: 'Hospitales', label: 'Hospitales' },
        { value: 'Clínicas', label: 'Clínicas' },
        { value: 'Dentistas', label: 'Dentistas' },
        { value: 'Veterinarias', label: 'Veterinarias' },
        { value: 'Lavanderías', label: 'Lavanderías' },
        { value: 'Peluquerías', label: 'Peluquerías' },
        { value: 'Tintorerías', label: 'Tintorerías' },
        { value: 'Papelerías', label: 'Papelerías' },
        { value: 'Librerías', label: 'Librerías' },
        { value: 'Joyerías', label: 'Joyerías' },
        { value: 'Ópticas', label: 'Ópticas' },
        { value: 'Zapaterías', label: 'Zapaterías' },
        { value: 'Ropa', label: 'Ropa' },
        { value: 'Electrónicos', label: 'Electrónicos' },
        { value: 'Mueblerías', label: 'Mueblerías' },
        { value: 'Ferreterías', label: 'Ferreterías' },
        { value: 'Viveros', label: 'Viveros' },
        { value: 'Mascotas', label: 'Mascotas' },
        { value: 'Deportes', label: 'Deportes' },
        { value: 'Música', label: 'Música' },
        { value: 'Fotografía', label: 'Fotografía' },
        { value: 'Viajes', label: 'Viajes' },
        { value: 'Seguros', label: 'Seguros' },
        { value: 'Abogados', label: 'Abogados' },
        { value: 'Contadores', label: 'Contadores' },
        { value: 'Arquitectos', label: 'Arquitectos' },
        { value: 'Ingenieros', label: 'Ingenieros' },
        { value: 'Diseñadores', label: 'Diseñadores' },
        { value: 'Programadores', label: 'Programadores' },
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
        cargarNegocios();
    }, []);

    const cargarNegocios = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await fetch('https://backend-iota-seven-19.vercel.app/api/negocios');
            const data = await response.json();

            if (Array.isArray(data)) {
                setNegocios(data);
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
    const prepareFormData = (data, newFiles) => {
        const formData = new FormData();
        
        // Agregar todos los campos del formulario EXCEPTO Imagenes
        Object.keys(data).forEach(key => {
            if (key !== 'Imagenes') {
                if (key === 'Ubicacion' || key === 'RedesSociales' || key === 'Reseñas') {
                    // Los objetos y arrays se envían como JSON string
                    formData.append(key, JSON.stringify(data[key]));
                } else {
                    formData.append(key, data[key]);
                }
            }
        });
        
        // Agregar imágenes existentes como JSON string separado
        if (data.Imagenes && data.Imagenes.length > 0) {
            formData.append('imagenesExistentes', JSON.stringify(data.Imagenes));
        }
        
        // Agregar archivos de imagen nuevos bajo la clave 'Imagenes'
        if (newFiles && newFiles.length > 0) {
            newFiles.forEach(file => {
                formData.append('Imagenes', file);
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

            // Preparar FormData con los archivos nuevos
            const formDataToSend = prepareFormData(formData, newImageFiles);

            const url = editingItem 
                ? `https://backend-iota-seven-19.vercel.app/api/negocios/admin/${editingItem._id}`
                : 'https://backend-iota-seven-19.vercel.app/api/negocios/admin';
            
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
                setNewImageFiles([]);
                cargarNegocios();
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
            Categoria: item.Categoria || '',
            Descripcion: item.Descripcion || '',
            Ubicacion: item.Ubicacion || {
                Estado: '',
                Municipio: '',
                Coordenadas: { lat: '', lng: '' },
                Direccion: ''
            },
            RedesSociales: item.RedesSociales || {
                Facebook: '',
                Instagram: '',
                WhatsApp: ''
            },
            Promociones: item.Promociones || '',
            Reseñas: item.Reseñas || [],
            Imagenes: item.Imagenes || [],
            Horario: item.Horario || '',
            Contacto: item.Contacto || '',
            Recomendado: item.Recomendado || false
        });
        // Mostrar preview de imágenes existentes
        setImagePreviewUrls(item.Imagenes || []);
        setNewImageFiles([]);
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('¿Estás seguro de que quieres eliminar este negocio?')) {
            return;
        }

        try {
            const token = getToken();
            if (!token) {
                setError('No hay token de autenticación. Por favor, inicia sesión.');
                return;
            }

            const response = await fetch(`https://backend-iota-seven-19.vercel.app/api/negocios/admin/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (data.success) {
                cargarNegocios();
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
            Categoria: '',
            Descripcion: '',
            Ubicacion: {
                Estado: '',
                Municipio: '',
                Coordenadas: { lat: '', lng: '' },
                Direccion: ''
            },
            RedesSociales: {
                Facebook: '',
                Instagram: '',
                WhatsApp: ''
            },
            Promociones: '',
            Reseñas: [],
            Imagenes: [],
            Horario: '',
            Contacto: '',
            Recomendado: false
        });
    };

    const handleShowModal = () => {
        setEditingItem(null);
        resetForm();
        setImagePreviewUrls([]);
        setNewImageFiles([]);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingItem(null);
        resetForm();
        setImagePreviewUrls([]);
        setNewImageFiles([]);
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
        
        // Guardar los archivos nuevos para enviar después
        setNewImageFiles(prev => [...prev, ...files]);
    };

    // Función para eliminar imagen de preview
    const removeImagePreview = (index) => {
        setImagePreviewUrls(prev => prev.filter((_, i) => i !== index));
        
        // Determinar si es una imagen existente o nueva
        const existingImagesCount = editingItem ? (editingItem.Imagenes?.length || 0) : 0;
        
        if (index < existingImagesCount) {
            // Es una imagen existente
            setFormData(prev => ({
                ...prev,
                Imagenes: prev.Imagenes.filter((_, i) => i !== index)
            }));
        } else {
            // Es una imagen nueva
            const newIndex = index - existingImagesCount;
            setNewImageFiles(prev => prev.filter((_, i) => i !== newIndex));
        }
    };

    // Función para abrir selector de archivos
    const openFileSelector = () => {
        fileInputRef.current?.click();
    };

    const getCategoriaColor = (categoria) => {
        const colores = {
            // Categorías originales
            'Restaurantes': 'success',
            'Hoteles': 'primary',
            'Tiendas': 'info',
            'Servicios': 'warning',
            'Entretenimiento': 'danger',
            'Salud': 'secondary',
            'Educación': 'dark',
            'Transporte': 'light',
            // Nuevas categorías
            'Gastronomía': 'success',
            'Hospedaje': 'primary',
            'Comercio': 'info',
            'Turismo': 'warning',
            'Artesanías': 'warning',
            'Cafeterías': 'success',
            'Bares': 'danger',
            'Farmacias': 'secondary',
            'Gasolineras': 'warning',
            'Bancos': 'primary',
            'Oficinas': 'secondary',
            'Talleres': 'info',
            'Estéticas': 'warning',
            'Gimnasios': 'success',
            'Museos': 'info',
            'Teatros': 'warning',
            'Cines': 'danger',
            'Parques': 'success',
            'Iglesias': 'secondary',
            'Escuelas': 'primary',
            'Universidades': 'primary',
            'Hospitales': 'secondary',
            'Clínicas': 'secondary',
            'Dentistas': 'secondary',
            'Veterinarias': 'secondary',
            'Lavanderías': 'info',
            'Peluquerías': 'warning',
            'Tintorerías': 'info',
            'Papelerías': 'info',
            'Librerías': 'info',
            'Joyerías': 'warning',
            'Ópticas': 'secondary',
            'Zapaterías': 'info',
            'Ropa': 'info',
            'Electrónicos': 'info',
            'Mueblerías': 'info',
            'Ferreterías': 'info',
            'Viveros': 'success',
            'Mascotas': 'warning',
            'Deportes': 'success',
            'Música': 'warning',
            'Fotografía': 'info',
            'Viajes': 'warning',
            'Seguros': 'primary',
            'Abogados': 'dark',
            'Contadores': 'dark',
            'Arquitectos': 'dark',
            'Ingenieros': 'dark',
            'Diseñadores': 'warning',
            'Programadores': 'dark',
            'Otros': 'secondary'
        };
        return colores[categoria] || 'secondary';
    };

    const filtrarNegocios = () => {
        if (!searchTerm.trim()) return negocios;
        
        const termino = searchTerm.toLowerCase();
        return negocios.filter(item => 
            item.Nombre?.toLowerCase().includes(termino) ||
            item.Ubicacion?.Municipio?.toLowerCase().includes(termino) ||
            item.Categoria?.toLowerCase().includes(termino)
        );
    };

    const negociosFiltrados = filtrarNegocios();

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
                            <FaStore style={{ marginRight: '0.5rem' }} />
                            Gestión de Negocios
                        </h2>
                        <Button
                            onClick={handleShowModal}
                            style={{
                                backgroundColor: '#1E8546',
                                borderColor: '#1E8546'
                            }}
                        >
                            <FaPlus /> Nuevo Negocio
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
                            placeholder="Buscar negocios..."
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
                                        <th>Contacto</th>
                                        <th>Recomendado</th>
                                        <th>Imágenes</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {negociosFiltrados.map((item) => (
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
                                                <Badge bg={getCategoriaColor(item.Categoria)}>
                                                    {item.Categoria}
                                                </Badge>
                                            </td>
                                            <td>{item.Contacto}</td>
                                            <td>
                                                {item.Recomendado ? (
                                                    <Badge bg="success">
                                                        <FaStar /> Recomendado
                                                    </Badge>
                                                ) : (
                                                    <Badge bg="secondary">No</Badge>
                                                )}
                                            </td>
                                            <td>
                                                <Badge bg="secondary">
                                                    {item.Imagenes?.length || 0} imágenes
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

                            {negociosFiltrados.length === 0 && (
                                <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
                                    <FaStore style={{ fontSize: '3rem', color: '#ccc', marginBottom: '1rem' }} />
                                    <p>No hay negocios registrados</p>
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
                        {editingItem ? 'Editar Negocio' : 'Nuevo Negocio'}
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
                            <Col md={12}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Dirección</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={formData.Ubicacion.Direccion}
                                        onChange={(e) => setFormData({
                                            ...formData, 
                                            Ubicacion: {...formData.Ubicacion, Direccion: e.target.value}
                                        })}
                                        maxLength={200}
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
                            <Col md={4}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Facebook</Form.Label>
                                    <Form.Control
                                        type="url"
                                        value={formData.RedesSociales.Facebook}
                                        onChange={(e) => setFormData({
                                            ...formData, 
                                            RedesSociales: {...formData.RedesSociales, Facebook: e.target.value}
                                        })}
                                        placeholder="https://facebook.com/..."
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={4}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Instagram</Form.Label>
                                    <Form.Control
                                        type="url"
                                        value={formData.RedesSociales.Instagram}
                                        onChange={(e) => setFormData({
                                            ...formData, 
                                            RedesSociales: {...formData.RedesSociales, Instagram: e.target.value}
                                        })}
                                        placeholder="https://instagram.com/..."
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={4}>
                                <Form.Group className="mb-3">
                                    <Form.Label>WhatsApp</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={formData.RedesSociales.WhatsApp}
                                        onChange={(e) => setFormData({
                                            ...formData, 
                                            RedesSociales: {...formData.RedesSociales, WhatsApp: e.target.value}
                                        })}
                                        placeholder="+52 123 456 7890"
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Horario</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={formData.Horario}
                                        onChange={(e) => setFormData({...formData, Horario: e.target.value})}
                                        placeholder="Lunes a Domingo 8:00 AM - 6:00 PM"
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Contacto</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={formData.Contacto}
                                        onChange={(e) => setFormData({...formData, Contacto: e.target.value})}
                                        placeholder="Teléfono o email"
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Form.Group className="mb-3">
                            <Form.Label>Promociones</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                value={formData.Promociones}
                                onChange={(e) => setFormData({...formData, Promociones: e.target.value})}
                                placeholder="Descuentos, ofertas especiales..."
                            />
                        </Form.Group>

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

                        <Form.Group className="mb-3">
                            <Form.Check
                                type="checkbox"
                                label="Negocio recomendado"
                                checked={formData.Recomendado}
                                onChange={(e) => setFormData({...formData, Recomendado: e.target.checked})}
                            />
                        </Form.Group>
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

export default NegociosAdmin; 