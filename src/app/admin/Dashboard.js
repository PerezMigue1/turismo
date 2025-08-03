// src/app/admin/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Table, Badge, Button, ProgressBar } from 'react-bootstrap';
import {
    FaUsers,
    FaShoppingCart,
    FaDollarSign,
    FaChartLine,
    FaMapMarkedAlt,
    FaBed,
    FaUtensils,
    FaMountain,
    FaCalendarAlt,
    FaStore,
    FaEye,
    FaEdit,
    FaTrash,
    FaInbox,
    FaArrowRight,
    FaCheckCircle,
    FaExclamationTriangle,
    FaClock,
    FaCog
} from 'react-icons/fa';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const DashboardContent = styled.div`
  width: 100%;
  max-width: 100%;
  
  h2 {
    color: #9A1E47; /* Rojo Guinda */
    font-weight: 600;
    margin-bottom: 1.5rem;
  }
  
  @media (max-width: 768px) {
    h2 {
      font-size: 1.5rem;
      margin-bottom: 1rem;
    }
  }
  
  @media (max-width: 480px) {
    h2 {
      font-size: 1.3rem;
      margin-bottom: 0.75rem;
    }
  }
`;

const StatCard = styled(Card)`
  border: none;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  height: 100%;
  background: linear-gradient(135deg, ${props => props.bgGradient || '#ffffff'} 0%, ${props => props.bgGradientEnd || '#ffffff'} 100%);
  cursor: pointer;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  }
`;

const StatIcon = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.8rem;
  background-color: ${props => props.bgColor}20;
  color: ${props => props.bgColor};
  
  @media (max-width: 768px) {
    width: 50px;
    height: 50px;
    font-size: 1.5rem;
  }
  
  @media (max-width: 480px) {
    width: 45px;
    height: 45px;
    font-size: 1.3rem;
  }
`;

const StatValue = styled(Card.Title)`
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0;
  color: #333;
  
  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1.3rem;
  }
`;

const StatTitle = styled(Card.Subtitle)`
  color: #6c757d;
  font-size: 0.9rem;
  margin-top: 0.25rem;
  font-weight: 500;
`;

const StatChange = styled.div`
  margin-top: 0.5rem;
  font-weight: 600;
  font-size: 0.9rem;
  color: ${props => props.positive ? '#1E8546' : '#dc3545'};
`;

const SectionCard = styled(Card)`
  border: none;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  margin-bottom: 1.5rem;
`;

const SectionTitle = styled(Card.Header)`
  background-color: #f8f9fa;
  border-bottom: 1px solid #e9ecef;
  font-weight: 600;
  color: #9A1E47;
  border-radius: 12px 12px 0 0 !important;
  padding: 1rem 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const QuickActionButton = styled(Button)`
  background-color: ${props => props.variant === 'primary' ? '#9A1E47' : '#1E8546'};
  border-color: ${props => props.variant === 'primary' ? '#9A1E47' : '#1E8546'};
  border-radius: 8px;
  padding: 0.75rem 1.5rem;
  font-weight: 500;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: ${props => props.variant === 'primary' ? '#7a1839' : '#156b37'};
    border-color: ${props => props.variant === 'primary' ? '#7a1839' : '#156b37'};
    transform: translateY(-2px);
  }
  
  @media (max-width: 768px) {
    padding: 0.6rem 1.2rem;
    font-size: 0.9rem;
  }
`;

const StatusBadge = styled(Badge)`
  padding: 0.5rem 0.75rem;
  border-radius: 6px;
  font-weight: 500;
`;

const ViewAllButton = styled(Button)`
  background: none;
  border: none;
  color: #9A1E47;
  font-size: 0.9rem;
  padding: 0.25rem 0.5rem;
  
  &:hover {
    background-color: rgba(154, 30, 71, 0.1);
    color: #9A1E47;
  }
`;

const ProgressCard = styled(Card)`
  border: none;
  border-radius: 12px;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  margin-bottom: 1rem;
`;

const Dashboard = ({ onNavigate }) => {
    const navigate = useNavigate();
    const [recentActivity, setRecentActivity] = useState([]);
    const [pendingRequests, setPendingRequests] = useState([]);
    const [systemStats, setSystemStats] = useState({
        storage: 75,
        performance: 92,
        uptime: 99.9
    });
    const [statsData, setStatsData] = useState([]);
    const [loading, setLoading] = useState(true);

    // Función para cargar datos en tiempo real
    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            
            // Cargar estadísticas en tiempo real
            const [usersRes, productsRes, lugaresRes, hospedajesRes, restaurantesRes, ecoturismoRes] = await Promise.all([
                fetch('https://backend-iota-seven-19.vercel.app/api/usuarios'),
                fetch('https://backend-iota-seven-19.vercel.app/api/productos'),
                fetch('https://backend-iota-seven-19.vercel.app/api/lugares'),
                fetch('https://backend-iota-seven-19.vercel.app/api/hospedajes'),
                fetch('https://backend-iota-seven-19.vercel.app/api/restaurantes'),
                fetch('https://backend-iota-seven-19.vercel.app/api/ecoturismo')
            ]);

            const [users, products, lugares, hospedajes, restaurantes, ecoturismo] = await Promise.all([
                usersRes.json(),
                productsRes.json(),
                lugaresRes.json(),
                hospedajesRes.json(),
                restaurantesRes.json(),
                ecoturismoRes.json()
            ]);

            // Actualizar estadísticas con datos reales
            const realStatsData = [
                { 
                    title: 'Usuarios Registrados', 
                    value: Array.isArray(users) ? users.length.toString() : '0', 
                    icon: <FaUsers />, 
                    change: '+3.48%', 
                    color: '#0FA89C',
                    bgGradient: '#f0fdfa',
                    bgGradientEnd: '#ecfeff',
                    section: 'users'
                },
                { 
                    title: 'Lugares Turísticos', 
                    value: Array.isArray(lugares) ? lugares.length.toString() : '0', 
                    icon: <FaMapMarkedAlt />, 
                    change: '+2', 
                    color: '#1E8546',
                    bgGradient: '#f0fdf4',
                    bgGradientEnd: '#ecfdf5',
                    section: 'lugares'
                },
                { 
                    title: 'Hospedajes', 
                    value: Array.isArray(hospedajes) ? hospedajes.length.toString() : '0', 
                    icon: <FaBed />, 
                    change: '+1', 
                    color: '#F28B27',
                    bgGradient: '#fffbeb',
                    bgGradientEnd: '#fef3c7',
                    section: 'hospedajeequests'
                },
                { 
                    title: 'Restaurantes', 
                    value: Array.isArray(restaurantes) ? restaurantes.length.toString() : '0', 
                    icon: <FaUtensils />, 
                    change: '+4', 
                    color: '#9A1E47',
                    bgGradient: '#fdf2f8',
                    bgGradientEnd: '#fce7f3',
                    section: 'restauranterequests'
                },
                { 
                    title: 'Productos Artesanales', 
                    value: Array.isArray(products) ? products.length.toString() : '0', 
                    icon: <FaStore />, 
                    change: '+12', 
                    color: '#6366f1',
                    bgGradient: '#f5f3ff',
                    bgGradientEnd: '#ede9fe',
                    section: 'products'
                },
                { 
                    title: 'Actividades Ecoturísticas', 
                    value: Array.isArray(ecoturismo) ? ecoturismo.length.toString() : '0', 
                    icon: <FaMountain />, 
                    change: '+1', 
                    color: '#059669',
                    bgGradient: '#ecfdf5',
                    bgGradientEnd: '#d1fae5',
                    section: 'ecoturismo'
                },
            ];

            setStatsData(realStatsData);

            // Cargar solicitudes pendientes reales
            const requestsRes = await fetch('https://backend-iota-seven-19.vercel.app/api/solicitudes/pendientes');
            const requests = await requestsRes.json();
            
            if (Array.isArray(requests)) {
                setPendingRequests(requests.slice(0, 5)); // Solo mostrar las primeras 5
            }

            // Cargar actividad reciente real
            const activityRes = await fetch('https://backend-iota-seven-19.vercel.app/api/actividad/reciente');
            const activity = await activityRes.json();
            
            if (Array.isArray(activity)) {
                setRecentActivity(activity.slice(0, 4)); // Solo mostrar las primeras 4
            }

        } catch (error) {
            console.error('Error cargando datos del dashboard:', error);
            // Mantener datos de ejemplo si hay error
            setRecentActivity([
                { id: 1, type: 'Nuevo lugar', description: 'Cascada de Yahualica agregada', time: '2 horas', status: 'completed' },
                { id: 2, type: 'Solicitud', description: 'Nuevo restaurante pendiente', time: '4 horas', status: 'pending' },
                { id: 3, type: 'Usuario', description: 'Nuevo artesano registrado', time: '6 horas', status: 'completed' },
                { id: 4, type: 'Producto', description: 'Artesanía aprobada', time: '1 día', status: 'completed' },
            ]);

            setPendingRequests([
                { id: 1, type: 'Restaurante', name: 'El Sabor de Yahualica', status: 'Pendiente', date: '2024-01-15' },
                { id: 2, type: 'Hospedaje', name: 'Casa Rural San José', status: 'En revisión', date: '2024-01-14' },
                { id: 3, type: 'Producto', name: 'Cerámica tradicional', status: 'Pendiente', date: '2024-01-13' },
            ]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
        
        // Actualizar datos cada 30 segundos
        const interval = setInterval(fetchDashboardData, 30000);
        
        return () => clearInterval(interval);
    }, []);

    const getStatusColor = (status) => {
        switch (status) {
            case 'Pendiente': return 'warning';
            case 'En revisión': return 'info';
            case 'Aprobado': return 'success';
            case 'Rechazado': return 'danger';
            default: return 'secondary';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'completed': return <FaCheckCircle className="text-success" />;
            case 'pending': return <FaClock className="text-warning" />;
            default: return <FaExclamationTriangle className="text-info" />;
        }
    };

    const handleStatClick = (section) => {
        if (onNavigate) {
            onNavigate(section);
        }
    };

    const handleViewAll = (section) => {
        if (onNavigate) {
            onNavigate(section);
        }
    };

    return (
        <DashboardContent>
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4" style={{ width: '100%' }}>
                <h2>Dashboard - El Turismo</h2>
                <div className="d-flex gap-2 mt-2 mt-md-0">
                    <QuickActionButton variant="primary" onClick={() => navigate('/')}>
                        <FaEye className="me-2" />
                        Ver Sitio Público
                    </QuickActionButton>
                </div>
            </div>

            {/* Estadísticas principales */}
            <Row className="mb-4 g-2" style={{ width: '100%', margin: 0 }}>
                {statsData.map((stat, index) => (
                    <Col xl={4} lg={6} md={6} sm={12} xs={12} key={index} className="mb-2" style={{ padding: '0.5rem' }}>
                        <StatCard 
                            bgGradient={stat.bgGradient} 
                            bgGradientEnd={stat.bgGradientEnd}
                            onClick={() => handleStatClick(stat.section)}
                        >
                            <Card.Body>
                                <div className="d-flex justify-content-between align-items-center">
                                    <div>
                                        <StatIcon bgColor={stat.color}>
                                            {stat.icon}
                                        </StatIcon>
                                    </div>
                                    <div className="text-end">
                                        <StatValue>{stat.value}</StatValue>
                                        <StatTitle>{stat.title}</StatTitle>
                                    </div>
                                </div>
                                <StatChange positive={stat.change.startsWith('+')}>
                                    {stat.change} este mes
                                </StatChange>
                            </Card.Body>
                        </StatCard>
                    </Col>
                ))}
            </Row>

            <Row className="g-3" style={{ width: '100%', margin: 0 }}>
                {/* Solicitudes Pendientes */}
                <Col xl={6} lg={12} md={12} className="mb-3" style={{ padding: '0.75rem' }}>
                    <SectionCard>
                        <SectionTitle>
                            <div>
                                <FaInbox className="me-2" />
                                Solicitudes Pendientes
                            </div>
                            <ViewAllButton onClick={() => handleViewAll('requests')}>
                                Ver todas <FaArrowRight className="ms-1" />
                            </ViewAllButton>
                        </SectionTitle>
                        <Card.Body>
                            <Table responsive hover>
                                <thead>
                                    <tr>
                                        <th>Tipo</th>
                                        <th>Nombre</th>
                                        <th>Estado</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {pendingRequests.map((request) => (
                                        <tr key={request.id}>
                                            <td>
                                                <Badge bg="light" text="dark">
                                                    {request.type}
                                                </Badge>
                                            </td>
                                            <td>{request.name}</td>
                                            <td>
                                                <StatusBadge bg={getStatusColor(request.status)}>
                                                    {request.status}
                                                </StatusBadge>
                                            </td>
                                            <td>
                                                <Button size="sm" variant="outline-primary" className="me-1">
                                                    <FaEye />
                                                </Button>
                                                <Button size="sm" variant="outline-success" className="me-1">
                                                    <FaEdit />
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </Card.Body>
                    </SectionCard>
                </Col>

                {/* Actividad Reciente */}
                <Col xl={6} lg={12} md={12} className="mb-3" style={{ padding: '0.75rem' }}>
                    <SectionCard>
                        <SectionTitle>
                            <FaChartLine className="me-2" />
                            Actividad Reciente
                        </SectionTitle>
                        <Card.Body>
                            <div className="activity-list">
                                {recentActivity.map((activity) => (
                                    <div key={activity.id} className="d-flex align-items-center mb-3 p-2 border-bottom">
                                        <div className="me-3">
                                            {getStatusIcon(activity.status)}
                                        </div>
                                        <div className="flex-grow-1">
                                            <div className="fw-bold">{activity.type}</div>
                                            <div className="text-muted small">{activity.description}</div>
                                        </div>
                                        <div className="text-muted small">{activity.time}</div>
                                    </div>
                                ))}
                            </div>
                        </Card.Body>
                    </SectionCard>
                </Col>
            </Row>

            {/* Estado del Sistema */}
            <Row>
                <Col lg={6} md={12} className="mb-4">
                    <SectionCard>
                        <SectionTitle>
                            <FaCog className="me-2" />
                            Estado del Sistema
                        </SectionTitle>
                        <Card.Body>
                            <ProgressCard>
                                <Card.Body>
                                    <div className="d-flex justify-content-between mb-2">
                                        <span>Almacenamiento</span>
                                        <span>{systemStats.storage}%</span>
                                    </div>
                                    <ProgressBar 
                                        variant={systemStats.storage > 80 ? 'danger' : systemStats.storage > 60 ? 'warning' : 'success'}
                                        now={systemStats.storage} 
                                    />
                                </Card.Body>
                            </ProgressCard>
                            
                            <ProgressCard>
                                <Card.Body>
                                    <div className="d-flex justify-content-between mb-2">
                                        <span>Rendimiento</span>
                                        <span>{systemStats.performance}%</span>
                                    </div>
                                    <ProgressBar 
                                        variant={systemStats.performance > 90 ? 'success' : 'warning'}
                                        now={systemStats.performance} 
                                    />
                                </Card.Body>
                            </ProgressCard>
                            
                            <ProgressCard>
                                <Card.Body>
                                    <div className="d-flex justify-content-between mb-2">
                                        <span>Tiempo de Actividad</span>
                                        <span>{systemStats.uptime}%</span>
                                    </div>
                                    <ProgressBar 
                                        variant="success"
                                        now={systemStats.uptime} 
                                    />
                                </Card.Body>
                            </ProgressCard>
                        </Card.Body>
                    </SectionCard>
                </Col>

                {/* Resumen de Contenido */}
                <Col lg={6} md={12} className="mb-4">
                    <SectionCard>
                        <SectionTitle>
                            <FaCalendarAlt className="me-2" />
                            Resumen de Contenido
                        </SectionTitle>
                        <Card.Body>
                            <Row>
                                <Col md={6} sm={6} className="text-center mb-3">
                                    <div className="p-3 bg-light rounded">
                                        <FaMapMarkedAlt className="text-primary mb-2" style={{fontSize: '2rem'}} />
                                        <h5>24 Lugares</h5>
                                        <small className="text-muted">Turísticos registrados</small>
                                    </div>
                                </Col>
                                <Col md={6} sm={6} className="text-center mb-3">
                                    <div className="p-3 bg-light rounded">
                                        <FaBed className="text-success mb-2" style={{fontSize: '2rem'}} />
                                        <h5>18 Hospedajes</h5>
                                        <small className="text-muted">Disponibles</small>
                                    </div>
                                </Col>
                                <Col md={6} sm={6} className="text-center mb-3">
                                    <div className="p-3 bg-light rounded">
                                        <FaUtensils className="text-warning mb-2" style={{fontSize: '2rem'}} />
                                        <h5>32 Restaurantes</h5>
                                        <small className="text-muted">Gastronomía local</small>
                                    </div>
                                </Col>
                                <Col md={6} sm={6} className="text-center mb-3">
                                    <div className="p-3 bg-light rounded">
                                        <FaStore className="text-info mb-2" style={{fontSize: '2rem'}} />
                                        <h5>156 Productos</h5>
                                        <small className="text-muted">Artesanías</small>
                                    </div>
                                </Col>
                            </Row>
                        </Card.Body>
                    </SectionCard>
                </Col>
            </Row>
        </DashboardContent>
    );
};

export default Dashboard;