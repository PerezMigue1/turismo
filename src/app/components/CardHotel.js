// src/components/CardHotel.js
import React, { useState } from 'react';
import { Card, Button, Badge } from 'react-bootstrap';
import { FaCalendarAlt, FaStar, FaWifi, FaParking, FaUtensils, FaMapMarkerAlt, FaUsers, FaSnowflake, FaChild } from 'react-icons/fa';
import HotelesDetalle from '../screens/HotelesDetalle';

const CardHotel = ({ hotel }) => {
    const [showDetail, setShowDetail] = useState(false);

    const renderServicios = () => {
        const servicios = hotel.Servicios.split(',');
        const iconos = [];
        
        servicios.forEach((servicio, index) => {
            const servicioTrim = servicio.trim();
            if (servicioTrim.toLowerCase().includes('wi-fi') || servicioTrim.toLowerCase().includes('wifi')) {
                iconos.push(<FaWifi key={index} title="WiFi gratuito" />);
            } else if (servicioTrim.toLowerCase().includes('estacionamiento')) {
                iconos.push(<FaParking key={index} title="Estacionamiento gratuito" />);
            } else if (servicioTrim.toLowerCase().includes('aire acondicionado')) {
                iconos.push(<FaSnowflake key={index} title="Aire acondicionado" />);
            } else if (servicioTrim.toLowerCase().includes('restaurante')) {
                iconos.push(<FaUtensils key={index} title="Restaurante" />);
            } else if (servicioTrim.toLowerCase().includes('niños')) {
                iconos.push(<FaChild key={index} title="Apto para niños" />);
            }
        });
        
        return iconos.slice(0, 4).map((icono, index) => (
            <span key={index} style={{ marginRight: '8px', color: '#0FA89C' }}>
                {icono}
            </span>
        ));
    };

    const getUbicacionCorta = () => {
        const partes = hotel.Ubicacion.split(',');
        return partes.length > 2 ? `${partes[partes.length - 2].trim()}, ${partes[partes.length - 1].trim()}` : hotel.Ubicacion;
    };

    const handleVerDetalles = () => {
        setShowDetail(true);
    };

    return (
        <>
            <Card 
                className="h-100" 
                style={{
                    border: '2px solid #0FA89C',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    boxShadow: '0 6px 20px rgba(154, 30, 71, 0.12)',
                    transition: 'all 0.3s ease',
                    backgroundColor: 'white',
                    position: 'relative',
                    maxWidth: '280px',
                    width: '100%',
                    margin: '0 auto'
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-5px)';
                    e.currentTarget.style.boxShadow = '0 10px 30px rgba(154, 30, 71, 0.18)';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 6px 20px rgba(154, 30, 71, 0.12)';
                }}
            >
                {/* Badge de disponibilidad */}
                <div style={{
                    position: 'absolute',
                    top: '12px',
                    left: '12px',
                    backgroundColor: '#1E8546',
                    color: 'white',
                    padding: '6px 12px',
                    borderRadius: '20px',
                    fontSize: '0.75rem',
                    zIndex: 2,
                    display: 'flex',
                    alignItems: 'center',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.2)'
                }}>
                    <FaCalendarAlt style={{ marginRight: '4px' }} />
                    Disponible
                </div>

                {/* Imagen principal */}
                <div style={{ position: 'relative', height: '180px' }}>
                    <img
                        src={hotel.Imagenes[0]}
                        alt={hotel.Nombre}
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            borderBottom: '2px solid #F28B27'
                        }}
                        onError={(e) => {
                            e.target.src = '/placeholder-hotel.jpg';
                        }}
                    />
                    
                    {/* Indicador de múltiples imágenes */}
                    {hotel.Imagenes && hotel.Imagenes.length > 1 && (
                        <div style={{
                            position: 'absolute',
                            bottom: '8px',
                            right: '8px',
                            backgroundColor: 'rgba(0,0,0,0.7)',
                            color: 'white',
                            padding: '3px 6px',
                            borderRadius: '12px',
                            fontSize: '0.7rem'
                        }}>
                            +{hotel.Imagenes.length - 1}
                        </div>
                    )}
                </div>

                <Card.Body 
                    className="d-flex flex-column" 
                    style={{ 
                        backgroundColor: '#FEF8ED',
                        padding: '14px',
                        flex: 1
                    }}
                >
                    {/* Badges de categoría y huéspedes */}
                    <div className="mb-2">
                        <Badge 
                            style={{ 
                                backgroundColor: '#0FA89C',
                                fontSize: '0.7rem',
                                padding: '4px 8px',
                                borderRadius: '15px',
                                marginRight: '6px'
                            }}
                        >
                            {hotel.Categoria}
                        </Badge>
                        <Badge 
                            style={{ 
                                backgroundColor: '#50C2C4',
                                fontSize: '0.7rem',
                                padding: '4px 8px',
                                borderRadius: '15px'
                            }}
                        >
                            <FaUsers style={{ marginRight: '3px' }} />
                            {hotel.Huespedes}
                        </Badge>
                    </div>
                    
                    {/* Nombre del hotel */}
                    <Card.Title 
                        style={{ 
                            color: '#9A1E47', 
                            fontSize: '1rem',
                            fontWeight: '600',
                            marginBottom: '10px',
                            lineHeight: '1.2',
                            height: '2.4rem',
                            overflow: 'hidden',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical'
                        }}
                    >
                        {hotel.Nombre}
                    </Card.Title>

                    {/* Ubicación */}
                    <div className="mb-2" style={{ 
                        color: '#666', 
                        display: 'flex', 
                        alignItems: 'center',
                        fontSize: '0.8rem'
                    }}>
                        <FaMapMarkerAlt style={{ marginRight: '6px', color: '#9A1E47' }} />
                        <span style={{ 
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                        }}>
                            {getUbicacionCorta()}
                        </span>
                    </div>

                    {/* Servicios */}
                    <div className="mb-2" style={{ 
                        display: 'flex', 
                        alignItems: 'center',
                        fontSize: '1rem'
                    }}>
                        {renderServicios()}
                    </div>

                    {/* Precio */}
                    <div className="mb-2 mt-auto">
                        <h4 style={{ color: '#9A1E47', margin: 0, fontSize: '1.2rem', fontWeight: '700' }}>
                            ${hotel.Precio.toFixed(2)}
                        </h4>
                        <small style={{ color: '#666', fontSize: '0.8rem' }}>por noche</small>
                    </div>

                    {/* Botón de ver detalles */}
                    <Button
                        onClick={handleVerDetalles}
                        style={{
                            backgroundColor: '#9A1E47',
                            borderColor: '#9A1E47',
                            color: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            textDecoration: 'none',
                            borderRadius: '8px',
                            padding: '10px',
                            fontWeight: '600',
                            fontSize: '0.85rem',
                            transition: 'all 0.3s ease',
                            boxShadow: '0 3px 10px rgba(154, 30, 71, 0.2)'
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.transform = 'translateY(-2px)';
                            e.target.style.boxShadow = '0 5px 15px rgba(154, 30, 71, 0.3)';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.transform = 'translateY(0)';
                            e.target.style.boxShadow = '0 3px 10px rgba(154, 30, 71, 0.2)';
                        }}
                    >
                        Ver detalles
                    </Button>
                </Card.Body>
            </Card>

            {/* Modal de detalles */}
            <HotelesDetalle
                hotel={hotel}
                show={showDetail}
                onHide={() => setShowDetail(false)}
                onBack={() => setShowDetail(false)}
            />
        </>
    );
};

export default CardHotel;