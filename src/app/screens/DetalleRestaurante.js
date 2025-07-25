import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Spinner, Badge, Modal } from 'react-bootstrap';
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
                const res = await axios.get('https://backend-iota-seven-19.vercel.app/api/comidaRestaurante');
                // Filtrar platillos por restaurante.Nombre
                const nombreRestaurante = restaurante.Nombre;
                const platillosFiltrados = res.data.filter(p => p.Restaurante && p.Restaurante.Nombre === nombreRestaurante);
                setPlatillos(platillosFiltrados);
            } catch (err) {
                // No bloquear la pantalla si falla
            }
        };
        fetchPlatillos();
    }, [restaurante]);

    // ... existing code ...
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

    // Depuración: usuario autenticado y comparación
    const usuario = currentUser;
    console.log('Usuario autenticado:', usuario);
    console.log('idUsuarioCreador:', idUsuarioCreador);
    const esCreador = usuario && idUsuarioCreador && usuario._id === idUsuarioCreador;
    console.log('Comparando:', usuario?._id, idUsuarioCreador, '=>', esCreador);

    const handleImagenClick = (platillo) => {
        setPlatilloSeleccionado(platillo);
        setShowModal(true);
    };

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
                onClick={() => navigate(-1)}
                style={{ color: '#9A1E47', textDecoration: 'none', marginBottom: '20px' }}
            >
                <FaArrowLeft /> Volver al listado
            </Button>
            {/* Botón para agregar platillo solo visible para el creador */}
            {esCreador && (
                <Button variant="primary" style={{ marginBottom: 20 }} onClick={() => {/* lógica para agregar platillo */ }}>
                    Agregar platillo
                </Button>
            )}
            <Row>
                <Col md={7}>
                    <Card className="mb-4" style={{ borderColor: '#0FA89C' }}>
                        {imagenes.length > 0 ? (
                            <Card.Img
                                variant="top"
                                src={imagenes[0]}
                                alt={nombre}
                                style={{ maxHeight: '400px', objectFit: 'cover', borderBottom: '3px solid #F28B27' }}
                                onError={(e) => e.target.src = '/placeholder-restaurant.jpg'}
                            />
                        ) : (
                            <div style={{ height: '400px', backgroundColor: '#ddd', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#666', borderBottom: '3px solid #F28B27' }}>
                                Sin imagen
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
                            <h5 style={{ color: '#9A1E47', fontWeight: 'bold', marginBottom: 16 }}>
                                Platillos del restaurante
                            </h5>
                            {platillos.length === 0 ? (
                                <div style={{ color: '#888', fontSize: '0.98rem' }}>Este restaurante aún no tiene platillos registrados.</div>
                            ) : (
                                <Row>
                                    {platillos.map((platillo) => (
                                        <Col key={platillo._id} xs={12} sm={6} md={6} lg={6} className="mb-4">
                                            <div style={{ textAlign: 'center' }}>
                                                {platillo.Imagenes && platillo.Imagenes.length > 0 ? (
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
                                                        onClick={() => handleImagenClick(platillo)}
                                                        onMouseEnter={e => e.target.style.transform = 'scale(1.04)'}
                                                        onMouseLeave={e => e.target.style.transform = 'scale(1)'}
                                                    />
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
                        </Card.Body>
                    </Card>
                    {/* Modal de detalles del platillo */}
                    <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
                        <Modal.Header closeButton style={{ backgroundColor: '#9A1E47', color: 'white' }}>
                            <Modal.Title>{platilloSeleccionado?.Nombre}</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            {platilloSeleccionado ? (
                                <div>
                                    {platilloSeleccionado.Imagenes && platilloSeleccionado.Imagenes.length > 0 && (
                                        <img
                                            src={platilloSeleccionado.Imagenes[0]}
                                            alt={platilloSeleccionado.Nombre}
                                            style={{ width: '100%', maxHeight: 300, objectFit: 'cover', borderRadius: 10, marginBottom: 16 }}
                                        />
                                    )}
                                    <h5 style={{ color: '#9A1E47', marginTop: 10 }}>Descripción</h5>
                                    <p>{platilloSeleccionado.Descripcion}</p>
                                    <h6 style={{ color: '#0FA89C', marginTop: 10 }}>Precio: ${platilloSeleccionado.Precio?.toFixed(2)}</h6>
                                    <h6 style={{ color: '#0FA89C', marginTop: 10 }}>Categoría: {platilloSeleccionado.Categoria}</h6>
                                    <h6 style={{ color: '#0FA89C', marginTop: 10 }}>Ingredientes:</h6>
                                    <ul>
                                        {platilloSeleccionado.Ingredientes?.map((ing, idx) => <li key={idx}>{ing}</li>)}
                                    </ul>
                                    <h6 style={{ color: '#0FA89C', marginTop: 10 }}>Pasos de preparación:</h6>
                                    <ol>
                                        {platilloSeleccionado.PasosPreparacion?.map((paso, idx) => <li key={idx}>{paso}</li>)}
                                    </ol>
                                </div>
                            ) : <Spinner animation="border" />}
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={() => setShowModal(false)}>
                                Cerrar
                            </Button>
                        </Modal.Footer>
                    </Modal>
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
                    {/* Aquí puedes agregar más información, promociones, menú, etc. */}
                </Col>
            </Row>
        </Container>
    );
};

export default DetalleRestaurante; 