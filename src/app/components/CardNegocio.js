
import React from 'react';
import { Card, Badge, OverlayTrigger, Tooltip, Button } from 'react-bootstrap';
import { FaMapMarkerAlt, FaFacebook, FaInstagram, FaWhatsapp, FaInfoCircle } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const CardNegocio = ({ negocio }) => {
  const redes = negocio.RedesSociales || negocio.redesSociales || {};

  // Tooltip con info extra
  const renderTooltip = (props) => (
    <Tooltip id="info-tooltip" {...props}>
      <div style={{ textAlign: 'left' }}>
        {negocio.Horario && <p><strong>Horarios:</strong> {negocio.Horario}</p>}
        {negocio.Contacto && <p><strong>Contacto:</strong> {negocio.Contacto}</p>}
        {negocio.Categoria && <p><strong>Categoría:</strong> {negocio.Categoria}</p>}
        {(redes.Facebook || redes.Instagram || redes.WhatsApp) && (
          <p><strong>Redes sociales:</strong> Disponibles</p>
        )}
      </div>
    </Tooltip>
  );

  return (
    <Card className="h-100" style={{
      border: '2px solid #0FA89C',
      borderRadius: '10px',
      overflow: 'hidden',
      boxShadow: '0 4px 12px rgba(154, 30, 71, 0.15)',
      transition: 'transform 0.3s, box-shadow 0.3s',
      backgroundColor: 'white',
      minHeight: '500px'
    }}>
      {/* Overlay info */}
      <div style={{
        position: 'absolute',
        top: '10px',
        right: '10px',
        zIndex: 1
      }}>
        <OverlayTrigger placement="left" overlay={renderTooltip}>
          <Button variant="light" size="sm" style={{
            padding: '5px',
            backgroundColor: 'rgba(255,255,255,0.8)',
            border: '1px solid #9A1E47'
          }}>
            <FaInfoCircle style={{ color: '#9A1E47' }} />
          </Button>
        </OverlayTrigger>
      </div>

      <Card.Img
        variant="top"
        src={negocio.Imagenes && negocio.Imagenes[0]}
        alt={negocio.Nombre}
        style={{
          height: '200px',
          objectFit: 'cover',
          borderBottom: '3px solid #F28B27'
        }}
        onError={(e) => {
          e.target.src = '/placeholder-product.jpg';
        }}
      />

      <Card.Body className="d-flex flex-column" style={{ backgroundColor: '#FEF8ED', flex: 1 }}>
        <div className="mb-2">
          <Badge bg="info" style={{ backgroundColor: '#50C2C4' }} className="me-2">
            {negocio.Categoria || negocio.categoria}
          </Badge>
          <Badge bg="info" style={{ backgroundColor: '#0FA89C' }}>
            <FaMapMarkerAlt style={{ marginRight: 5 }} />
            {negocio.Ubicacion?.Municipio || negocio.municipio}
          </Badge>
        </div>
        <Card.Title style={{ color: '#9A1E47', minHeight: '48px' }}>
          {negocio.Nombre || negocio.nombre}
        </Card.Title>
        <Card.Text className="flex-grow-1" style={{ color: '#555', minHeight: '120px', lineHeight: '1.5' }}>
          {negocio.Descripcion || negocio.descripcion}
        </Card.Text>
        
        {/* Redes sociales */}
        {(redes.Facebook || redes.Instagram || redes.WhatsApp) && (
          <div className="mt-2 d-flex gap-3 mb-3">
            {redes.Facebook && (
              <a href={redes.Facebook} target="_blank" rel="noopener noreferrer" style={{ fontSize: '1.2rem' }}>
                <FaFacebook color="#3b5998" />
              </a>
            )}
            {redes.Instagram && (
              <a href={redes.Instagram} target="_blank" rel="noopener noreferrer" style={{ fontSize: '1.2rem' }}>
                <FaInstagram color="#E1306C" />
              </a>
            )}
            {redes.WhatsApp && (
              <a href={`https://wa.me/${redes.WhatsApp}`} target="_blank" rel="noopener noreferrer" style={{ fontSize: '1.2rem' }}>
                <FaWhatsapp color="#25D366" />
              </a>
            )}
          </div>
        )}
        
        {/* Botón de ver detalles */}
        <div className="d-grid gap-2">
          <Button
            variant="outline"
            style={{
              color: '#9A1E47',
              borderColor: '#9A1E47'
            }}
            as={Link}
            to={`/negocios/${negocio._id || negocio.id}`}
          >
            Ver detalles
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default CardNegocio;
