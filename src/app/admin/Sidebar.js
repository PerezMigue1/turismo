// src/components/Sidebar.jsx
import React from 'react';
import { Nav } from 'react-bootstrap';
import {
  FaTachometerAlt,
  FaUsers,
  FaBox,
  FaCog,
  FaChartBar,
  FaShoppingCart,
  FaComments,
  FaInbox,
  FaBullseye,
  FaShieldAlt
} from 'react-icons/fa';
import styled from 'styled-components';

const SidebarContainer = styled.div`
  background-color: #FDF2E0; /* Beige Claro */
  height: calc(100vh - 56px);
  position: sticky;
  top: 56px;
  padding: 1.5rem 0;
  overflow-y: auto;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  width: ${props => props.collapsed ? '60px' : 'auto'};
`;

const SidebarLink = styled(Nav.Link)`
  color: #555;
  padding: ${props => props.collapsed ? '0.75rem' : '0.75rem 1.5rem'};
  display: flex;
  align-items: center;
  text-decoration: none;
  transition: all 0.2s;
  border-left: 3px solid transparent;
  justify-content: ${props => props.collapsed ? 'center' : 'flex-start'};

  &:hover {
    background-color: rgba(154, 30, 71, 0.05);
    color: #9A1E47; /* Rojo Guinda */
  }

  ${props => props.active && `
    background-color: rgba(154, 30, 71, 0.1);
    color: #9A1E47; /* Rojo Guinda */
    border-left: 3px solid #9A1E47; /* Rojo Guinda */
  `}
`;

const SidebarIcon = styled.span`
  font-size: 1.2rem;
  width: 24px;
  text-align: center;
  margin-right: ${props => props.collapsed ? '0' : '1rem'};
`;

const SidebarText = styled.span`
  font-weight: 500;
  display: ${props => props.collapsed ? 'none' : 'inline'};
`;

const Sidebar = ({ activeSection, setActiveSection, collapsed }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <FaTachometerAlt /> },
    { id: 'requests', label: 'Solicitudes', icon: <FaInbox /> },
    { id: 'gastrorequests', label: 'Solicitudes Gastronomia', icon: <FaInbox /> },
    { id: 'hospedajeequests', label: 'Solicitudes Hospedaje', icon: <FaInbox /> },
    { id: 'restauranterequests', label: 'Solicitudes Restaurante', icon: <FaInbox /> },
    { id: 'festividadesAdmin', label: 'Festividades', icon: <FaInbox /> },
    { id: 'users', label: 'Usuarios', icon: <FaUsers /> },
    { id: 'products', label: 'Productos', icon: <FaBox /> },
    { id: 'orders', label: 'Pedidos', icon: <FaShoppingCart /> },
    { id: 'analytics', label: 'Analíticas', icon: <FaChartBar /> },
    { id: 'messages', label: 'Mensajes', icon: <FaComments /> },
    { id: 'misionVision', label: 'Misión y Visión', icon: <FaBullseye /> },
    { id: 'politicas', label: 'Políticas', icon: <FaShieldAlt /> },
    { id: 'faq', label: 'FAQ', icon: <FaShieldAlt /> },
    { id: 'settings', label: 'Configuración', icon: <FaCog /> },
  ];

  return (
    <SidebarContainer collapsed={collapsed}>
      <Nav className="flex-column">
        {menuItems.map((item) => (
          <SidebarLink
            key={item.id}
            href="#"
            active={activeSection === item.id}
            collapsed={collapsed}
            onClick={(e) => {
              e.preventDefault();
              setActiveSection(item.id);
            }}
          >
            <SidebarIcon collapsed={collapsed}>{item.icon}</SidebarIcon>
            <SidebarText collapsed={collapsed}>{item.label}</SidebarText>
          </SidebarLink>
        ))}
      </Nav>
    </SidebarContainer>
  );
};

export default Sidebar;