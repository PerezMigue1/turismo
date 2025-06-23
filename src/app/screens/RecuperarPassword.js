import React, { useState } from 'react';
import { Form, Button, Container, Card, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const RecoverPassword = () => {
    const [email, setEmail] = useState('');
    const [securityAnswer, setSecurityAnswer] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [step, setStep] = useState(1); // 1: email, 2: question, 3: new password
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Mock security question (in a real app, this would come from the server)
    const securityQuestion = "¿Cuál es el nombre de tu primera mascota?";

    const handleEmailSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // Validate email exists - in a real app, this would be an API call
            setTimeout(() => {
                setStep(2);
                setLoading(false);
            }, 1000);
        } catch (err) {
            setError('No encontramos una cuenta con ese correo electrónico.');
            setLoading(false);
        }
    };

    const handleSecurityAnswerSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // Validate security answer - in a real app, this would be an API call
            setTimeout(() => {
                setStep(3);
                setLoading(false);
            }, 1000);
        } catch (err) {
            setError('Respuesta de seguridad incorrecta.');
            setLoading(false);
        }
    };

    const handlePasswordReset = async (e) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            return setError('Las contraseñas no coinciden');
        }

        setError('');
        setLoading(true);

        try {
            // Password reset logic would go here
            setTimeout(() => {
                setSuccess('¡Contraseña actualizada correctamente! Redirigiendo al login...');
                setTimeout(() => {
                    navigate('/login');
                }, 2000);
            }, 1000);
        } catch (err) {
            setError('Error al actualizar la contraseña. Por favor intenta nuevamente.');
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
            <div className="w-100" style={{ maxWidth: '500px' }}>
                <Card style={{ borderColor: '#1E8546' }}> {/* Verde Bosque border */}
                    <Card.Body>
                        <h2
                            className="text-center mb-4"
                            style={{ color: '#9A1E47' }} // Rojo Guinda text
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
                                    {loading ? 'Verificando...' : 'Continuar'}
                                </Button>
                            </Form>
                        )}

                        {/* Step 2: Security Question */}
                        {step === 2 && (
                            <Form onSubmit={handleSecurityAnswerSubmit}>
                                <Form.Group id="securityQuestion" className="mb-3">
                                    <Form.Label>Pregunta de seguridad:</Form.Label>
                                    <p className="fw-bold">{securityQuestion}</p>
                                    <Form.Control
                                        type="text"
                                        required
                                        value={securityAnswer}
                                        onChange={(e) => setSecurityAnswer(e.target.value)}
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
                                    {loading ? 'Verificando...' : 'Continuar'}
                                </Button>
                            </Form>
                        )}

                        {/* Step 3: New Password */}
                        {step === 3 && (
                            <Form onSubmit={handlePasswordReset}>
                                <Form.Group id="newPassword" className="mb-3">
                                    <Form.Label>Nueva Contraseña</Form.Label>
                                    <Form.Control
                                        type="password"
                                        required
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        style={{ borderColor: '#0FA89C' }} // Turquesa Agua border
                                    />
                                </Form.Group>
                                <Form.Group id="confirmPassword" className="mb-3">
                                    <Form.Label>Confirmar Nueva Contraseña</Form.Label>
                                    <Form.Control
                                        type="password"
                                        required
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        style={{ borderColor: '#0FA89C' }} // Turquesa Agua border
                                    />
                                </Form.Group>
                                <Button
                                    disabled={loading}
                                    className="w-100 mt-3"
                                    type="submit"
                                    style={{
                                        backgroundColor: '#1E8546', // Verde Bosque background
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
                                style={{ color: '#F28B27' }} // Naranja Sol text
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