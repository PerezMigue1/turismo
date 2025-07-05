// src/components/admin/AdminLayout.js
import React from 'react';
import { Row, Col, Nav } from 'react-bootstrap';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { FaHome, FaUsers, FaBox, FaChartLine, FaSignOutAlt } from 'react-icons/fa';

const AdminLayout = () => {
    const navigate = useNavigate();
    
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <>
            {/* Eliminamos el Container fluid porque ya está en Navigation */}
            <Row className="g-0">
                {/* Sidebar */}
                <Col md={2} style={{ 
                    backgroundColor: '#1E8546', // Verde Bosque de tu paleta
                    minHeight: '100vh',
                    color: 'white',
                    position: 'fixed' // Hacemos el sidebar fijo
                }}>
                    <div className="p-4">
                        <h4 className="mb-4" style={{ color: 'white' }}>Admin Panel</h4>
                        <Nav className="flex-column">
                            <Nav.Link as={Link} to="/admin" className="text-white mb-2">
                                <FaHome className="me-2" /> Dashboard
                            </Nav.Link>
                            <Nav.Link as={Link} to="/admin/usuarios" className="text-white mb-2">
                                <FaUsers className="me-2" /> Usuarios
                            </Nav.Link>
                            <Nav.Link className="text-white mb-2">
                                <FaBox className="me-2" /> Productos
                            </Nav.Link>
                            <Nav.Link className="text-white mb-2">
                                <FaChartLine className="me-2" /> Reportes
                            </Nav.Link>
                            <hr className="my-3" />
                            <Nav.Link className="text-white" onClick={handleLogout}>
                                <FaSignOutAlt className="me-2" /> Cerrar Sesión
                            </Nav.Link>
                        </Nav>
                    </div>
                </Col>

                {/* Contenido principal - Ajustamos el margen para el sidebar fijo */}
                <Col md={10} className="p-4" style={{ marginLeft: '16.666667%' }}>
                    <Outlet />
                </Col>
            </Row>
        </>
    );
};

export default AdminLayout;