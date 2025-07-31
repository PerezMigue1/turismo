import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Spinner, Badge, Modal, Form, Alert, InputGroup, Carousel } from 'react-bootstrap';
import { FaArrowLeft, FaMapMarkerAlt, FaStar, FaUtensils, FaClock, FaPhone, FaFacebook, FaInstagram, FaWhatsapp } from 'react-icons/fa';
import axios from 'axios';
import { useAuth } from '../Navigation/AuthContext';

const DetalleRestaurante = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [restaurante, setRestaurante] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [platillos, setPlatillos] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [platilloSeleccionado, setPlatilloSeleccionado] = useState(null);
    const [idUsuarioCreador, setIdUsuarioCreador] = useState(null);
    const { currentUser } = useAuth();
    
    // Debug: verificar el estado del usuario
    useEffect(() => {
        console.log('🔍 AuthContext - currentUser:', currentUser);
        console.log('🔍 AuthContext - token disponible:', currentUser?.token ? 'SÍ' : 'NO');
    }, [currentUser]);

    // Variables para el modal de agregar platillo
    const [showPlatilloModal, setShowPlatilloModal] = useState(false);
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
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get(`https://backend-iota-seven-19.vercel.app/api/restaurante/${id}`);
                setRestaurante(res.data);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);



    useEffect(() => {
        const fetchPlatillos = async () => {
            if (!restaurante) return;
            try {
                console.log('🔍 Buscando platillos para restaurante:', restaurante.Nombre);
                const res = await axios.get('https://backend-iota-seven-19.vercel.app/api/comidaRestaurante');
                console.log('🔍 Todos los platillos obtenidos:', res.data);
                
                // Filtrar platillos por restaurante.Nombre y solo mostrar los aprobados
                const nombreRestaurante = restaurante.Nombre;
                const platillosFiltrados = res.data.filter(p => {
                    const coincideRestaurante = p.Restaurante && p.Restaurante.Nombre === nombreRestaurante;
                    const esAprobado = p.estadoRevision === 'aprobado';
                    console.log(`🔍 Platillo ${p.Nombre}: restaurante=${coincideRestaurante}, estado=${p.estadoRevision}, aprobado=${esAprobado}`);
                    return coincideRestaurante && esAprobado;
                });
                
                console.log('🔍 Platillos filtrados:', platillosFiltrados);
                setPlatillos(platillosFiltrados);
            } catch (err) {
                console.error('Error al obtener platillos:', err);
                // No bloquear la pantalla si falla
            }
        };
        fetchPlatillos();
    }, [restaurante]);

    useEffect(() => {
        const fetchCreador = async () => {
            if (!restaurante?.idRestaurante) return;
            console.log('restaurante.idRestaurante:', restaurante.idRestaurante);
            try {
                const res = await axios.get(`https://backend-iota-seven-19.vercel.app/api/contactoRestaurante/por-restaurante/${restaurante.idRestaurante}`);
                console.log('Respuesta contactoRestaurante:', res.data);
                setIdUsuarioCreador(res.data.idUsuario);
            } catch (err) {
                setIdUsuarioCreador(null);
            }
        };
        fetchCreador();
    }, [restaurante]);

    if (loading) {
        return (
            <Container style={{ backgroundColor: '#FDF2E0', padding: '30px 0', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Spinner animation="border" variant="primary" />
            </Container>
        );
    }

    if (error || !restaurante) {
        return (
            <Container style={{ backgroundColor: '#FDF2E0', padding: '30px 0', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Card body bg="danger" text="white">
                    Error al cargar el restaurante: {error || 'No encontrado'}
                    <Button variant="link" onClick={() => navigate('/restaurantes')}>Volver al listado</Button>
                </Card>
            </Container>
        );
    }

    const handleBack = () => {
        navigate(-1);
    };

    const handleShowModal = (platillo) => {
        setPlatilloSeleccionado(platillo);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setPlatilloSeleccionado(null);
        setCurrentImageIndex(0); // Resetear índice al cerrar
    };





    const handleShowPlatilloModal = () => {
        console.log('🔍 handleShowPlatilloModal llamado');
        setPlatilloForm({
            Nombre: '',
            Descripcion: '',
            Precio: '',
            Categoria: '',
            Ingredientes: '',
            PasosPreparacion: '',
            Imagenes: [],
        });
        setPlatilloImagePreviews([]);
        setPlatilloMensaje(null);
        setShowPlatilloModal(true);
        console.log('🔍 showPlatilloModal establecido en true');
    };

    const handleClosePlatilloModal = () => {
        setShowPlatilloModal(false);
    };

    const handleRemoveImage = (indexToRemove) => {
        const newFiles = Array.from(platilloForm.Imagenes).filter((_, index) => index !== indexToRemove);
        const newPreviews = platilloImagePreviews.filter((_, index) => index !== indexToRemove);
        setPlatilloForm({ ...platilloForm, Imagenes: newFiles });
        setPlatilloImagePreviews(newPreviews);
        URL.revokeObjectURL(platilloImagePreviews[indexToRemove]);
    };

    // Funciones para el modal de platillos
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

    const recargarPlatillos = async () => {
        if (!restaurante) return;
        try {
            console.log('🔍 Recargando platillos para restaurante:', restaurante.Nombre);
            const res = await axios.get('https://backend-iota-seven-19.vercel.app/api/comidaRestaurante');
            console.log('🔍 TODOS los platillos del servidor:', res.data);
            
            const nombreRestaurante = restaurante.Nombre;
            console.log('🔍 Buscando platillos para restaurante:', nombreRestaurante);
            
            const platillosFiltrados = res.data.filter(p => {
                console.log('🔍 Analizando platillo:', p.Nombre);
                console.log('🔍 - Restaurante del platillo:', p.Restaurante);
                console.log('🔍 - Nombre del restaurante del platillo:', p.Restaurante?.Nombre);
                console.log('🔍 - Estado del platillo:', p.estadoRevision);
                
                const coincideRestaurante = p.Restaurante && p.Restaurante.Nombre === nombreRestaurante;
                const esAprobado = p.estadoRevision === 'aprobado';
                
                console.log('🔍 - ¿Coincide restaurante?:', coincideRestaurante);
                console.log('🔍 - ¿Es aprobado?:', esAprobado);
                console.log('🔍 - ¿Pasa el filtro?:', coincideRestaurante && esAprobado);
                
                return coincideRestaurante && esAprobado;
            });
            
            console.log('🔍 Platillos filtrados finales:', platillosFiltrados);
            setPlatillos(platillosFiltrados);
        } catch (err) {
            console.error('Error al recargar platillos:', err);
        }
    };

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
        
        // Procesar ingredientes
        platilloForm.Ingredientes.split(',').map(i => i.trim()).filter(Boolean).forEach(i => data.append('Ingredientes', i));
        
        // Procesar pasos de preparación
        platilloForm.PasosPreparacion.split('\n').map(p => p.trim()).filter(Boolean).forEach(p => data.append('PasosPreparacion', p));
        
        // Procesar imágenes
        if (platilloForm.Imagenes && platilloForm.Imagenes.length > 0) {
            for (let i = 0; i < platilloForm.Imagenes.length; i++) {
                data.append('Imagenes', platilloForm.Imagenes[i]);
            }
        }
        
        // Agregar información del restaurante
        data.append('idRestaurante', restaurante.idRestaurante);
        data.append('Restaurante.Nombre', restaurante.Nombre);
        data.append('Restaurante.Ubicacion.Municipio', restaurante.Ubicacion?.Municipio || '');
        data.append('Restaurante.Ubicacion.Estado', restaurante.Ubicacion?.Estado || '');
        
        // Agregar estado de revisión pendiente
        data.append('estadoRevision', 'pendiente');

        // Log de los datos que se van a enviar
        console.log('🔍 Datos del FormData:');
        for (let [key, value] of data.entries()) {
            console.log(`🔍 ${key}:`, value);
        }

        try {
            // Obtener el token del AuthContext
            const token = currentUser?.token;
            
            console.log('🔍 CurrentUser completo:', currentUser);
            console.log('🔍 Token obtenido:', token);
            console.log('🔍 ¿Hay token?:', !!token);
            
            if (!token) {
                setPlatilloMensaje('❌ No hay token de autorización. Por favor, inicia sesión nuevamente.');
                setIsPlatilloSubmitting(false);
                return;
            }
            
            console.log('🔍 Enviando petición con headers:', {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${token}`
            });
            
            const res = await axios.post('https://backend-iota-seven-19.vercel.app/api/comidaRestaurante', data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                }
            });
            
            setPlatilloMensaje('✅ Platillo enviado para revisión del administrador');
            setPlatilloForm({ 
                Nombre: '', 
                Descripcion: '', 
                Precio: '', 
                Categoria: '', 
                Ingredientes: '', 
                PasosPreparacion: '', 
                Imagenes: [] 
            });
            setPlatilloImagePreviews([]);
            
            setTimeout(() => {
                setShowPlatilloModal(false);
                setPlatilloMensaje(null);
            }, 2000);
        } catch (error) {
            console.error('Error al guardar platillo:', error);
            setPlatilloMensaje('❌ Error al enviar platillo para revisión');
        } finally {
            setIsPlatilloSubmitting(false);
        }
    };

    const nombre = restaurante.Nombre;
    const descripcion = restaurante.Descripcion;
    const ubicacion = restaurante.Ubicacion;
    const horario = restaurante.Horario;
    const contacto = restaurante.Contacto;
    const categoria = restaurante.Categoria;
    const redes = restaurante.RedesSociales || {};
    const resenas = restaurante.Reseñas || [];
    const imagenes = restaurante.Imagenes || [];

    return (
        <Container style={{ backgroundColor: '#FDF2E0', padding: '30px 0', minHeight: '100vh' }}>
            <Button
                variant="link"
                onClick={handleBack}
                style={{ color: '#9A1E47', textDecoration: 'none', marginBottom: '20px' }}
            >
                <FaArrowLeft /> Volver al listado
            </Button>
            
            <Row>
                <Col md={7}>
                    <Card className="mb-4" style={{ borderColor: '#0FA89C' }}>
                        {imagenes.length > 0 ? (
                            imagenes.length > 1 ? (
                                <Carousel interval={4000} controls={true} indicators={true}>
                                    {imagenes.map((img, idx) => (
                                        <Carousel.Item key={idx}>
                                            <img
                                                src={img}
                                                alt={`Imagen ${idx + 1}`}
                                                className="d-block w-100"
                                                style={{ objectFit: 'cover', height: '400px' }}
                                                onError={(e) => e.target.src = '/placeholder-restaurant.jpg'}
                                            />
                                        </Carousel.Item>
                                    ))}
                                </Carousel>
                            ) : (
                                <Card.Img
                                    variant="top"
                                    src={imagenes[0]}
                                    alt={nombre}
                                    style={{ maxHeight: '400px', objectFit: 'cover', borderBottom: '3px solid #F28B27' }}
                                    onError={(e) => e.target.src = '/placeholder-restaurant.jpg'}
                                />
                            )
                        ) : (
                            <div style={{ height: '400px', backgroundColor: '#ddd', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#666', borderBottom: '3px solid #F28B27' }}>
                                Sin imagen
                            </div>
                        )}
                        
                        {/* Miniaturas del restaurante (solo si hay múltiples imágenes) */}
                        {imagenes.length > 1 && (
                            <div className="d-flex gap-2 mb-4 flex-wrap">
                                {imagenes.map((img, idx) => (
                                    <img
                                        key={idx}
                                        src={img}
                                        alt={`Miniatura ${idx + 1}`}
                                        className={`img-thumbnail ${currentImageIndex === idx ? 'border border-danger' : ''}`}
                                        style={{ width: 75, height: 75, objectFit: 'cover', cursor: 'pointer' }}
                                        onClick={() => setCurrentImageIndex(idx)}
                                        onError={(e) => e.target.src = '/placeholder-restaurant.jpg'}
                                    />
                                ))}
                            </div>
                        )}
                        <Card.Body style={{ backgroundColor: '#FEF8ED' }}>
                            <h3 style={{ color: '#9A1E47' }}>{nombre}</h3>
                            <div className="d-flex align-items-center mb-3">
                                <Badge style={{ backgroundColor: '#1E8546', marginRight: '10px' }}>{categoria}</Badge>
                                <div style={{ color: '#F28B27' }}>
                                    {[...Array(5)].map((_, i) => (
                                        <FaStar key={i} color={i < 4 ? '#F28B27' : '#ddd'} />
                                    ))}
                                    <small style={{ color: '#A0C070', marginLeft: '5px' }}>(Reseñas: {resenas.length})</small>
                                </div>
                            </div>
                            {ubicacion && (
                                <div className="d-flex align-items-center mb-2" style={{ color: '#0FA89C' }}>
                                    <FaMapMarkerAlt className="me-2" />
                                    <span>{ubicacion.Municipio}, {ubicacion.Estado}</span>
                                </div>
                            )}
                            {horario && (
                                <div className="d-flex align-items-center mb-2" style={{ color: '#0FA89C' }}>
                                    <FaClock className="me-2" />
                                    <span>{horario}</span>
                                </div>
                            )}
                            {contacto && (
                                <div className="d-flex align-items-center mb-2" style={{ color: '#0FA89C' }}>
                                    <FaPhone className="me-2" />
                                    <span>{contacto}</span>
                                </div>
                            )}
                            {(redes.Facebook || redes.Instagram || redes.WhatsApp) && (
                                <div style={{ marginBottom: 16, fontWeight: 600 }}>
                                    Redes sociales:
                                    {redes.Facebook && (
                                        <a href={redes.Facebook} target="_blank" rel="noopener noreferrer" style={{ marginLeft: 10 }}><FaFacebook color="#3b5998" size={22} /></a>
                                    )}
                                    {redes.Instagram && (
                                        <a href={redes.Instagram} target="_blank" rel="noopener noreferrer" style={{ marginLeft: 10 }}><FaInstagram color="#E1306C" size={22} /></a>
                                    )}
                                    {redes.WhatsApp && (
                                        <a href={`https://wa.me/${redes.WhatsApp}`} target="_blank" rel="noopener noreferrer" style={{ marginLeft: 10 }}><FaWhatsapp color="#25D366" size={22} /></a>
                                    )}
                                </div>
                            )}
                            <p style={{ color: '#555', fontSize: '1.1rem', margin: 0 }}>{descripcion}</p>
                        </Card.Body>
                    </Card>
                    
                    {/* Platillos del restaurante */}
                    <Card className="mb-4" style={{ borderColor: '#0FA89C' }}>
                        <Card.Body style={{ backgroundColor: '#FEF8ED' }}>
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h5 style={{ color: '#9A1E47', fontWeight: 'bold', margin: 0 }}>
                                    Platillos del restaurante
                                </h5>
                                <Button 
                                    variant="outline-primary" 
                                    size="sm" 
                                    onClick={recargarPlatillos}
                                    style={{ borderColor: '#0FA89C', color: '#0FA89C' }}
                                >
                                    🔄 Actualizar
                                </Button>
                            </div>
                            {platillos.length === 0 ? (
                                <div style={{ color: '#888', fontSize: '0.98rem' }}>Este restaurante aún no tiene platillos registrados.</div>
                            ) : (
                                <Row>
                                    {platillos.map((platillo) => (
                                        <Col key={platillo._id} xs={12} sm={6} md={6} lg={6} className="mb-4">
                                            <div style={{ textAlign: 'center' }}>
                                                {platillo.Imagenes && platillo.Imagenes.length > 0 ? (
                                                    <div style={{ position: 'relative' }}>
                                                        {/* Imagen principal */}
                                                        <img
                                                            src={platillo.Imagenes[0]}
                                                            alt={platillo.Nombre}
                                                            style={{
                                                                width: 220,
                                                                height: 140,
                                                                objectFit: 'cover',
                                                                borderRadius: 12,
                                                                border: '2px solid #0FA89C',
                                                                boxShadow: '0 4px 18px rgba(154,30,71,0.10)',
                                                                cursor: 'pointer',
                                                                transition: 'transform 0.2s',
                                                                margin: '0 auto',
                                                                display: 'block'
                                                            }}
                                                            onClick={() => handleShowModal(platillo)}
                                                            onMouseEnter={e => e.target.style.transform = 'scale(1.04)'}
                                                            onMouseLeave={e => e.target.style.transform = 'scale(1)'}
                                                        />
                                                        {/* Indicador de múltiples imágenes */}
                                                        {platillo.Imagenes.length > 1 && (
                                                            <div style={{
                                                                position: 'absolute',
                                                                top: 8,
                                                                right: 8,
                                                                backgroundColor: 'rgba(154, 30, 71, 0.9)',
                                                                color: 'white',
                                                                borderRadius: '50%',
                                                                width: 24,
                                                                height: 24,
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                fontSize: '12px',
                                                                fontWeight: 'bold',
                                                                border: '2px solid white'
                                                            }}>
                                                                +{platillo.Imagenes.length - 1}
                                                            </div>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <div style={{
                                                        width: 220,
                                                        height: 140,
                                                        backgroundColor: '#ddd',
                                                        borderRadius: 12,
                                                        border: '2px solid #0FA89C',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        color: '#666',
                                                        margin: '0 auto',
                                                        boxShadow: '0 4px 18px rgba(154,30,71,0.10)'
                                                    }}>
                                                        Sin imagen
                                                    </div>
                                                )}
                                                <h6 style={{ marginTop: 12, color: '#9A1E47', fontWeight: 'bold', fontSize: '1.05rem', letterSpacing: 0.2 }}>{platillo.Nombre}</h6>
                                            </div>
                                        </Col>
                                    ))}
                                </Row>
                            )}
                            
                            {/* Botón para agregar platillo solo visible para el creador */}
                            {(() => {
                                console.log('🔍 Verificando condición del botón:');
                                console.log('🔍 currentUser?._id:', currentUser?._id);
                                console.log('🔍 idUsuarioCreador:', idUsuarioCreador);
                                console.log('🔍 ¿Son iguales?:', currentUser?._id === idUsuarioCreador);
                                return currentUser?._id === idUsuarioCreador && (
                                    <Button variant="primary" onClick={handleShowPlatilloModal} className="mt-3">
                                        <FaUtensils /> Agregar Platillo
                                    </Button>
                                );
                            })()}
                        </Card.Body>
                    </Card>
                </Col>
                
                <Col md={5}>
                    {/* Reseñas */}
                    <Card className="mb-4" style={{ borderColor: '#0FA89C' }}>
                        <Card.Body style={{ backgroundColor: '#FEF8ED' }}>
                            <h5 style={{ color: '#9A1E47', fontWeight: 'bold', marginBottom: 16 }}>
                                Reseñas ({resenas.length})
                            </h5>
                            {resenas.length === 0 ? (
                                <div style={{ color: '#888', fontSize: '0.98rem' }}>Este restaurante aún no tiene reseñas.</div>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                    {resenas.map((resena, idx) => (
                                        <div key={idx} style={{ marginBottom: 8 }}>
                                            <span style={{ fontWeight: 600, color: '#9A1E47' }}>{resena.Usuario}</span>
                                            <div style={{ color: '#444', fontSize: '1.05rem', whiteSpace: 'pre-line' }}>{resena.Comentario}</div>
                                            <div style={{ color: '#F28B27' }}>{[...Array(resena.Calificacion || 0)].map((_, i) => <FaStar key={i} color="#F28B27" />)}</div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Modal de detalles del platillo */}
            <Modal show={showModal} onHide={handleCloseModal} size="lg" centered>
                <Modal.Header closeButton style={{ backgroundColor: '#9A1E47', color: 'white' }}>
                    <Modal.Title>{platilloSeleccionado?.Nombre}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {platilloSeleccionado ? (
                        <div>
                            {/* Carrusel de imágenes */}
                            {platilloSeleccionado.Imagenes && platilloSeleccionado.Imagenes.length > 0 && (
                                <div className="mb-4">
                                    {platilloSeleccionado.Imagenes.length > 1 ? (
                                        <Carousel activeIndex={currentImageIndex} onSelect={setCurrentImageIndex} interval={3000}>
                                            {platilloSeleccionado.Imagenes.map((img, idx) => (
                                                <Carousel.Item key={idx}>
                                                    <img
                                                        src={img}
                                                        alt={`Imagen ${idx + 1}`}
                                                        className="d-block w-100"
                                                        style={{ objectFit: 'cover', height: '400px' }}
                                                        onError={(e) => e.target.src = '/placeholder-restaurant.jpg'}
                                                    />
                                                </Carousel.Item>
                                            ))}
                                        </Carousel>
                                    ) : (
                                        <img
                                            src={platilloSeleccionado.Imagenes[0]}
                                            alt={platilloSeleccionado.Nombre}
                                            style={{ 
                                                width: '100%', 
                                                maxHeight: 400, 
                                                objectFit: 'cover', 
                                                borderRadius: 10,
                                                border: '3px solid #0FA89C'
                                            }}
                                        />
                                    )}
                                    
                                    {/* Miniaturas de navegación (solo si hay múltiples imágenes) */}
                                    {platilloSeleccionado.Imagenes.length > 1 && (
                                        <div className="d-flex gap-2 mt-3 flex-wrap">
                                            {platilloSeleccionado.Imagenes.map((img, idx) => (
                                                <img
                                                    key={idx}
                                                    src={img}
                                                    alt={`Miniatura ${idx + 1}`}
                                                    className={`img-thumbnail ${currentImageIndex === idx ? 'border border-danger' : ''}`}
                                                    style={{ width: 75, height: 75, objectFit: 'cover', cursor: 'pointer' }}
                                                    onClick={() => setCurrentImageIndex(idx)}
                                                    onError={(e) => e.target.src = '/placeholder-restaurant.jpg'}
                                                />
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                            
                            {/* Información del platillo */}
                            <Row>
                                <Col md={6}>
                                    <h5 style={{ color: '#9A1E47', marginTop: 10 }}>Descripción</h5>
                                    <p style={{ fontSize: '1.05rem', lineHeight: '1.6' }}>{platilloSeleccionado.Descripcion}</p>
                                    
                                    <h6 style={{ color: '#0FA89C', marginTop: 15 }}>💲 Precio: ${platilloSeleccionado.Precio?.toFixed(2)}</h6>
                                    <h6 style={{ color: '#0FA89C', marginTop: 10 }}>🏷️ Categoría: {platilloSeleccionado.Categoria}</h6>
                                </Col>
                                <Col md={6}>
                                    {platilloSeleccionado.Ingredientes && platilloSeleccionado.Ingredientes.length > 0 && (
                                        <div>
                                            <h6 style={{ color: '#0FA89C', marginTop: 10 }}>🥗 Ingredientes:</h6>
                                            <ul style={{ fontSize: '1.05rem' }}>
                                                {platilloSeleccionado.Ingredientes.map((ing, idx) => (
                                                    <li key={idx}>{ing}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </Col>
                            </Row>
                            
                            {/* Pasos de preparación */}
                            {platilloSeleccionado.PasosPreparacion && platilloSeleccionado.PasosPreparacion.length > 0 && (
                                <div style={{ marginTop: 20 }}>
                                    <h6 style={{ color: '#0FA89C' }}>👨‍🍳 Pasos de preparación:</h6>
                                    <ol style={{ fontSize: '1.05rem' }}>
                                        {platilloSeleccionado.PasosPreparacion.map((paso, idx) => (
                                            <li key={idx}>{paso}</li>
                                        ))}
                                    </ol>
                                </div>
                            )}
                        </div>
                    ) : <Spinner animation="border" />}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Cerrar
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Modal de agregar platillo */}
            <Modal show={showPlatilloModal} onHide={handleClosePlatilloModal} centered size="lg">
                {console.log('🔍 showPlatilloModal en Modal:', showPlatilloModal)}
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
                    <Button variant="secondary" onClick={handleClosePlatilloModal} disabled={isPlatilloSubmitting}>Cancelar</Button>
                    <Button variant="primary" onClick={handleAddPlatillo} disabled={isPlatilloSubmitting}>
                        {isPlatilloSubmitting ? <Spinner size="sm" animation="border" className="me-2" /> : '➕'} Agregar Platillo
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default DetalleRestaurante; 