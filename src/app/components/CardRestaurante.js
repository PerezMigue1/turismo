import React from 'react';
import { Card, Button, Badge, Carousel } from 'react-bootstrap';
import { FaStar, FaMapMarkerAlt, FaUtensils } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const CardRestaurante = ({ restaurante }) => {
    return (
        <Card className="h-100" style={{
            border: '2px solid #0FA89C',
            borderRadius: '10px',
            overflow: 'hidden',
            boxShadow: '0 4px 12px rgba(154, 30, 71, 0.15)',
            transition: 'transform 0.3s, box-shadow 0.3s',
            backgroundColor: 'white',
        }}>
                        <Link to={`/restaurantes/${restaurante._id}`}> 
                {restaurante.Imagenes && restaurante.Imagenes.length > 1 ? (
                    <Carousel interval={3000} controls={false} indicators={false} pause={false}>
                        {restaurante.Imagenes.map((img, idx) => (
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
                                        e.target.src = '/placeholder-restaurant.jpg';
                                    }}
                                />
                            </Carousel.Item>
                        ))}
                    </Carousel>
                ) : (
                    <img
                        src={restaurante.Imagenes?.[0]}
                        alt={restaurante.Nombre}
                        style={{
                            width: '100%',
                            height: '200px',
                            objectFit: 'cover',
                            borderBottom: '3px solid #F28B27'
                        }}
                        onError={(e) => {
                            e.target.src = '/placeholder-restaurant.jpg';
                        }}
                    />
                )}
            </Link>
            <Card.Body className="d-flex flex-column" style={{ backgroundColor: '#FEF8ED' }}>
                <div className="mb-2">
                    <Badge bg="info" style={{ backgroundColor: '#50C2C4', marginRight: 8 }}>
                        <FaUtensils style={{ marginRight: 4 }} /> {restaurante.Categoria}
                    </Badge>
                    {restaurante.Ubicacion && (
                        <Badge bg="success" style={{ backgroundColor: '#1E8546' }}>
                            <FaMapMarkerAlt style={{ marginRight: 4 }} /> {restaurante.Ubicacion.Municipio}
                        </Badge>
                    )}
                </div>
                <Card.Title style={{ color: '#9A1E47', minHeight: '48px' }}>
                    <Link to={`/restaurantes/${restaurante._id}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                        {restaurante.Nombre}
                    </Link>
                </Card.Title>
                <Card.Text className="flex-grow-1" style={{ color: '#555', minHeight: '60px' }}>
                    {restaurante.Descripcion?.substring(0, 100)}...
                </Card.Text>
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <div style={{ color: '#F28B27' }}>
                        {[...Array(5)].map((_, i) => (
                            <FaStar key={i} color={i < 4 ? '#F28B27' : '#ddd'} />
                        ))}
                    </div>
                </div>
                <div className="d-grid gap-2">
                    <Button
                        variant="outline"
                        style={{
                            color: '#9A1E47',
                            borderColor: '#9A1E47'
                        }}
                        as={Link}
                        to={`/restaurantes/${restaurante._id}`}
                    >
                        Ver detalles
                    </Button>
                </div>
            </Card.Body>
        </Card>
    );
};

export default CardRestaurante; 