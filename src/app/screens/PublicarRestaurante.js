import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Alert, Row, Col, Card, Badge, Modal, Spinner, InputGroup } from 'react-bootstrap';
import axios from 'axios';

const PublicarRestaurante = () => {
    const [formData, setFormData] = useState({
        Nombre: '',
        Categoria: '',
        Descripcion: '',
        Estado: '',
        Municipio: '',
        Direccion: '',
        lat: '',
        lng: '',
        Facebook: '',
        Instagram: '',
        WhatsApp: '',
        Horario: '',
        Contacto: '',
        Recomendado: false,
        Imagenes: [],
    });

    const [mensaje, setMensaje] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [imagePreviews, setImagePreviews] = useState([]);
    const [idRestaurante, setIdRestaurante] = useState(null);
    const [datosRestaurante, setDatosRestaurante] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [platillos, setPlatillos] = useState([]);
    const [platilloForm, setPlatilloForm] = useState({
        Nombre: '',
        Descripcion: '',
        Precio: '',
        Categoria: '',
        Ingredientes: '', // como string separado por comas
        PasosPreparacion: '', // como string separado por saltos de línea
        Imagenes: [],
    });
    const [platilloImagePreviews, setPlatilloImagePreviews] = useState([]);
    const [platilloMensaje, setPlatilloMensaje] = useState(null);
    const [isPlatilloSubmitting, setIsPlatilloSubmitting] = useState(false);


    const user = JSON.parse(localStorage.getItem("user"));
    const token = user?.token;
    const idUsuario = user?._id || user?.idUsuario;

    // Obtener datos del restaurante del backend
    useEffect(() => {
        const obtenerRestaurante = async () => {
            if (!idUsuario) return;
            try {
                const res = await axios.get(`https://backend-iota-seven-19.vercel.app/api/contactoRestaurante/por-usuario/${idUsuario}`);
                setIdRestaurante(res.data.idRestaurante);
                setDatosRestaurante(res.data);
            } catch (error) {
                console.warn("⚠️ Este usuario no está registrado como restaurante.");
                setIdRestaurante(null);
            }
        };
        obtenerRestaurante();
    }, [idUsuario]);

    // Manejar cambios del formulario
    const handleChange = (e) => {
        const { name, value, files, type, checked } = e.target;
        if (name === 'Imagenes') {
            setFormData({ ...formData, Imagenes: files });
            if (files && files.length > 0) {
                const previews = Array.from(files).map(file => URL.createObjectURL(file));
                setImagePreviews(previews);
            } else {
                setImagePreviews([]);
            }
        } else if (type === 'checkbox') {
            setFormData({ ...formData, [name]: checked });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    // Eliminar imagen específica
    const handleRemoveImage = (indexToRemove) => {
        const newFiles = Array.from(formData.Imagenes).filter((_, index) => index !== indexToRemove);
        const newPreviews = imagePreviews.filter((_, index) => index !== indexToRemove);
        setFormData({ ...formData, Imagenes: newFiles });
        setImagePreviews(newPreviews);
        URL.revokeObjectURL(imagePreviews[indexToRemove]);
    };

    // Limpiar previews al desmontar
    useEffect(() => {
        return () => {
            imagePreviews.forEach(preview => URL.revokeObjectURL(preview));
        };
    }, [imagePreviews]);

    // Modal handlers
    const handlePlatilloChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'Imagenes') {
            setPlatilloForm({ ...platilloForm, Imagenes: files });
            if (files && files.length > 0) {
                const previews = Array.from(files).map(file => URL.createObjectURL(file));
                setPlatilloImagePreviews(previews);
            } else {
                setPlatilloImagePreviews([]);
            }
        } else {
            setPlatilloForm({ ...platilloForm, [name]: value });
        }
    };
    const handleRemovePlatilloImage = (indexToRemove) => {
        const newFiles = Array.from(platilloForm.Imagenes).filter((_, index) => index !== indexToRemove);
        const newPreviews = platilloImagePreviews.filter((_, index) => index !== indexToRemove);
        setPlatilloForm({ ...platilloForm, Imagenes: newFiles });
        setPlatilloImagePreviews(newPreviews);
        URL.revokeObjectURL(platilloImagePreviews[indexToRemove]);
    };
    // --- MODAL: Guardar platillo en comida-restaurante ---
    const handleAddPlatillo = async () => {
        setIsPlatilloSubmitting(true);
        setPlatilloMensaje(null);
        if (!platilloForm.Nombre || !platilloForm.Descripcion || !platilloForm.Precio || !platilloForm.Categoria) {
            setPlatilloMensaje('❌ Todos los campos son obligatorios');
            setIsPlatilloSubmitting(false);
            return;
        }
        const data = new FormData();
        data.append('Nombre', platilloForm.Nombre);
        data.append('Descripcion', platilloForm.Descripcion);
        data.append('Precio', platilloForm.Precio);
        data.append('Categoria', platilloForm.Categoria);
        platilloForm.Ingredientes.split(',').map(i => i.trim()).filter(Boolean).forEach(i => data.append('Ingredientes', i));
        platilloForm.PasosPreparacion.split('\n').map(p => p.trim()).filter(Boolean).forEach(p => data.append('PasosPreparacion', p));
        if (platilloForm.Imagenes && platilloForm.Imagenes.length > 0) {
            for (let i = 0; i < platilloForm.Imagenes.length; i++) {
                data.append('Imagenes', platilloForm.Imagenes[i]);
            }
        }
        data.append('idRestaurante', idRestaurante);
        data.append('Restaurante.Nombre', formData.Nombre);
        data.append('Restaurante.Ubicacion.Municipio', formData.Municipio);
        data.append('Restaurante.Ubicacion.Estado', formData.Estado);
        try {
            // --- ENDPOINT CORRECTO PARA PLATILLOS DE RESTAURANTE ---
            const res = await axios.post('https://backend-iota-seven-19.vercel.app/api/comidaRestaurante', data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                }
            });
            setPlatilloMensaje('✅ Platillo guardado correctamente');
            setPlatillos([
                ...platillos,
                res.data.comida
            ]);
            setPlatilloForm({ Nombre: '', Descripcion: '', Precio: '', Categoria: '', Ingredientes: '', PasosPreparacion: '', Imagenes: [] });
            setPlatilloImagePreviews([]);
            setTimeout(() => {
                setShowModal(false);
                setPlatilloMensaje(null);
            }, 1000);
        } catch (error) {
            setPlatilloMensaje('❌ Error al guardar platillo');
        } finally {
            setIsPlatilloSubmitting(false);
        }
    };

    // --- SUBMIT PRINCIPAL: Guardar publicación de restaurante en publicaciones-restaurantes ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        if (!token || !idUsuario || !idRestaurante) {
            setMensaje('⚠️ Debes estar registrado como restaurante para publicar.');
            setIsSubmitting(false);
            return;
        }

        const data = new FormData();
        data.append('Nombre', formData.Nombre);
        data.append('Categoria', formData.Categoria);
        data.append('Descripcion', formData.Descripcion);
        data.append('Ubicacion.Estado', formData.Estado);
        data.append('Ubicacion.Municipio', formData.Municipio);
        data.append('Ubicacion.Direccion', formData.Direccion);
        data.append('Ubicacion.Coordenadas.lat', formData.lat);
        data.append('Ubicacion.Coordenadas.lng', formData.lng);
        data.append('RedesSociales.Facebook', formData.Facebook);
        data.append('RedesSociales.Instagram', formData.Instagram);
        data.append('RedesSociales.WhatsApp', formData.WhatsApp);
        data.append('Horario', formData.Horario);
        data.append('Contacto', formData.Contacto);
        data.append('Recomendado', formData.Recomendado);
        data.append('idUsuario', idUsuario);
        data.append('idRestaurante', idRestaurante);
        data.append('estadoRevision', 'pendiente');
        data.append('fechaSolicitud', new Date().toISOString());
        if (formData.Imagenes && formData.Imagenes.length > 0) {
            for (let i = 0; i < formData.Imagenes.length; i++) {
                data.append('Imagenes', formData.Imagenes[i]);
            }
        }

        try {
            // --- ENDPOINT CORRECTO PARA PUBLICACIONES DE RESTAURANTES ---
            await axios.post('https://backend-iota-seven-19.vercel.app/api/publicaRestaurantes', data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                }
            });
            setMensaje('✅ Publicación enviada para revisión');
            setFormData({
                Nombre: '', Categoria: '', Descripcion: '', Estado: '', Municipio: '', Direccion: '', lat: '', lng: '', Facebook: '', Instagram: '', WhatsApp: '', Horario: '', Contacto: '', Recomendado: false, Imagenes: []
            });
            setImagePreviews([]);
        } catch (error) {
            console.error("❌ Error al enviar publicación:", error.response?.data || error.message);
            setMensaje('❌ Hubo un error al enviar tu publicación');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Container fluid className="py-5" style={{
            background: 'linear-gradient(135deg, #FDF2E0 0%, #F8E8D0 100%)',
            minHeight: '100vh'
        }}>
            <Container>
                <div className="text-center mb-5">
                    <h1 className="display-4 fw-bold" style={{ color: '#9A1E47' }}>
                        🍽️ Publicar Restaurante
                    </h1>
                    <p className="lead text-muted">
                        Comparte tu restaurante y especialidad con la comunidad
                    </p>
                </div>

                {mensaje && (
                    <Alert 
                        variant={mensaje.startsWith('✅') ? 'success' : 'danger'}
                        className="border-0 shadow-sm"
                        style={{ borderRadius: '15px' }}
                    >
                        <div className="d-flex align-items-center">
                            <span className="me-2">
                                {mensaje.startsWith('✅') ? '✅' : '❌'}
                            </span>
                            {mensaje}
                        </div>
                    </Alert>
                )}

                {!idRestaurante && (
                    <Alert variant="warning" className="border-0 shadow-sm" style={{ borderRadius: '15px' }}>
                        <div className="d-flex align-items-center">
                            <span className="me-2">⚠️</span>
                            <div>
                                <strong>Registro requerido:</strong> Debes completar tu 
                                <a href="/RegistroRestaurante" className="text-decoration-none ms-1">
                                    registro como restaurante
                                </a> para publicar restaurantes.
                            </div>
                        </div>
                    </Alert>
                )}

                {idRestaurante && datosRestaurante && (
                    <Alert variant="info" className="border-0 shadow-sm" style={{ borderRadius: '15px' }}>
                        <div className="d-flex align-items-center">
                            <span className="me-2">👤</span>
                            <div>
                                <strong>Publicando como:</strong> {datosRestaurante.nombre}
                                <Badge bg="secondary" className="ms-2">{datosRestaurante.especialidad}</Badge>
                            </div>
                        </div>
                    </Alert>
                )}

                <Card className="border-0 shadow-lg" style={{ borderRadius: '20px', overflow: 'hidden' }}>
                    <Card.Body className="p-5">
                        <Form onSubmit={handleSubmit}>
                            {/* Información Básica */}
                            <div className="mb-5">
                                <h4 className="mb-4" style={{ color: '#9A1E47' }}>
                                    📋 Información Básica
                                </h4>
                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-4">
                                            <Form.Label className="fw-bold">
                                                🍽️ Nombre del restaurante <span className="text-danger">*</span>
                                            </Form.Label>
                                            <Form.Control 
                                                name="Nombre" 
                                                value={formData.Nombre} 
                                                onChange={handleChange} 
                                                required 
                                                placeholder="Ej: Café Aroma, Restaurante El Buen Sabor"
                                                className="border-0 shadow-sm"
                                                style={{ borderRadius: '10px', padding: '12px' }}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-4">
                                            <Form.Label className="fw-bold">
                                                🏷️ Categoría <span className="text-danger">*</span>
                                            </Form.Label>
                                            <Form.Control 
                                                name="Categoria" 
                                                value={formData.Categoria} 
                                                onChange={handleChange} 
                                                required 
                                                placeholder="Ej: Cafetería, Mariscos, Pizzería"
                                                className="border-0 shadow-sm"
                                                style={{ borderRadius: '10px', padding: '12px' }}
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Form.Group className="mb-4">
                                    <Form.Label className="fw-bold">
                                        📝 Descripción <span className="text-danger">*</span>
                                    </Form.Label>
                                    <Form.Control 
                                        as="textarea" 
                                        rows={4} 
                                        name="Descripcion" 
                                        value={formData.Descripcion} 
                                        onChange={handleChange} 
                                        required 
                                        placeholder="Describe tu restaurante, especialidades, historia, etc..."
                                        className="border-0 shadow-sm"
                                        style={{ borderRadius: '10px', padding: '12px' }}
                                    />
                                </Form.Group>
                            </div>

                            {/* Ubicación */}
                            <div className="mb-5">
                                <h4 className="mb-4" style={{ color: '#9A1E47' }}>
                                    📍 Ubicación
                                </h4>
                                <Row>
                                    <Col md={4}>
                                        <Form.Group className="mb-4">
                                            <Form.Label className="fw-bold">Estado</Form.Label>
                                            <Form.Control 
                                                name="Estado" 
                                                value={formData.Estado} 
                                                onChange={handleChange}
                                                placeholder="Ej: Hidalgo"
                                                className="border-0 shadow-sm"
                                                style={{ borderRadius: '10px', padding: '12px' }}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={4}>
                                        <Form.Group className="mb-4">
                                            <Form.Label className="fw-bold">Municipio</Form.Label>
                                            <Form.Control 
                                                name="Municipio" 
                                                value={formData.Municipio} 
                                                onChange={handleChange}
                                                placeholder="Ej: Huejutla de Reyes"
                                                className="border-0 shadow-sm"
                                                style={{ borderRadius: '10px', padding: '12px' }}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={4}>
                                        <Form.Group className="mb-4">
                                            <Form.Label className="fw-bold">Dirección</Form.Label>
                                            <Form.Control 
                                                name="Direccion" 
                                                value={formData.Direccion} 
                                                onChange={handleChange}
                                                placeholder="Ej: Centro Histórico de Huejutla"
                                                className="border-0 shadow-sm"
                                                style={{ borderRadius: '10px', padding: '12px' }}
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-4">
                                            <Form.Label className="fw-bold">Latitud</Form.Label>
                                            <Form.Control 
                                                name="lat" 
                                                value={formData.lat} 
                                                onChange={handleChange}
                                                placeholder="Ej: 21.1365"
                                                className="border-0 shadow-sm"
                                                style={{ borderRadius: '10px', padding: '12px' }}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-4">
                                            <Form.Label className="fw-bold">Longitud</Form.Label>
                                            <Form.Control 
                                                name="lng" 
                                                value={formData.lng} 
                                                onChange={handleChange}
                                                placeholder="Ej: -98.4201"
                                                className="border-0 shadow-sm"
                                                style={{ borderRadius: '10px', padding: '12px' }}
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>
                            </div>

                            {/* Redes Sociales y Contacto */}
                            <div className="mb-5">
                                <h4 className="mb-4" style={{ color: '#9A1E47' }}>
                                    🌐 Redes Sociales y Contacto
                                </h4>
                                <Row>
                                    <Col md={4}>
                                        <Form.Group className="mb-4">
                                            <Form.Label className="fw-bold">📘 Facebook</Form.Label>
                                            <Form.Control 
                                                name="Facebook" 
                                                value={formData.Facebook} 
                                                onChange={handleChange}
                                                placeholder="Ej: facebook.com/tuRestaurante"
                                                className="border-0 shadow-sm"
                                                style={{ borderRadius: '10px', padding: '12px' }}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={4}>
                                        <Form.Group className="mb-4">
                                            <Form.Label className="fw-bold">📷 Instagram</Form.Label>
                                            <Form.Control 
                                                name="Instagram" 
                                                value={formData.Instagram} 
                                                onChange={handleChange}
                                                placeholder="Ej: @tuRestaurante"
                                                className="border-0 shadow-sm"
                                                style={{ borderRadius: '10px', padding: '12px' }}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={4}>
                                        <Form.Group className="mb-4">
                                            <Form.Label className="fw-bold">📱 WhatsApp</Form.Label>
                                            <Form.Control 
                                                name="WhatsApp" 
                                                value={formData.WhatsApp} 
                                                onChange={handleChange}
                                                placeholder="Ej: +52 55 1234 5678"
                                                className="border-0 shadow-sm"
                                                style={{ borderRadius: '10px', padding: '12px' }}
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-4">
                                            <Form.Label className="fw-bold">⏰ Horario</Form.Label>
                                            <Form.Control 
                                                name="Horario" 
                                                value={formData.Horario} 
                                                onChange={handleChange}
                                                placeholder="Ej: Lunes a Sábado, 9:00 am - 9:00 pm"
                                                className="border-0 shadow-sm"
                                                style={{ borderRadius: '10px', padding: '12px' }}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-4">
                                            <Form.Label className="fw-bold">☎️ Teléfono de contacto</Form.Label>
                                            <Form.Control 
                                                name="Contacto" 
                                                value={formData.Contacto} 
                                                onChange={handleChange}
                                                placeholder="Ej: 01 789 896 0738"
                                                className="border-0 shadow-sm"
                                                style={{ borderRadius: '10px', padding: '12px' }}
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Form.Group className="mb-4">
                                    <Form.Check 
                                        type="checkbox"
                                        name="Recomendado"
                                        checked={formData.Recomendado}
                                        onChange={handleChange}
                                        label="¿Recomendar este restaurante?"
                                    />
                                </Form.Group>
                            </div>

                            {/* Imágenes */}
                            <div className="mb-5">
                                <h4 className="mb-4" style={{ color: '#9A1E47' }}>
                                    📸 Imágenes del Restaurante
                                </h4>
                                <Form.Group className="mb-4">
                                    <Form.Label className="fw-bold">
                                        🖼️ Selecciona las imágenes <span className="text-muted">(Máximo 10 archivos, 5MB cada uno)</span>
                                    </Form.Label>
                                    <Form.Control 
                                        type="file" 
                                        name="Imagenes" 
                                        multiple 
                                        onChange={handleChange}
                                        accept="image/*"
                                        className="border-0 shadow-sm"
                                        style={{ borderRadius: '10px', padding: '12px' }}
                                    />
                                    <Form.Text className="text-muted">
                                        Formatos permitidos: JPG, PNG, JPEG, WEBP, GIF
                                    </Form.Text>
                                </Form.Group>
                                {imagePreviews.length > 0 && (
                                    <div className="mb-4">
                                        <h6 className="fw-bold mb-3">🖼️ Vista previa de imágenes:</h6>
                                        <Row>
                                            {imagePreviews.map((preview, index) => (
                                                <Col key={index} xs={6} sm={4} md={3} lg={2} className="mb-3">
                                                    <div 
                                                        className="position-relative"
                                                        style={{
                                                            borderRadius: '10px',
                                                            overflow: 'hidden',
                                                            boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                                                        }}
                                                    >
                                                        <img
                                                            src={preview}
                                                            alt={`Preview ${index + 1}`}
                                                            className="img-fluid"
                                                            style={{
                                                                width: '100%',
                                                                height: '120px',
                                                                objectFit: 'cover'
                                                            }}
                                                        />
                                                        <div 
                                                            className="position-absolute top-0 end-0 m-1"
                                                            style={{
                                                                background: 'rgba(0,0,0,0.7)',
                                                                color: 'white',
                                                                borderRadius: '50%',
                                                                width: '24px',
                                                                height: '24px',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                fontSize: '12px'
                                                            }}
                                                        >
                                                            {index + 1}
                                                        </div>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleRemoveImage(index)}
                                                            className="position-absolute top-0 start-0 m-1 btn btn-danger btn-sm"
                                                            style={{
                                                                width: '24px',
                                                                height: '24px',
                                                                borderRadius: '50%',
                                                                border: 'none',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                fontSize: '10px',
                                                                padding: '0'
                                                            }}
                                                            title="Eliminar imagen"
                                                        >
                                                            ×
                                                        </button>
                                                    </div>
                                                </Col>
                                            ))}
                                        </Row>
                                    </div>
                                )}
                            </div>

                            {/* Botón de envío */}
                            <div className="text-center">
                                <Button
                                    type="submit"
                                    variant="primary"
                                    size="lg"
                                    disabled={!idRestaurante || isSubmitting}
                                    className="px-5 py-3 fw-bold border-0 shadow"
                                    style={{ 
                                        backgroundColor: '#9A1E47', 
                                        borderRadius: '15px',
                                        minWidth: '200px'
                                    }}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                            Enviando...
                                        </>
                                    ) : (
                                        <>
                                            📤 Enviar Publicación
                                        </>
                                    )}
                                </Button>
                            </div>
                        </Form>
                    </Card.Body>
                </Card>
                <div className="mb-4 text-end">
                    <Button variant="success" onClick={() => setShowModal(true)}>
                        🍲 Agregar Platillo
                    </Button>
                </div>
                {/* Lista de platillos agregados */}
                {platillos.length > 0 && (
                    <Card className="mb-4 border-0 shadow-sm">
                        <Card.Body>
                            <h5 className="mb-3">Platillos agregados:</h5>
                            <Row>
                                {platillos.map((p, idx) => (
                                    <Col key={idx} md={6} lg={4} className="mb-3">
                                        <Card className="h-100 border-0 shadow-sm">
                                            {p.Imagenes && p.Imagenes.length > 0 && (
                                                <Card.Img variant="top" src={p.Imagenes[0]} style={{ height: 180, objectFit: 'cover' }} />
                                            )}
                                            <Card.Body>
                                                <Card.Title>{p.Nombre}</Card.Title>
                                                <Card.Subtitle className="mb-2 text-muted">{p.Categoria}</Card.Subtitle>
                                                <div className="mb-2">💲 <strong>{p.Precio}</strong></div>
                                                <div style={{ fontSize: 13 }}>{p.Descripcion}</div>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                ))}
                            </Row>
                        </Card.Body>
                    </Card>
                )}
                <Modal show={showModal} onHide={() => setShowModal(false)} centered size="lg">
                    <Modal.Header closeButton style={{ background: '#F8E8D0' }}>
                        <Modal.Title>🍲 Agregar Platillo al Restaurante</Modal.Title>
                    </Modal.Header>
                    <Modal.Body style={{ background: '#FFF9F2' }}>
                        <Form>
                            <Row>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>🍽️ Nombre del platillo</Form.Label>
                                        <InputGroup>
                                            <InputGroup.Text>🍽️</InputGroup.Text>
                                            <Form.Control name="Nombre" value={platilloForm.Nombre} onChange={handlePlatilloChange} required placeholder="Ej: Molletes con café de olla" />
                                        </InputGroup>
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Label>💲 Precio</Form.Label>
                                        <InputGroup>
                                            <InputGroup.Text>$</InputGroup.Text>
                                            <Form.Control type="number" name="Precio" value={platilloForm.Precio} onChange={handlePlatilloChange} required placeholder="Ej: 55" />
                                        </InputGroup>
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Label>🏷️ Categoría</Form.Label>
                                        <Form.Control name="Categoria" value={platilloForm.Categoria} onChange={handlePlatilloChange} required placeholder="Ej: Desayuno, Comida, Cena" />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>📝 Descripción</Form.Label>
                                        <Form.Control as="textarea" name="Descripcion" value={platilloForm.Descripcion} onChange={handlePlatilloChange} required placeholder="Describe el platillo..." rows={3} />
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Label>🥗 Ingredientes <span className="text-muted">(separados por coma)</span></Form.Label>
                                        <Form.Control name="Ingredientes" value={platilloForm.Ingredientes} onChange={handlePlatilloChange} required placeholder="Ej: bolillo, frijoles, queso, café, canela, piloncillo" />
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Label>👨‍🍳 Pasos de preparación <span className="text-muted">(uno por línea)</span></Form.Label>
                                        <Form.Control as="textarea" name="PasosPreparacion" value={platilloForm.PasosPreparacion} onChange={handlePlatilloChange} required placeholder={"1. ...\n2. ..."} rows={3} />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Form.Group className="mb-3">
                                <Form.Label>🖼️ Imágenes del platillo</Form.Label>
                                <Form.Control type="file" name="Imagenes" multiple onChange={handlePlatilloChange} accept="image/*" />
                                {platilloImagePreviews.length > 0 && (
                                    <div className="mt-2">
                                        <Row>
                                            {platilloImagePreviews.map((preview, idx) => (
                                                <Col key={idx} xs={6} md={4} className="mb-2">
                                                    <div className="position-relative">
                                                        <img src={preview} alt="preview" className="img-fluid rounded shadow" style={{ height: 120, objectFit: 'cover', width: '100%' }} />
                                                        <button type="button" className="btn btn-danger btn-sm position-absolute top-0 end-0" onClick={() => handleRemovePlatilloImage(idx)} style={{ borderRadius: '50%' }}>×</button>
                                                    </div>
                                                </Col>
                                            ))}
                                        </Row>
                                    </div>
                                )}
                            </Form.Group>
                            {platilloMensaje && (
                                <Alert variant={platilloMensaje.startsWith('✅') ? 'success' : 'danger'} className="mt-3">
                                    {platilloMensaje}
                                </Alert>
                            )}
                        </Form>
                    </Modal.Body>
                    <Modal.Footer style={{ background: '#F8E8D0' }}>
                        <Button variant="secondary" onClick={() => setShowModal(false)} disabled={isPlatilloSubmitting}>Cancelar</Button>
                        <Button variant="primary" onClick={handleAddPlatillo} disabled={isPlatilloSubmitting}>
                            {isPlatilloSubmitting ? <Spinner size="sm" animation="border" className="me-2" /> : '➕'} Agregar Platillo
                        </Button>
                    </Modal.Footer>
                </Modal>
            </Container>
        </Container>
    );
};

export default PublicarRestaurante; 