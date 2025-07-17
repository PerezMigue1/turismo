// src/screen/HotelesDetalle.js
import React, { useState } from 'react';
import { Container, Row, Col, Button, Badge, Card, Modal } from 'react-bootstrap';
import { 
    FaArrowLeft, 
    FaStar, 
    FaMapMarkerAlt, 
    FaPhone, 
    FaClock, 
    FaUsers, 
    FaWifi, 
    FaParking, 
    FaUtensils, 
    FaSnowflake, 
    FaChild,
    FaHeart,
    FaShare
} from 'react-icons/fa';

const HotelesDetalle = ({ hotel, onBack, show, onHide }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    // Generar datos de demostración
    const valoracionDemo = Math.floor(Math.random() * 2) + 4;
    const numeroResenasDemo = Math.floor(Math.random() * 50) + 10;

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
        
        return iconos.map((icono, index) => (
            <div key={index} style={{ 
                display: 'flex', 
                alignItems: 'center', 
                marginBottom: '10px',
                padding: '8px 12px',
                backgroundColor: '#F8F9FA',
                borderRadius: '8px',
                marginRight: '8px'
            }}>
                <span style={{ marginRight: '8px', color: '#0FA89C', fontSize: '1.2rem' }}>
                    {icono}
                </span>
                <span style={{ color: '#666', fontSize: '0.9rem' }}>
                    {servicios[index]?.trim()}
                </span>
            </div>
        ));
    };

    if (!hotel) return null;

    return (
        <Modal 
            show={show} 
            onHide={onHide} 
            size="xl" 
            centered
            style={{ zIndex: 1050 }}
        >
            <Modal.Header style={{ 
                backgroundColor: '#0FA89C', 
                color: 'white',
                padding: '15px 25px'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                    <Button 
                        variant="link" 
                        onClick={onHide}
                        style={{ 
                            color: 'green', 
                            padding: '0',
                            marginRight: '15px',
                            fontSize: '1.2rem'
                        }}
                    >
                        <FaArrowLeft />
                    </Button>
                    <h4 style={{ margin: 0, flex: 1 }}>Detalles del Hotel</h4>
                    <div style={{ display: 'flex', gap: '10px' }}>
                    
                    </div>
                </div>
            </Modal.Header>

            <Modal.Body style={{ padding: 0, maxHeight: '80vh', overflowY: 'auto' }}>
                <Container fluid style={{ padding: '20px' }}>
                    <Row>
                        {/* Columna izquierda - Imágenes */}
                        <Col lg={8}>
                            {/* Imagen principal */}
                            <div style={{ marginBottom: '20px' }}>
                                <img
                                    src={hotel.Imagenes[currentImageIndex]}
                                    alt={`${hotel.Nombre} - Imagen principal`}
                                    style={{
                                        width: '50%',
                                        height: '500px',
                                        objectFit: 'cover',
                                        borderRadius: '12px',
                                        border: '3px solid #0FA89C'
                                    }}
                                    onError={(e) => {
                                        e.target.src = '/placeholder-hotel.jpg';
                                    }}
                                />
                            </div>

                            {/* Miniaturas */}
                            <div style={{ 
                                display: 'flex', 
                                gap: '10px',
                                flexWrap: 'wrap',
                                marginBottom: '30px'
                            }}>
                                {hotel.Imagenes.map((imagen, index) => (
                                    <div
                                        key={index}
                                        onClick={() => setCurrentImageIndex(index)}
                                        style={{
                                            width: '100px',
                                            height: '100px',
                                            border: currentImageIndex === index ? '3px solid #9A1E47' : '2px solid #E8E8E8',
                                            borderRadius: '8px',
                                            overflow: 'hidden',
                                            cursor: 'pointer',
                                            transition: 'all 0.3s ease'
                                        }}
                                    >
                                        <img
                                            src={imagen}
                                            alt={`${hotel.Nombre} - Miniatura ${index + 1}`}
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'cover'
                                            }}
                                        />
                                    </div>
                                ))}
                            </div>
                        </Col>

                        {/* Columna derecha - Información del hotel */}
                        <Col lg={4}>
                            <div style={{ position: 'sticky', top: '20px' }}>
                                {/* Información principal */}
                                <div style={{ marginBottom: '20px' }}>
                                    <Badge 
                                        style={{ 
                                            backgroundColor: '#0FA89C',
                                            fontSize: '0.9rem',
                                            padding: '8px 15px',
                                            borderRadius: '25px',
                                            marginBottom: '15px'
                                        }}
                                    >
                                        {hotel.Categoria}
                                    </Badge>
                                    <br></br>
                                    <br></br>
                                    <h2 style={{ 
                                        color: '#9A1E47', 
                                        fontSize: '1.8rem',
                                        fontWeight: '600',
                                        margin: 0,
                                        marginBottom: '15px'
                                    }}>
                                        {hotel.Nombre}
                                    </h2>
                                    
                                    {/* Precio */}
                                    <div style={{ marginBottom: '15px' }}>
                                        <span style={{ 
                                            color: '#9A1E47', 
                                            fontSize: '2rem', 
                                            fontWeight: '700'
                                        }}>
                                            ${hotel.Precio.toFixed(2)}
                                        </span>
                                        <span style={{ 
                                            color: '#666', 
                                            fontSize: '1.1rem',
                                            marginLeft: '8px'
                                        }}>
                                            MX
                                        </span>
                                    </div>

                                    {/* Valoración */}
                                    <div style={{ 
                                        display: 'flex', 
                                        alignItems: 'center',
                                        gap: '10px',
                                        marginBottom: '20px'
                                    }}>
                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                            {[...Array(5)].map((_, i) => (
                                                <FaStar 
                                                    key={i} 
                                                    color={i < valoracionDemo ? '#F28B27' : '#ddd'}
                                                    style={{ fontSize: '1.2rem', marginRight: '2px' }}
                                                />
                                            ))}
                                        </div>
                                        <span style={{ 
                                            color: '#666',
                                            fontSize: '0.9rem'
                                        }}>
                                            ({numeroResenasDemo} reseñas)
                                        </span>
                                    </div>

                                    {/* Ubicación */}
                                    <div style={{ 
                                        display: 'flex', 
                                        alignItems: 'center',
                                        marginBottom: '20px'
                                    }}>
                                        <FaMapMarkerAlt style={{ marginRight: '8px', color: '#9A1E47' }} />
                                        <span style={{ color: '#666', fontSize: '1rem' }}>
                                            {hotel.Ubicacion}
                                        </span>
                                    </div>
                                </div>

                                {/* Información de contacto */}
                                <Card style={{ marginBottom: '20px', border: '1px solid #E8E8E8' }}>
                                    <Card.Body>
                                        <div style={{ marginBottom: '15px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                                                <FaPhone style={{ marginRight: '8px', color: '#9A1E47' }} />
                                                <strong>Teléfono:</strong>
                                            </div>
                                            <p style={{ margin: 0, color: '#666', paddingLeft: '24px' }}>
                                                {hotel.Telefono}
                                            </p>
                                        </div>
                                        
                                        <div style={{ marginBottom: '15px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                                                <FaClock style={{ marginRight: '8px', color: '#9A1E47' }} />
                                                <strong>Horario:</strong>
                                            </div>
                                            <p style={{ margin: 0, color: '#666', paddingLeft: '24px' }}>
                                                {hotel.Horario}
                                            </p>
                                        </div>
                                        
                                        <div>
                                            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                                                <FaUsers style={{ marginRight: '8px', color: '#9A1E47' }} />
                                                <strong>Huespedes:</strong>
                                            </div>
                                            <p style={{ margin: 0, color: '#666', paddingLeft: '24px' }}>
                                                {hotel.Huespedes}
                                            </p>
                                        </div>
                                    </Card.Body>
                                </Card>

                                {/* Servicios */}
                                <Card style={{ border: '1px solid #E8E8E8' }}>
                                    <Card.Body>
                                        <h5 style={{ color: '#9A1E47', marginBottom: '15px' }}>
                                            Servicios Incluidos
                                        </h5>
                                        <div style={{ 
                                            display: 'flex', 
                                            flexWrap: 'wrap',
                                            gap: '10px'
                                        }}>
                                            {renderServicios()}
                                        </div>
                                    </Card.Body>
                                </Card>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </Modal.Body>
        </Modal>
    );
};

export default HotelesDetalle;