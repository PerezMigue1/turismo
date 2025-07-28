import React from 'react';
import { Card, Button, Badge, Carousel } from 'react-bootstrap';
import { FaCalendarAlt, FaMapMarkerAlt, FaInfoCircle } from 'react-icons/fa';

const CardFestividades = ({ festividad, onVerDetalle }) => {
  const imagenes = festividad.Imagen || [];

  return (
    <Card className="h-100" style={{
      border: '2px solid #0FA89C',
      borderRadius: '10px',
      overflow: 'hidden',
      boxShadow: '0 4px 12px rgba(154, 30, 71, 0.15)',
      backgroundColor: 'white',
      position: 'relative',
      maxWidth: '450px',
      minHeight: '520px',
      width: '100%',
      margin: '0 auto'
    }}>
      {/* Carrusel de imágenes */}
      {imagenes.length > 1 ? (
        <Carousel interval={3000} controls={false} indicators={false} pause={false}>
          {imagenes.map((img, idx) => (
            <Carousel.Item key={idx}>
              <img
                src={img}
                alt={`Imagen ${idx + 1}`}
                style={{
                  width: '100%',
                  height: '200px',
                  objectFit: 'cover',
                  borderBottom: '3px solid #F28B27'
                }}
                onError={e => { e.target.src = '/festividad-default.jpg'; }}
              />
            </Carousel.Item>
          ))}
        </Carousel>
      ) : (
        <img
          src={imagenes[0] || "/festividad-default.jpg"}
          alt={festividad.nombre}
          style={{
            width: '100%',
            height: '200px',
            objectFit: 'cover',
            borderBottom: '3px solid #F28B27'
          }}
          onError={e => { e.target.src = '/festividad-default.jpg'; }}
        />
      )}

      <Card.Body className="d-flex flex-column" style={{ backgroundColor: '#FEF8ED' }}>
        <div className="mb-2">
          <Badge style={{ backgroundColor: '#1E8546', color: 'white', marginRight: '6px' }}>
            {festividad.tipo}
          </Badge>
        </div>
        <Card.Title style={{ color: '#9A1E47', minHeight: '48px', fontSize: '1.2rem', fontWeight: '600' }}>
          {festividad.nombre}
        </Card.Title>
        <div style={{ color: '#555', fontSize: 14, marginBottom: 8 }}>
          <FaCalendarAlt style={{ marginRight: 4 }} />
          {festividad.fecha?.inicio} - {festividad.fecha?.fin}
        </div>
        <div style={{ color: '#555', fontSize: 14, marginBottom: 8 }}>
          <FaMapMarkerAlt style={{ marginRight: 4 }} />
          {festividad.municipios.slice(0, 2).join(", ")}
          {festividad.municipios.length > 2 && ` +${festividad.municipios.length - 2}`}
        </div>
        <Card.Text className="flex-grow-1" style={{ color: '#666', minHeight: '60px' }}>
          {festividad.descripcion.slice(0, 90)}...
        </Card.Text>
        <div className="d-grid gap-2 mt-auto">
          <Button
            onClick={() => onVerDetalle(festividad)}
            variant="outline"
            style={{
              color: '#9A1E47',
              borderColor: '#9A1E47'
            }}
          >
            Ver detalles
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default CardFestividades;