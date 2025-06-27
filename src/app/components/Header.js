import React, { useState } from "react";
import { Container, Navbar, Nav, Button, Form, FormControl, Dropdown } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { FaSearch, FaShoppingCart, FaBars, FaUser, FaSignOutAlt } from "react-icons/fa";
import Sidebar from "./Sidebar";
import logo from "../image/turismo.jpeg";

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = useNavigate();

    // Verificar sesión leyendo localStorage
    const isLoggedIn = localStorage.getItem('token') !== null;
    const userData = isLoggedIn ? JSON.parse(localStorage.getItem('user')) : null;

    const handleLogout = () => {
        // 1. Eliminar datos de sesión
        localStorage.removeItem('token');
        localStorage.removeItem('user');

        // 2. Recargar la página para actualizar el estado de la aplicación
        window.location.reload();

        // 3. No redirigir automáticamente (la app mostrará la vista de invitado)
    };

    return (
        <>
            <Navbar expand="lg" className="py-2" style={{
                backgroundColor: "#FDF2E0",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                position: "relative",
                zIndex: 1000
            }}>
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

                    {/* Barra de búsqueda (igual que antes) */}
                    <Form className="mx-3" style={{ flex: 1, maxWidth: "500px" }}>
                        <div style={{
                            display: "flex",
                            backgroundColor: "white",
                            borderRadius: "25px",
                            overflow: "hidden",
                            border: "1px solid #ddd"
                        }}>
                            <FormControl
                                type="text"
                                placeholder="Buscar experiencias..."
                                style={{
                                    border: "none",
                                    boxShadow: "none",
                                    padding: "10px 15px"
                                }}
                            />
                            <Button
                                variant="outline-light"
                                style={{
                                    backgroundColor: "#9A1E47",
                                    color: "white",
                                    border: "none",
                                    borderRadius: "0 25px 25px 0",
                                    padding: "0 20px"
                                }}
                            >
                                <FaSearch />
                            </Button>
                        </div>
                    </Form>

                    {/* Parte modificada del menú de usuario */}
                    <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                        <Link to="/carrito" style={{
                            color: "#9A1E47",
                            fontSize: "1.3rem",
                            position: "relative"
                        }}>
                            <FaShoppingCart />
                            {isLoggedIn && (
                                <span style={{
                                    position: "absolute",
                                    top: "-8px",
                                    right: "-8px",
                                    backgroundColor: "#F28B27",
                                    color: "white",
                                    borderRadius: "50%",
                                    width: "20px",
                                    height: "20px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontSize: "0.7rem"
                                }}>
                                    {userData?.cartItems?.length || 0}
                                </span>
                            )}
                        </Link>

                        {isLoggedIn ? (
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
                                            {userData?.nombre.split(' ')[0] || 'Perfil'}
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
                                        to={`/perfil/${userData?._id}`}
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

            {/* Segundo menú horizontal (igual que antes) */}
            <div style={{
                backgroundColor: "#1E8546",
                padding: "10px 0",
                boxShadow: "0 2px 5px rgba(0,0,0,0.1)"
            }}>
                <Container>
                    <Nav style={{ display: "flex", justifyContent: "center", gap: "30px" }}>
                        <Nav.Link as={Link} to="/ecoturismo" style={{ color: "white" }}>Ecoturismo</Nav.Link>
                        <Nav.Link as={Link} to="/cultura" style={{ color: "white" }}>Cultura</Nav.Link>
                        <Nav.Link as={Link} to="/gastronomia" style={{ color: "white" }}>Gastronomía</Nav.Link>
                        <Nav.Link as={Link} to="/artesanias" style={{ color: "white" }}>Artesanías</Nav.Link>
                        <Nav.Link as={Link} to="/alojamiento" style={{ color: "white" }}>Alojamiento</Nav.Link>
                    </Nav>
                </Container>
            </div>

            <Sidebar isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
        </>
    );
};

export default Header;