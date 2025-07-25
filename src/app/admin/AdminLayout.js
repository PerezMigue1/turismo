// src/app/admin/AdminLayout.jsx
import React, { useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import TopNavbar from '../admin/TopNavbar';
import Sidebar from '../admin/Sidebar';
import Dashboard from '../admin/Dashboard';
import Users from '../admin/Users';
import Products from '../admin/Products';
import Settings from '../admin/Settings';
import styled from 'styled-components';
import ProductRequests from '../admin/ProductRequests'
import GastroRequests from '../admin/GastronomiaRequests'
import HospedajeRequests from '../admin/HospedajeRequests';
import RestauranteRequests from '../admin/RestauranteRequests';

const AdminContainer = styled(Container)`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  padding: 0;
`;

const MainRow = styled(Row)`
  margin: 0;
`;

const SidebarCol = styled(Col)`
  transition: all 0.3s ease;
  padding: 0;
  background-color: #FDF2E0; /* Beige Claro */
`;

const MainContentCol = styled(Col)`
  padding: 2rem;
  background-color: #f8f9fa;
  min-height: calc(100vh - 56px);
`;

const AdminLayout = () => {
    const [activeSection, setActiveSection] = useState('dashboard');
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    const toggleSidebar = () => {
        setSidebarCollapsed(!sidebarCollapsed);
    };

    const renderContent = () => {
        switch (activeSection) {
            case 'dashboard':
                return <Dashboard />;
            case 'users':
                return <Users />;
            case 'products':
                return <Products />;
            case 'requests': // Nuevo caso
                return <ProductRequests />;
            case 'gastrorequests': // Nuevo caso
                return <GastroRequests />;
            case 'hospedajeequests': // Nuevo caso
                return <HospedajeRequests />;
            case 'restauranterequests': // Nuevo caso
                return <RestauranteRequests />;
            case 'settings':
                return <Settings />;
            default:
                return <Dashboard />;
        }
    };

    return (
        <AdminContainer fluid>
            <TopNavbar
                toggleSidebar={toggleSidebar}
                sidebarCollapsed={sidebarCollapsed}
            />
            <MainRow className="g-0">
                <SidebarCol xs={sidebarCollapsed ? 1 : 2}>
                    <Sidebar
                        activeSection={activeSection}
                        setActiveSection={setActiveSection}
                        collapsed={sidebarCollapsed}
                    />
                </SidebarCol>
                <MainContentCol xs={sidebarCollapsed ? 11 : 10}>
                    {renderContent()}
                </MainContentCol>
            </MainRow>
        </AdminContainer>
    );
};

export default AdminLayout;