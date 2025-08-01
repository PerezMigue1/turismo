import React from 'react';
import { Card, Button, Badge, OverlayTrigger, Tooltip, Carousel } from 'react-bootstrap';
import { FaMountain, FaStar, FaInfoCircle, FaMapMarkerAlt, FaClock } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const CardEcoturismo = ({ ecoturismo }) => {
    const renderTooltip = (props) => (
        <Tooltip id="info-tooltip" {...props}>
            <div style={{ textAlign: 'left' }}>
                <p><strong>Dificultad:</strong> {ecoturismo.dificultad}</p>
                <p><strong>Duración:</strong> {ecoturismo.duracion}</p>
                <p><strong>Distancia:</strong> {ecoturismo.distancia}</p>
                <p><strong>Altitud:</strong> {ecoturismo.altitud}</p>
            </div>
        </Tooltip>
    );

    const getCategoriaColor = (categoria) => {
        const colores = {
            'senderismo': 'success',
            'cascadas': 'info',
            'observacion_aves': 'warning',
            'camping': 'danger',
            'escalada': 'dark',
            'ciclismo': 'primary',
            'kayak': 'secondary'
        };
        return colores[categoria] || 'primary';
    };

    const getDificultadColor = (dificultad) => {
        const colores = {
            'facil': 'success',
            'moderado': 'warning',
            'dificil': 'danger',
            'experto': 'dark'
        };
        return colores[dificultad] || 'primary';
    };

    return (
        <Card className="h-100" style={{
            border: '2px solid #0FA89C',
            borderRadius: '10px',
            overflow: 'hidden',
            boxShadow: '0 4px 12px rgba(154, 30, 71, 0.15)',
            transition: 'transform 0.3s, box-shadow 0.3s',
            backgroundColor: 'white',
        }}>
            {ecoturismo.destacado && (
                <div style={{
                    position: 'absolute',
                    top: '10px',
                    left: '10px',
                    backgroundColor: '#F28B27',
                    color: 'white',
                    padding: '5px 10px',
                    borderRadius: '20px',
                    fontSize: '0.8rem',
                    zIndex: 1,
                    display: 'flex',
                    alignItems: 'center'
                }}>
                    <FaMountain style={{ marginRight: '5px' }} />
                    Destacado
                </div>
            )}

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

            <Link to={`/ecoturismo/${ecoturismo._id}`}>
                {Array.isArray(ecoturismo.imagenes) && ecoturismo.imagenes.length > 1 ? (
                    <Carousel interval={3000} controls={false} indicators={false} pause={false}>
                        {ecoturismo.imagenes.map((img, idx) => (
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
                                    onError={(e) => {
                                        e.target.src = '/placeholder-product.jpg';
                                    }}
                                />
                            </Carousel.Item>
                        ))}
                    </Carousel>
                ) : (
                    <Card.Img
                        variant="top"
                        src={Array.isArray(ecoturismo.imagenes) ? ecoturismo.imagenes[0] : ecoturismo.imagenes}
                        style={{
                            height: '200px',
                            objectFit: 'cover',
                            borderBottom: '3px solid #F28B27'
                        }}
                        alt={ecoturismo.nombre}
                        onError={(e) => {
                            e.target.src = '/placeholder-product.jpg';
                        }}
                    />
                )}
            </Link>

            <Card.Body className="d-flex flex-column" style={{ backgroundColor: '#FEF8ED' }}>
                <div className="mb-2">
                    <Badge bg={getCategoriaColor(ecoturismo.categoria)} className="me-2">
                        {ecoturismo.categoria.replace('_', ' ').toUpperCase()}
                    </Badge>
                    <Badge bg={getDificultadColor(ecoturismo.dificultad)}>
                        {ecoturismo.dificultad.toUpperCase()}
                    </Badge>
                </div>
                <Card.Title style={{ color: '#9A1E47', minHeight: '48px' }}>
                    <Link to={`/ecoturismo/${ecoturismo._id}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                        {ecoturismo.nombre}
                    </Link>
                </Card.Title>
                <Card.Text className="flex-grow-1" style={{ color: '#555', minHeight: '60px' }}>
                    {ecoturismo.descripcion?.substring(0, 100)}...
                </Card.Text>
                
                <div className="mb-2">
                    <div style={{ color: '#666', fontSize: '0.9rem', display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
                        <FaMapMarkerAlt style={{ marginRight: '5px', color: '#1E8546' }} />
                        {ecoturismo.ubicacion}
                    </div>
                    <div style={{ color: '#666', fontSize: '0.9rem', display: 'flex', alignItems: 'center' }}>
                        <FaClock style={{ marginRight: '5px', color: '#F28B27' }} />
                        {ecoturismo.duracion} • {ecoturismo.distancia}
                    </div>
                </div>

                <div className="d-flex justify-content-between align-items-center mb-3">
                    <div style={{ color: '#F28B27' }}>
                        {[...Array(5)].map((_, i) => (
                            <FaStar key={i} color={i < (ecoturismo.calificacion || 4) ? '#F28B27' : '#ddd'} />
                        ))}
                    </div>
                    <div>
                        <h5 style={{ color: '#9A1E47', margin: 0 }}>
                            {ecoturismo.precio_entrada ? `$${parseFloat(ecoturismo.precio_entrada).toFixed(2)}` : 'Gratis'}
                        </h5>
                    </div>
                </div>
                <div className="d-grid gap-2">
                    <Link to={`/ecoturismo/${ecoturismo._id}`}>
                        <Button
                            variant="outline"
                            style={{
                                color: '#9A1E47',
                                borderColor: '#9A1E47',
                                width: '100%'
                            }}
                        >
                            Ver Destino
                        </Button>
                    </Link>
                </div>
            </Card.Body>
        </Card>
    );
};

export default CardEcoturismo; 