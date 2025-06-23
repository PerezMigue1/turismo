<<<<<<< HEAD
// src/screens/Checkout.js
import React, { useState, useContext } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { FaArrowLeft, FaCreditCard, FaMapMarkerAlt, FaUser } from 'react-icons/fa';
import { Link } from 'react-router-dom';

import { CartContext } from '../Navigation/CartContext'

const Checkout = () => {
    const { carrito } = useContext(CartContext);
    const [formData, setFormData] = useState({
        nombre: '',
        email: '',
        direccion: '',
        ciudad: '',
        codigoPostal: '',
        metodoPago: 'tarjeta'
    });

    const [ordenCompletada, setOrdenCompletada] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Simular procesamiento de pago
        setTimeout(() => {
            setOrdenCompletada(true);
        }, 1500);
    };

    const calcularTotal = () => {
        return carrito.reduce((total, item) => total + (item.precio * item.cantidad), 0);
    };

    if (ordenCompletada) {
        return (
            <Container style={{ backgroundColor: '#FDF2E0', minHeight: '100vh', padding: '30px 0' }}>
                <Row className="justify-content-center">
                    <Col md={8}>
                        <Alert variant="success" className="text-center" style={{ backgroundColor: '#1E8546', color: 'white' }}>
                            <h4>¡Pago Completado con Éxito!</h4>
                            <p>Tu orden ha sido procesada correctamente. Hemos enviado los detalles a tu correo electrónico.</p>
                            <Link to="/confirmacion">
                                <Button variant="light" style={{ color: '#1E8546', marginTop: '15px' }}>
                                    Ver Confirmación
                                </Button>
                            </Link>
                        </Alert>
                    </Col>
                </Row>
            </Container>
        );
    }

    return (
        <Container style={{ backgroundColor: '#FDF2E0', minHeight: '100vh', padding: '30px 0' }}>
            <Row>
                <Col md={8}>
                    <Card className="mb-4" style={{ backgroundColor: 'white' }}>
                        <Card.Body>
                            <h3 style={{ color: '#9A1E47' }}>Información de Envío</h3>
                            <Form onSubmit={handleSubmit}>
                                <Row className="mb-3">
                                    <Col md={6}>
                                        <Form.Group controlId="nombre">
                                            <Form.Label>Nombre Completo</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="nombre"
                                                value={formData.nombre}
                                                onChange={handleChange}
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group controlId="email">
                                            <Form.Label>Correo Electrónico</Form.Label>
                                            <Form.Control
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Form.Group controlId="direccion" className="mb-3">
                                    <Form.Label>
                                        <FaMapMarkerAlt className="me-2" />
                                        Dirección
                                    </Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="direccion"
                                        value={formData.direccion}
                                        onChange={handleChange}
                                        required
                                    />
                                </Form.Group>

                                <Row className="mb-3">
                                    <Col md={6}>
                                        <Form.Group controlId="ciudad">
                                            <Form.Label>Ciudad</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="ciudad"
                                                value={formData.ciudad}
                                                onChange={handleChange}
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group controlId="codigoPostal">
                                            <Form.Label>Código Postal</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="codigoPostal"
                                                value={formData.codigoPostal}
                                                onChange={handleChange}
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <h3 style={{ color: '#9A1E47', marginTop: '30px' }}>Método de Pago</h3>

                                <Form.Group controlId="metodoPago" className="mb-4">
                                    <Form.Check
                                        type="radio"
                                        label="Tarjeta de Crédito/Débito"
                                        name="metodoPago"
                                        value="tarjeta"
                                        checked={formData.metodoPago === 'tarjeta'}
                                        onChange={handleChange}
                                        className="mb-2"
                                    />
                                    <Form.Check
                                        type="radio"
                                        label="PayPal"
                                        name="metodoPago"
                                        value="paypal"
                                        checked={formData.metodoPago === 'paypal'}
                                        onChange={handleChange}
                                        className="mb-2"
                                    />
                                    <Form.Check
                                        type="radio"
                                        label="Transferencia Bancaria"
                                        name="metodoPago"
                                        value="transferencia"
                                        checked={formData.metodoPago === 'transferencia'}
                                        onChange={handleChange}
                                    />
                                </Form.Group>

                                <div className="d-flex justify-content-between">
                                    <Link to="/carrito">
                                        <Button variant="outline-primary">
                                            <FaArrowLeft className="me-2" />
                                            Volver al Carrito
                                        </Button>
                                    </Link>
                                    <Button
                                        type="submit"
                                        style={{ backgroundColor: '#9A1E47', border: 'none' }}
                                    >
                                        <FaCreditCard className="me-2" />
                                        Confirmar Pago
                                    </Button>
                                </div>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={4}>
                    <Card style={{ backgroundColor: 'white' }}>
                        <Card.Body>
                            <h4 style={{ color: '#9A1E47' }}>Resumen de Orden</h4>
                            {carrito.map((item) => (
                                <div key={item.id} className="d-flex justify-content-between mb-2">
                                    <span>
                                        {item.nombre} x {item.cantidad}
                                    </span>
                                    <span>${item.precio * item.cantidad}</span>
                                </div>
                            ))}
                            <hr />
                            <div className="d-flex justify-content-between fw-bold">
                                <span>Total:</span>
                                <span style={{ color: '#9A1E47' }}>${calcularTotal()}</span>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

=======
// src/screens/Checkout.js
import React, { useState, useContext } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { FaArrowLeft, FaCreditCard, FaMapMarkerAlt, FaUser } from 'react-icons/fa';
import { Link } from 'react-router-dom';

import { CartContext } from '../Navigation/CartContext'

const Checkout = () => {
    const { carrito } = useContext(CartContext);
    const [formData, setFormData] = useState({
        nombre: '',
        email: '',
        direccion: '',
        ciudad: '',
        codigoPostal: '',
        metodoPago: 'tarjeta'
    });

    const [ordenCompletada, setOrdenCompletada] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Simular procesamiento de pago
        setTimeout(() => {
            setOrdenCompletada(true);
        }, 1500);
    };

    const calcularTotal = () => {
        return carrito.reduce((total, item) => total + (item.precio * item.cantidad), 0);
    };

    if (ordenCompletada) {
        return (
            <Container style={{ backgroundColor: '#FDF2E0', minHeight: '100vh', padding: '30px 0' }}>
                <Row className="justify-content-center">
                    <Col md={8}>
                        <Alert variant="success" className="text-center" style={{ backgroundColor: '#1E8546', color: 'white' }}>
                            <h4>¡Pago Completado con Éxito!</h4>
                            <p>Tu orden ha sido procesada correctamente. Hemos enviado los detalles a tu correo electrónico.</p>
                            <Link to="/confirmacion">
                                <Button variant="light" style={{ color: '#1E8546', marginTop: '15px' }}>
                                    Ver Confirmación
                                </Button>
                            </Link>
                        </Alert>
                    </Col>
                </Row>
            </Container>
        );
    }

    return (
        <Container style={{ backgroundColor: '#FDF2E0', minHeight: '100vh', padding: '30px 0' }}>
            <Row>
                <Col md={8}>
                    <Card className="mb-4" style={{ backgroundColor: 'white' }}>
                        <Card.Body>
                            <h3 style={{ color: '#9A1E47' }}>Información de Envío</h3>
                            <Form onSubmit={handleSubmit}>
                                <Row className="mb-3">
                                    <Col md={6}>
                                        <Form.Group controlId="nombre">
                                            <Form.Label>Nombre Completo</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="nombre"
                                                value={formData.nombre}
                                                onChange={handleChange}
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group controlId="email">
                                            <Form.Label>Correo Electrónico</Form.Label>
                                            <Form.Control
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Form.Group controlId="direccion" className="mb-3">
                                    <Form.Label>
                                        <FaMapMarkerAlt className="me-2" />
                                        Dirección
                                    </Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="direccion"
                                        value={formData.direccion}
                                        onChange={handleChange}
                                        required
                                    />
                                </Form.Group>

                                <Row className="mb-3">
                                    <Col md={6}>
                                        <Form.Group controlId="ciudad">
                                            <Form.Label>Ciudad</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="ciudad"
                                                value={formData.ciudad}
                                                onChange={handleChange}
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group controlId="codigoPostal">
                                            <Form.Label>Código Postal</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="codigoPostal"
                                                value={formData.codigoPostal}
                                                onChange={handleChange}
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <h3 style={{ color: '#9A1E47', marginTop: '30px' }}>Método de Pago</h3>

                                <Form.Group controlId="metodoPago" className="mb-4">
                                    <Form.Check
                                        type="radio"
                                        label="Tarjeta de Crédito/Débito"
                                        name="metodoPago"
                                        value="tarjeta"
                                        checked={formData.metodoPago === 'tarjeta'}
                                        onChange={handleChange}
                                        className="mb-2"
                                    />
                                    <Form.Check
                                        type="radio"
                                        label="PayPal"
                                        name="metodoPago"
                                        value="paypal"
                                        checked={formData.metodoPago === 'paypal'}
                                        onChange={handleChange}
                                        className="mb-2"
                                    />
                                    <Form.Check
                                        type="radio"
                                        label="Transferencia Bancaria"
                                        name="metodoPago"
                                        value="transferencia"
                                        checked={formData.metodoPago === 'transferencia'}
                                        onChange={handleChange}
                                    />
                                </Form.Group>

                                <div className="d-flex justify-content-between">
                                    <Link to="/carrito">
                                        <Button variant="outline-primary">
                                            <FaArrowLeft className="me-2" />
                                            Volver al Carrito
                                        </Button>
                                    </Link>
                                    <Button
                                        type="submit"
                                        style={{ backgroundColor: '#9A1E47', border: 'none' }}
                                    >
                                        <FaCreditCard className="me-2" />
                                        Confirmar Pago
                                    </Button>
                                </div>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={4}>
                    <Card style={{ backgroundColor: 'white' }}>
                        <Card.Body>
                            <h4 style={{ color: '#9A1E47' }}>Resumen de Orden</h4>
                            {carrito.map((item) => (
                                <div key={item.id} className="d-flex justify-content-between mb-2">
                                    <span>
                                        {item.nombre} x {item.cantidad}
                                    </span>
                                    <span>${item.precio * item.cantidad}</span>
                                </div>
                            ))}
                            <hr />
                            <div className="d-flex justify-content-between fw-bold">
                                <span>Total:</span>
                                <span style={{ color: '#9A1E47' }}>${calcularTotal()}</span>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

>>>>>>> 39e792a0febff33491eff80f548ffaf809d93736
export default Checkout;