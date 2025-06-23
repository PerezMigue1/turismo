import React, { useState } from "react";
import { Container, Navbar, Nav, Button, Form, FormControl } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FaSearch, FaUser, FaShoppingCart, FaBars } from "react-icons/fa";
import Sidebar from "./Sidebar";
import logo from "../image/turismo.jpeg";

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <>
            {/* Navbar principal */}
            <Navbar expand="lg" className="py-2" style={{
                backgroundColor: "#FDF2E0", // Beige Claro
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                position: "relative",
                zIndex: 1000
            }}>
                <Container>
                    {/* Logo y menú hamburguesa */}
                    <div style={{ display: "flex", alignItems: "center" }}>
                        <Button 
                            variant="outline-light" 
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            style={{
                                backgroundColor: "transparent",
                                border: "none",
                                color: "#9A1E47", // Rojo Guinda
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
                                color: "#9A1E47", // Rojo Guinda
                                fontWeight: "bold",
                                fontSize: "1.5rem"
                            }}>
                                Aventura Huasteca
                            </span>
                        </Navbar.Brand>
                    </div>

                    {/* Barra de búsqueda */}
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
                                    backgroundColor: "#9A1E47", // Rojo Guinda
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

                    {/* Iconos de usuario, carrito y botones de sesión */}
                    <div style={{ 
                        display: "flex", 
                        alignItems: "center",
                        gap: "15px"
                    }}>
                        <Link to="/carrito" style={{
                            color: "#9A1E47", // Rojo Guinda
                            fontSize: "1.3rem",
                            position: "relative"
                        }}>
                            <FaShoppingCart />
                            <span style={{
                                position: "absolute",
                                top: "-8px",
                                right: "-8px",
                                backgroundColor: "#F28B27", // Naranja Sol
                                color: "white",
                                borderRadius: "50%",
                                width: "20px",
                                height: "20px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "0.7rem"
                            }}>
                                3
                            </span>
                        </Link>

                        {/* Botón de Registro */}
                        <Button 
                            as={Link} 
                            to="/registro" 
                            variant="outline" 
                            style={{
                                color: "#9A1E47", // Rojo Guinda
                                border: "1px solid #9A1E47",
                                borderRadius: "25px",
                                padding: "8px 15px",
                                fontWeight: "500",
                                transition: "all 0.3s"
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.backgroundColor = "#9A1E47";
                                e.target.style.color = "white";
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.backgroundColor = "transparent";
                                e.target.style.color = "#9A1E47";
                            }}
                        >
                            Registrarse
                        </Button>

                        {/* Botón de Iniciar Sesión */}
                        <Button 
                            as={Link} 
                            to="/login" 
                            variant="primary" 
                            style={{
                                backgroundColor: "#9A1E47", // Rojo Guinda
                                border: "none",
                                borderRadius: "25px",
                                padding: "8px 20px",
                                fontWeight: "500",
                                transition: "all 0.3s"
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.backgroundColor = "#7a1838";
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.backgroundColor = "#9A1E47";
                            }}
                        >
                            Iniciar Sesión
                        </Button>
                    </div>
                </Container>
            </Navbar>

            {/* Segundo menú horizontal */}
            <div style={{
                backgroundColor: "#1E8546", // Verde Bosque
                padding: "10px 0",
                boxShadow: "0 2px 5px rgba(0,0,0,0.1)"
            }}>
                <Container>
                    <Nav style={{ 
                        display: "flex", 
                        justifyContent: "center",
                        gap: "30px"
                    }}>
                        <Nav.Link as={Link} to="/ecoturismo" style={{ 
                            color: "white",
                            fontWeight: "500",
                            textTransform: "uppercase",
                            fontSize: "0.9rem",
                            letterSpacing: "1px",
                            transition: "color 0.3s"
                        }}
                        onMouseEnter={(e) => e.target.style.color = "#F28B27"} // Naranja Sol
                        onMouseLeave={(e) => e.target.style.color = "white"}
                        >
                            Ecoturismo
                        </Nav.Link>
                        <Nav.Link as={Link} to="/cultura" style={{ 
                            color: "white",
                            fontWeight: "500",
                            textTransform: "uppercase",
                            fontSize: "0.9rem",
                            letterSpacing: "1px",
                            transition: "color 0.3s"
                        }}
                        onMouseEnter={(e) => e.target.style.color = "#F28B27"}
                        onMouseLeave={(e) => e.target.style.color = "white"}
                        >
                            Cultura
                        </Nav.Link>
                        <Nav.Link as={Link} to="/gastronomia" style={{ 
                            color: "white",
                            fontWeight: "500",
                            textTransform: "uppercase",
                            fontSize: "0.9rem",
                            letterSpacing: "1px",
                            transition: "color 0.3s"
                        }}
                        onMouseEnter={(e) => e.target.style.color = "#F28B27"}
                        onMouseLeave={(e) => e.target.style.color = "white"}
                        >
                            Gastronomía
                        </Nav.Link>
                        <Nav.Link as={Link} to="/artesanias" style={{ 
                            color: "white",
                            fontWeight: "500",
                            textTransform: "uppercase",
                            fontSize: "0.9rem",
                            letterSpacing: "1px",
                            transition: "color 0.3s"
                        }}
                        onMouseEnter={(e) => e.target.style.color = "#F28B27"}
                        onMouseLeave={(e) => e.target.style.color = "white"}
                        >
                            Artesanías
                        </Nav.Link>
                        <Nav.Link as={Link} to="/alojamiento" style={{ 
                            color: "white",
                            fontWeight: "500",
                            textTransform: "uppercase",
                            fontSize: "0.9rem",
                            letterSpacing: "1px",
                            transition: "color 0.3s"
                        }}
                        onMouseEnter={(e) => e.target.style.color = "#F28B27"}
                        onMouseLeave={(e) => e.target.style.color = "white"}
                        >
                            Alojamiento
                        </Nav.Link>
                    </Nav>
                </Container>
            </div>

            {/* Menú lateral */}
            <Sidebar isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
        </>
    );
};

export default Header;