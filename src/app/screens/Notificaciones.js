import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaCheckCircle, FaTimesCircle, FaInfoCircle, FaCalendarAlt, FaUser, FaBox, FaEye, FaEyeSlash, FaTrash } from "react-icons/fa";
import { Container, Card, Badge, Alert, Spinner, Button, Row, Col } from "react-bootstrap";

const Notificaciones = ({ idUsuario }) => {
    const [notificaciones, setNotificaciones] = useState([]);
    const [loading, setLoading] = useState(true);
    const [noLeidas, setNoLeidas] = useState(0);

    useEffect(() => {
        obtenerNotificaciones();
    }, [idUsuario]);

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
            
            // Contar notificaciones no leídas
            const noLeidasCount = response.data.filter(noti => noti.estado !== 'leido').length;
            setNoLeidas(noLeidasCount);
        } catch (error) {
            console.error("Error al obtener notificaciones:", error);
        } finally {
            setLoading(false);
        }
    };

    const marcarComoLeida = async (notificacionId) => {
        try {
            await axios.put(
                `https://backend-iota-seven-19.vercel.app/api/notificaciones/${notificacionId}/leer`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );
            
            // Actualizar el estado local
            setNotificaciones(prev => 
                prev.map(noti => 
                    noti._id === notificacionId 
                        ? { ...noti, estado: 'leido' }
                        : noti
                )
            );
            
            // Actualizar contador de no leídas
            setNoLeidas(prev => Math.max(0, prev - 1));
        } catch (error) {
            console.error("Error al marcar como leída:", error);
        }
    };

    const eliminarNotificacion = async (notificacionId) => {
        try {
            await axios.delete(
                `https://backend-iota-seven-19.vercel.app/api/notificaciones/${notificacionId}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );
            
            // Remover de la lista local
            setNotificaciones(prev => prev.filter(noti => noti._id !== notificacionId));
            
            // Actualizar contador si era no leída
            const notificacionEliminada = notificaciones.find(noti => noti._id === notificacionId);
            if (notificacionEliminada && notificacionEliminada.estado !== 'leido') {
                setNoLeidas(prev => Math.max(0, prev - 1));
            }
        } catch (error) {
            console.error("Error al eliminar notificación:", error);
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
            case "leido":
                return "secondary";
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
            <Container fluid className="py-5" style={{ 
                background: 'linear-gradient(135deg, #FDF2E0 0%, #F8E8D0 100%)',
                minHeight: '100vh'
            }}>
                <Container>
                    <div className="text-center">
                        <Spinner animation="border" variant="primary" />
                        <p className="mt-2">Cargando notificaciones...</p>
                    </div>
                </Container>
            </Container>
        );
    }

    return (
        <Container fluid className="py-5" style={{ 
            background: 'linear-gradient(135deg, #FDF2E0 0%, #F8E8D0 100%)',
            minHeight: '100vh'
        }}>
            <Container>
                <div className="text-center mb-5">
                    <h1 className="display-4 fw-bold" style={{ color: '#9A1E47' }}>
                        🔔 Mis Notificaciones
                    </h1>
                    <p className="lead text-muted">
                        Mantente al día con el estado de tus publicaciones
                    </p>
                    {noLeidas > 0 && (
                        <Badge bg="danger" className="fs-6 px-3 py-2">
                            {noLeidas} {noLeidas === 1 ? 'notificación nueva' : 'notificaciones nuevas'}
                        </Badge>
                    )}
                </div>
                
                {notificaciones.length === 0 ? (
                    <Card className="border-0 shadow-lg text-center" style={{ borderRadius: '20px' }}>
                        <Card.Body className="p-5">
                            <FaInfoCircle size={48} className="text-muted mb-3" />
                            <h4 className="text-muted">No tienes notificaciones</h4>
                            <p className="text-muted">Cuando tus productos sean revisados, aparecerán aquí las notificaciones.</p>
                        </Card.Body>
                    </Card>
                ) : (
                    <div className="space-y-3">
                        {notificaciones.map((noti) => (
                            <Card 
                                key={noti._id} 
                                className={`mb-3 shadow-sm border-0 ${noti.estado !== 'leido' ? 'border-start border-4 border-primary' : ''}`}
                                style={{ borderRadius: '15px' }}
                            >
                                <Card.Body className="p-4">
                                    <div className="d-flex justify-content-between align-items-start mb-3">
                                        <div className="d-flex align-items-center">
                                            {getTipoIcon(noti.tipo, noti.estado)}
                                            <h6 className="mb-0 ms-2 fw-bold">
                                                {noti.tipo === "publicacion" ? "Publicación" : noti.tipo}
                                            </h6>
                                        </div>
                                        <div className="d-flex align-items-center gap-2">
                                            <Badge bg={getEstadoColor(noti.estado)} className="px-3 py-2">
                                                {noti.estado === 'leido' ? 'Leída' : noti.estado}
                                            </Badge>
                                            {noti.estado !== 'leido' && (
                                                <Button
                                                    variant="outline-primary"
                                                    size="sm"
                                                    onClick={() => marcarComoLeida(noti._id)}
                                                    title="Marcar como leída"
                                                >
                                                    <FaEye />
                                                </Button>
                                            )}
                                            <Button
                                                variant="outline-danger"
                                                size="sm"
                                                onClick={() => eliminarNotificacion(noti._id)}
                                                title="Eliminar notificación"
                                            >
                                                <FaTrash />
                                            </Button>
                                        </div>
                                    </div>
                                    
                                    <div className="mb-3">
                                        <p className="mb-2 fw-bold">Mensaje:</p>
                                        <p className="text-muted mb-0">{noti.mensaje}</p>
                                    </div>

                                    {noti.producto && (
                                        <div className="mb-3">
                                            <p className="mb-1 fw-bold">
                                                <FaBox className="me-2" />
                                                Producto:
                                            </p>
                                            <p className="text-muted mb-0">{noti.producto}</p>
                                        </div>
                                    )}

                                    {noti.Motivo && noti.Motivo.trim() !== "" && (
                                        <div className="mb-3">
                                            <p className="mb-1 fw-bold text-danger">Motivo del rechazo:</p>
                                            <p className="text-danger mb-0">{noti.Motivo}</p>
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
        </Container>
    );
};

// Hook personalizado para obtener contador de notificaciones no leídas
export const useNotificacionesCount = (idUsuario) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        const obtenerCount = async () => {
            try {
                const response = await axios.get(
                    `https://backend-iota-seven-19.vercel.app/api/notificaciones/usuario/${idUsuario}/no-leidas`,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`,
                        },
                    }
                );
                setCount(response.data.length);
            } catch (error) {
                console.error("Error al obtener contador de notificaciones:", error);
            }
        };

        if (idUsuario) {
            obtenerCount();
        }
    }, [idUsuario]);

    return count;
};

export default Notificaciones;
