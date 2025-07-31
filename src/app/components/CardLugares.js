import React from 'react';
import { Card, Badge, OverlayTrigger, Tooltip, Button, Carousel } from 'react-bootstrap';
import { FaMapMarkerAlt, FaInfoCircle } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const CardLugares = ({ lugar }) => {
  // Tooltip con info extra
  const renderTooltip = (props) => (
    <Tooltip id="info-tooltip" {...props}>
      <div style={{ textAlign: 'left' }}>
        {lugar.Horarios && <p><strong>Horarios:</strong> {lugar.Horarios}</p>}
        {lugar.Costo && <p><strong>Costo:</strong> {lugar.Costo}</p>}
        {lugar.NivelDeDificultad && <p><strong>Dificultad:</strong> {lugar.NivelDeDificultad}</p>}
        {lugar.Contacto && <p><strong>Contacto:</strong> {lugar.Contacto}</p>}
        {lugar['Link educativos'] && lugar['Link educativos'].length > 0 && (
          <p style={{ wordBreak: 'break-all' }}><strong>Links educativos:</strong> Disponibles</p>
        )}
      </div>
    </Tooltip>
  );

  // Carousel si hay varias imágenes
  const imagenes = Array.isArray(lugar.Imagen) ? lugar.Imagen : lugar.Imagen ? [lugar.Imagen] : [];

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

      {/* Imagen principal o carousel */}
      {imagenes.length > 1 ? (
        <Carousel interval={3000} controls={false} indicators={false} pause={false}>
          {imagenes.map((img, idx) => (
            <Carousel.Item key={idx}>
              <Card.Img
                variant="top"
                src={img}
                style={{
                  height: '200px',
                  objectFit: 'cover',
                  borderBottom: '3px solid #F28B27'
                }}
                alt={`Imagen ${idx + 1}`}
                onError={e => { e.target.src = '/placeholder-product.jpg'; }}
              />
            </Carousel.Item>
          ))}
        </Carousel>
      ) : (
        <Card.Img
          variant="top"
          src={imagenes[0]}
          style={{
            height: '200px',
            objectFit: 'cover',
            borderBottom: '3px solid #F28B27'
          }}
          alt={lugar.Nombre}
          onError={e => { e.target.src = '/placeholder-product.jpg'; }}
        />
      )}

      <Card.Body className="d-flex flex-column" style={{ backgroundColor: '#FEF8ED', flex: 1 }}>
        <div className="mb-2">
          <Badge bg="info" style={{ backgroundColor: '#50C2C4' }} className="me-2">
            {lugar.idCtgLugar || lugar.Categoria || lugar.categoria}
          </Badge>
          <Badge bg="info" style={{ backgroundColor: '#0FA89C' }}>
            <FaMapMarkerAlt style={{ marginRight: 5 }} />
            {lugar.Ubicacion?.Municipio || lugar.municipio}
          </Badge>
        </div>
        <Card.Title style={{ color: '#9A1E47', minHeight: '48px' }}>
          {lugar.Nombre || lugar.nombre}
        </Card.Title>
        <Card.Text className="flex-grow-1" style={{ color: '#555', minHeight: '120px', lineHeight: '1.5' }}>
          {lugar.Descripcion || lugar.descripcion}
        </Card.Text>
        
        {/* Botón de ver detalles */}
        <div className="d-grid gap-2">
          <Button
            variant="outline"
            style={{
              color: '#9A1E47',
              borderColor: '#9A1E47'
            }}
            as={Link}
            to={`/lugares/${lugar._id || lugar.id}`}
          >
            Ver detalles
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default CardLugares;
