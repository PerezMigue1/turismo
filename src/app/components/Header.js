import React, { useState, useEffect } from "react";
import { Container, Navbar, Button, Dropdown, Badge } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FaBars, FaUser, FaSignOutAlt, FaBell, FaCheck } from "react-icons/fa";
import Sidebar from "./Sidebar";
import HorizontalMenu from "./HorizontalMenu";
import logo from "../image/turismo.jpeg";
import { useAuth } from '../Navigation/AuthContext';
import axios from "axios";

const Header = () => {

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [isScrolled, setIsScrolled] = useState(false);

    // Verificar sesión leyendo localStorage
    const { currentUser, logout } = useAuth();

    // Debug: Verificar el rol del usuario
    useEffect(() => {
        if (currentUser) {
            console.log("🔍 Usuario actual:", currentUser);
            console.log("🔍 Rol del usuario:", currentUser.rol);
            console.log("🔍 Tipo de rol:", typeof currentUser.rol);
            console.log("🔍 ¿Es admin?:", currentUser.rol === 'admin' || (Array.isArray(currentUser.rol) && currentUser.rol.includes('admin')));
            fetchNotifications();
        }
    }, [currentUser]);

    // Detectar scroll para efectos visuales del header
    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.scrollY;
            setIsScrolled(scrollTop > 10);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const fetchNotifications = async () => {
        try {
            const storedUser = JSON.parse(localStorage.getItem("user"));
            const id = storedUser?._id || storedUser?.id || storedUser?.idUsuario;
            
            if (!id) return;

            const response = await axios.get(`https://backend-iota-seven-19.vercel.app/api/notificaciones/usuario/${id}`);
            setNotifications(response.data);
        } catch (error) {
            console.error("Error al cargar notificaciones:", error);
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
        }
    };

    const handleLogout = () => {
        logout();
    };

    const unreadCount = notifications.filter(n => !n.leida).length;

    // Función para verificar si el usuario es admin
    const isAdmin = () => {
        if (!currentUser) return false;

        // Verificar si el rol es un string
        if (typeof currentUser.rol === 'string') {
            return currentUser.rol === 'admin';
        }

        // Verificar si el rol es un array
        if (Array.isArray(currentUser.rol)) {
            return currentUser.rol.includes('admin');
        }

        // Verificar si el rol está en diferentes propiedades
        return currentUser.rol === 'admin' ||
            currentUser.role === 'admin' ||
            currentUser.tipo === 'admin';
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

    return (
        <>
            <style>
                {`
                    @media (max-width: 768px) {
                        .notifications-dropdown {
                            min-width: 280px !important;
                            max-width: 90vw !important;
                            right: 0 !important;
                            left: auto !important;
                        }
                        
                        .notifications-dropdown .dropdown-item {
                            padding: 8px 12px !important;
                        }
                        
                        .notifications-dropdown h6 {
                            font-size: 0.85rem !important;
                        }
                        
                        .notifications-dropdown p {
                            font-size: 0.75rem !important;
                        }
                        
                        .notifications-dropdown small {
                            font-size: 0.7rem !important;
                        }
                        
                        .notifications-dropdown .btn-sm {
                            padding: 2px 6px !important;
                            font-size: 0.6rem !important;
                        }
                    }
                    
                    @media (max-width: 576px) {
                        .notifications-dropdown {
                            min-width: 260px !important;
                            max-width: 85vw !important;
                        }
                        
                        .header-user-section {
                            gap: 8px !important;
                        }
                        
                        .notification-badge {
                            font-size: 0.6rem !important;
                            padding: 2px 4px !important;
                        }
                    }
                    
                    .notifications-dropdown {
                        max-height: 60vh !important;
                        overflow-y: auto !important;
                    }
                    
                    .notifications-dropdown::-webkit-scrollbar {
                        width: 4px;
                    }
                    
                    .notifications-dropdown::-webkit-scrollbar-track {
                        background: #f1f1f1;
                        border-radius: 2px;
                    }
                    
                    .notifications-dropdown::-webkit-scrollbar-thumb {
                        background: #9A1E47;
                        border-radius: 2px;
                    }
                    
                    .notifications-dropdown::-webkit-scrollbar-thumb:hover {
                        background: #7a1a3a;
                    }
                    
                    /* Estilos para header fijo */
                    .fixed-header {
                        transition: all 0.3s ease;
                        backdrop-filter: blur(10px);
                        -webkit-backdrop-filter: blur(10px);
                    }
                    
                    .fixed-header.scrolled {
                        background-color: rgba(253, 242, 224, 0.95) !important;
                        box-shadow: 0 4px 12px rgba(0,0,0,0.15) !important;
                    }
                    
                    /* Asegurar que el contenido no se esconda detrás del header */
                    body {
                        padding-top: 0 !important;
                    }
                    
                    /* Eliminar separaciones entre header y menu horizontal */
                    .navbar {
                        margin-bottom: 0 !important;
                        border-bottom: none !important;
                    }
                    
                    .fixed-header + div {
                        margin-top: 0 !important;
                        padding-top: 0 !important;
                        border-top: none !important;
                    }
                    
                    /* Estilos responsivos para header fijo */
                    @media (max-width: 768px) {
                        .fixed-header {
                            padding: 8px 0 !important;
                        }
                        
                        .fixed-header .navbar-brand img {
                            height: 40px !important;
                        }
                        
                        .fixed-header .navbar-brand span {
                            font-size: 1.2rem !important;
                        }
                    }
                    
                    @media (max-width: 576px) {
                        .fixed-header {
                            padding: 5px 0 !important;
                        }
                        
                        .fixed-header .navbar-brand img {
                            height: 35px !important;
                        }
                        
                        .fixed-header .navbar-brand span {
                            font-size: 1rem !important;
                        }
                    }
                `}
            </style>

            <Navbar 
                expand="lg" 
                className={`py-2 fixed-header ${isScrolled ? 'scrolled' : ''}`} 
                style={{
                    backgroundColor: isScrolled ? "rgba(253, 242, 224, 0.95)" : "#FDF2E0",
                    boxShadow: isScrolled ? "0 4px 12px rgba(0,0,0,0.15)" : "0 2px 4px rgba(0,0,0,0.1)",
                    position: "fixed",
                    top: 0,
                    left: 0,
                    right: 0,
                    zIndex: 1050,
                    width: "100%",
                    transition: "all 0.3s ease",
                    backdropFilter: isScrolled ? "blur(10px)" : "none",
                    WebkitBackdropFilter: isScrolled ? "blur(10px)" : "none",
                    borderBottom: "none",
                    marginBottom: 0
                }}
            >
                <Container>
                    {/* Logo y menú hamburguesa (igual que antes) */}
                    <div style={{ display: "flex", alignItems: "center" }}>
                        <Button
                            variant="outline-light"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            style={{
                                backgroundColor: "transparent",
                                border: "none",
                                color: "#9A1E47",
                                marginRight: "15px",
                                fontSize: "1.5rem"
                            }}
                        >
                            <FaBars />
                        </Button>

                        <Navbar.Brand as={Link} to="/" style={{
                            display: "flex",
                            alignItems: "center",
                            marginRight: "20px"
                        }}>
                            <img
                                src={logo}
                                alt="Aventura Huasteca Logo"
                                style={{
                                    height: "50px",
                                    marginRight: "10px"
                                }}
                            />
                            <span style={{
                                color: "#9A1E47",
                                fontWeight: "bold",
                                fontSize: "1.5rem"
                            }}>
                                Aventura Huasteca
                            </span>
                        </Navbar.Brand>
                    </div>

                    {/* Parte modificada del menú de usuario */}
                    <div className="header-user-section" style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                        {currentUser ? (
                            <>
                                {/* Dropdown de Notificaciones */}
                                <Dropdown>
                                    <Dropdown.Toggle variant="outline-light" style={{
                                        backgroundColor: "transparent",
                                        border: "none",
                                        color: "#9A1E47",
                                        fontSize: "1.3rem",
                                        padding: "0",
                                        transition: "all 0.3s ease",
                                        display: "flex",
                                        alignItems: "center",
                                        position: "relative"
                                    }}>
                                        <div style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "8px",
                                            padding: "5px 10px",
                                            borderRadius: "20px",
                                            backgroundColor: "#FDF2E0",
                                            border: `1px solid #9A1E47`
                                        }}>
                                            <FaBell />
                                            {unreadCount > 0 && (
                                                <Badge
                                                    bg="danger"
                                                    className="notification-badge"
                                                    style={{
                                                        position: "absolute",
                                                        top: "-5px",
                                                        right: "-5px",
                                                        fontSize: "0.7rem"
                                                    }}
                                                >
                                                    {unreadCount}
                                                </Badge>
                                            )}
                                        </div>
                                    </Dropdown.Toggle>

                                    <Dropdown.Menu
                                        className="notifications-dropdown"
                                        style={{
                                            border: "none",
                                            boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                                            borderRadius: "10px",
                                            overflow: "hidden",
                                            marginTop: "5px",
                                            minWidth: "300px",
                                            maxWidth: "350px",
                                            maxHeight: "400px",
                                            overflowY: "auto"
                                        }}
                                        align="end"
                                    >
                                        <Dropdown.Header style={{
                                            backgroundColor: "#9A1E47",
                                            color: "white",
                                            padding: "10px 15px",
                                            position: "sticky",
                                            top: 0,
                                            zIndex: 1
                                        }}>
                                            <div className="d-flex justify-content-between align-items-center">
                                                <span>Notificaciones</span>
                                                <Link
                                                    to="/notificaciones"
                                                    style={{
                                                        color: "white",
                                                        textDecoration: "none",
                                                        fontSize: "0.8rem"
                                                    }}
                                                >
                                                    Ver todas
                                                </Link>
                                            </div>
                                        </Dropdown.Header>

                                        {notifications.length === 0 ? (
                                            <Dropdown.Item disabled style={{
                                                color: "#6C757D",
                                                padding: "15px",
                                                textAlign: "center"
                                            }}>
                                                No tienes notificaciones
                                            </Dropdown.Item>
                                        ) : (
                                            <>
                                                {notifications.slice(0, 3).map((notification) => (
                                                    <Dropdown.Item
                                                        key={notification._id}
                                                        style={{
                                                            color: "#9A1E47",
                                                            padding: "10px 15px",
                                                            backgroundColor: notification.leida ? "white" : "#f8f9fa",
                                                            borderBottom: "1px solid #eee",
                                                            transition: "all 0.2s ease"
                                                        }}
                                                        className="hover-effect"
                                                    >
                                                        <div className="d-flex justify-content-between align-items-start">
                                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                                <div className="d-flex align-items-center mb-1">
                                                                    <h6 className="mb-0 me-2" style={{
                                                                        fontSize: "0.9rem",
                                                                        fontWeight: notification.leida ? "normal" : "bold",
                                                                        overflow: "hidden",
                                                                        textOverflow: "ellipsis",
                                                                        whiteSpace: "nowrap"
                                                                    }}>
                                                                        {notification.titulo || notification.mensaje?.split('.')[0] || 'Notificación'}
                                                                    </h6>
                                                                    {!notification.leida && (
                                                                        <Badge
                                                                            bg="danger"
                                                                            style={{
                                                                                fontSize: "0.6rem",
                                                                                flexShrink: 0
                                                                            }}
                                                                        >
                                                                            Nueva
                                                                        </Badge>
                                                                    )}
                                                                </div>
                                                                <p className="mb-1" style={{
                                                                    fontSize: "0.8rem",
                                                                    color: "#6C757D",
                                                                    overflow: "hidden",
                                                                    textOverflow: "ellipsis",
                                                                    display: "-webkit-box",
                                                                    WebkitLineClamp: 2,
                                                                    WebkitBoxOrient: "vertical",
                                                                    lineHeight: "1.2"
                                                                }}>
                                                                    {notification.mensaje}
                                                                </p>
                                                                <small className="text-muted">
                                                                    {formatDate(notification.fecha || notification.createdAt)}
                                                                </small>
                                                            </div>
                                                            <div className="d-flex gap-1" style={{ flexShrink: 0 }}>
                                                                {!notification.leida && (
                                                                    <Button
                                                                        size="sm"
                                                                        variant="outline-primary"
                                                                        onClick={(e) => {
                                                                            e.preventDefault();
                                                                            markNotificationAsRead(notification._id);
                                                                        }}
                                                                        style={{ fontSize: "0.6rem" }}
                                                                    >
                                                                        <FaCheck />
                                                                    </Button>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </Dropdown.Item>
                                                ))}
                                            </>
                                        )}
                                    </Dropdown.Menu>
                                </Dropdown>

                                {/* Dropdown del Usuario */}
                                <Dropdown>
                                    <Dropdown.Toggle variant="outline-light" style={{
                                        backgroundColor: "transparent",
                                        border: "none",
                                        color: "#9A1E47",
                                        fontSize: "1.3rem",
                                        padding: "0",
                                        transition: "all 0.3s ease",
                                        display: "flex",
                                        alignItems: "center"
                                    }}>
                                        <div style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "8px",
                                            padding: "5px 10px",
                                            borderRadius: "20px",
                                            backgroundColor: "#FDF2E0",
                                            border: `1px solid #9A1E47`
                                        }}>
                                            <FaUser />
                                            <span style={{ fontSize: "0.9rem", fontWeight: "500" }}>
                                                {currentUser?.nombre.split(' ')[0]}
                                            </span>
                                        </div>
                                    </Dropdown.Toggle>

                                    <Dropdown.Menu style={{
                                        border: "none",
                                        boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                                        borderRadius: "10px",
                                        overflow: "hidden",
                                        marginTop: "5px"
                                    }}>
                                        <Dropdown.Item
                                            as={Link}
                                            to={`/perfil`}
                                            style={{
                                                color: "#9A1E47",
                                                padding: "10px 15px",
                                                backgroundColor: "white",
                                                transition: "all 0.2s ease"
                                            }}
                                            className="hover-effect"
                                        >
                                            Mi Perfil
                                        </Dropdown.Item>
                                        <Dropdown.Item
                                            as={Link}
                                            to="/reservaciones"
                                            style={{
                                                color: "#9A1E47",
                                                padding: "10px 15px",
                                                backgroundColor: "white",
                                                transition: "all 0.2s ease"
                                            }}
                                            className="hover-effect"
                                        >
                                            Mis Reservas
                                        </Dropdown.Item>

                                        {/* Dentro del menú desplegable del usuario*/}
                                        {isAdmin() && (
                                            <Dropdown.Item
                                                as={Link}
                                                to="/admin"
                                                style={{
                                                    color: "#9A1E47",
                                                    padding: "10px 15px",
                                                    backgroundColor: "white",
                                                    transition: "all 0.2s ease"
                                                }}
                                                className="hover-effect"
                                            >
                                                Panel Administrativo
                                            </Dropdown.Item>
                                        )}

                                        <Dropdown.Divider style={{ margin: "5px 0" }} />
                                        <Dropdown.Item
                                            onClick={handleLogout}
                                            style={{
                                                color: "#D24D1C",
                                                padding: "10px 15px",
                                                backgroundColor: "white",
                                                transition: "all 0.2s ease"
                                            }}
                                            className="hover-effect"
                                        >
                                            <FaSignOutAlt style={{ marginRight: "8px" }} />
                                            Cerrar Sesión
                                        </Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                            </>
                        ) : (
                            <>
                                <Button
                                    as={Link}
                                    to="/registro"
                                    variant="outline"
                                    style={{
                                        color: "#9A1E47",
                                        border: "1px solid #9A1E47",
                                        borderRadius: "25px",
                                        padding: "8px 15px",
                                        fontWeight: "500",
                                        transition: "all 0.3s ease"
                                    }}
                                    className="hover-effect"
                                >
                                    Registrarse
                                </Button>

                                <Button
                                    as={Link}
                                    to="/login"
                                    variant="primary"
                                    style={{
                                        backgroundColor: "#9A1E47",
                                        border: "none",
                                        borderRadius: "25px",
                                        padding: "8px 20px",
                                        fontWeight: "500",
                                        transition: "all 0.3s ease"
                                    }}
                                    className="hover-effect"
                                >
                                    Iniciar Sesión
                                </Button>
                            </>
                        )}

                    </div>
                </Container>
            </Navbar>

            <div style={{ 
                position: "fixed", 
                top: "76px", 
                left: 0, 
                right: 0, 
                zIndex: 1040,
                marginTop: 0,
                paddingTop: 0,
                "@media (max-width: 768px)": {
                    top: "80px"
                }
            }}>
                <HorizontalMenu />
            </div>

            <Sidebar isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
        </>
    );
};

export default Header;