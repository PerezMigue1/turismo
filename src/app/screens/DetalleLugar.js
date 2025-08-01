import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Container, Card, Badge, Button, Row, Col, Alert, Spinner, Form, Tabs, Tab, Carousel } from 'react-bootstrap';
import { FaMapMarkerAlt, FaClock, FaPhone, FaStar, FaArrowLeft, FaHiking, FaDollarSign, FaLink, FaMapMarkedAlt, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const DetalleLugar = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lugar, setLugar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mensajeEnviado, setMensajeEnviado] = useState(null);

  // Estados para el formulario de contacto
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [telefono, setTelefono] = useState('');
  const [comentario, setComentario] = useState('');

  useEffect(() => {
    axios.get(`https://backend-iota-seven-19.vercel.app/api/lugares/${id}`)
      .then(res => setLugar(res.data))
      .catch(() => setLugar(null))
      .finally(() => setLoading(false));
  }, [id]);

  const handleEnviarComentario = async (e) => {
    e.preventDefault();
    try {
      await axios.post("https://backend-iota-seven-19.vercel.app/api/contacto", {
        nombre,
        correo,
        telefono,
        comentario,
        idLugar: lugar._id || lugar.id
      });

      setMensajeEnviado("Comentario enviado correctamente.");
      setNombre('');
      setCorreo('');
      setTelefono('');
      setComentario('');
    } catch (error) {
      setMensajeEnviado("Error al enviar el comentario.");
      console.error(error);
    }
  };

  if (loading) {
    return (
      <Container style={{ backgroundColor: '#FDF2E0', padding: '30px 0', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  if (error) {
    return (
      <Container style={{ backgroundColor: '#FDF2E0', padding: '30px 0', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Alert variant="danger">
          Error al cargar el lugar: {error}
          <Button variant="link" onClick={() => window.location.reload()}>Intentar de nuevo</Button>
        </Alert>
      </Container>
    );
  }

  if (!lugar) {
    return (
      <Container style={{ backgroundColor: '#FDF2E0', padding: '30px 0', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Alert variant="warning">
          Lugar no encontrado
          <Button variant="link" onClick={() => navigate('/lugares')}>Volver al listado</Button>
        </Alert>
      </Container>
    );
  }

  // Manejo mejorado de imágenes para carrusel
  let imagenes = [];
  
  // Buscar en todas las propiedades posibles de imágenes
  if (lugar.Imagenes && Array.isArray(lugar.Imagenes) && lugar.Imagenes.length > 0) {
    imagenes = lugar.Imagenes;
  } else if (lugar.Imagen && Array.isArray(lugar.Imagen) && lugar.Imagen.length > 0) {
    imagenes = lugar.Imagen;
  } else if (lugar.Imagenes && typeof lugar.Imagenes === 'string') {
    imagenes = [lugar.Imagenes];
  } else if (lugar.Imagen && typeof lugar.Imagen === 'string') {
    imagenes = [lugar.Imagen];
  }
  
  // Si no hay imágenes, usar una imagen por defecto
  if (imagenes.length === 0) {
    imagenes = ['/placeholder-product.jpg'];
  }

  const municipio = lugar.Ubicacion?.Municipio || '';
  const categoria = lugar.idCtgLugar || '';
  
  // Buscar links - CORRECCIÓN PRINCIPAL
  let links = [];
  
  // Buscar en todas las propiedades posibles y tomar la primera que tenga contenido válido
  const posiblesLinks = [
    lugar['Link educativos'],        // Tu campo exacto
    lugar.LinkEducativos,
    lugar.linkEducativos,
    lugar.links,
    lugar.Links,
    lugar.link,
    lugar.Link,
    lugar.url,
    lugar.Url
  ];

  // Encontrar el primer campo que tenga contenido válido
  for (let linkField of posiblesLinks) {
    if (linkField) {
      if (Array.isArray(linkField)) {
        links = linkField;
      } else if (typeof linkField === 'string' && linkField.trim() !== '') {
        links = [linkField];
      }
      
      // Si encontramos links válidos, salir del bucle
      if (links.length > 0) {
        break;
      }
    }
  }
  
  // Filtrar links válidos
  links = links.filter(link => link && typeof link === 'string' && link.trim() !== '');
  
  const calificacion = lugar.Calificacion || lugar.calificacion || 4;

  return (
    <Container style={{ backgroundColor: '#FDF2E0', padding: '30px 0', minHeight: '100vh' }}>
      <Button
        variant="link"
        onClick={() => navigate(-1)}
        style={{ color: '#9A1E47', textDecoration: 'none', marginBottom: '20px' }}
      >
        <FaArrowLeft /> Volver al listado
      </Button>

      <Row>
        <Col md={7}>
          <Card className="mb-4" style={{ borderColor: '#0FA89C' }}>
            <Carousel 
              interval={5000} 
              controls={imagenes.length > 1}
              indicators={imagenes.length > 1}
              style={{ 
                borderBottom: '3px solid #F28B27',
                backgroundColor: '#f8f9fa'
              }}
            >
              {imagenes.map((imagen, index) => (
                <Carousel.Item key={index}>
                  <img
                    className="d-block w-100"
                    src={imagen}
                    alt={`${lugar.Nombre} - Imagen ${index + 1}`}
                    style={{ 
                      height: '500px', 
                      objectFit: 'cover',
                      width: '100%'
                    }}
                    onError={(e) => e.target.src = '/placeholder-product.jpg'}
                  />
                  {imagenes.length > 1 && (
                    <Carousel.Caption style={{ 
                      background: 'rgba(0, 0, 0, 0.5)', 
                      borderRadius: '8px',
                      padding: '10px'
                    }}>
                      <p style={{ margin: 0, fontSize: '14px' }}>
                        Imagen {index + 1} de {imagenes.length}
                      </p>
                    </Carousel.Caption>
                  )}
                </Carousel.Item>
              ))}
            </Carousel>
          </Card>

          <Card className="mb-4" style={{ borderColor: '#0FA89C' }}>
            <Card.Body style={{ backgroundColor: '#FDF2E0' }}>
              <Tabs defaultActiveKey="descripcion" id="lugar-tabs" className="mb-3">
                <Tab eventKey="descripcion" title="Descripción">
                  <h4 style={{ color: '#9A1E47', marginTop: '15px' }}>Descripción del lugar</h4>
                  <p style={{ color: '#555' }}>{lugar.Descripcion || lugar.descripcion}</p>
                </Tab>

                <Tab eventKey="informacion" title="Información">
                  <h4 style={{ color: '#9A1E47', marginTop: '15px' }}>Detalles del lugar</h4>
                  <div style={{ color: '#555' }}>
                    {lugar.Horarios && (
                      <p><strong>Horarios:</strong> {lugar.Horarios}</p>
                    )}
                    {lugar.Contacto && (
                      <p><strong>Contacto:</strong> {lugar.Contacto}</p>
                    )}
                    {lugar.Costo && (
                      <p><strong>Costo:</strong> {lugar.Costo}</p>
                    )}
                    {(lugar.NivelDeDificultad || lugar.nivelDeDificultad || lugar['Nivel de dificultad'] || lugar['nivel de dificultad']) && (
                      <p><strong>Nivel de dificultad:</strong> {lugar.NivelDeDificultad || lugar.nivelDeDificultad || lugar['Nivel de dificultad'] || lugar['nivel de dificultad']}</p>
                    )}
                  </div>
                </Tab>

                <Tab eventKey="links" title="Links educativos">
                  <h4 style={{ color: '#9A1E47', marginTop: '15px' }}>Links educativos</h4>
                  {links.length > 0 ? (
                    <div style={{ color: '#555' }}>
                      {links.map((link, i) => (
                        <p key={i}>
                          <a
                            href={link.startsWith('http') ? link : `https://${link}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ 
                              color: '#0FA89C', 
                              textDecoration: 'underline',
                              wordBreak: 'break-all'
                            }}
                          >
                            {link}
                          </a>
                        </p>
                      ))}
                    </div>
                  ) : (
                    <p style={{ color: '#666' }}>No hay links educativos disponibles</p>
                  )}
                </Tab>
              </Tabs>
            </Card.Body>
          </Card>
        </Col>

        <Col md={5}>
          <Card className="sticky-top" style={{ top: '20px', borderColor: '#0FA89C' }}>
            <Card.Body style={{ backgroundColor: '#FDF2E0' }}>
              <h3 style={{ color: '#9A1E47' }}>{lugar.Nombre || lugar.nombre}</h3>
              <div className="d-flex align-items-center mb-3">
                <Badge style={{ backgroundColor: '#1E8546', marginRight: '10px' }}>{categoria}</Badge>
                <div style={{ color: '#F28B27' }}>
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} color={i < calificacion ? '#F28B27' : '#ddd'} />
                  ))}
                  <small style={{ color: '#A0C070', marginLeft: '5px' }}>(Calificación: {calificacion}/5)</small>
                </div>
              </div>
              <div className="d-flex align-items-center mb-3" style={{ color: '#0FA89C' }}>
                <FaMapMarkerAlt className="me-2" />
                <span>{municipio}, Hidalgo</span>
              </div>

              {/* Información adicional */}
              <div style={{ marginBottom: '20px' }}>
                {lugar.Costo && (
                  <div className="d-flex align-items-center mb-2" style={{ color: '#0FA89C' }}>
                    <FaDollarSign className="me-2" />
                    <span><strong>Costo:</strong> {lugar.Costo}</span>
                  </div>
                )}
                {(lugar.NivelDeDificultad || lugar.nivelDeDificultad || lugar['Nivel de dificultad'] || lugar['nivel de dificultad']) && (
                  <div className="d-flex align-items-center mb-2" style={{ color: '#0FA89C' }}>
                    <FaHiking className="me-2" />
                    <span><strong>Dificultad:</strong> {lugar.NivelDeDificultad || lugar.nivelDeDificultad || lugar['Nivel de dificultad'] || lugar['nivel de dificultad']}</span>
                  </div>
                )}
                {links.length > 0 && (
                  <div className="d-flex align-items-center mb-2" style={{ color: '#0FA89C' }}>
                    <FaLink className="me-2" />
                    <span><strong>Links educativos:</strong> Disponibles</span>
                  </div>
                )}
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Formulario de contacto */}
      <Row className="justify-content-center mt-5">
        <Col md={8}>
          <Card style={{ borderColor: '#0FA89C' }}>
            <Card.Body style={{ backgroundColor: '#FDF2E0' }}>
              <h4 style={{ color: '#9A1E47', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: 8 }}>
                <FaMapMarkedAlt color="#1E8546" />
                ¿Tienes dudas o deseas más información sobre este lugar?
              </h4>

              {mensajeEnviado && (
                <Alert variant={mensajeEnviado.includes("Error") ? "danger" : "success"}>
                  {mensajeEnviado}
                </Alert>
              )}

              <Form onSubmit={handleEnviarComentario}>
                <Form.Group controlId="formNombre" className="mb-3">
                  <Form.Label>Nombre</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Tu nombre"
                    required
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                  />
                </Form.Group>

                <Form.Group controlId="formCorreo" className="mb-3">
                  <Form.Label>Correo electrónico</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="tu@email.com"
                    required
                    value={correo}
                    onChange={(e) => setCorreo(e.target.value)}
                  />
                </Form.Group>

                <Form.Group controlId="formTelefono" className="mb-3">
                  <Form.Label>Teléfono</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Opcional"
                    value={telefono}
                    onChange={(e) => setTelefono(e.target.value)}
                  />
                </Form.Group>

                <Form.Group controlId="formComentario" className="mb-3">
                  <Form.Label>Comentario</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    placeholder="Escribe tu mensaje..."
                    required
                    value={comentario}
                    onChange={(e) => setComentario(e.target.value)}
                  />
                </Form.Group>

                <Button type="submit" variant="primary" style={{ backgroundColor: '#9A1E47', borderColor: '#9A1E47' }}>
                  Enviar mensaje
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

// Estilos CSS personalizados para el carrusel
const carouselStyles = `
  .carousel-control-prev,
  .carousel-control-next {
    background: rgba(154, 30, 71, 0.8);
    border-radius: 50%;
    width: 40px;
    height: 40px;
    top: 50%;
    transform: translateY(-50%);
    margin: 0 10px;
  }
  
  .carousel-control-prev-icon,
  .carousel-control-next-icon {
    width: 20px;
    height: 20px;
  }
  
  .carousel-indicators {
    bottom: 20px;
  }
  
  .carousel-indicators button {
    background-color: rgba(154, 30, 71, 0.6);
    border: 2px solid white;
    border-radius: 50%;
    width: 12px;
    height: 12px;
    margin: 0 4px;
  }
  
  .carousel-indicators button.active {
    background-color: #9A1E47;
  }
  
  .carousel-caption {
    bottom: 20px;
  }
`;

// Agregar estilos al head del documento
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = carouselStyles;
document.head.appendChild(styleSheet);

export default DetalleLugar;