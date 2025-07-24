// src/components/CardGastronomia.js
import React from 'react';
import { Card, Button } from 'react-bootstrap';

const CardGastronomia = ({ gastronomia, onVerReceta }) => {
    return (
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
                maxWidth: '350px',
                minHeight: '500px', // Altura mínima
                width: '100%',
                margin: '0 auto'
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.15)';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
            }}
        >
            {/* Imagen principal */}
            <div style={{ position: 'relative', height: '200px', backgroundColor: '#f0f0f0' }}>
                <img
                    src={gastronomia.imagen?.url || gastronomia.imagen}
                    alt={gastronomia.nombre}
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        borderBottom: '2px solid #F28B27'
                    }}
                    onError={(e) => {
                        e.target.style.display = 'none';
                    }}
                />
                
                {/* Badge de tipo de platillo */}
                {gastronomia.tipoPlatillo && (
                    <div style={{
                        position: 'absolute',
                        top: '12px',
                        right: '12px',
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

            <Card.Body style={{ padding: '20px', backgroundColor: '#FDF2E0'}}>
                {/* Nombre del platillo */}
                <Card.Title 
                    style={{ 
                        color: '#9A1E47', 
                        fontSize: '1.5rem',
                        fontWeight: '700',
                        marginBottom: '12px',
                        lineHeight: '1.3'
                    }}
                >
                    {gastronomia.nombre}
                </Card.Title>

                {/* Descripción */}
                {gastronomia.descripcion && (
                    <p style={{ 
                        color: '#666', 
                        fontSize: '0.9rem',
                        marginBottom: '16px',
                        lineHeight: '1',
                        height: '4.5rem',
                        overflow: 'hidden',
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical'
                    }}>
                        {gastronomia.descripcion}
                    </p>
                )}

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
                <br></br>
                <br></br>
                {/* Botón de ver receta */}
                <Button
                    onClick={() => onVerReceta(gastronomia)}
                    style={{
                        backgroundColor: '#9A1E47',
                        borderColor: '#9A1E47',
                        color: 'white',
                        borderRadius: '12px',
                        padding: '12px 24px',
                        fontWeight: '600',
                        fontSize: '0.9rem',
                        transition: 'all 0.3s ease',
                        width: '100%',
                        border: 'none'
                    }}
                    onMouseEnter={(e) => {
                        e.target.style.backgroundColor = 'rgba(154, 30, 71, 0.3)';
                        e.target.style.transform = 'translateY(-1px)';
                    }}
                    onMouseLeave={(e) => {
                        e.target.style.backgroundColor = 'rgba(154, 30, 71, 0.3)';
                        e.target.style.transform = 'translateY(0)';
                    }}
                >
                    Ver Receta Completa
                </Button>
            </Card.Body>
        </Card>
    );
};

export default CardGastronomia;