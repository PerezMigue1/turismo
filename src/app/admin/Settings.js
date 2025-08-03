// src/app/admin/Settings.js
import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Form, Button, Alert, Nav, Tab } from 'react-bootstrap';
import {
    FaCog,
    FaUser,
    FaShieldAlt,
    FaBell,
    FaPalette,
    FaDatabase,
    FaSave,
    FaEye,
    FaEyeSlash,
    FaKey,
    FaEnvelope,
    FaGlobe
} from 'react-icons/fa';
import styled from 'styled-components';

const SettingsContainer = styled.div`
  h2 {
    color: #9A1E47;
    font-weight: 600;
    margin-bottom: 1.5rem;
  }
`;

const SettingsCard = styled(Card)`
  border: none;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  margin-bottom: 1.5rem;
`;

const SettingsHeader = styled(Card.Header)`
  background-color: #f8f9fa;
  border-bottom: 1px solid #e9ecef;
  font-weight: 600;
  color: #9A1E47;
  border-radius: 12px 12px 0 0 !important;
  padding: 1rem 1.5rem;
`;

const SaveButton = styled(Button)`
  background-color: #1E8546;
  border-color: #1E8546;
  padding: 0.75rem 2rem;
  font-weight: 500;
  
  &:hover {
    background-color: #156b37;
    border-color: #156b37;
  }
`;

const TabIcon = styled.span`
  margin-right: 0.5rem;
  font-size: 1.1rem;
`;

const Settings = () => {
    const [activeTab, setActiveTab] = useState('general');
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertVariant, setAlertVariant] = useState('success');
    const [loading, setLoading] = useState(false);
    const [settings, setSettings] = useState({
        // Configuración general
        siteName: 'El Turismo',
        siteDescription: 'Portal turístico de la Huasteca Hidalguense',
        contactEmail: 'admin@elturismo.com',
        contactPhone: '+52 123 456 7890',
        
        // Configuración de usuario
        emailNotifications: true,
        pushNotifications: false,
        language: 'es',
        timezone: 'America/Mexico_City',
        
        // Configuración de seguridad
        twoFactorAuth: false,
        sessionTimeout: 30,
        passwordExpiry: 90,
        
        // Configuración de apariencia
        theme: 'light',
        sidebarCollapsed: false,
        compactMode: false,
        
        // Configuración del sistema
        maintenanceMode: false,
        debugMode: false,
        backupFrequency: 'daily',
        maxFileSize: 10
    });

    // Cargar configuración existente
    useEffect(() => {
        const loadSettings = async () => {
            try {
                const response = await fetch('https://backend-iota-seven-19.vercel.app/api/configuracion');
                if (response.ok) {
                    const data = await response.json();
                    setSettings(prev => ({ ...prev, ...data }));
                }
            } catch (error) {
                console.error('Error cargando configuración:', error);
            }
        };

        loadSettings();
    }, []);

    const handleSettingChange = (key, value) => {
        setSettings(prev => ({
            ...prev,
            [key]: value
        }));
    };

    const handleSave = async () => {
        try {
            setLoading(true);
            setShowAlert(false);

            const response = await fetch('https://backend-iota-seven-19.vercel.app/api/configuracion', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(settings)
            });

            if (response.ok) {
                setAlertMessage('Configuración guardada exitosamente');
                setAlertVariant('success');
                setShowAlert(true);
                
                // Actualizar el título de la página si se cambió el nombre del sitio
                if (settings.siteName) {
                    document.title = `Admin - ${settings.siteName}`;
                }
            } else {
                throw new Error('Error al guardar configuración');
            }
        } catch (error) {
            console.error('Error guardando configuración:', error);
            setAlertMessage('Error al guardar la configuración');
            setAlertVariant('danger');
            setShowAlert(true);
        } finally {
            setLoading(false);
            setTimeout(() => setShowAlert(false), 3000);
        }
    };

    return (
        <SettingsContainer>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Configuración del Sistema</h2>
                <SaveButton onClick={handleSave} disabled={loading}>
                    <FaSave className="me-2" />
                    {loading ? 'Guardando...' : 'Guardar Cambios'}
                </SaveButton>
            </div>

            {showAlert && (
                <Alert variant={alertVariant} dismissible onClose={() => setShowAlert(false)}>
                    <FaSave className="me-2" />
                    {alertMessage}
                </Alert>
            )}

            <Row>
                <Col lg={3} md={4} className="mb-4">
                    <SettingsCard>
                        <SettingsHeader>
                            <FaCog className="me-2" />
                            Categorías
                        </SettingsHeader>
                        <Card.Body className="p-0">
                            <Nav variant="pills" className="flex-column">
                                <Nav.Item>
                                    <Nav.Link 
                                        active={activeTab === 'general'}
                                        onClick={() => setActiveTab('general')}
                                    >
                                        <TabIcon><FaCog /></TabIcon>
                                        General
                                    </Nav.Link>
                                </Nav.Item>
                                <Nav.Item>
                                    <Nav.Link 
                                        active={activeTab === 'user'}
                                        onClick={() => setActiveTab('user')}
                                    >
                                        <TabIcon><FaUser /></TabIcon>
                                        Usuario
                                    </Nav.Link>
                                </Nav.Item>
                                <Nav.Item>
                                    <Nav.Link 
                                        active={activeTab === 'security'}
                                        onClick={() => setActiveTab('security')}
                                    >
                                        <TabIcon><FaShieldAlt /></TabIcon>
                                        Seguridad
                                    </Nav.Link>
                                </Nav.Item>
                                <Nav.Item>
                                    <Nav.Link 
                                        active={activeTab === 'notifications'}
                                        onClick={() => setActiveTab('notifications')}
                                    >
                                        <TabIcon><FaBell /></TabIcon>
                                        Notificaciones
                                    </Nav.Link>
                                </Nav.Item>
                                <Nav.Item>
                                    <Nav.Link 
                                        active={activeTab === 'appearance'}
                                        onClick={() => setActiveTab('appearance')}
                                    >
                                        <TabIcon><FaPalette /></TabIcon>
                                        Apariencia
                                    </Nav.Link>
                                </Nav.Item>
                                <Nav.Item>
                                    <Nav.Link 
                                        active={activeTab === 'system'}
                                        onClick={() => setActiveTab('system')}
                                    >
                                        <TabIcon><FaDatabase /></TabIcon>
                                        Sistema
                                    </Nav.Link>
                                </Nav.Item>
                            </Nav>
                        </Card.Body>
                    </SettingsCard>
                </Col>

                <Col lg={9} md={8}>
                    <Tab.Container activeKey={activeTab}>
                        <Tab.Content>
                            {/* Configuración General */}
                            <Tab.Pane eventKey="general">
                                <SettingsCard>
                                    <SettingsHeader>
                                        <FaGlobe className="me-2" />
                                        Configuración General
                                    </SettingsHeader>
                        <Card.Body>
                                        <Row>
                                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Nombre del Sitio</Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        value={settings.siteName}
                                                        onChange={(e) => handleSettingChange('siteName', e.target.value)}
                                                    />
                                                </Form.Group>
                                            </Col>
                                            <Col md={6}>
                                                <Form.Group className="mb-3">
                                                    <Form.Label>Email de Contacto</Form.Label>
                                                    <Form.Control
                                                        type="email"
                                                        value={settings.contactEmail}
                                                        onChange={(e) => handleSettingChange('contactEmail', e.target.value)}
                                                    />
                                                </Form.Group>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col md={6}>
                                                <Form.Group className="mb-3">
                                                    <Form.Label>Teléfono de Contacto</Form.Label>
                                                    <Form.Control
                                                        type="tel"
                                                        value={settings.contactPhone}
                                                        onChange={(e) => handleSettingChange('contactPhone', e.target.value)}
                                                    />
                                </Form.Group>
                                            </Col>
                                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Descripción del Sitio</Form.Label>
                                                    <Form.Control
                                                        as="textarea"
                                                        rows={3}
                                                        value={settings.siteDescription}
                                                        onChange={(e) => handleSettingChange('siteDescription', e.target.value)}
                                                    />
                                </Form.Group>
                                            </Col>
                                        </Row>
                                    </Card.Body>
                                </SettingsCard>
                            </Tab.Pane>

                            {/* Configuración de Usuario */}
                            <Tab.Pane eventKey="user">
                                <SettingsCard>
                                    <SettingsHeader>
                                        <FaUser className="me-2" />
                                        Configuración de Usuario
                                    </SettingsHeader>
                                    <Card.Body>
                                        <Row>
                                            <Col md={6}>
                                                <Form.Group className="mb-3">
                                                    <Form.Label>Idioma</Form.Label>
                                                    <Form.Select
                                                        value={settings.language}
                                                        onChange={(e) => handleSettingChange('language', e.target.value)}
                                                    >
                                                        <option value="es">Español</option>
                                                        <option value="en">English</option>
                                                    </Form.Select>
                                                </Form.Group>
                                            </Col>
                                            <Col md={6}>
                                <Form.Group className="mb-3">
                                                    <Form.Label>Zona Horaria</Form.Label>
                                                    <Form.Select
                                                        value={settings.timezone}
                                                        onChange={(e) => handleSettingChange('timezone', e.target.value)}
                                                    >
                                                        <option value="America/Mexico_City">México (GMT-6)</option>
                                                        <option value="America/New_York">Nueva York (GMT-5)</option>
                                                        <option value="Europe/Madrid">Madrid (GMT+1)</option>
                                                    </Form.Select>
                                </Form.Group>
                                            </Col>
                                        </Row>
                        </Card.Body>
                                </SettingsCard>
                            </Tab.Pane>

                            {/* Configuración de Seguridad */}
                            <Tab.Pane eventKey="security">
                                <SettingsCard>
                                    <SettingsHeader>
                                        <FaShieldAlt className="me-2" />
                                        Configuración de Seguridad
                                    </SettingsHeader>
                        <Card.Body>
                                        <Row>
                                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Check
                                                        type="switch"
                                                        id="twoFactorAuth"
                                                        label="Autenticación de dos factores"
                                                        checked={settings.twoFactorAuth}
                                                        onChange={(e) => handleSettingChange('twoFactorAuth', e.target.checked)}
                                                    />
                                                </Form.Group>
                                            </Col>
                                            <Col md={6}>
                                                <Form.Group className="mb-3">
                                                    <Form.Label>Tiempo de sesión (minutos)</Form.Label>
                                                    <Form.Control
                                                        type="number"
                                                        value={settings.sessionTimeout}
                                                        onChange={(e) => handleSettingChange('sessionTimeout', parseInt(e.target.value))}
                                                    />
                                                </Form.Group>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col md={6}>
                                                <Form.Group className="mb-3">
                                                    <Form.Label>Expiración de contraseña (días)</Form.Label>
                                                    <Form.Control
                                                        type="number"
                                                        value={settings.passwordExpiry}
                                                        onChange={(e) => handleSettingChange('passwordExpiry', parseInt(e.target.value))}
                                                    />
                                                </Form.Group>
                                            </Col>
                                        </Row>
                                    </Card.Body>
                                </SettingsCard>
                            </Tab.Pane>

                            {/* Configuración de Notificaciones */}
                            <Tab.Pane eventKey="notifications">
                                <SettingsCard>
                                    <SettingsHeader>
                                        <FaBell className="me-2" />
                                        Configuración de Notificaciones
                                    </SettingsHeader>
                                    <Card.Body>
                                        <Row>
                                            <Col md={6}>
                                                <Form.Group className="mb-3">
                                    <Form.Check
                                                        type="switch"
                                                        id="emailNotifications"
                                                        label="Notificaciones por email"
                                                        checked={settings.emailNotifications}
                                                        onChange={(e) => handleSettingChange('emailNotifications', e.target.checked)}
                                                    />
                                                </Form.Group>
                                            </Col>
                                            <Col md={6}>
                                                <Form.Group className="mb-3">
                                    <Form.Check
                                                        type="switch"
                                                        id="pushNotifications"
                                                        label="Notificaciones push"
                                                        checked={settings.pushNotifications}
                                                        onChange={(e) => handleSettingChange('pushNotifications', e.target.checked)}
                                    />
                                </Form.Group>
                                            </Col>
                                        </Row>
                                    </Card.Body>
                                </SettingsCard>
                            </Tab.Pane>

                            {/* Configuración de Apariencia */}
                            <Tab.Pane eventKey="appearance">
                                <SettingsCard>
                                    <SettingsHeader>
                                        <FaPalette className="me-2" />
                                        Configuración de Apariencia
                                    </SettingsHeader>
                                    <Card.Body>
                                        <Row>
                                            <Col md={6}>
                                <Form.Group className="mb-3">
                                                    <Form.Label>Tema</Form.Label>
                                                    <Form.Select
                                                        value={settings.theme}
                                                        onChange={(e) => handleSettingChange('theme', e.target.value)}
                                                    >
                                                        <option value="light">Claro</option>
                                                        <option value="dark">Oscuro</option>
                                                        <option value="auto">Automático</option>
                                    </Form.Select>
                                </Form.Group>
                                            </Col>
                                            <Col md={6}>
                                                <Form.Group className="mb-3">
                                                    <Form.Check
                                                        type="switch"
                                                        id="sidebarCollapsed"
                                                        label="Sidebar colapsado por defecto"
                                                        checked={settings.sidebarCollapsed}
                                                        onChange={(e) => handleSettingChange('sidebarCollapsed', e.target.checked)}
                                                    />
                                                </Form.Group>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col md={6}>
                                <Form.Group className="mb-3">
                                                    <Form.Check
                                                        type="switch"
                                                        id="compactMode"
                                                        label="Modo compacto"
                                                        checked={settings.compactMode}
                                                        onChange={(e) => handleSettingChange('compactMode', e.target.checked)}
                                                    />
                                </Form.Group>
                                            </Col>
                                        </Row>
                        </Card.Body>
                                </SettingsCard>
                            </Tab.Pane>

                            {/* Configuración del Sistema */}
                            <Tab.Pane eventKey="system">
                                <SettingsCard>
                                    <SettingsHeader>
                                        <FaDatabase className="me-2" />
                                        Configuración del Sistema
                                    </SettingsHeader>
                        <Card.Body>
                                        <Row>
                                            <Col md={6}>
                                                <Form.Group className="mb-3">
                                                    <Form.Check
                                                        type="switch"
                                                        id="maintenanceMode"
                                                        label="Modo mantenimiento"
                                                        checked={settings.maintenanceMode}
                                                        onChange={(e) => handleSettingChange('maintenanceMode', e.target.checked)}
                                                    />
                                                </Form.Group>
                                            </Col>
                                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Check
                                        type="switch"
                                                        id="debugMode"
                                                        label="Modo debug"
                                                        checked={settings.debugMode}
                                                        onChange={(e) => handleSettingChange('debugMode', e.target.checked)}
                                    />
                                </Form.Group>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col md={6}>
                                <Form.Group className="mb-3">
                                                    <Form.Label>Frecuencia de respaldo</Form.Label>
                                                    <Form.Select
                                                        value={settings.backupFrequency}
                                                        onChange={(e) => handleSettingChange('backupFrequency', e.target.value)}
                                                    >
                                                        <option value="daily">Diario</option>
                                                        <option value="weekly">Semanal</option>
                                                        <option value="monthly">Mensual</option>
                                    </Form.Select>
                                </Form.Group>
                                            </Col>
                                            <Col md={6}>
                                <Form.Group className="mb-3">
                                                    <Form.Label>Tamaño máximo de archivo (MB)</Form.Label>
                                                    <Form.Control
                                                        type="number"
                                                        value={settings.maxFileSize}
                                                        onChange={(e) => handleSettingChange('maxFileSize', parseInt(e.target.value))}
                                    />
                                </Form.Group>
                                            </Col>
                                        </Row>
                        </Card.Body>
                                </SettingsCard>
                            </Tab.Pane>
                        </Tab.Content>
                    </Tab.Container>
                </Col>
            </Row>
        </SettingsContainer>
    );
};

export default Settings;