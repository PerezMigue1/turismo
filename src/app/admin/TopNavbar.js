// src/components/TopNavbar.jsx
import React from 'react';
import { Navbar, Container, Nav, Button } from 'react-bootstrap';
import { FaBars, FaBell, FaUserCircle, FaCog } from 'react-icons/fa';
import { useAuth } from '../Navigation/AuthContext';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const StyledNavbar = styled(Navbar)`
  background-color: #9A1E47; /* Rojo Guinda */
  padding: 0.8rem 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 1020;
`;

const BrandText = styled.span`
  font-weight: 600;
  color: white;
`;

const NavLink = styled(Nav.Link)`
  color: rgba(255, 255, 255, 0.85) !important;
  padding: 0.5rem 1rem;
  display: flex;
  align-items: center;
  transition: color 0.2s;

  &:hover {
    color: white !important;
  }
`;

const NavIcon = styled(NavLink)`
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
`;

const TopNavbar = ({ toggleSidebar, sidebarCollapsed }) => {
    const { currentUser, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <StyledNavbar expand="lg" variant="dark">
            <Container fluid>
                <Button
                    variant="link"
                    className="sidebar-toggle text-white"
                    onClick={toggleSidebar}
                >
                    <FaBars />
                </Button>
                <Navbar.Brand href="#" className="ms-3">
                    <BrandText>Panel Administrativo</BrandText>
                </Navbar.Brand>

                <Nav className="ms-auto">
                    <NavIcon href="#">
                        <FaBell />
                    </NavIcon>
                    <NavIcon href="#">
                        <FaCog />
                    </NavIcon>
                    <NavLink href="#">
                        <FaUserCircle className="me-2" />
                        <span>{currentUser?.nombre || 'Admin'}</span>
                    </NavLink>
                    <Button
                        variant="outline-light"
                        size="sm"
                        className="ms-2"
                        onClick={handleLogout}
                    >
                        Cerrar sesión
                    </Button>
                </Nav>
            </Container>
        </StyledNavbar>
    );
};

export default TopNavbar;