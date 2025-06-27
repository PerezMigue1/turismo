import React, { useState } from "react";
import { Container, Card, Button, Form, Alert } from "react-bootstrap";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const CambiarContrasena = () => {
    const [actualPassword, setActualPassword] = useState("");
    const [nuevaPassword, setNuevaPassword] = useState("");
    const [confirmarPassword, setConfirmarPassword] = useState("");
    const [alerta, setAlerta] = useState({ show: false, message: "", variant: "danger" });

    const { id } = useParams();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (nuevaPassword !== confirmarPassword) {
            setAlerta({ show: true, message: "Las contraseñas no coinciden", variant: "danger" });
            return;
        }

        try {
            const res = await axios.put(`http://localhost:5000/api/usuarios/${id}/cambiar-password`, {
                actualPassword,
                nuevaPassword
            });

            setAlerta({ show: true, message: res.data.message || "Contraseña actualizada", variant: "success" });

            setTimeout(() => {
                setAlerta({ show: false });
                navigate(`/perfil/${id}`);
            }, 2000);
        } catch (error) {
            setAlerta({
                show: true,
                message: error.response?.data?.message || "Error al cambiar la contraseña",
                variant: "danger"
            });
        }
    };

    return (
        <Container className="py-5">
            <Card className="p-4 mx-auto" style={{
                maxWidth: 500,
                border: "none",
                borderRadius: "15px",
                backgroundColor: "#FDF2E0", // Beige Claro
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
            }}>
                <h3 className="text-center mb-4" style={{ color: "#9A1E47" /* Rojo Guinda */ }}>
                    Cambiar Contraseña
                </h3>

                {alerta.show && (
                    <Alert variant={alerta.variant}>
                        {alerta.message}
                    </Alert>
                )}

                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label style={{ color: "#1E8546", fontWeight: "500" /* Verde Bosque */ }}>
                            Contraseña Actual
                        </Form.Label>
                        <Form.Control
                            type="password"
                            value={actualPassword}
                            onChange={(e) => setActualPassword(e.target.value)}
                            style={{
                                borderColor: "#0FA89C", // Turquesa Agua
                                borderRadius: "10px",
                                padding: "10px 15px"
                            }}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label style={{ color: "#1E8546", fontWeight: "500" }}>
                            Nueva Contraseña
                        </Form.Label>
                        <Form.Control
                            type="password"
                            value={nuevaPassword}
                            onChange={(e) => setNuevaPassword(e.target.value)}
                            style={{
                                borderColor: "#0FA89C",
                                borderRadius: "10px",
                                padding: "10px 15px"
                            }}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-4">
                        <Form.Label style={{ color: "#1E8546", fontWeight: "500" }}>
                            Confirmar Nueva Contraseña
                        </Form.Label>
                        <Form.Control
                            type="password"
                            value={confirmarPassword}
                            onChange={(e) => setConfirmarPassword(e.target.value)}
                            style={{
                                borderColor: "#0FA89C",
                                borderRadius: "10px",
                                padding: "10px 15px"
                            }}
                            required
                        />
                    </Form.Group>

                    <Button
                        type="submit"
                        className="w-100"
                        style={{
                            backgroundColor: "#9A1E47", // Rojo Guinda
                            border: "none",
                            borderRadius: "25px",
                            padding: "10px",
                            fontWeight: "500"
                        }}
                    >
                        Guardar Contraseña
                    </Button>
                </Form>
            </Card>
        </Container>
    );
};

export default CambiarContrasena;
