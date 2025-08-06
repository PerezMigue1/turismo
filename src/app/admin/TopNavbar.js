// src/components/TopNavbar.jsx
import React from 'react';
import { Navbar, Container, Nav, Button, Dropdown } from 'react-bootstrap';
import { FaBars, FaBell, FaUserCircle, FaCog, FaHome, FaSignOutAlt } from 'react-icons/fa';
import { useAuth } from '../Navigation/AuthContext';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const StyledNavbar = styled(Navbar)`
  background-color: #9A1E47; /* Rojo Guinda */
  padding: 1rem 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1050;
  width: 100%;
  height: 70px;
  display: flex;
  align-items: center;
  border-bottom: 2px solid #FDF2E0;
  
  /* Asegurar que no se vea afectado por estilos del header principal */
  &.admin-navbar {
    position: fixed !important;
    top: 0 !important;
    left: 0 !important;
    right: 0 !important;
    z-index: 1050 !important;
  }
`;

const BrandText = styled.span`
  font-weight: 600;
  color: white;
  font-size: 1.3rem;
  
  @media (max-width: 576px) {
    font-size: 1.1rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1rem;
  }
`;

const NavLink = styled(Nav.Link)`
  color: rgba(255, 255, 255, 0.85) !important;
  padding: 0.7rem 1.2rem;
  display: flex;
  align-items: center;
  transition: color 0.2s;

  &:hover {
    color: white !important;
  }
`;

const NavIcon = styled(NavLink)`
  font-size: 1.4rem;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 42px;
  
  @media (max-width: 576px) {
    width: 38px;
    height: 38px;
    font-size: 1.2rem;
  }
`;

const ToggleButton = styled(Button)`
  background: none;
  border: none;
  color: white;
  padding: 0.5rem;
  font-size: 1.2rem;
  
  &:hover, &:focus {
    background: rgba(255, 255, 255, 0.1);
    color: white;
    border: none;
  }
  
  @media (max-width: 576px) {
    font-size: 1rem;
    padding: 0.4rem;
  }
`;

const UserDropdown = styled(Dropdown)`
  .dropdown-toggle {
    background: none;
    border: none;
    color: rgba(255, 255, 255, 0.85);
    display: flex;
    align-items: center;
    padding: 0.5rem 1rem;
    
    &:hover, &:focus {
      background: rgba(255, 255, 255, 0.1);
      color: white;
      border: none;
    }
    
    &::after {
      display: none;
    }
  }
  
  /* Estilos específicos para evitar conflictos con el header principal */
  .admin-navbar {
    position: fixed !important;
    top: 0 !important;
    left: 0 !important;
    right: 0 !important;
    z-index: 1050 !important;
    width: 100% !important;
  }
  
  .dropdown-menu {
    border: none;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    border-radius: 8px;
    margin-top: 0.5rem;
  }
  
  .dropdown-item {
    padding: 0.75rem 1rem;
    display: flex;
    align-items: center;
    
    &:hover {
      background-color: #f8f9fa;
    }
    
    svg {
      margin-right: 0.5rem;
    }
  }
`;

const LogoutButton = styled(Button)`
  background-color: #dc3545;
  border-color: #dc3545;
  color: white;
  font-size: 0.9rem;
  padding: 0.4rem 0.8rem;
  
  &:hover {
    background-color: #c82333;
    border-color: #bd2130;
  }
  
  @media (max-width: 576px) {
    padding: 0.3rem 0.6rem;
    font-size: 0.8rem;
  }
`;

const TopNavbar = ({ toggleSidebar, sidebarCollapsed, isMobile }) => {
    const { currentUser, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handlePublicClick = () => {
        navigate('/');
    };

    return (
        <StyledNavbar expand="lg" variant="dark" className="admin-navbar">
            <Container fluid>
                <ToggleButton
                    onClick={toggleSidebar}
                    className="me-2"
                >
                    <FaBars />
                </ToggleButton>
                
                <Navbar.Brand href="#" className="me-auto">
                    <BrandText>
                        {isMobile ? 'El Turismo' : 'El Turismo - Admin'}
                    </BrandText>
                </Navbar.Brand>

                <Nav className="ms-auto">
                    <NavIcon href="#" title="Notificaciones">
                        <FaBell />
                    </NavIcon>
                    
                    <UserDropdown>
                        <Dropdown.Toggle className="dropdown-toggle">
                            <FaUserCircle className="me-2" />
                            <span className="d-none d-md-inline">
                                {currentUser?.nombre || 'Admin'}
                            </span>
                        </Dropdown.Toggle>
                        
                        <Dropdown.Menu>
                            <Dropdown.Item onClick={handlePublicClick}>
                                <FaHome />
                                Ir al Sitio Público
                            </Dropdown.Item>
                            <Dropdown.Item href="#">
                                <FaCog />
                                Configuración
                            </Dropdown.Item>
                            <Dropdown.Divider />
                            <Dropdown.Item onClick={handleLogout}>
                                <FaSignOutAlt />
                                Cerrar sesión
                            </Dropdown.Item>
                        </Dropdown.Menu>
                    </UserDropdown>
                    
                    {!isMobile && (
                        <LogoutButton
                            size="sm"
                            className="ms-2"
                            onClick={handleLogout}
                        >
                            Salir
                        </LogoutButton>
                    )}
                </Nav>
            </Container>
        </StyledNavbar>
    );
};

export default TopNavbar;