import React, { useState } from "react";
import { Container, Nav } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import { FaTree, FaTheaterMasks, FaUtensils, FaPalette, FaBed, FaChevronDown } from "react-icons/fa";

const HorizontalMenu = () => {
    const location = useLocation();
    const [hoveredItem, setHoveredItem] = useState(null);

    const menuItems = [
        { path: "/ecoturismo", label: "Ecoturismo", icon: FaTree },
        { path: "/festividades", label: "Festividades", icon: FaTheaterMasks },
        { path: "/gastronomia", label: "Gastronomía", icon: FaUtensils },
        { path: "/artesanias", label: "Artesanías", icon: FaPalette },
        { path: "/hospedajes", label: "Hoteles", icon: FaBed }
    ];

    const isActive = (path) => {
        return location.pathname === path;
    };

    return (
        <div style={{
            background: "linear-gradient(135deg, #1E8546 0%, #2A9D5A 50%, #1E8546 100%)",
            padding: "12px 0",
            boxShadow: "0 4px 12px rgba(30, 133, 70, 0.3)",
            position: "relative",
            overflow: "hidden"
        }}>
            {/* Efecto de fondo decorativo */}
            <div style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: "url('data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 100 100\"><defs><pattern id=\"grain\" width=\"100\" height=\"100\" patternUnits=\"userSpaceOnUse\"><circle cx=\"25\" cy=\"25\" r=\"1\" fill=\"rgba(255,255,255,0.1)\"/><circle cx=\"75\" cy=\"75\" r=\"1\" fill=\"rgba(255,255,255,0.1)\"/><circle cx=\"50\" cy=\"10\" r=\"0.5\" fill=\"rgba(255,255,255,0.05)\"/><circle cx=\"10\" cy=\"60\" r=\"0.5\" fill=\"rgba(255,255,255,0.05)\"/><circle cx=\"90\" cy=\"40\" r=\"0.5\" fill=\"rgba(255,255,255,0.05)\"/></pattern></defs><rect width=\"100\" height=\"100\" fill=\"url(%23grain)\"/></svg>')",
                opacity: 0.3,
                pointerEvents: "none"
            }} />
            
            <Container>
                <Nav style={{ 
                    display: "flex", 
                    justifyContent: "center", 
                    alignItems: "center",
                    gap: "0",
                    flexWrap: "wrap"
                }}>
                    {menuItems.map((item, index) => {
                        const IconComponent = item.icon;
                        const active = isActive(item.path);
                        const isHovered = hoveredItem === index;
                        
                        return (
                            <Nav.Link 
                                key={item.path}
                                as={Link} 
                                to={item.path} 
                                style={{ 
                                    color: active ? "#FFD700" : "white",
                                    padding: "12px 20px",
                                    margin: "0 5px",
                                    borderRadius: "25px",
                                    textDecoration: "none",
                                    fontWeight: active ? "600" : "500",
                                    fontSize: "0.95rem",
                                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                                    position: "relative",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "8px",
                                    background: active 
                                        ? "rgba(255, 215, 0, 0.15)" 
                                        : isHovered 
                                            ? "rgba(255, 255, 255, 0.1)" 
                                            : "transparent",
                                    border: active 
                                        ? "2px solid rgba(255, 215, 0, 0.3)" 
                                        : isHovered 
                                            ? "2px solid rgba(255, 255, 255, 0.2)" 
                                            : "2px solid transparent",
                                    transform: isHovered ? "translateY(-2px)" : "translateY(0)",
                                    boxShadow: isHovered 
                                        ? "0 6px 20px rgba(0, 0, 0, 0.15)" 
                                        : active 
                                            ? "0 4px 15px rgba(255, 215, 0, 0.2)" 
                                            : "none"
                                }}
                                onMouseEnter={() => setHoveredItem(index)}
                                onMouseLeave={() => setHoveredItem(null)}
                                className="menu-item"
                            >
                                <IconComponent 
                                    style={{ 
                                        fontSize: "1.1rem",
                                        transition: "transform 0.3s ease",
                                        transform: isHovered ? "scale(1.1)" : "scale(1)"
                                    }} 
                                />
                                <span>{item.label}</span>
                                {isHovered && (
                                    <FaChevronDown 
                                        style={{ 
                                            fontSize: "0.8rem",
                                            marginLeft: "4px",
                                            animation: "bounce 0.6s infinite"
                                        }} 
                                    />
                                )}
                                
                                {/* Indicador de activo */}
                                {active && (
                                    <div style={{
                                        position: "absolute",
                                        bottom: "-2px",
                                        left: "50%",
                                        transform: "translateX(-50%)",
                                        width: "20px",
                                        height: "3px",
                                        backgroundColor: "#FFD700",
                                        borderRadius: "2px",
                                        boxShadow: "0 0 10px rgba(255, 215, 0, 0.5)"
                                    }} />
                                )}
                            </Nav.Link>
                        );
                    })}
                </Nav>
            </Container>

            <style>
                {`
                    @keyframes bounce {
                        0%, 20%, 50%, 80%, 100% {
                            transform: translateY(0);
                        }
                        40% {
                            transform: translateY(-3px);
                        }
                        60% {
                            transform: translateY(-1px);
                        }
                    }
                    
                    .menu-item:hover {
                        text-decoration: none !important;
                    }
                    
                    @media (max-width: 768px) {
                        .menu-item {
                            padding: 8px 12px !important;
                            font-size: 0.85rem !important;
                            margin: 2px !important;
                        }
                        
                        .menu-item span {
                            display: none;
                        }
                        
                        .menu-item svg {
                            font-size: 1.2rem !important;
                        }
                    }
                    
                    @media (max-width: 576px) {
                        .menu-item {
                            padding: 6px 8px !important;
                            margin: 1px !important;
                        }
                    }
                `}
            </style>
        </div>
    );
};

export default HorizontalMenu; 