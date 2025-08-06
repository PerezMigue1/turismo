import React from "react";
import { Nav } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FaTimes, FaHome, FaMapMarkedAlt, FaRoute, FaStore, FaCalendarAlt, FaHiking, FaUtensils, FaShoppingBasket, FaBed, FaUserPlus, FaPlus, FaMapMarkerAlt } from "react-icons/fa";

const Sidebar = ({ isOpen, onClose }) => {
    return (
        <div style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "280px",
            height: "100vh",
            backgroundColor: "#FDF2E0", // Beige Claro
            boxShadow: "2px 0 10px rgba(0,0,0,0.1)",
            transform: isOpen ? "translateX(0)" : "translateX(-100%)",
            transition: "transform 0.3s ease-in-out",
            zIndex: 1070,
            padding: "20px",
            overflowY: "auto"
        }}>
            {/* Botón de cerrar */}
            <div style={{
                display: "flex",
                justifyContent: "flex-end",
                marginBottom: "20px"
            }}>
                <button onClick={onClose} style={{
                    backgroundColor: "transparent",
                    border: "none",
                    color: "#9A1E47", // Rojo Guinda
                    fontSize: "1.5rem",
                    cursor: "pointer"
                }}>
                    <FaTimes />
                </button>
            </div>

            {/* Menú de navegación */}
            <Nav className="flex-column">
                <Nav.Link as={Link} to="/" onClick={onClose} style={{
                    color: "#9A1E47",
                    padding: "10px 15px",
                    marginBottom: "5px",
                    borderRadius: "5px",
                    display: "flex",
                    alignItems: "center"
                }}>
                    <FaHome style={{ marginRight: "10px" }} /> Inicio
                </Nav.Link>

                <div style={{ 
                    color: "#0FA89C", // Turquesa Agua
                    fontWeight: "bold",
                    margin: "20px 0 10px 15px",
                    fontSize: "0.9rem",
                    textTransform: "uppercase"
                }}>
                    Explorar
                </div>

                <Nav.Link as={Link} to="/mapa" onClick={onClose} style={{
                    color: "#9A1E47",
                    padding: "10px 15px",
                    marginBottom: "5px",
                    borderRadius: "5px",
                    display: "flex",
                    alignItems: "center"
                }}>
                    <FaMapMarkedAlt style={{ marginRight: "10px" }} /> Mapas interactivos
                </Nav.Link>

                <div style={{ 
                    color: "#0FA89C", // Turquesa Agua
                    fontWeight: "bold",
                    margin: "20px 0 10px 15px",
                    fontSize: "0.9rem",
                    textTransform: "uppercase"
                }}>
                    Categorías
                </div>

                <Nav.Link as={Link} to="/ecoturismo" onClick={onClose} style={{
                    color: "#9A1E47",
                    padding: "10px 15px",
                    marginBottom: "5px",
                    borderRadius: "5px",
                    display: "flex",
                    alignItems: "center"
                }}>
                    <FaHiking style={{ marginRight: "10px" }} /> Ecoturismo
                </Nav.Link>

                <Nav.Link as={Link} to="/gastronomia" onClick={onClose} style={{
                    color: "#9A1E47",
                    padding: "10px 15px",
                    marginBottom: "5px",
                    borderRadius: "5px",
                    display: "flex",
                    alignItems: "center"
                }}>
                    <FaUtensils style={{ marginRight: "10px" }} /> Gastronomía
                </Nav.Link>

                <Nav.Link as={Link} to="/hospedajes" onClick={onClose} style={{
                    color: "#9A1E47",
                    padding: "10px 15px",
                    marginBottom: "5px",
                    borderRadius: "5px",
                    display: "flex",
                    alignItems: "center"
                }}>
                    <FaBed style={{ marginRight: "10px" }} /> Hospedajes
                </Nav.Link>

                <Nav.Link as={Link} to="/restaurantes" onClick={onClose} style={{
                    color: "#9A1E47",
                    padding: "10px 15px",
                    marginBottom: "5px",
                    borderRadius: "5px",
                    display: "flex",
                    alignItems: "center"
                }}>
                    <FaUtensils style={{ marginRight: "10px" }} /> Restaurantes
                </Nav.Link>

                <Nav.Link as={Link} to="/artesanias" onClick={onClose} style={{
                    color: "#9A1E47",
                    padding: "10px 15px",
                    marginBottom: "5px",
                    borderRadius: "5px",
                    display: "flex",
                    alignItems: "center"
                }}>
                    <FaShoppingBasket style={{ marginRight: "10px" }} /> Marketplace
                </Nav.Link>

                <Nav.Link as={Link} to="/festividades" onClick={onClose} style={{
                    color: "#9A1E47",
                    padding: "10px 15px",
                    marginBottom: "5px",
                    borderRadius: "5px",
                    display: "flex",
                    alignItems: "center"
                }}>
                    <FaCalendarAlt style={{ marginRight: "10px" }} /> Festividades
                </Nav.Link>

                <Nav.Link as={Link} to="/negocios" onClick={onClose} style={{
                    color: "#9A1E47",
                    padding: "10px 15px",
                    marginBottom: "5px",
                    borderRadius: "5px",
                    display: "flex",
                    alignItems: "center"
                }}>
                    <FaStore style={{ marginRight: "10px" }} /> Negocios
                </Nav.Link>

                <Nav.Link as={Link} to="/lugares" onClick={onClose} style={{
                    color: "#9A1E47",
                    padding: "10px 15px",
                    marginBottom: "5px",
                    borderRadius: "5px",
                    display: "flex",
                    alignItems: "center"
                }}>
                    <FaMapMarkerAlt style={{ marginRight: "10px" }} /> Lugares
                </Nav.Link>

                <div style={{ 
                    color: "#0FA89C", // Turquesa Agua
                    fontWeight: "bold",
                    margin: "20px 0 10px 15px",
                    fontSize: "0.9rem",
                    textTransform: "uppercase"
                }}>
                    Registros
                </div>

                <Nav.Link as={Link} to="/RegistroArtesano" onClick={onClose} style={{
                    color: "#9A1E47",
                    padding: "10px 15px",
                    marginBottom: "5px",
                    borderRadius: "5px",
                    display: "flex",
                    alignItems: "center"
                }}>
                    <FaUserPlus style={{ marginRight: "10px" }} /> Registro Artesano
                </Nav.Link>

                <Nav.Link as={Link} to="/RegistroChef" onClick={onClose} style={{
                    color: "#9A1E47",
                    padding: "10px 15px",
                    marginBottom: "5px",
                    borderRadius: "5px",
                    display: "flex",
                    alignItems: "center"
                }}>
                    <FaUserPlus style={{ marginRight: "10px" }} /> Registro Chef
                </Nav.Link>

                <Nav.Link as={Link} to="/RegistroHospedaje" onClick={onClose} style={{
                    color: "#9A1E47",
                    padding: "10px 15px",
                    marginBottom: "5px",
                    borderRadius: "5px",
                    display: "flex",
                    alignItems: "center"
                }}>
                    <FaUserPlus style={{ marginRight: "10px" }} /> Registro Hospedero
                </Nav.Link>

                <Nav.Link as={Link} to="/RegistroRestaurante" onClick={onClose} style={{
                    color: "#9A1E47",
                    padding: "10px 15px",
                    marginBottom: "5px",
                    borderRadius: "5px",
                    display: "flex",
                    alignItems: "center"
                }}>
                    <FaUserPlus style={{ marginRight: "10px" }} /> Registro Restaurante
                </Nav.Link>

                <div style={{ 
                    color: "#0FA89C", // Turquesa Agua
                    fontWeight: "bold",
                    margin: "20px 0 10px 15px",
                    fontSize: "0.9rem",
                    textTransform: "uppercase"
                }}>
                    Publicaciones
                </div>

                <Nav.Link as={Link} to="/PublicarProducto" onClick={onClose} style={{
                    color: "#9A1E47",
                    padding: "10px 15px",
                    marginBottom: "5px",
                    borderRadius: "5px",
                    display: "flex",
                    alignItems: "center"
                }}>
                    <FaPlus style={{ marginRight: "10px" }} /> Publicar Producto
                </Nav.Link>

                <Nav.Link as={Link} to="/PublicaChef" onClick={onClose} style={{
                    color: "#9A1E47",
                    padding: "10px 15px",
                    marginBottom: "5px",
                    borderRadius: "5px",
                    display: "flex",
                    alignItems: "center"
                }}>
                    <FaPlus style={{ marginRight: "10px" }} /> Publicar Gastronomía
                </Nav.Link>

                <Nav.Link as={Link} to="/PublicarHospedaje" onClick={onClose} style={{
                    color: "#9A1E47",
                    padding: "10px 15px",
                    marginBottom: "5px",
                    borderRadius: "5px",
                    display: "flex",
                    alignItems: "center"
                }}>
                    <FaPlus style={{ marginRight: "10px" }} /> Publicar Hospedaje
                </Nav.Link>

                <Nav.Link as={Link} to="/PublicarRestaurante" onClick={onClose} style={{
                    color: "#9A1E47",
                    padding: "10px 15px",
                    marginBottom: "5px",
                    borderRadius: "5px",
                    display: "flex",
                    alignItems: "center"
                }}>
                    <FaPlus style={{ marginRight: "10px" }} /> Publicar Restaurante
                </Nav.Link>
            </Nav>
        </div>
    );
};

export default Sidebar;