import React, { useState } from 'react';
import { Form, Button, Container, Card, Alert, InputGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useAuth } from '../Navigation/AuthContext'; // Ajusta la ruta si es diferente

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();


    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await fetch("https://backend-iota-seven-19.vercel.app/api/usuarios/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();
            console.log("🔍 Datos del login:", data);

            if (!response.ok || !data.token || !data.usuario) {
                throw new Error(data.message || "Error al iniciar sesión");
            }

            const usuario = { ...data.usuario, token: data.token };
            login(usuario); // ✅ Actualiza el contexto global
            navigate("/home");

        } catch (err) {
            console.error("❌ Error de login:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }

    };


    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <Container
            className="d-flex align-items-center justify-content-center"
            style={{
                minHeight: '100vh',
                backgroundColor: '#FDF2E0'
            }}
        >
            <div className="w-100" style={{ maxWidth: '400px' }}>
                <Card style={{ borderColor: '#1E8546' }}>
                    <Card.Body>
                        <h2
                            className="text-center mb-4"
                            style={{ color: '#9A1E47' }}
                        >
                            Iniciar Sesión
                        </h2>
                        {error && <Alert variant="danger">{error}</Alert>}
                        <Form onSubmit={handleSubmit}>
                            <Form.Group id="email" className="mb-3">
                                <Form.Label>Correo Electrónico</Form.Label>
                                <Form.Control
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    style={{ borderColor: '#0FA89C' }}
                                />
                            </Form.Group>
                            <Form.Group id="password" className="mb-3">
                                <Form.Label>Contraseña</Form.Label>
                                <InputGroup>
                                    <Form.Control
                                        type={showPassword ? "text" : "password"}
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        style={{ borderColor: '#0FA89C' }}
                                    />
                                    <InputGroup.Text
                                        style={{ cursor: 'pointer', backgroundColor: 'white', borderColor: '#0FA89C' }}
                                        onClick={togglePasswordVisibility}
                                    >
                                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                                    </InputGroup.Text>
                                </InputGroup>
                            </Form.Group>
                            <Button
                                disabled={loading}
                                className="w-100 mt-3"
                                type="submit"
                                style={{
                                    backgroundColor: '#9A1E47',
                                    borderColor: '#9A1E47',
                                    fontWeight: 'bold'
                                }}
                            >
                                {loading ? 'Iniciando Sesión...' : 'Iniciar Sesión'}
                            </Button>
                        </Form>
                        <div className="w-100 text-center mt-3">
                            <a
                                href="/recuperarContra"
                                style={{ color: '#F28B27' }}
                            >
                                ¿Olvidaste tu contraseña?
                            </a>
                        </div>
                    </Card.Body>
                </Card>
                <div className="w-100 text-center mt-2">
                    ¿No tienes una cuenta?{' '}
                    <a
                        href="/registro"
                        style={{
                            color: '#1E8546',
                            fontWeight: 'bold'
                        }}
                    >
                        Regístrate
                    </a>
                </div>
            </div>
        </Container>
    );
};

export default Login;