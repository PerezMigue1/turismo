// src/components/Sidebar.jsx
import React from 'react';
import { Nav, Button } from 'react-bootstrap';
import {
  FaTachometerAlt,
  FaUsers,
  FaBox,
  FaCog,
  FaPalette,
  FaInbox,
  FaBullseye,
  FaShieldAlt,
  FaMountain,
  FaClipboardList,
  FaMapMarkedAlt,
  FaStore,
  FaCalendarAlt,
  FaUtensils,
  FaBed,
  FaHome,
  FaSignOutAlt,
  FaTimes,
  FaEye
} from 'react-icons/fa';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const SidebarContainer = styled.div`
  background: linear-gradient(180deg, #FDF2E0 0%, #F8F4E6 100%);
  height: calc(100vh - 56px);
  position: sticky;
  top: 56px;
  padding: ${props => props.collapsed ? '1rem 0.5rem' : '1rem 0'};
  overflow-y: auto;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  width: 100%;
  border-right: 1px solid rgba(154, 30, 71, 0.1);
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  
  @media (max-width: 768px) {
    position: fixed;
    top: 56px;
    left: 0;
    width: 250px;
    height: calc(100vh - 56px);
    z-index: 1001;
    padding: 1rem 0;
    background: linear-gradient(180deg, #FDF2E0 0%, #F8F4E6 100%);
    transform: translateX(${props => props.isOpen ? '0' : '-100%'});
  }
  
  @media (max-width: 576px) {
    width: 220px;
  }
  
  @media (max-width: 480px) {
    width: 200px;
    padding: 0.75rem 0;
  }
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(154, 30, 71, 0.05);
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(154, 30, 71, 0.2);
    border-radius: 3px;
    
    &:hover {
      background: rgba(154, 30, 71, 0.3);
    }
  }
`;

const SidebarLink = styled(Nav.Link)`
  color: #555;
  padding: ${props => props.collapsed ? '0.75rem 0.5rem' : '0.75rem 1.5rem'};
  display: flex;
  align-items: center;
  text-decoration: none;
  transition: all 0.3s ease;
  border-left: 3px solid transparent;
  justify-content: ${props => props.collapsed ? 'center' : 'flex-start'};
  margin: ${props => props.collapsed ? '0.25rem 0.5rem' : '0.25rem 1rem'};
  border-radius: 8px;
  font-weight: 500;
  position: relative;
  overflow: hidden;
  font-size: ${props => props.collapsed ? '0.9rem' : '1rem'};

  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(154, 30, 71, 0.1), transparent);
    transition: left 0.5s;
  }

  &:hover {
    background: linear-gradient(90deg, rgba(154, 30, 71, 0.08), rgba(154, 30, 71, 0.05));
    color: #9A1E47;
    transform: ${props => props.collapsed ? 'scale(1.1)' : 'translateX(3px)'};
    
    &:before {
      left: 100%;
    }
  }

  ${props => props.active && `
    background: linear-gradient(90deg, rgba(154, 30, 71, 0.15), rgba(154, 30, 71, 0.1));
    color: #9A1E47;
    border-left: 3px solid #9A1E47;
    box-shadow: 0 2px 8px rgba(154, 30, 71, 0.15);
    
    &:before {
      left: 100%;
    }
  `}
  
  @media (max-width: 768px) {
    margin: 0.25rem 0.75rem;
    padding: ${props => props.collapsed ? '0.75rem 0.5rem' : '0.75rem 1rem'};
    font-size: 1rem;
  }
  
  @media (max-width: 480px) {
    margin: 0.25rem 0.5rem;
    padding: ${props => props.collapsed ? '0.75rem 0.5rem' : '0.75rem 0.75rem'};
    font-size: 0.9rem;
  }
`;

const SidebarIcon = styled.span`
  font-size: 1.2rem;
  width: 24px;
  text-align: center;
  margin-right: ${props => props.collapsed ? '0' : '1rem'};
  transition: all 0.3s ease;
  
  ${SidebarLink}:hover & {
    transform: scale(1.1);
  }
`;

const SidebarText = styled.span`
  font-weight: 500;
  display: ${props => props.collapsed ? 'none' : 'inline'};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const MenuSection = styled.div`
  margin-bottom: 2rem;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const SectionTitle = styled.div`
  font-size: 0.75rem;
  font-weight: 700;
  color: #9A1E47;
  text-transform: uppercase;
  letter-spacing: 1px;
  padding: ${props => props.collapsed ? '0.75rem 0.5rem 0.5rem' : '0.75rem 1.5rem 0.5rem'};
  margin-bottom: 0.5rem;
  display: ${props => props.collapsed ? 'none' : 'block'};
  position: relative;
  text-align: ${props => props.collapsed ? 'center' : 'left'};
  
  &:after {
    content: '';
    position: absolute;
    bottom: 0;
    left: ${props => props.collapsed ? '0.5rem' : '1.5rem'};
    right: ${props => props.collapsed ? '0.5rem' : '1.5rem'};
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(154, 30, 71, 0.2), transparent);
  }
`;

const MobileCloseButton = styled(Button)`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  color: #9A1E47;
  font-size: 1.2rem;
  padding: 0.5rem;
  border-radius: 50%;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(154, 30, 71, 0.1);
    transform: rotate(90deg);
  }
  
  @media (min-width: 769px) {
    display: none;
  }
`;

const PublicButton = styled(Button)`
  background: linear-gradient(135deg, #1E8546 0%, #156b37 100%);
  border: none;
  color: white;
  margin: ${props => props.collapsed ? '1rem 0.5rem' : '1rem 1.5rem'};
  width: ${props => props.collapsed ? 'calc(100% - 1rem)' : 'calc(100% - 3rem)'};
  padding: ${props => props.collapsed ? '0.75rem 0.5rem' : '0.75rem 1rem'};
  border-radius: 10px;
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(30, 133, 70, 0.3);
  font-size: ${props => props.collapsed ? '0.8rem' : '1rem'};
  
  &:hover {
    background: linear-gradient(135deg, #156b37 0%, #0f4f28 100%);
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(30, 133, 70, 0.4);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  @media (max-width: 768px) {
    margin: 1rem 1rem;
    width: calc(100% - 2rem);
    padding: 0.75rem 1rem;
    font-size: 1rem;
  }
  
  @media (max-width: 480px) {
    margin: 0.75rem 0.75rem;
    width: calc(100% - 1.5rem);
    padding: 0.6rem 0.75rem;
    font-size: 0.9rem;
  }
`;

const Sidebar = ({ activeSection, setActiveSection, collapsed, isMobile }) => {
  const navigate = useNavigate();

  const menuSections = [
    {
      title: 'Principal',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: <FaTachometerAlt /> }
      ]
    },
    {
      title: 'Solicitudes',
      items: [
        { id: 'artesanias', label: 'Artesanias', icon: <FaPalette /> },
        { id: 'gastrorequests', label: 'Gastronomía', icon: <FaUtensils /> },
        { id: 'hospedajeequests', label: 'Hospedaje', icon: <FaBed /> },
        { id: 'restauranterequests', label: 'Restaurantes', icon: <FaUtensils /> }
      ]
    },
    {
      title: 'Contenido',
      items: [
        { id: 'lugares', label: 'Lugares', icon: <FaMapMarkedAlt /> },
        { id: 'negocios', label: 'Negocios', icon: <FaStore /> },
        { id: 'festividadesAdmin', label: 'Festividades', icon: <FaCalendarAlt /> },
        { id: 'ecoturismo', label: 'Ecoturismo', icon: <FaMountain /> }
      ]
    },
    {
      title: 'Gestión',
      items: [
        { id: 'users', label: 'Usuarios', icon: <FaUsers /> },
        { id: 'products', label: 'Gestión de publicaciones', icon: <FaBox /> }
      ]
    },

    {
      title: 'Configuración',
      items: [
        { id: 'misionVision', label: 'Misión y Visión', icon: <FaBullseye /> },
        { id: 'politicas', label: 'Políticas', icon: <FaShieldAlt /> },
        { id: 'faq', label: 'FAQ', icon: <FaClipboardList /> },
        { id: 'encuestas', label: 'Encuestas', icon: <FaClipboardList /> },
        { id: 'settings', label: 'Configuración', icon: <FaCog /> }
      ]
    }
  ];

  const handlePublicClick = () => {
    navigate('/');
  };

  return (
    <SidebarContainer collapsed={collapsed}>
      {isMobile && (
        <MobileCloseButton onClick={() => setActiveSection(activeSection)}>
          <FaTimes />
        </MobileCloseButton>
      )}
      
      <PublicButton collapsed={collapsed} onClick={handlePublicClick}>
        <FaHome className={collapsed ? "" : "me-2"} />
        {!collapsed && "Ir al Sitio Público"}
      </PublicButton>

      <Nav className="flex-column" style={{ flex: 1, width: '100%' }}>
        {menuSections.map((section, sectionIndex) => (
          <MenuSection key={sectionIndex}>
            <SectionTitle collapsed={collapsed}>{section.title}</SectionTitle>
            {section.items.map((item) => (
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
          </MenuSection>
        ))}
      </Nav>
    </SidebarContainer>
  );
};

export default Sidebar;