// src/app/admin/Settings.jsx
import React from 'react';
import { Form, Button, Card, Tab, Tabs } from 'react-bootstrap';
import styled from 'styled-components';

const SettingsContent = styled.div`
  h2 {
    color: #9A1E47; /* Rojo Guinda */
    font-weight: 600;
    margin-bottom: 1.5rem;
  }
`;

const StyledCard = styled(Card)`
  border: none;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  margin-bottom: 1.5rem;
`;

const CardTitle = styled(Card.Title)`
  font-weight: 600;
  color: #9A1E47; /* Rojo Guinda */
  margin-bottom: 1.5rem;
`;

const Settings = () => {
    return (
        <SettingsContent>
            <h2 className="mb-4">Configuración del Sistema</h2>

            <Tabs defaultActiveKey="general" className="mb-4">
                <Tab eventKey="general" title="General">
                    <StyledCard>
                        <Card.Body>
                            <CardTitle>Configuración General</CardTitle>
                            <Form>
                                <Form.Group className="mb-3">
                                    <Form.Label>Nombre del Sitio</Form.Label>
                                    <Form.Control type="text" defaultValue="Aventura Huasteca" />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Descripción del Sitio</Form.Label>
                                    <Form.Control as="textarea" rows={3} defaultValue="Plataforma de turismo y artesanías" />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Email de Contacto</Form.Label>
                                    <Form.Control type="email" defaultValue="contacto@aventurahuasteca.com" />
                                </Form.Group>

                                <Button variant="primary" className="mt-2">Guardar Cambios</Button>
                            </Form>
                        </Card.Body>
                    </StyledCard>
                </Tab>

                <Tab eventKey="payment" title="Pagos">
                    <StyledCard>
                        <Card.Body>
                            <CardTitle>Configuración de Pagos</CardTitle>
                            <Form>
                                <Form.Group className="mb-3">
                                    <Form.Label>Métodos de Pago</Form.Label>
                                    <Form.Check
                                        type="checkbox"
                                        label="Tarjeta de Crédito"
                                        defaultChecked
                                    />
                                    <Form.Check
                                        type="checkbox"
                                        label="PayPal"
                                        defaultChecked
                                    />
                                    <Form.Check
                                        type="checkbox"
                                        label="Transferencia Bancaria"
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Moneda Principal</Form.Label>
                                    <Form.Select defaultValue="MXN">
                                        <option value="MXN">Peso Mexicano (MXN)</option>
                                        <option value="USD">Dólar Estadounidense (USD)</option>
                                        <option value="EUR">Euro (EUR)</option>
                                    </Form.Select>
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Impuestos (%)</Form.Label>
                                    <Form.Control type="number" defaultValue="16" min="0" max="50" />
                                </Form.Group>

                                <Button variant="primary" className="mt-2">Guardar Configuración</Button>
                            </Form>
                        </Card.Body>
                    </StyledCard>
                </Tab>

                <Tab eventKey="users" title="Usuarios">
                    <StyledCard>
                        <Card.Body>
                            <CardTitle>Configuración de Usuarios</CardTitle>
                            <Form>
                                <Form.Group className="mb-3">
                                    <Form.Label>Permitir Registros</Form.Label>
                                    <Form.Check
                                        type="switch"
                                        defaultChecked
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Roles Predeterminados</Form.Label>
                                    <Form.Select defaultValue="user">
                                        <option value="user">Usuario</option>
                                        <option value="artisan">Artesano</option>
                                        <option value="admin">Administrador</option>
                                    </Form.Select>
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Restricciones de Contraseña</Form.Label>
                                    <Form.Check
                                        type="checkbox"
                                        label="Mínimo 8 caracteres"
                                        defaultChecked
                                    />
                                    <Form.Check
                                        type="checkbox"
                                        label="Incluir números"
                                        defaultChecked
                                    />
                                    <Form.Check
                                        type="checkbox"
                                        label="Incluir caracteres especiales"
                                    />
                                </Form.Group>

                                <Button variant="primary" className="mt-2">Actualizar Configuración</Button>
                            </Form>
                        </Card.Body>
                    </StyledCard>
                </Tab>
            </Tabs>
        </SettingsContent>
    );
};

export default Settings;