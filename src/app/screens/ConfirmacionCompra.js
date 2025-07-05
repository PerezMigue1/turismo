// src/screens/ConfirmacionCompra.js
import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Spinner } from 'react-bootstrap';
import { FaCheckCircle, FaHome, FaShoppingBag } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';

const ConfirmacionCompra = () => {
    const [pedido, setPedido] = useState(null);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const token = localStorage.getItem("token");
    const ultimoPedidoId = localStorage.getItem("ultimoPedidoId");

    useEffect(() => {
        if (!ultimoPedidoId || !token) {
            return navigate('/');
        }

        const obtenerPedido = async () => {
            try {
                const res = await fetch(`https://backend-iota-seven-19.vercel.app/api/pedidos/${ultimoPedidoId}`, {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                });

                if (!res.ok) throw new Error("No se pudo obtener el pedido");

                const data = await res.json();
                setPedido(data);
                setCargando(false);
            } catch (err) {
                setError(err.message);
                setCargando(false);
            }
        };

        obtenerPedido();
    }, [ultimoPedidoId, token, navigate]);

    if (cargando) {
        return (
            <Container className="text-center" style={{ paddingTop: "100px" }}>
                <Spinner animation="border" variant="primary" />
                <p>Cargando detalles de tu pedido...</p>
            </Container>
        );
    }

    if (error || !pedido) {
        return (
            <Container className="text-center" style={{ paddingTop: "100px" }}>
                <h4 style={{ color: '#D24D1C' }}>Ocurrió un error: {error || "Pedido no encontrado"}</h4>
                <Link to="/">
                    <Button style={{ backgroundColor: '#9A1E47', border: 'none' }}>
                        <FaHome className="me-2" /> Volver al Inicio
                    </Button>
                </Link>
            </Container>
        );
    }

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
                                <p><strong>Número de Orden:</strong> {pedido.idPedido}</p>
                                <p><strong>Fecha:</strong> {new Date(pedido.createdAt).toLocaleString()}</p>
                                <p><strong>Total:</strong> ${pedido.total}</p>
                                <p><strong>Dirección de envío:</strong> {pedido.direccionEnvio?.Direccion}, {pedido.direccionEnvio?.Ciudad}, CP {pedido.direccionEnvio?.CodigoPostal}</p>

                                <h4 style={{ color: '#9A1E47', marginTop: '30px' }}>Productos</h4>
                                <ul>
                                    {pedido.productos.map((producto, index) => (
                                        <li key={index}>
                                            {producto.Nombre} - {producto.Cantidad} x ${producto.Precio}
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
