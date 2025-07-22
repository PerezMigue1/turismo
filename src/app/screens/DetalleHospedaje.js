import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Carousel } from 'react-bootstrap';

const HotelesDetalle = ({ hotel, onVolver }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    if (!hotel) {
        return (
            <div className="container py-5 text-center">
                <div className="alert alert-warning d-inline-block">
                    No se encontró el hotel.
                    <button onClick={onVolver} className="btn btn-link text-primary ms-2">Volver</button>
                </div>
            </div>
        );
    }

    const renderServicios = () => {
        if (!hotel.Servicios) return null;
        const servicios = hotel.Servicios.split(',').map((servicio, index) => (
            <li key={index} className="list-group-item">
                {servicio.trim()}
            </li>
        ));
        return <ul className="list-group">{servicios}</ul>;
    };

    return (
        <div className="container py-5">
            <button className="btn btn-outline-danger mb-3" onClick={onVolver}>
                <ArrowLeft className="me-2" size={18} /> Volver
            </button>

            <div className="row">
                <div className="col-lg-7">
                    <div className="card mb-4">
                        {hotel.Imagenes && hotel.Imagenes.length > 1 ? (
                            <Carousel activeIndex={currentImageIndex} onSelect={setCurrentImageIndex} interval={3000}>
                                {hotel.Imagenes.map((img, idx) => (
                                    <Carousel.Item key={idx}>
                                        <img
                                            src={img}
                                            alt={`Imagen ${idx + 1}`}
                                            className="card-img-top"
                                            style={{ height: '400px', objectFit: 'cover' }}
                                            onError={(e) => (e.target.src = '/placeholder-hotel.jpg')}
                                        />
                                    </Carousel.Item>
                                ))}
                            </Carousel>
                        ) : (
                            <img
                                src={hotel.Imagenes?.[0] || '/placeholder-hotel.jpg'}
                                alt="Imagen del hotel"
                                className="card-img-top"
                                style={{ height: '400px', objectFit: 'cover' }}
                                onError={(e) => (e.target.src = '/placeholder-hotel.jpg')}
                            />
                        )}
                    </div>

                    {hotel.Imagenes && hotel.Imagenes.length > 1 && (
                        <div className="d-flex gap-2 mb-4 flex-wrap">
                            {hotel.Imagenes.map((img, idx) => (
                                <img
                                    key={idx}
                                    src={img}
                                    alt={`Miniatura ${idx + 1}`}
                                    className={`img-thumbnail ${currentImageIndex === idx ? 'border border-danger' : ''}`}
                                    style={{ width: 75, height: 75, objectFit: 'cover', cursor: 'pointer' }}
                                    onClick={() => setCurrentImageIndex(idx)}
                                    onError={(e) => (e.target.src = '/placeholder-hotel.jpg')}
                                />
                            ))}
                        </div>
                    )}
                </div>

                <div className="col-lg-5">
                    <div className="card">
                        <div className="card-body">
                            <h4 className="card-title text-danger">{hotel.Nombre || 'Hotel sin nombre'}</h4>
                            <p className="text-muted">{hotel.Ubicacion || 'Ubicación no disponible'}</p>
                            <h5 className="text-success">
                                ${hotel.Precio || 0} <small className="text-muted">MXN</small>
                            </h5>
                            <hr />
                            <h5 className="text-danger">Información adicional</h5>
                            <p><strong>Categoría:</strong> {hotel.Categoria || 'N/D'}</p>
                            <p><strong>Capacidad:</strong> {hotel.Huespedes || 'N/D'}</p>
                            <p><strong>Teléfono:</strong> {hotel.Telefono || 'N/D'}</p>
                            <p><strong>Horario:</strong> {hotel.Horario || 'N/D'}</p>
                            <hr />
                            <h5 className="text-danger">Servicios incluidos</h5>
                            {renderServicios()}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HotelesDetalle;