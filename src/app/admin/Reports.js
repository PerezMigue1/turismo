// src/app/admin/Reports.js
import React, { useState } from 'react';
import { Row, Col, Card, Table, Badge, Button, Form, Dropdown } from 'react-bootstrap';
import {
    FaChartLine,
    FaDownload,
    FaFilePdf,
    FaFileExcel,
    FaFileCsv,
    FaCalendarAlt,
    FaFilter,
    FaEye,
    FaPrint,
    FaShare,
    FaUsers,
    FaMapMarkedAlt,
    FaBed,
    FaUtensils,
    FaStore
} from 'react-icons/fa';
import styled from 'styled-components';

const ReportsContainer = styled.div`
  h2 {
    color: #9A1E47;
    font-weight: 600;
    margin-bottom: 1.5rem;
  }
`;

const ReportCard = styled(Card)`
  border: none;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  margin-bottom: 1.5rem;
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  }
`;

const ReportHeader = styled(Card.Header)`
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

const ExportButton = styled(Button)`
  background-color: #1E8546;
  border-color: #1E8546;
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  
  &:hover {
    background-color: #156b37;
    border-color: #156b37;
  }
`;

const Reports = () => {
    const [selectedReport, setSelectedReport] = useState('visitors');
    const [dateRange, setDateRange] = useState('30d');

    const reportsData = {
        visitors: {
            title: 'Reporte de Visitantes',
            icon: <FaUsers />,
            data: [
                { date: '2024-01-01', visitors: 1250, pageViews: 3200, bounceRate: 42.5 },
                { date: '2024-01-02', visitors: 1380, pageViews: 3450, bounceRate: 41.2 },
                { date: '2024-01-03', visitors: 1420, pageViews: 3600, bounceRate: 39.8 },
                { date: '2024-01-04', visitors: 1350, pageViews: 3400, bounceRate: 43.1 },
                { date: '2024-01-05', visitors: 1480, pageViews: 3750, bounceRate: 38.5 }
            ]
        },
        content: {
            title: 'Reporte de Contenido',
            icon: <FaMapMarkedAlt />,
            data: [
                { section: 'Lugares Turísticos', views: 8900, engagement: 78.5, growth: 12.3 },
                { section: 'Gastronomía', views: 6700, engagement: 82.1, growth: 15.7 },
                { section: 'Hospedajes', views: 5400, engagement: 75.2, growth: 8.9 },
                { section: 'Artesanías', views: 4200, engagement: 68.9, growth: 6.4 },
                { section: 'Ecoturismo', views: 3800, engagement: 71.3, growth: 9.8 }
            ]
        },
        performance: {
            title: 'Reporte de Rendimiento',
            icon: <FaChartLine />,
            data: [
                { metric: 'Tiempo de Carga', value: '2.3s', target: '3s', status: 'success' },
                { metric: 'Disponibilidad', value: '99.8%', target: '99.5%', status: 'success' },
                { metric: 'Errores 404', value: '12', target: '<50', status: 'success' },
                { metric: 'Tiempo de Respuesta', value: '180ms', target: '200ms', status: 'success' },
                { metric: 'Uso de CPU', value: '45%', target: '<70%', status: 'success' }
            ]
        }
    };

    const currentReport = reportsData[selectedReport];

    const handleExport = (format) => {
        console.log(`Exportando reporte ${selectedReport} en formato ${format}`);
        // Aquí se implementaría la lógica de exportación
    };

    const renderReportTable = () => {
        switch (selectedReport) {
            case 'visitors':
                return (
                    <Table responsive hover>
                        <thead>
                            <tr>
                                <th>Fecha</th>
                                <th>Visitantes</th>
                                <th>Vistas de Página</th>
                                <th>Tasa de Rebote</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentReport.data.map((row, index) => (
                                <tr key={index}>
                                    <td>{row.date}</td>
                                    <td>{row.visitors.toLocaleString()}</td>
                                    <td>{row.pageViews.toLocaleString()}</td>
                                    <td>{row.bounceRate}%</td>
                                    <td>
                                        <Button size="sm" variant="outline-primary" className="me-1">
                                            <FaEye />
                                        </Button>
                                        <Button size="sm" variant="outline-secondary">
                                            <FaDownload />
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                );
            case 'content':
                return (
                    <Table responsive hover>
                        <thead>
                            <tr>
                                <th>Sección</th>
                                <th>Vistas</th>
                                <th>Engagement</th>
                                <th>Crecimiento</th>
                                <th>Estado</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentReport.data.map((row, index) => (
                                <tr key={index}>
                                    <td>{row.section}</td>
                                    <td>{row.views.toLocaleString()}</td>
                                    <td>{row.engagement}%</td>
                                    <td>
                                        <Badge bg={row.growth > 10 ? 'success' : 'warning'}>
                                            {row.growth > 0 ? '+' : ''}{row.growth}%
                                        </Badge>
                                    </td>
                                    <td>
                                        <Badge bg="success">Activo</Badge>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                );
            case 'performance':
                return (
                    <Table responsive hover>
                        <thead>
                            <tr>
                                <th>Métrica</th>
                                <th>Valor Actual</th>
                                <th>Objetivo</th>
                                <th>Estado</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentReport.data.map((row, index) => (
                                <tr key={index}>
                                    <td>{row.metric}</td>
                                    <td>{row.value}</td>
                                    <td>{row.target}</td>
                                    <td>
                                        <Badge bg={row.status === 'success' ? 'success' : 'danger'}>
                                            {row.status === 'success' ? 'OK' : 'Crítico'}
                                        </Badge>
                                    </td>
                                    <td>
                                        <Button size="sm" variant="outline-info" className="me-1">
                                            <FaEye />
                                        </Button>
                                        <Button size="sm" variant="outline-warning">
                                            <FaChartLine />
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                );
            default:
                return null;
        }
    };

    return (
        <ReportsContainer>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Reportes - Yahualica Turístico</h2>
                <div className="d-flex gap-2">
                    <Dropdown>
                        <Dropdown.Toggle as={ExportButton} variant="success">
                            <FaDownload className="me-2" />
                            Exportar
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item onClick={() => handleExport('pdf')}>
                                <FaFilePdf className="me-2" />
                                Exportar PDF
                            </Dropdown.Item>
                            <Dropdown.Item onClick={() => handleExport('excel')}>
                                <FaFileExcel className="me-2" />
                                Exportar Excel
                            </Dropdown.Item>
                            <Dropdown.Item onClick={() => handleExport('csv')}>
                                <FaFileCsv className="me-2" />
                                Exportar CSV
                            </Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                    <Button variant="outline-primary">
                        <FaPrint className="me-2" />
                        Imprimir
                    </Button>
                    <Button variant="outline-secondary">
                        <FaShare className="me-2" />
                        Compartir
                    </Button>
                </div>
            </div>

            {/* Filtros */}
            <Row className="mb-4">
                <Col md={6}>
                    <Form.Group>
                        <Form.Label>Tipo de Reporte</Form.Label>
                        <Form.Select 
                            value={selectedReport} 
                            onChange={(e) => setSelectedReport(e.target.value)}
                        >
                            <option value="visitors">Reporte de Visitantes</option>
                            <option value="content">Reporte de Contenido</option>
                            <option value="performance">Reporte de Rendimiento</option>
                        </Form.Select>
                    </Form.Group>
                </Col>
                <Col md={6}>
                    <Form.Group>
                        <Form.Label>Rango de Fechas</Form.Label>
                        <Form.Select 
                            value={dateRange} 
                            onChange={(e) => setDateRange(e.target.value)}
                        >
                            <option value="7d">Últimos 7 días</option>
                            <option value="30d">Últimos 30 días</option>
                            <option value="90d">Últimos 90 días</option>
                            <option value="1y">Último año</option>
                        </Form.Select>
                    </Form.Group>
                </Col>
            </Row>

            {/* Reporte seleccionado */}
            <ReportCard>
                <ReportHeader>
                    <div>
                        {currentReport.icon}
                        <span className="ms-2">{currentReport.title}</span>
                    </div>
                    <div className="d-flex gap-2">
                        <Button size="sm" variant="outline-primary">
                            <FaFilter className="me-1" />
                            Filtrar
                        </Button>
                        <Button size="sm" variant="outline-success">
                            <FaDownload className="me-1" />
                            Descargar
                        </Button>
                    </div>
                </ReportHeader>
                <Card.Body>
                    {renderReportTable()}
                </Card.Body>
            </ReportCard>

            {/* Resumen de métricas */}
            <Row>
                <Col md={4}>
                    <ReportCard>
                        <Card.Body className="text-center">
                            <div className="h3 text-primary mb-2">
                                <FaUsers />
                            </div>
                            <h5>Total Visitantes</h5>
                            <div className="h2 text-primary">15,420</div>
                            <small className="text-success">+8.6% vs mes anterior</small>
                        </Card.Body>
                    </ReportCard>
                </Col>
                <Col md={4}>
                    <ReportCard>
                        <Card.Body className="text-center">
                            <div className="h3 text-success mb-2">
                                <FaMapMarkedAlt />
                            </div>
                            <h5>Páginas Visitadas</h5>
                            <div className="h2 text-success">45,680</div>
                            <small className="text-success">+8.0% vs mes anterior</small>
                        </Card.Body>
                    </ReportCard>
                </Col>
                <Col md={4}>
                    <ReportCard>
                        <Card.Body className="text-center">
                            <div className="h3 text-warning mb-2">
                                <FaChartLine />
                            </div>
                            <h5>Tiempo Promedio</h5>
                            <div className="h2 text-warning">4.2 min</div>
                            <small className="text-success">+10.5% vs mes anterior</small>
                        </Card.Body>
                    </ReportCard>
                </Col>
            </Row>
        </ReportsContainer>
    );
};

export default Reports; 