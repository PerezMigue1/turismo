import React, { useState, useEffect } from "react";
import { Container, Card, Button, Badge, ListGroup, Alert, Row, Col } from "react-bootstrap";
import { FaBell, FaTimes, FaCheck, FaTrash, FaEnvelope, FaCalendar, FaStar } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Notificaciones = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [alert, setAlert] = useState({ show: false, message: "", variant: "success" });
    const navigate = useNavigate();

    const storedUser = JSON.parse(localStorage.getItem("user"));
    const id = storedUser?._id || storedUser?.id || storedUser?.idUsuario;

    useEffect(() => {
        if (!id) {
            setAlert({
                show: true,
                message: "No se pudo cargar las notificaciones. Por favor, inicia sesión nuevamente.",
                variant: "danger"
            });
            return;
        }

        fetchNotifications();
    }, [id]);

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`https://backend-iota-seven-19.vercel.app/api/notificaciones/usuario/${id}`);
            setNotifications(response.data);
        } catch (error) {
            console.error("Error al cargar notificaciones:", error);
            setAlert({
                show: true,
                message: "Error al cargar las notificaciones",
                variant: "danger"
            });
        } finally {
            setLoading(false);
        }
    };

    const markNotificationAsRead = async (notificationId) => {
        try {
            await axios.put(`https://backend-iota-seven-19.vercel.app/api/notificaciones/${notificationId}/leer`);
            setNotifications(prev => 
                prev.map(notif => 
                    notif._id === notificationId 
                        ? { ...notif, leida: true }
                        : notif
                )
            );
        } catch (error) {
            console.error("Error al marcar como leída:", error);
            setAlert({
                show: true,
                message: "Error al marcar la notificación como leída",
                variant: "danger"
            });
        }
    };

    const markAllAsRead = async () => {
        try {
            await axios.put(`https://backend-iota-seven-19.vercel.app/api/notificaciones/usuario/${id}/leer-todas`);
            setNotifications(prev => 
                prev.map(notif => ({ ...notif, leida: true }))
            );
            setAlert({
                show: true,
                message: "Todas las notificaciones marcadas como leídas",
                variant: "success"
            });
        } catch (error) {
            console.error("Error al marcar todas como leídas:", error);
            setAlert({
                show: true,
                message: "Error al marcar todas las notificaciones como leídas",
                variant: "danger"
            });
        }
    };

    const deleteNotification = async (notificationId) => {
        try {
            await axios.delete(`https://backend-iota-seven-19.vercel.app/api/notificaciones/${notificationId}`);
            setNotifications(prev => prev.filter(notif => notif._id !== notificationId));
            setAlert({
                show: true,
                message: "Notificación eliminada correctamente",
                variant: "success"
            });
        } catch (error) {
            console.error("Error al eliminar notificación:", error);
            setAlert({
                show: true,
                message: "Error al eliminar la notificación",
                variant: "danger"
            });
        }
    };

    const deleteAllRead = async () => {
        try {
            await axios.delete(`https://backend-iota-seven-19.vercel.app/api/notificaciones/usuario/${id}/eliminar-leidas`);
            setNotifications(prev => prev.filter(notif => !notif.leida));
            setAlert({
                show: true,
                message: "Notificaciones leídas eliminadas correctamente",
                variant: "success"
            });
        } catch (error) {
            console.error("Error al eliminar notificaciones leídas:", error);
            setAlert({
                show: true,
                message: "Error al eliminar las notificaciones leídas",
                variant: "danger"
            });
        }
    };

    const getNotificationIcon = (type) => {
        switch (type) {
            case 'reservation':
            case 'reserva':
                return <FaCalendar style={{ color: '#1E8546' }} />;
            case 'promotion':
            case 'promocion':
                return <FaStar style={{ color: '#FFD700' }} />;
            case 'event':
            case 'evento':
                return <FaBell style={{ color: '#9A1E47' }} />;
            case 'restaurant':
            case 'restaurante':
                return <FaEnvelope style={{ color: '#D24D1C' }} />;
            case 'payment':
            case 'pago':
                return <FaEnvelope style={{ color: '#FF6B6B' }} />;
            case 'publicacion':
                return <FaStar style={{ color: '#1E8546' }} />;
            default:
                return <FaBell style={{ color: '#6C757D' }} />;
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'high':
            case 'alta':
                return '#FF6B6B';
            case 'medium':
            case 'media':
                return '#FFD700';
            case 'low':
            case 'baja':
                return '#6C757D';
            default:
                return '#6C757D';
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) {
            return 'Hoy';
        } else if (diffDays === 2) {
            return 'Ayer';
        } else if (diffDays <= 7) {
            return `Hace ${diffDays - 1} días`;
        } else {
            return date.toLocaleDateString('es-ES', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
            });
        }
    };

    const unreadCount = notifications.filter(n => !n.leida).length;

    if (loading) {
        return (
            <div style={{
                display: "flex", 
                justifyContent: "center", 
                alignItems: "center", 
                height: "100vh", 
                color: "#9A1E47"
            }}>
                Cargando notificaciones...
            </div>
        );
    }

    return (
        <Container className="py-5">
            <Row className="justify-content-center">
                <Col md={10} lg={8}>
                    <Card style={{ 
                        border: "none", 
                        borderRadius: "15px", 
                        boxShadow: "0 4px 12px rgba(0,0,0,0.1)", 
                        backgroundColor: "#FDF2E0" 
                    }}>
                        <Card.Header style={{ 
                            backgroundColor: "#9A1E47", 
                            color: "white", 
                            borderTopLeftRadius: "15px", 
                            borderTopRightRadius: "15px", 
                            padding: "1.5rem" 
                        }}>
                            <div className="d-flex justify-content-between align-items-center">
                                <div className="d-flex align-items-center">
                                    <FaBell className="me-3" style={{ fontSize: "1.5rem" }} />
                                    <h3 className="mb-0">Notificaciones</h3>
                                    {unreadCount > 0 && (
                                        <Badge 
                                            bg="danger" 
                                            className="ms-3"
                                            style={{ fontSize: "0.9rem" }}
                                        >
                                            {unreadCount} nueva{unreadCount !== 1 ? 's' : ''}
                                        </Badge>
                                    )}
                                </div>
                                <div className="d-flex gap-2">
                                    {unreadCount > 0 && (
                                        <Button
                                            variant="outline-light"
                                            size="sm"
                                            onClick={markAllAsRead}
                                            style={{ borderRadius: "20px" }}
                                        >
                                            <FaCheck className="me-1" />
                                            Marcar todas como leídas
                                        </Button>
                                    )}
                                    <Button
                                        variant="outline-light"
                                        size="sm"
                                        onClick={() => navigate('/perfil')}
                                        style={{ borderRadius: "20px" }}
                                    >
                                        Volver al perfil
                                    </Button>
                                </div>
                            </div>
                        </Card.Header>

                        <Card.Body style={{ padding: "2rem" }}>
                            {alert.show && (
                                <Alert variant={alert.variant} onClose={() => setAlert({ ...alert, show: false })} dismissible>
                                    {alert.message}
                                </Alert>
                            )}

                            {notifications.length === 0 ? (
                                <div className="text-center py-5">
                                    <FaBell style={{ fontSize: "4rem", color: "#6C757D", marginBottom: "1rem" }} />
                                    <h4 style={{ color: "#6C757D" }}>No tienes notificaciones</h4>
                                    <p style={{ color: "#6C757D" }}>Cuando tengas nuevas notificaciones, aparecerán aquí.</p>
                                </div>
                            ) : (
                                <>
                                    <div className="d-flex justify-content-between align-items-center mb-3">
                                        <h5 style={{ color: "#9A1E47", margin: 0 }}>
                                            Total: {notifications.length} notificación{notifications.length !== 1 ? 'es' : ''}
                                        </h5>
                                        {notifications.some(n => n.leida) && (
                                            <Button
                                                variant="outline-danger"
                                                size="sm"
                                                onClick={deleteAllRead}
                                                style={{ borderRadius: "20px" }}
                                            >
                                                <FaTrash className="me-1" />
                                                Eliminar leídas
                                            </Button>
                                        )}
                                    </div>

                                    <ListGroup>
                                        {notifications.map((notification) => (
                                            <ListGroup.Item 
                                                key={notification._id}
                                                style={{
                                                    backgroundColor: notification.leida ? "white" : "#f8f9fa",
                                                    border: "1px solid #dee2e6",
                                                    borderRadius: "10px",
                                                    marginBottom: "10px",
                                                    borderLeft: notification.leida ? "4px solid #dee2e6" : `4px solid ${getPriorityColor(notification.prioridad || 'media')}`,
                                                    transition: "all 0.3s ease"
                                                }}
                                                className="hover-effect"
                                            >
                                                <div className="d-flex justify-content-between align-items-start">
                                                    <div className="d-flex align-items-start" style={{ flex: 1 }}>
                                                        <div className="me-3 mt-1">
                                                            {getNotificationIcon(notification.tipo)}
                                                        </div>
                                                        <div style={{ flex: 1 }}>
                                                            <div className="d-flex align-items-center mb-1">
                                                                <h6 className="mb-0 me-2" style={{ 
                                                                    color: "#9A1E47",
                                                                    fontWeight: notification.leida ? "normal" : "bold"
                                                                }}>
                                                                    {notification.titulo || notification.mensaje?.split('.')[0] || 'Notificación'}
                                                                </h6>
                                                                {!notification.leida && (
                                                                    <Badge 
                                                                        bg="danger" 
                                                                        style={{ fontSize: "0.6rem" }}
                                                                    >
                                                                        Nueva
                                                                    </Badge>
                                                                )}
                                                            </div>
                                                            <p className="mb-1" style={{ 
                                                                fontSize: "0.9rem",
                                                                color: "#6C757D"
                                                            }}>
                                                                {notification.mensaje}
                                                            </p>
                                                            <small className="text-muted">
                                                                {formatDate(notification.fecha || notification.createdAt)}
                                                            </small>
                                                        </div>
                                                    </div>
                                                    <div className="d-flex gap-1">
                                                        {!notification.leida && (
                                                            <Button
                                                                size="sm"
                                                                variant="outline-primary"
                                                                onClick={() => markNotificationAsRead(notification._id)}
                                                                style={{ 
                                                                    fontSize: "0.7rem",
                                                                    borderRadius: "15px"
                                                                }}
                                                            >
                                                                <FaCheck />
                                                            </Button>
                                                        )}
                                                        <Button
                                                            size="sm"
                                                            variant="outline-danger"
                                                            onClick={() => deleteNotification(notification._id)}
                                                            style={{ 
                                                                fontSize: "0.7rem",
                                                                borderRadius: "15px"
                                                            }}
                                                        >
                                                            <FaTimes />
                                                        </Button>
                                                    </div>
                                                </div>
                                            </ListGroup.Item>
                                        ))}
                                    </ListGroup>
                                </>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default Notificaciones;
