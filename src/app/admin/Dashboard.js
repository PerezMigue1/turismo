// src/app/admin/Dashboard.jsx
import React from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import {
    FaUsers,
    FaShoppingCart,
    FaDollarSign,
    FaChartLine
} from 'react-icons/fa';
import styled from 'styled-components';

const DashboardContent = styled.div`
  h2 {
    color: #9A1E47; /* Rojo Guinda */
    font-weight: 600;
    margin-bottom: 1.5rem;
  }
`;

const StatCard = styled(Card)`
  border: none;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  height: 100%;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1);
  }
`;

const StatIcon = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  background-color: ${props => props.bgColor}20;
  color: ${props => props.bgColor};
`;

const StatValue = styled(Card.Title)`
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 0;
  color: #333;
`;

const StatTitle = styled(Card.Subtitle)`
  color: #6c757d;
  font-size: 0.9rem;
  margin-top: 0.25rem;
`;

const StatChange = styled.div`
  margin-top: 0.5rem;
  font-weight: 600;
  font-size: 0.9rem;
  color: ${props => props.positive ? '#1E8546' : '#dc3545'}; /* Verde Bosque para positivo, rojo para negativo */
`;

const Dashboard = () => {
    const statsData = [
        { title: 'Usuarios', value: '1,458', icon: <FaUsers />, change: '+3.48%', color: '#0FA89C' },
        { title: 'Pedidos', value: '342', icon: <FaShoppingCart />, change: '-2.15%', color: '#F28B27' },
        { title: 'Ingresos', value: '$8,425', icon: <FaDollarSign />, change: '+5.32%', color: '#1E8546' },
        { title: 'Rendimiento', value: '86.2%', icon: <FaChartLine />, change: '+1.25%', color: '#9A1E47' },
    ];

    return (
        <DashboardContent>
            <h2 className="mb-4">Dashboard</h2>

            <Row className="mb-4">
                {statsData.map((stat, index) => (
                    <Col md={3} key={index} className="mb-3">
                        <StatCard>
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
                                    {stat.change}
                                </StatChange>
                            </Card.Body>
                        </StatCard>
                    </Col>
                ))}
            </Row>

            {/* ... resto del dashboard ... */}
        </DashboardContent>
    );
};

export default Dashboard;