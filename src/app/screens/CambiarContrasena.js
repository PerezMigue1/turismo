import React, { useState } from "react";
import { Container, Card, Button, Form, Alert, InputGroup } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Eye, EyeSlash } from "react-bootstrap-icons"; // Asegúrate de tener react-bootstrap-icons instalado

const CambiarContrasena = () => {
    const [actualPassword, setActualPassword] = useState("");
    const [nuevaPassword, setNuevaPassword] = useState("");
    const [confirmarPassword, setConfirmarPassword] = useState("");
    const [mostrarPasswords, setMostrarPasswords] = useState({
        actual: false,
        nueva: false,
        confirmar: false
    });
    const [alerta, setAlerta] = useState({ show: false, message: "", variant: "danger" });

    const usuarioId = JSON.parse(localStorage.getItem("user"))?._id;

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (nuevaPassword !== confirmarPassword) {
            setAlerta({ show: true, message: "Las contraseñas no coinciden", variant: "danger" });
            return;
        }

        try {
            const res = await axios.put(`https://backend-iota-seven-19.vercel.app/api/usuarios/${usuarioId}/cambiar-password`, {
                actualPassword,
                nuevaPassword
            });

            setAlerta({ show: true, message: res.data.message || "Contraseña actualizada", variant: "success" });

            setTimeout(() => {
                setAlerta({ show: false });
                navigate(`/perfil`);
            }, 2000);
        } catch (error) {
            setAlerta({
                show: true,
                message: error.response?.data?.message || "Error al cambiar la contraseña",
                variant: "danger"
            });
        }
    };

    const toggleVerPassword = (campo) => {
        setMostrarPasswords(prev => ({ ...prev, [campo]: !prev[campo] }));
    };

    return (
        <Container className="py-5">
            <Card className="p-4 mx-auto" style={{
                maxWidth: 500,
                border: "none",
                borderRadius: "15px",
                backgroundColor: "#FDF2E0",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
            }}>
                <h3 className="text-center mb-4" style={{ color: "#9A1E47" }}>
                    Cambiar Contraseña
                </h3>

                {alerta.show && (
                    <Alert variant={alerta.variant}>
                        {alerta.message}
                    </Alert>
                )}

                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label style={{ color: "#1E8546", fontWeight: "500" }}>
                            Contraseña Actual
                        </Form.Label>
                        <InputGroup>
                            <Form.Control
                                type={mostrarPasswords.actual ? "text" : "password"}
                                value={actualPassword}
                                onChange={(e) => setActualPassword(e.target.value)}
                                style={{
                                    borderColor: "#0FA89C",
                                    borderRadius: "10px",
                                    padding: "10px 15px"
                                }}
                                required
                            />
                            <Button
                                variant="outline-secondary"
                                onClick={() => toggleVerPassword("actual")}
                                style={{ borderColor: "#0FA89C" }}
                            >
                                {mostrarPasswords.actual ? <EyeSlash /> : <Eye />}
                            </Button>
                        </InputGroup>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label style={{ color: "#1E8546", fontWeight: "500" }}>
                            Nueva Contraseña
                        </Form.Label>
                        <InputGroup>
                            <Form.Control
                                type={mostrarPasswords.nueva ? "text" : "password"}
                                value={nuevaPassword}
                                onChange={(e) => setNuevaPassword(e.target.value)}
                                style={{
                                    borderColor: "#0FA89C",
                                    borderRadius: "10px",
                                    padding: "10px 15px"
                                }}
                                required
                            />
                            <Button
                                variant="outline-secondary"
                                onClick={() => toggleVerPassword("nueva")}
                                style={{ borderColor: "#0FA89C" }}
                            >
                                {mostrarPasswords.nueva ? <EyeSlash /> : <Eye />}
                            </Button>
                        </InputGroup>
                    </Form.Group>

                    <Form.Group className="mb-4">
                        <Form.Label style={{ color: "#1E8546", fontWeight: "500" }}>
                            Confirmar Nueva Contraseña
                        </Form.Label>
                        <InputGroup>
                            <Form.Control
                                type={mostrarPasswords.confirmar ? "text" : "password"}
                                value={confirmarPassword}
                                onChange={(e) => setConfirmarPassword(e.target.value)}
                                style={{
                                    borderColor: "#0FA89C",
                                    borderRadius: "10px",
                                    padding: "10px 15px"
                                }}
                                required
                            />
                            <Button
                                variant="outline-secondary"
                                onClick={() => toggleVerPassword("confirmar")}
                                style={{ borderColor: "#0FA89C" }}
                            >
                                {mostrarPasswords.confirmar ? <EyeSlash /> : <Eye />}
                            </Button>
                        </InputGroup>
                    </Form.Group>

                    <Button
                        type="submit"
                        className="w-100"
                        style={{
                            backgroundColor: "#9A1E47",
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
