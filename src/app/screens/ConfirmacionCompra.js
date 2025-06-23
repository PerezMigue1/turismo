// src/screens/ConfirmacionCompra.js
import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { FaCheckCircle, FaHome, FaShoppingBag } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const ConfirmacionCompra = () => {
    // Datos de ejemplo (en una app real vendrían del estado o de una API)
    const ordenEjemplo = {
        id: 'ORD-123456',
        fecha: new Date().toLocaleDateString(),
        total: 1250,
        productos: [
            { id: 1, nombre: 'Bordado Tenango', cantidad: 2, precio: 350 },
            { id: 2, nombre: 'Máscara de Carnaval', cantidad: 1, precio: 280 }
        ],
        direccion: 'Calle Falsa 123, Ciudad, CP 12345'
    };

    return (
        <Container style={{ backgroundColor: '#FDF2E0', minHeight: '100vh', padding: '30px 0' }}>
            <Row className="justify-content-center">
                <Col md={8}>
                    <Card style={{ backgroundColor: 'white' }}>
                        <Card.Body className="text-center">
                            <FaCheckCircle style={{ fontSize: '5rem', color: '#1E8546', marginBottom: '20px' }} />
                            <h2 style={{ color: '#9A1E47' }}>¡Gracias por tu compra!</h2>
                            <p className="lead">Tu orden ha sido procesada exitosamente.</p>

                            <div className="text-start mt-4">
                                <h4 style={{ color: '#9A1E47' }}>Detalles de la Orden</h4>
                                <p><strong>Número de Orden:</strong> {ordenEjemplo.id}</p>
                                <p><strong>Fecha:</strong> {ordenEjemplo.fecha}</p>
                                <p><strong>Total:</strong> ${ordenEjemplo.total}</p>
                                <p><strong>Dirección de envío:</strong> {ordenEjemplo.direccion}</p>

                                <h4 style={{ color: '#9A1E47', marginTop: '30px' }}>Productos</h4>
                                <ul>
                                    {ordenEjemplo.productos.map((producto) => (
                                        <li key={producto.id}>
                                            {producto.nombre} - {producto.cantidad} x ${producto.precio}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="d-flex justify-content-center gap-3 mt-5">
                                <Link to="/">
                                    <Button variant="primary" style={{ backgroundColor: '#9A1E47', border: 'none' }}>
                                        <FaHome className="me-2" />
                                        Volver al Inicio
                                    </Button>
                                </Link>
                                <Link to="/artesanias">
                                    <Button variant="outline-primary">
                                        <FaShoppingBag className="me-2" />
                                        Seguir Comprando
                                    </Button>
                                </Link>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default ConfirmacionCompra;