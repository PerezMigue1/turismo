import React, { useState } from 'react';
import { Form, Button, Container, Card, Alert, InputGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const RecoverPassword = () => {
    const [email, setEmail] = useState('');
    const [securityAnswer, setSecurityAnswer] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [securityQuestion, setSecurityQuestion] = useState('');
    const [step, setStep] = useState(1); // 1: email, 2: question, 3: new password
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [resetToken, setResetToken] = useState('');
    const navigate = useNavigate();

    const toggleNewPasswordVisibility = () => {
        setShowNewPassword(!showNewPassword);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
        const response = await fetch(`https://backend-iota-nine-32.vercel.app/api/usuarios/pregunta-secreta`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email })
        });

        const data = await response.json();
        console.log("Respuesta completa:", data); // Agrega esto para depuración

        if (!response.ok) {
            throw new Error(data.message || 'Error al obtener pregunta');
        }

        if (!data.pregunta) {
            throw new Error('El usuario no tiene pregunta de seguridad configurada');
        }

        setSecurityQuestion(data.pregunta);
        setStep(2);
    } catch (err) {
        console.error("Error detallado:", err);
        setError(err.message);
        setSecurityQuestion(""); // Limpia la pregunta en caso de error
    } finally {
        setLoading(false);
    }
};

    const handleSecurityAnswerSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
        const response = await fetch(`https://backend-iota-nine-32.vercel.app/api/usuarios/verificar-respuesta`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email,
                respuesta: securityAnswer
            })
        });

        const data = await response.json();
        console.log("Respuesta verificación:", data); // Para depuración

        if (!response.ok || !data.success) {
            throw new Error(data.message || 'Error al verificar la respuesta');
        }

        if (!data.token) {
            throw new Error('No se recibió el token de recuperación');
        }

        setResetToken(data.token);
        setStep(3);
    } catch (err) {
        console.error("Error en verificación:", err);
        setError(err.message);
    } finally {
        setLoading(false);
    }
};

    const handlePasswordReset = async (e) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
        return setError('Las contraseñas no coinciden');
    }

    try {
        const response = await fetch(`https://backend-iota-nine-32.vercel.app/api/usuarios/cambiar-password`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email,
                token: resetToken, // Asegúrate de enviar el token
                nuevaPassword: newPassword
            })
        });

        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Error al cambiar contraseña');
        }

        setSuccess('Contraseña cambiada correctamente');
        setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
        setError(err.message);
    }
};

    return (
        <Container
            className="d-flex align-items-center justify-content-center"
            style={{
                minHeight: '100vh',
                backgroundColor: '#FDF2E0'
            }}
        >
            <div className="w-100" style={{ maxWidth: '500px' }}>
                <Card style={{ borderColor: '#1E8546' }}>
                    <Card.Body>
                        <h2
                            className="text-center mb-4"
                            style={{ color: '#9A1E47' }}
                        >
                            Recuperar Contraseña
                        </h2>
                        {error && <Alert variant="danger">{error}</Alert>}
                        {success && <Alert variant="success">{success}</Alert>}

                        {/* Step 1: Email Verification */}
                        {step === 1 && (
                            <Form onSubmit={handleEmailSubmit}>
                                <Form.Group id="email" className="mb-3">
                                    <Form.Label>Correo Electrónico</Form.Label>
                                    <Form.Control
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        style={{ borderColor: '#0FA89C' }}
                                        placeholder="Ingresa tu correo registrado"
                                    />
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
                                    {loading ? 'Verificando...' : 'Continuar'}
                                </Button>
                            </Form>
                        )}

                        {/* Step 2: Security Question */}
                        {step === 2 && (
                            <Form onSubmit={handleSecurityAnswerSubmit}>
                                <Form.Group id="securityQuestion" className="mb-3">
                                    <Form.Label>Pregunta de seguridad:</Form.Label>
                                    <Card className="mb-3" style={{ backgroundColor: '#f8f9fa' }}>
                                        <Card.Body>
                                            <p className="mb-0 fw-bold">{securityQuestion || "Cargando pregunta..."}</p>
                                        </Card.Body>
                                    </Card>
                                    <Form.Label>Tu respuesta:</Form.Label>
                                    <Form.Control
                                        type="text"
                                        required
                                        value={securityAnswer}
                                        onChange={(e) => setSecurityAnswer(e.target.value)}
                                        style={{ borderColor: '#0FA89C' }}
                                        placeholder="Ingresa tu respuesta"
                                    />
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
                                    {loading ? 'Verificando...' : 'Continuar'}
                                </Button>
                            </Form>
                        )}

                        {/* Step 3: New Password */}
                        {step === 3 && (
                            <Form onSubmit={handlePasswordReset}>
                                <Form.Group id="newPassword" className="mb-3">
                                    <Form.Label>Nueva Contraseña</Form.Label>
                                    <InputGroup>
                                        <Form.Control
                                            type={showNewPassword ? "text" : "password"}
                                            required
                                            minLength="6"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            style={{ borderColor: '#0FA89C' }}
                                            placeholder="Mínimo 6 caracteres"
                                        />
                                        <InputGroup.Text
                                            style={{ cursor: 'pointer', backgroundColor: 'white', borderColor: '#0FA89C' }}
                                            onClick={toggleNewPasswordVisibility}
                                        >
                                            {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                                        </InputGroup.Text>
                                    </InputGroup>
                                </Form.Group>
                                <Form.Group id="confirmPassword" className="mb-3">
                                    <Form.Label>Confirmar Nueva Contraseña</Form.Label>
                                    <InputGroup>
                                        <Form.Control
                                            type={showConfirmPassword ? "text" : "password"}
                                            required
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            style={{ borderColor: '#0FA89C' }}
                                        />
                                        <InputGroup.Text
                                            style={{ cursor: 'pointer', backgroundColor: 'white', borderColor: '#0FA89C' }}
                                            onClick={toggleConfirmPasswordVisibility}
                                        >
                                            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                                        </InputGroup.Text>
                                    </InputGroup>
                                </Form.Group>
                                <Button
                                    disabled={loading}
                                    className="w-100 mt-3"
                                    type="submit"
                                    style={{
                                        backgroundColor: '#1E8546',
                                        borderColor: '#1E8546',
                                        fontWeight: 'bold'
                                    }}
                                >
                                    {loading ? 'Actualizando...' : 'Actualizar Contraseña'}
                                </Button>
                            </Form>
                        )}

                        <div className="w-100 text-center mt-3">
                            <a
                                href="/login"
                                style={{ color: '#F28B27' }}
                            >
                                Volver al inicio de sesión
                            </a>
                        </div>
                    </Card.Body>
                </Card>
            </div>
        </Container>
    );
};

export default RecoverPassword;