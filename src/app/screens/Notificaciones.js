import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaCheckCircle, FaTimesCircle, FaInfoCircle, FaCalendarAlt, FaUser, FaBox } from "react-icons/fa";
import { Container, Card, Badge, Alert, Spinner } from "react-bootstrap";

const Notificaciones = ({ idUsuario }) => {
    const [notificaciones, setNotificaciones] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        obtenerNotificaciones();
    }, []);

    const obtenerNotificaciones = async () => {
        try {
            setLoading(true);
            const response = await axios.get(
                `https://backend-iota-seven-19.vercel.app/api/notificaciones/usuario/${idUsuario}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );
            setNotificaciones(response.data);
        } catch (error) {
            console.error("Error al obtener notificaciones:", error);
        } finally {
            setLoading(false);
        }
    };

    const getEstadoColor = (estado) => {
        switch (estado) {
            case "aprobado":
                return "success";
            case "rechazado":
                return "danger";
            case "pendiente":
                return "warning";
            default:
                return "info";
        }
    };

    const getTipoIcon = (tipo, estado) => {
        if (tipo === "publicacion") {
            return estado === "aprobado" ? <FaCheckCircle className="text-success" /> : <FaTimesCircle className="text-danger" />;
        }
        return <FaInfoCircle className="text-info" />;
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <Container className="mt-4">
                <div className="text-center">
                    <Spinner animation="border" variant="primary" />
                    <p className="mt-2">Cargando notificaciones...</p>
                </div>
            </Container>
        );
    }

    return (
        <Container className="mt-4">
            <h2 className="mb-4">
                <FaInfoCircle className="me-2" />
                Mis Notificaciones
            </h2>
            
            {notificaciones.length === 0 ? (
                <Alert variant="info">
                    <FaInfoCircle className="me-2" />
                    No tienes notificaciones.
                </Alert>
            ) : (
                <div className="space-y-3">
                    {notificaciones.map((noti) => (
                        <Card key={noti._id} className="mb-3 shadow-sm">
                            <Card.Body>
                                <div className="d-flex justify-content-between align-items-start mb-2">
                                    <div className="d-flex align-items-center">
                                        {getTipoIcon(noti.tipo, noti.estado)}
                                        <h6 className="mb-0 ms-2">
                                            {noti.tipo === "publicacion" ? "Publicación" : noti.tipo}
                                        </h6>
                                    </div>
                                    <Badge bg={getEstadoColor(noti.estado)}>
                                        {noti.estado}
                                    </Badge>
                                </div>
                                
                                <div className="mb-2">
                                    <p className="mb-1"><strong>Mensaje:</strong></p>
                                    <p className="text-muted">{noti.mensaje}</p>
                                </div>

                                {noti.producto && (
                                    <div className="mb-2">
                                        <p className="mb-1">
                                            <FaBox className="me-1" />
                                            <strong>Producto:</strong>
                                        </p>
                                        <p className="text-muted">{noti.producto}</p>
                                    </div>
                                )}

                                {noti.Motivo && noti.Motivo.trim() !== "" && (
                                    <div className="mb-2">
                                        <p className="mb-1"><strong>Motivo:</strong></p>
                                        <p className="text-danger">{noti.Motivo}</p>
                                    </div>
                                )}

                                <div className="d-flex justify-content-between align-items-center text-muted small">
                                    <div>
                                        <FaCalendarAlt className="me-1" />
                                        {formatDate(noti.fecha || noti.createdAt)}
                                    </div>
                                    {noti.idUsuario && (
                                        <div>
                                            <FaUser className="me-1" />
                                            ID: {noti.idUsuario}
                                        </div>
                                    )}
                                </div>
                            </Card.Body>
                        </Card>
                    ))}
                </div>
            )}
        </Container>
    );
};

export default Notificaciones;
