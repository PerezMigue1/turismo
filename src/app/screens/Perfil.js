import React, { useState, useEffect } from "react";
import { Container, Card, Button, Form, Row, Col, Alert } from "react-bootstrap";
import { FaUser, FaPhone, FaEnvelope, FaVenusMars, FaBirthdayCake, FaEdit, FaSave } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Perfil = () => {
    const [user, setUser] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({});
    const [alert, setAlert] = useState({ show: false, message: "", variant: "success" });
    const navigate = useNavigate();

    // ✅ Obtener ID del usuario desde localStorage
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const id = storedUser?._id;

    useEffect(() => {
        if (!id) {
            console.error("❌ ID de usuario no encontrado en localStorage");
            setAlert({
                show: true,
                message: "No se pudo cargar el perfil. Por favor, inicia sesión nuevamente.",
                variant: "danger"
            });
            return;
        }


        const fetchUserData = async () => {
            try {
                const response = await axios.get(`https://backend-iota-seven-19.vercel.app/api/usuarios/${id}/perfil`);
                setUser(response.data);
                setFormData(response.data);
            } catch (error) {
                console.error("Error al cargar datos del usuario:", error);
                setAlert({
                    show: true,
                    message: "Error al cargar los datos del perfil",
                    variant: "danger"
                });
            }
        };

        fetchUserData();
    }, [id]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put(`https://backend-iota-seven-19.vercel.app/api/usuarios/${id}/perfil`, formData);
            setUser(response.data.usuario);
            setEditMode(false);
            setAlert({
                show: true,
                message: response.data.message || "Perfil actualizado correctamente",
                variant: "success"
            });
        } catch (error) {
            console.error("Error al actualizar perfil:", error);
            setAlert({
                show: true,
                message: error.response?.data?.message || "Error al actualizar el perfil",
                variant: "danger"
            });
        }
        setTimeout(() => setAlert({ ...alert, show: false }), 3000);
    };

    if (!user) return (
        <div style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            color: "#9A1E47"
        }}>
            Cargando perfil...
        </div>
    );

    return (
        <Container className="py-5">
            <Row className="justify-content-center">
                <Col md={8} lg={6}>
                    <Card style={{
                        border: "none",
                        borderRadius: "15px",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                        backgroundColor: "#FDF2E0"
                    }}>
                        <Card.Header style={{
                            backgroundColor: "#9A1E47",
                            color: "white",
                            borderTopLeftRadius: "15px",
                            borderTopRightRadius: "15px",
                            padding: "1.5rem"
                        }}>
                            <div className="d-flex justify-content-between align-items-center">
                                <h3 className="mb-0">
                                    <FaUser className="me-2" />
                                    Mi Perfil
                                </h3>
                                <Button
                                    variant={editMode ? "success" : "outline-light"}
                                    onClick={editMode ? handleSubmit : () => setEditMode(true)}
                                    style={{
                                        backgroundColor: editMode ? "#1E8546" : "transparent",
                                        borderColor: "white",
                                        borderRadius: "20px",
                                        padding: "5px 15px"
                                    }}
                                >
                                    {editMode ? (
                                        <>
                                            <FaSave className="me-1" /> Guardar
                                        </>
                                    ) : (
                                        <>
                                            <FaEdit className="me-1" /> Editar
                                        </>
                                    )}
                                </Button>
                            </div>
                        </Card.Header>

                        <Card.Body style={{ padding: "2rem" }}>
                            {alert.show && (
                                <Alert variant={alert.variant} onClose={() => setAlert({ ...alert, show: false })} dismissible>
                                    {alert.message}
                                </Alert>
                            )}

                            <Form onSubmit={handleSubmit}>
                                <Form.Group className="mb-4">
                                    <Form.Label style={{ color: "#9A1E47", fontWeight: "500" }}>
                                        <FaUser className="me-2" /> Nombre completo
                                    </Form.Label>
                                    {editMode ? (
                                        <Form.Control
                                            type="text"
                                            name="nombre"
                                            value={formData.nombre || ""}
                                            onChange={handleInputChange}
                                            style={{
                                                borderColor: "#0FA89C",
                                                borderRadius: "10px",
                                                padding: "10px 15px"
                                            }}
                                        />
                                    ) : (
                                        <div style={{
                                            backgroundColor: "white",
                                            padding: "10px 15px",
                                            borderRadius: "10px",
                                            border: "1px solid #ddd"
                                        }}>
                                            {user.nombre}
                                        </div>
                                    )}
                                </Form.Group>

                                <Row className="mb-4">
                                    <Col md={6}>
                                        <Form.Group>
                                            <Form.Label style={{ color: "#9A1E47", fontWeight: "500" }}>
                                                <FaPhone className="me-2" /> Teléfono
                                            </Form.Label>
                                            {editMode ? (
                                                <Form.Control
                                                    type="tel"
                                                    name="telefono"
                                                    value={formData.telefono || ""}
                                                    onChange={handleInputChange}
                                                    style={{
                                                        borderColor: "#0FA89C",
                                                        borderRadius: "10px",
                                                        padding: "10px 15px"
                                                    }}
                                                />
                                            ) : (
                                                <div style={{
                                                    backgroundColor: "white",
                                                    padding: "10px 15px",
                                                    borderRadius: "10px",
                                                    border: "1px solid #ddd"
                                                }}>
                                                    {user.telefono}
                                                </div>
                                            )}
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group>
                                            <Form.Label style={{ color: "#9A1E47", fontWeight: "500" }}>
                                                <FaEnvelope className="me-2" /> Correo electrónico
                                            </Form.Label>
                                            <div style={{
                                                backgroundColor: "white",
                                                padding: "10px 15px",
                                                borderRadius: "10px",
                                                border: "1px solid #ddd",
                                                color: "#555"
                                            }}>
                                                {user.email}
                                            </div>
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Row className="mb-4">
                                    <Col md={6}>
                                        <Form.Group>
                                            <Form.Label style={{ color: "#9A1E47", fontWeight: "500" }}>
                                                <FaVenusMars className="me-2" /> Género
                                            </Form.Label>
                                            {editMode ? (
                                                <Form.Select
                                                    name="sexo"
                                                    value={formData.sexo || ""}
                                                    onChange={handleInputChange}
                                                    style={{
                                                        borderColor: "#0FA89C",
                                                        borderRadius: "10px",
                                                        padding: "10px 15px"
                                                    }}
                                                >
                                                    <option value="Masculino">Masculino</option>
                                                    <option value="Femenino">Femenino</option>
                                                    <option value="Otro">Otro</option>
                                                </Form.Select>
                                            ) : (
                                                <div style={{
                                                    backgroundColor: "white",
                                                    padding: "10px 15px",
                                                    borderRadius: "10px",
                                                    border: "1px solid #ddd"
                                                }}>
                                                    {user.sexo}
                                                </div>
                                            )}
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group>
                                            <Form.Label style={{ color: "#9A1E47", fontWeight: "500" }}>
                                                <FaBirthdayCake className="me-2" /> Edad
                                            </Form.Label>
                                            {editMode ? (
                                                <Form.Control
                                                    type="number"
                                                    name="edad"
                                                    value={formData.edad || ""}
                                                    onChange={handleInputChange}
                                                    style={{
                                                        borderColor: "#0FA89C",
                                                        borderRadius: "10px",
                                                        padding: "10px 15px"
                                                    }}
                                                />
                                            ) : (
                                                <div style={{
                                                    backgroundColor: "white",
                                                    padding: "10px 15px",
                                                    borderRadius: "10px",
                                                    border: "1px solid #ddd"
                                                }}>
                                                    {user.edad} años
                                                </div>
                                            )}
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Form.Group className="mb-4">
                                    <Form.Label style={{ color: "#9A1E47", fontWeight: "500" }}>
                                        Rol
                                    </Form.Label>
                                    <div style={{
                                        backgroundColor: user.rol === "turista" ? "#50C2C4" : "#F28B27",
                                        color: "white",
                                        padding: "10px 15px",
                                        borderRadius: "20px",
                                        display: "inline-block",
                                        fontWeight: "500",
                                        textTransform: "capitalize"
                                    }}>
                                        {user.rol}
                                    </div>
                                </Form.Group>
                            </Form>

                            <div className="d-flex justify-content-between mt-4">
                                <Button
                                    variant="outline"
                                    onClick={() => navigate('/reservaciones')}
                                    style={{
                                        color: "#9A1E47",
                                        borderColor: "#9A1E47",
                                        borderRadius: "20px",
                                        padding: "8px 20px",
                                        fontWeight: "500"
                                    }}
                                >
                                    Ver mis reservaciones
                                </Button>
                                <Button
                                    variant="primary"
                                    onClick={() => {
                                        const user = JSON.parse(localStorage.getItem('user'));
                                        const usuarioId = user?._id;

                                        if (usuarioId) {
                                            navigate(`/cambiar-contrasena`);
                                        } else {
                                            console.error("ID de usuario no encontrado");
                                        }
                                    }}
                                    style={{
                                        backgroundColor: "#D24D1C",
                                        border: "none",
                                        borderRadius: "20px",
                                        padding: "8px 20px",
                                        fontWeight: "500"
                                    }}
                                >
                                    Cambiar contraseña
                                </Button>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default Perfil;