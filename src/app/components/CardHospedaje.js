import React from 'react';
import { Card, Button, Badge, Carousel } from 'react-bootstrap';
import { FaCalendarAlt, FaStar, FaWifi, FaParking, FaUtensils, FaMapMarkerAlt, FaUsers, FaSnowflake, FaChild, FaInfoCircle } from 'react-icons/fa';

const CardHotel = ({ hotel, onVerHotel }) => {
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
        onVerHotel(hotel);
    };

    return (
        <Card className="h-100" style={{
            border: '2px solid #0FA89C',
            borderRadius: '10px',
            overflow: 'hidden',
            boxShadow: '0 4px 12px rgba(154, 30, 71, 0.15)',
            transition: 'transform 0.3s, box-shadow 0.3s',
            backgroundColor: 'white',
            position: 'relative',
            maxWidth: '350px',
            minHeight: '500px',
            width: '100%',
            margin: '0 auto'
        }}>
            <div style={{
                position: 'absolute',
                top: '10px',
                left: '10px',
                backgroundColor: '#0FA89C',
                color: 'white',
                padding: '5px 10px',
                borderRadius: '20px',
                fontSize: '0.8rem',
                zIndex: 1,
                display: 'flex',
                alignItems: 'center'
            }}>
                <FaCalendarAlt style={{ marginRight: '5px' }} />
                Disponible
            </div>

            <div style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                zIndex: 1
            }}>
                <Button variant="light" size="sm" style={{
                    padding: '5px',
                    backgroundColor: 'rgba(255,255,255,0.8)',
                    border: '1px solid #9A1E47'
                }} onClick={handleVerDetalles}>
                    <FaInfoCircle style={{ color: '#9A1E47' }} />
                </Button>
            </div>

            {hotel.Imagenes && hotel.Imagenes.length > 1 ? (
                <Carousel interval={3000} controls={false} indicators={false} pause={false}>
                    {hotel.Imagenes.map((img, idx) => (
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
                                onError={(e) => {
                                    e.target.src = '/placeholder-hotel.jpg';
                                }}
                            />
                        </Carousel.Item>
                    ))}
                </Carousel>
            ) : (
                <img
                    src={hotel.Imagenes[0]}
                    alt={hotel.Nombre}
                    style={{
                        width: '100%',
                        height: '200px',
                        objectFit: 'cover',
                        borderBottom: '3px solid #F28B27'
                    }}
                    onError={(e) => {
                        e.target.src = '/placeholder-hotel.jpg';
                    }}
                />
            )}

            <Card.Body className="d-flex flex-column" style={{ backgroundColor: '#FEF8ED' }}>
                <div className="mb-2">
                    <Badge style={{ backgroundColor: '#1E8546', color: 'white', marginRight: '6px' }}>
                        {hotel.Categoria}
                    </Badge>
                    <Badge style={{ backgroundColor: '#50C2C4', color: 'white' }}>
                        <FaUsers style={{ marginRight: '3px' }} />
                        {hotel.Huespedes}
                    </Badge>
                </div>
                <Card.Title style={{ color: '#9A1E47', minHeight: '48px', fontSize: '1.2rem', fontWeight: '600' }}>
                    {hotel.Nombre}
                </Card.Title>
                <Card.Text className="flex-grow-1" style={{ color: '#555', minHeight: '60px' }}>
                    {hotel.Ubicacion}
                </Card.Text>
                <div className="mb-2" style={{ color: '#666', display: 'flex', alignItems: 'center', fontSize: '0.95rem' }}>
                    <FaMapMarkerAlt style={{ marginRight: '6px', color: '#9A1E47' }} />
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {getUbicacionCorta()}
                    </span>
                </div>
                <div className="mb-2" style={{ display: 'flex', alignItems: 'center', fontSize: '1.4rem' }}>
                    {renderServicios()}
                </div>
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <div style={{ color: '#F28B27' }}>
                        {[...Array(5)].map((_, i) => (
                            <FaStar key={i} color={i < 4 ? '#F28B27' : '#ddd'} />
                        ))}
                    </div>
                    <div>
                        <h5 style={{ color: '#9A1E47', margin: 0 }}>
                            {hotel.Precio !== undefined ? `$${parseFloat(hotel.Precio).toFixed(2)}` : 'N/D'}
                        </h5>
                    </div>
                </div>
                <div className="d-grid gap-2">
                    <Button
                        onClick={handleVerDetalles}
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

export default CardHotel;