<<<<<<< HEAD
import React, { useState } from 'react';
import { Form, Button, Container, Card, Alert, InputGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await fetch("http://localhost:5000/api/usuarios/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email,
                    password
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Error al iniciar sesión");
            }

            // Guardar el token y redirigir
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.usuario));
            
            navigate('/home'); // Redirigir al dashboard después del login
        } catch (err) {
            setError(err.message || 'Credenciales incorrectas. Por favor intenta nuevamente.');
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

=======
import React, { useState } from 'react';
import { Form, Button, Container, Card, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // Authentication logic would go here
            // For now, simulate a successful login
            setTimeout(() => {
                navigate('/home'); // Redirect to dashboard after login
            }, 1000);
        } catch (err) {
            setError('Failed to log in. Please check your credentials.');
            setLoading(false);
        }
    };

    return (
        <Container
            className="d-flex align-items-center justify-content-center"
            style={{
                minHeight: '100vh',
                backgroundColor: '#FDF2E0' // Beige Claro background
            }}
        >
            <div className="w-100" style={{ maxWidth: '400px' }}>
                <Card style={{ borderColor: '#1E8546' }}> {/* Verde Bosque border */}
                    <Card.Body>
                        <h2
                            className="text-center mb-4"
                            style={{ color: '#9A1E47' }} // Rojo Guinda text
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
                                    style={{ borderColor: '#0FA89C' }} // Turquesa Agua border
                                />
                            </Form.Group>
                            <Form.Group id="password" className="mb-3">
                                <Form.Label>Contraseña</Form.Label>
                                <Form.Control
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    style={{ borderColor: '#0FA89C' }} // Turquesa Agua border
                                />
                            </Form.Group>
                            <Button
                                disabled={loading}
                                className="w-100 mt-3"
                                type="submit"
                                style={{
                                    backgroundColor: '#9A1E47', // Rojo Guinda background
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
                                style={{ color: '#F28B27' }} // Naranja Sol text
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
                            color: '#1E8546', // Verde Bosque text
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

>>>>>>> 39e792a0febff33491eff80f548ffaf809d93736
export default Login;