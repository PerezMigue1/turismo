import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Container, Card, Badge, Button, Row, Col, Alert, Spinner, Form, Tabs, Tab } from 'react-bootstrap';
import { FaMapMarkerAlt, FaClock, FaPhone, FaStar, FaArrowLeft, FaFacebook, FaInstagram, FaWhatsapp, FaUser, FaComments, FaStore } from 'react-icons/fa';

const DetalleNegocio = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [negocio, setNegocio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mensajeEnviado, setMensajeEnviado] = useState(null);

  // Estados para el formulario de contacto
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [telefono, setTelefono] = useState('');
  const [comentario, setComentario] = useState('');

  useEffect(() => {
    axios.get(`https://backend-iota-seven-19.vercel.app/api/negocios/${id}`)
      .then(res => setNegocio(res.data))
      .catch(() => setNegocio(null))
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
        idNegocio: negocio._id || negocio.id
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
          Error al cargar el negocio: {error}
          <Button variant="link" onClick={() => window.location.reload()}>Intentar de nuevo</Button>
        </Alert>
      </Container>
    );
  }

  if (!negocio) {
    return (
      <Container style={{ backgroundColor: '#FDF2E0', padding: '30px 0', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Alert variant="warning">
          Negocio no encontrado
          <Button variant="link" onClick={() => navigate('/negocios')}>Volver al listado</Button>
        </Alert>
      </Container>
    );
  }

  const imagen = Array.isArray(negocio.Imagenes) ? negocio.Imagenes[0] : negocio.Imagenes;
  const municipio = negocio.Ubicacion?.Municipio || negocio.municipio || '';
  const categoria = negocio.Categoria || negocio.categoria || '';
  const redes = negocio.RedesSociales || negocio.redesSociales || {};
  const resenas = negocio.Resenas || negocio.resenas || negocio.Reseñas || negocio.reseñas || [];
  const calificacion = negocio.Calificacion || negocio.calificacion || 4;
  const recomendado = negocio.Recomendado || negocio.recomendado;

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
            {imagen && (
              <Card.Img
                variant="top"
                src={imagen}
                alt={negocio.Nombre}
                style={{ maxHeight: '500px', objectFit: 'cover', borderBottom: '3px solid #F28B27' }}
                onError={(e) => e.target.src = '/placeholder-product.jpg'}
              />
            )}
          </Card>

          <Card className="mb-4" style={{ borderColor: '#0FA89C' }}>
            <Card.Body style={{ backgroundColor: '#FDF2E0' }}>
              <Tabs defaultActiveKey="descripcion" id="negocio-tabs" className="mb-3">
                <Tab eventKey="descripcion" title="Descripción">
                  <h4 style={{ color: '#9A1E47', marginTop: '15px' }}>Descripción del negocio</h4>
                  <p style={{ color: '#555' }}>{negocio.Descripcion || negocio.descripcion}</p>
                </Tab>

                <Tab eventKey="informacion" title="Información">
                  <h4 style={{ color: '#9A1E47', marginTop: '15px' }}>Detalles del negocio</h4>
                  <div style={{ color: '#555' }}>
                    {negocio.Horario && (
                      <p><strong>Horarios:</strong> {negocio.Horario}</p>
                    )}
                    {negocio.Contacto && (
                      <p><strong>Contacto:</strong> {negocio.Contacto}</p>
                    )}
                    {negocio.Direccion && (
                      <p><strong>Dirección:</strong> {negocio.Direccion}</p>
                    )}
                    {negocio.Servicios && (
                      <p><strong>Servicios:</strong> {negocio.Servicios}</p>
                    )}
                  </div>
                </Tab>

                <Tab eventKey="redes" title="Redes sociales">
                  <h4 style={{ color: '#9A1E47', marginTop: '15px' }}>Redes sociales</h4>
                  {(redes.Facebook || redes.Instagram || redes.WhatsApp) ? (
                    <div style={{ color: '#555' }}>
                      {redes.Facebook && (
                        <p>
                          <strong>Facebook:</strong> 
                          <a href={redes.Facebook} target="_blank" rel="noopener noreferrer" style={{ color: '#3b5998', marginLeft: '10px' }}>
                            {redes.Facebook}
                          </a>
                        </p>
                      )}
                      {redes.Instagram && (
                        <p>
                          <strong>Instagram:</strong> 
                          <a href={redes.Instagram} target="_blank" rel="noopener noreferrer" style={{ color: '#E1306C', marginLeft: '10px' }}>
                            {redes.Instagram}
                          </a>
                        </p>
                      )}
                      {redes.WhatsApp && (
                        <p>
                          <strong>WhatsApp:</strong> 
                          <a href={`https://wa.me/${redes.WhatsApp}`} target="_blank" rel="noopener noreferrer" style={{ color: '#25D366', marginLeft: '10px' }}>
                            {redes.WhatsApp}
                          </a>
                        </p>
                      )}
                    </div>
                  ) : (
                    <p style={{ color: '#666' }}>No hay redes sociales disponibles</p>
                  )}
                </Tab>
              </Tabs>
            </Card.Body>
          </Card>
        </Col>

        <Col md={5}>
          <Card className="sticky-top" style={{ top: '20px', borderColor: '#0FA89C' }}>
            <Card.Body style={{ backgroundColor: '#FDF2E0' }}>
              <h3 style={{ color: '#9A1E47' }}>{negocio.Nombre || negocio.nombre}</h3>
              <div className="d-flex align-items-center mb-3">
                <Badge style={{ backgroundColor: '#1E8546', marginRight: '10px' }}>{categoria}</Badge>
                <div style={{ color: '#F28B27' }}>
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} color={i < calificacion ? '#F28B27' : '#ddd'} />
                  ))}
                  <small style={{ color: '#A0C070', marginLeft: '5px' }}>({resenas.length} reseñas)</small>
                </div>
              </div>
              <div className="d-flex align-items-center mb-3" style={{ color: '#0FA89C' }}>
                <FaMapMarkerAlt className="me-2" />
                <span>{municipio}, Hidalgo</span>
              </div>

              {/* Recomendado */}
              {recomendado && (
                <div className="mb-3">
                  <Badge style={{ backgroundColor: '#F28B27', fontSize: 14, padding: '6px 12px' }}>
                    ⭐ Recomendado
                  </Badge>
                </div>
              )}

              {/* Redes sociales */}
              {(redes.Facebook || redes.Instagram || redes.WhatsApp) && (
                <div style={{ marginBottom: '20px' }}>
                  <h5 style={{ color: '#9A1E47', marginBottom: 8 }}>Redes sociales:</h5>
                  <div style={{ display: 'flex', gap: 12 }}>
                    {redes.Facebook && (
                      <a href={redes.Facebook} target="_blank" rel="noopener noreferrer" style={{ fontSize: 20 }}>
                        <FaFacebook color="#3b5998" />
                      </a>
                    )}
                    {redes.Instagram && (
                      <a href={redes.Instagram} target="_blank" rel="noopener noreferrer" style={{ fontSize: 20 }}>
                        <FaInstagram color="#E1306C" />
                      </a>
                    )}
                    {redes.WhatsApp && (
                      <a href={`https://wa.me/${redes.WhatsApp}`} target="_blank" rel="noopener noreferrer" style={{ fontSize: 20 }}>
                        <FaWhatsapp color="#25D366" />
                      </a>
                    )}
                  </div>
                </div>
              )}
            </Card.Body>
          </Card>

          {/* Reseñas */}
          <Card className="mt-4" style={{ borderColor: '#0FA89C' }}>
            <Card.Body style={{ backgroundColor: '#FDF2E0' }}>
              <h4 style={{ color: '#9A1E47', fontSize: 20, fontWeight: 700, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                <FaComments color="#1E8546" />
                Reseñas ({resenas.length})
              </h4>

              {resenas.length > 0 ? (
                resenas.map((resena, index) => (
                  <div key={index} style={{ 
                    marginBottom: 16, 
                    paddingBottom: 16, 
                    borderBottom: index < resenas.length - 1 ? '1px solid #eee' : 'none' 
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                      <FaUser color="#1E8546" />
                      <span style={{ color: '#9A1E47', fontWeight: '600', fontSize: 16 }}>
                        {resena.Usuario || resena.usuario || resena.nombre || resena.Nombre || `Usuario ${index + 1}`}
                      </span>
                    </div>
                    <div style={{ color: '#666', fontSize: 14, marginBottom: 8, lineHeight: 1.4 }}>
                      {resena.Comentario || resena.comentario || resena.texto || resena.Texto || resena.mensaje || 'Sin comentario'}
                    </div>
                    <div style={{ display: 'flex', gap: 2 }}>
                      {[1,2,3,4,5].map(i => (
                        <FaStar key={i} color={i <= (resena.Calificacion || resena.calificacion || 5) ? '#F28B27' : '#ddd'} size={12} />
                      ))}
                      <span style={{ color: '#666', fontSize: 12, marginLeft: 8 }}>
                        ({resena.Calificacion || resena.calificacion || 5}/5)
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ textAlign: 'center', color: '#666', padding: 20 }}>
                  <FaComments size={48} color="#ddd" style={{ marginBottom: 16 }} />
                  <p>No hay reseñas disponibles</p>
                  <p style={{ fontSize: 14 }}>Sé el primero en dejar una reseña</p>
                </div>
              )}
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
                <FaStore color="#1E8546" />
                ¿Tienes dudas o deseas contactar al negocio?
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
                  Enviar mensaje al negocio
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default DetalleNegocio;
