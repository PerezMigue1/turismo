// src/components/CardGastronomia.js
import React from 'react';
import { Card, Button, Badge, OverlayTrigger, Tooltip, Carousel } from 'react-bootstrap';
import { FaUtensils, FaHeart, FaStar, FaInfoCircle } from 'react-icons/fa';

const CardGastronomia = ({ gastronomia, onVerReceta }) => {
    const renderTooltip = (props) => (
        <Tooltip id="info-tooltip" {...props}>
            <div style={{ textAlign: 'left' }}>
                <p><strong>Tipo:</strong> {gastronomia.tipoPlatillo}</p>
                <p><strong>Origen:</strong> {gastronomia.regionOrigen}</p>
                <p><strong>Ocasiones:</strong> {Array.isArray(gastronomia.ocasion) ? gastronomia.ocasion.join(', ') : gastronomia.ocasion}</p>
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
        }}>
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

            <div style={{ position: 'relative', height: '200px', backgroundColor: '#f0f0f0' }}>
                {Array.isArray(gastronomia.imagen) && gastronomia.imagen.length > 1 ? (
                    <Carousel interval={3000} controls={false} indicators={false} pause={false}>
                        {gastronomia.imagen.map((img, idx) => (
                            <Carousel.Item key={idx}>
                                <img
                                    src={img}
                                    alt={`Imagen ${idx + 1}`}
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover',
                                        borderBottom: '3px solid #F28B27'
                                    }}
                                    onError={(e) => {
                                        e.target.src = '/placeholder-food.jpg';
                                    }}
                                />
                            </Carousel.Item>
                        ))}
                    </Carousel>
                ) : (
                    <img
                        src={gastronomia.imagen?.url || gastronomia.imagen}
                        alt={gastronomia.nombre}
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            borderBottom: '3px solid #F28B27'
                        }}
                        onError={(e) => {
                            e.target.src = '/placeholder-food.jpg';
                        }}
                    />
                )}
                
                {/* Badge de tipo de platillo */}
                {gastronomia.tipoPlatillo && (
                    <div style={{
                        position: 'absolute',
                        top: '12px',
                        left: '12px',
                        backgroundColor: '#0FA89C',
                        color: 'white',
                        padding: '6px 12px',
                        borderRadius: '20px',
                        fontSize: '0.75rem',
                        fontWeight: '500',
                        backdropFilter: 'blur(10px)'
                    }}>
                        {gastronomia.tipoPlatillo}
                    </div>
                )}
            </div>

            <Card.Body className="d-flex flex-column" style={{ backgroundColor: '#FEF8ED' }}>
                <div className="mb-2">
                    <Badge bg="success" style={{ backgroundColor: '#1E8546' }} className="me-2">
                        {gastronomia.tipoPlatillo}
                    </Badge>
                    <Badge bg="info" style={{ backgroundColor: '#50C2C4' }}>
                        {gastronomia.regionOrigen}
                    </Badge>
                </div>
                <Card.Title style={{ color: '#9A1E47', minHeight: '48px' }}>
                    {gastronomia.nombre}
                </Card.Title>
                <Card.Text className="flex-grow-1" style={{ color: '#555', minHeight: '60px' }}>
                    {gastronomia.descripcion?.substring(0, 100)}...
                </Card.Text>

                {/* Sección de ocasiones */}
                {gastronomia.ocasion && (
                    <div className="mb-3">
                        <div style={{
                            color: '#333',
                            fontSize: '0.9rem',
                            fontWeight: '600',
                            marginBottom: '8px',
                            display: 'flex',
                            alignItems: 'center'
                        }}>
                            <span style={{
                                width: '8px',
                                height: '8px',
                                backgroundColor: '#ff6b35',
                                borderRadius: '50%',
                                marginRight: '8px'
                            }}></span>
                            Ocasiones especiales
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                            {Array.isArray(gastronomia.ocasion) 
                                ? gastronomia.ocasion.slice(0, 2).map((ocasion, index) => (
                                    <span 
                                        key={index}
                                        style={{ 
                                            backgroundColor: '#50C2C4',
                                            color: '#f0f0f0',
                                            fontSize: '0.75rem',
                                            padding: '4px 10px',
                                            borderRadius: '12px',
                                            fontWeight: '500',
                                            border: '1px solid #50C2C4'
                                        }}
                                    >
                                        {ocasion}
                                    </span>
                                ))
                                : (
                                    <span 
                                        style={{ 
                                            backgroundColor: '#50C2C4',
                                            color: '#f0f0f0',
                                            fontSize: '0.75rem',
                                            padding: '4px 10px',
                                            borderRadius: '12px',
                                            fontWeight: '500',
                                            border: '1px solid #50C2C4'
                                        }}
                                    >
                                        {gastronomia.ocasion}
                                    </span>
                                )
                            }
                        </div>
                    </div>
                )}

                <div className="d-flex justify-content-between align-items-center mb-3">
                    <div style={{ color: '#F28B27' }}>
                        {[...Array(5)].map((_, i) => (
                            <FaStar key={i} color={i < 4 ? '#F28B27' : '#ddd'} />
                        ))}
                    </div>
                    <div>
                        <h5 style={{ color: '#9A1E47', margin: 0 }}>
                            {gastronomia.receta?.tiempoPreparacionMinutos ? `${gastronomia.receta.tiempoPreparacionMinutos} min` : 'N/D'}
                        </h5>
                    </div>
                </div>
                <div className="d-grid gap-2">
                    <Button
                        variant="outline"
                        style={{
                            color: '#9A1E47',
                            borderColor: '#9A1E47'
                        }}
                        onClick={() => onVerReceta(gastronomia)}
                    >
                        <FaUtensils /> Ver Receta
                    </Button>
                </div>
            </Card.Body>
        </Card>
    );
};

export default CardGastronomia;