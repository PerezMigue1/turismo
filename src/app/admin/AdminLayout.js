// src/app/admin/AdminLayout.jsx
import React, { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import TopNavbar from '../admin/TopNavbar';
import Sidebar from '../admin/Sidebar';
import Dashboard from '../admin/Dashboard';
import Users from '../admin/Users';
import Products from '../admin/Products';
import Settings from '../admin/Settings';
import styled from 'styled-components';
import ArtesaniasRequests from '../admin/ArtesaniasRequests'
import GastroRequests from '../admin/GastronomiaRequests'
import HospedajeRequests from '../admin/HospedajeRequests';
import RestauranteRequests from '../admin/RestauranteRequests';
import FestividadesAdmin from './FestividadesAdmin';
import MisionVisionAdmin from './MisionVisionAdmin';
import PoliticasAdmin from './PoliticasAdmin';
import FAQAdmin from './FAQAdmin';
import EcoturismoAdmin from './EcoturismoAdmin';
import EncuestasAdmin from './EncuestasAdmin';
import LugaresAdmin from './LugaresAdmin';
import NegociosAdmin from './NegociosAdmin';


const AdminContainer = styled(Container)`
  min-height: 100vh;
  display: block;
  padding: 0;
  width: 100vw;
  max-width: 100vw;
  margin: 0;
  margin-top: 0;
  position: relative;
  
  /* Estilos específicos para el área administrativa */
  .admin-area {
    position: relative;
    z-index: 1;
  }
  
  /* Asegurar que el header administrativo no se vea afectado por estilos del header principal */
  .admin-navbar {
    position: fixed !important;
    top: 0 !important;
    left: 0 !important;
    right: 0 !important;
    z-index: 1050 !important;
    width: 100% !important;
    border-bottom: 2px solid #FDF2E0 !important;
  }
  
  /* Eliminar cualquier gap entre header y contenido */
  .admin-sidebar {
    margin-top: 0 !important;
    padding-top: 0 !important;
    border-top: none !important;
  }
  
  .admin-content {
    margin-top: 0 !important;
    padding-top: 0 !important;
    border-top: none !important;
    position: fixed !important;
    top: 70px !important;
    right: 0 !important;
    overflow-y: auto !important;
  }
  
  /* Eliminar separaciones entre header, sidebar y contenido */
  .admin-layout {
    margin-top: 0 !important;
    padding-top: 0 !important;
  }
  
  .admin-sidebar {
    margin-top: 0 !important;
    padding-top: 0 !important;
    border-top: none !important;
  }
  
  .admin-content {
    margin-top: 0 !important;
    padding-top: 0 !important;
    border-top: none !important;
  }
`;



const SidebarCol = styled.div`
  transition: all 0.3s ease;
  padding: 0;
  background-color: #FDF2E0; /* Beige Claro */
  width: ${props => props.collapsed ? '70px' : '280px'};
  min-width: ${props => props.collapsed ? '70px' : '280px'};
  max-width: ${props => props.collapsed ? '70px' : '280px'};
  flex-shrink: 0;
  margin-top: 0;
  position: fixed;
  top: 70px;
  left: 0;
  height: calc(100vh - 70px);
  z-index: 1000;
  margin-top: 0;
  padding-top: 0;
  
  @media (max-width: 768px) {
    position: fixed;
    top: 70px;
    left: 0;
    height: calc(100vh - 70px);
    z-index: 1000;
    width: 250px;
    min-width: 250px;
    max-width: 250px;
    box-shadow: ${props => props.isOpen ? '2px 0 10px rgba(0,0,0,0.1)' : 'none'};
    transform: translateX(${props => props.isOpen ? '0' : '-100%'});
    margin-top: 0;
  }
  
  @media (max-width: 576px) {
    width: 220px;
    min-width: 220px;
    max-width: 220px;
  }
  
  @media (max-width: 480px) {
    width: 200px;
    min-width: 200px;
    max-width: 200px;
  }
`;

const MainContentCol = styled.div`
  padding: 1rem;
  background-color: #f8f9fa;
  min-height: calc(100vh - 70px);
  transition: all 0.3s ease;
  flex: 1;
  overflow-x: hidden;
  margin-top: 0;
  height: calc(100vh - 70px);
  position: fixed;
  top: 70px;
  right: 0;
  width: calc(100vw - ${props => props.sidebarCollapsed ? '70px' : '280px'});
  overflow-y: auto;
  
  @media (max-width: 768px) {
    padding: 0.75rem;
    width: calc(100vw - 250px);
    position: fixed;
    top: 70px;
    right: 0;
    z-index: 1;
    overflow-y: auto;
  }
  
  @media (max-width: 576px) {
    padding: 0.5rem;
    width: calc(100vw - 220px);
  }
  
  @media (max-width: 480px) {
    padding: 0.25rem;
    width: calc(100vw - 200px);
  }
`;

const Overlay = styled.div`
  position: fixed;
  top: 70px;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;
  display: ${props => props.isOpen ? 'block' : 'none'};
  opacity: ${props => props.isOpen ? '1' : '0'};
  transition: opacity 0.3s ease;
  
  @media (min-width: 769px) {
    display: none;
  }
  
  @media (max-width: 480px) {
    background-color: rgba(0, 0, 0, 0.7);
  }
`;

const AdminLayout = () => {
    const [activeSection, setActiveSection] = useState('dashboard');
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Detectar si es móvil
    useEffect(() => {
        const checkIsMobile = () => {
            setIsMobile(window.innerWidth <= 768);
            if (window.innerWidth > 768) {
                setSidebarOpen(false);
            }
        };

        checkIsMobile();
        window.addEventListener('resize', checkIsMobile);
        return () => window.removeEventListener('resize', checkIsMobile);
    }, []);

    const toggleSidebar = () => {
        if (isMobile) {
            setSidebarOpen(!sidebarOpen);
        } else {
            setSidebarCollapsed(!sidebarCollapsed);
        }
    };

    const closeSidebar = () => {
        if (isMobile) {
            setSidebarOpen(false);
        }
    };

    // Función para navegar desde el Dashboard
    const navigateToSection = (section) => {
        setActiveSection(section);
        closeSidebar();
    };

    const renderContent = () => {
        switch (activeSection) {
            case 'dashboard':
                return <Dashboard onNavigate={navigateToSection} />;
            case 'users':
                return <Users />;
            case 'products':
                return <Products />;
            case 'artesanias':
                return <ArtesaniasRequests />;
            case 'gastrorequests':
                return <GastroRequests />;
            case 'hospedajeequests':
                return <HospedajeRequests />;
            case 'restauranterequests':
                return <RestauranteRequests />;
            case 'festividadesAdmin':
                return <FestividadesAdmin />;
            case 'lugares':
                return <LugaresAdmin />;
            case 'negocios':
                return <NegociosAdmin />;
            case 'ecoturismo':
                return <EcoturismoAdmin />;

            case 'misionVision':
                return <MisionVisionAdmin />;
            case 'politicas':
                return <PoliticasAdmin />;
            case 'faq':
                return <FAQAdmin />;
            case 'encuestas':
                return <EncuestasAdmin />;
            case 'settings':
                return <Settings />;
            default:
                return <Dashboard onNavigate={navigateToSection} />;
        }
    };

    return (
        <AdminContainer fluid className="admin-area admin-layout">
            <TopNavbar
                toggleSidebar={toggleSidebar}
                sidebarCollapsed={sidebarCollapsed}
                isMobile={isMobile}
            />
            <Overlay isOpen={sidebarOpen} onClick={closeSidebar} />
            <SidebarCol
                collapsed={sidebarCollapsed}
                isOpen={sidebarOpen}
                className="admin-sidebar"
            >
                <Sidebar
                    activeSection={activeSection}
                    setActiveSection={(section) => {
                        setActiveSection(section);
                        closeSidebar();
                    }}
                    collapsed={sidebarCollapsed}
                    isMobile={isMobile}
                />
            </SidebarCol>
            <MainContentCol sidebarCollapsed={sidebarCollapsed} className="admin-content">
                {renderContent()}
            </MainContentCol>
        </AdminContainer>
    );
};

export default AdminLayout;