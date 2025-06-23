<<<<<<< HEAD
import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Card, Alert, InputGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const Register = () => {
    const [formData, setFormData] = useState({
        nombre: "",
        telefono: "",
        email: "",
        password: "",
        confirmPassword: "",
        sexo: "",
        edad: "",
        userType: "turista",
        securityQuestion: "",
        securityAnswer: ""
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [securityQuestions, setSecurityQuestions] = useState([]);
    const [loadingQuestions, setLoadingQuestions] = useState(true);
    const navigate = useNavigate();

    const sexoOptions = ['Masculino', 'Femenino', 'Otro'];
    const userTypes = ['turista', 'miembro'];

    // Cargar preguntas de seguridad al montar el componente
    useEffect(() => {
        const fetchSecurityQuestions = async () => {
            try {
                const response = await fetch("http://localhost:5000/api/preguntas");
                const data = await response.json();
                
                if (!response.ok) {
                    throw new Error(data.message || "Error al cargar preguntas de seguridad");
                }
                
                setSecurityQuestions(data);
                setLoadingQuestions(false);
            } catch (err) {
                setError(err.message);
                setLoadingQuestions(false);
            }
        };

        fetchSecurityQuestions();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            return setError('Las contraseñas no coinciden');
        }

        if (!formData.securityAnswer) {
            return setError('Por favor responde la pregunta de seguridad');
        }

        setError('');
        setSuccess('');
        setLoading(true);

        try {
            const response = await fetch("http://localhost:5000/api/usuarios", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    nombre: formData.nombre,
                    telefono: formData.telefono,
                    email: formData.email,
                    password: formData.password,
                    sexo: formData.sexo,
                    edad: parseInt(formData.edad),
                    recuperacion: {
                        pregunta: formData.securityQuestion, // Aquí se envía el ObjectId
                        respuesta: formData.securityAnswer
                    },
                    rol: formData.userType
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Error al registrar usuario");
            }

            setSuccess("¡Registro exitoso! Redirigiendo...");
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
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
                            Regístrate en Huasteca Hidalguense
                        </h2>
                        {error && <Alert variant="danger">{error}</Alert>}
                        {success && <Alert variant="success">{success}</Alert>}
                        <Form onSubmit={handleSubmit}>
                            <Form.Group id="nombre" className="mb-3">
                                <Form.Label>Nombre Completo</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="nombre"
                                    required
                                    value={formData.nombre}
                                    onChange={handleChange}
                                    style={{ borderColor: '#0FA89C' }}
                                />
                            </Form.Group>

                            <Form.Group id="telefono" className="mb-3">
                                <Form.Label>Teléfono</Form.Label>
                                <Form.Control
                                    type="tel"
                                    name="telefono"
                                    required
                                    value={formData.telefono}
                                    onChange={handleChange}
                                    style={{ borderColor: '#0FA89C' }}
                                    placeholder="Ej. 7711234567"
                                />
                            </Form.Group>

                            <Form.Group id="email" className="mb-3">
                                <Form.Label>Correo Electrónico</Form.Label>
                                <Form.Control
                                    type="email"
                                    name="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    style={{ borderColor: '#0FA89C' }}
                                />
                            </Form.Group>

                            <Form.Group id="sexo" className="mb-3">
                                <Form.Label>Sexo</Form.Label>
                                <Form.Select
                                    name="sexo"
                                    value={formData.sexo}
                                    onChange={handleChange}
                                    required
                                    style={{ borderColor: '#0FA89C' }}
                                >
                                    <option value="">Selecciona una opción</option>
                                    {sexoOptions.map((option, index) => (
                                        <option key={index} value={option}>{option}</option>
                                    ))}
                                </Form.Select>
                            </Form.Group>

                            <Form.Group id="edad" className="mb-3">
                                <Form.Label>Edad</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="edad"
                                    required
                                    min="18"
                                    value={formData.edad}
                                    onChange={handleChange}
                                    style={{ borderColor: '#0FA89C' }}
                                />
                            </Form.Group>

                            <Form.Group id="userType" className="mb-3">
                                <Form.Label>Tipo de Usuario</Form.Label>
                                <Form.Select
                                    name="userType"
                                    value={formData.userType}
                                    onChange={handleChange}
                                    required
                                    style={{ borderColor: '#0FA89C' }}
                                >
                                    {userTypes.map((type, index) => (
                                        <option key={index} value={type}>
                                            {type === 'turista' ? 'Turista' : 'Miembro de la Comunidad'}
                                        </option>
                                    ))}
                                </Form.Select>
                            </Form.Group>

                            <Form.Group id="password" className="mb-3">
                                <Form.Label>Contraseña</Form.Label>
                                <InputGroup>
                                    <Form.Control
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        required
                                        minLength="6"
                                        value={formData.password}
                                        onChange={handleChange}
                                        style={{ borderColor: '#0FA89C' }}
                                    />
                                    <InputGroup.Text 
                                        style={{ cursor: 'pointer', backgroundColor: 'white', borderColor: '#0FA89C' }}
                                        onClick={togglePasswordVisibility}
                                    >
                                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                                    </InputGroup.Text>
                                </InputGroup>
                                <Form.Text className="text-muted">
                                    La contraseña debe tener al menos 6 caracteres.
                                </Form.Text>
                            </Form.Group>

                            <Form.Group id="confirmPassword" className="mb-3">
                                <Form.Label>Confirmar Contraseña</Form.Label>
                                <InputGroup>
                                    <Form.Control
                                        type={showConfirmPassword ? "text" : "password"}
                                        name="confirmPassword"
                                        required
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
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

                            <Form.Group id="securityQuestion" className="mb-3">
                                <Form.Label>Pregunta de Seguridad</Form.Label>
                                {loadingQuestions ? (
                                    <Form.Control as="select" disabled>
                                        <option>Cargando preguntas...</option>
                                    </Form.Control>
                                ) : (
                                    <Form.Select
                                        name="securityQuestion"
                                        value={formData.securityQuestion}
                                        onChange={handleChange}
                                        required
                                        style={{ borderColor: '#0FA89C' }}
                                    >
                                        <option value="">Selecciona una pregunta</option>
                                        {securityQuestions.map((question) => (
                                            <option key={question._id} value={question._id}>
                                                {question.pregunta}
                                            </option>
                                        ))}
                                    </Form.Select>
                                )}
                                <Form.Text className="text-muted">
                                    Esta pregunta te ayudará a recuperar tu cuenta si olvidas tu contraseña.
                                </Form.Text>
                            </Form.Group>

                            <Form.Group id="securityAnswer" className="mb-3">
                                <Form.Label>Respuesta de Seguridad</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="securityAnswer"
                                    required
                                    value={formData.securityAnswer}
                                    onChange={handleChange}
                                    style={{ borderColor: '#0FA89C' }}
                                />
                            </Form.Group>

                            <Button
                                disabled={loading || loadingQuestions}
                                className="w-100 mt-3"
                                type="submit"
                                style={{
                                    backgroundColor: '#1E8546',
                                    borderColor: '#1E8546',
                                    fontWeight: 'bold'
                                }}
                            >
                                {loading ? 'Registrando...' : 'Registrarse'}
                            </Button>
                        </Form>
                    </Card.Body>
                </Card>
                <div className="w-100 text-center mt-2">
                    ¿Ya tienes una cuenta?{' '}
                    <a
                        href="/login"
                        style={{
                            color: '#9A1E47',
                            fontWeight: 'bold'
                        }}
                    >
                        Inicia Sesión
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

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        userType: 'tourist',
        securityQuestion: '¿Cuál es el nombre de tu primera mascota?', // Default question
        securityAnswer: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const securityQuestions = [
        '¿Cuál es el nombre de tu primera mascota?',
        '¿Cuál es el nombre de tu escuela primaria?',
        '¿Cuál es el nombre de tu ciudad natal?',
        '¿Cuál es el nombre de tu mejor amigo de la infancia?'
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            return setError('Las contraseñas no coinciden');
        }

        if (!formData.securityAnswer) {
            return setError('Por favor responde la pregunta de seguridad');
        }

        setError('');
        setLoading(true);

        try {
            // Registration logic would go here
            setTimeout(() => {
                setSuccess('¡Registro exitoso! Redirigiendo...');
                setTimeout(() => {
                    navigate('/login');
                }, 2000);
            }, 1000);
        } catch (err) {
            setError('Error al registrar. Por favor intenta nuevamente.');
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
                            Regístrate en Huasteca Hidalguense
                        </h2>
                        {error && <Alert variant="danger">{error}</Alert>}
                        {success && <Alert variant="success">{success}</Alert>}
                        <Form onSubmit={handleSubmit}>
                            <Form.Group id="name" className="mb-3">
                                <Form.Label>Nombre Completo</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="name"
                                    required
                                    value={formData.name}
                                    onChange={handleChange}
                                    style={{ borderColor: '#0FA89C' }} // Turquesa Agua border
                                />
                            </Form.Group>

                            <Form.Group id="email" className="mb-3">
                                <Form.Label>Correo Electrónico</Form.Label>
                                <Form.Control
                                    type="email"
                                    name="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    style={{ borderColor: '#0FA89C' }} // Turquesa Agua border
                                />
                            </Form.Group>

                            <Form.Group id="userType" className="mb-3">
                                <Form.Label>Tipo de Usuario</Form.Label>
                                <Form.Select
                                    name="userType"
                                    value={formData.userType}
                                    onChange={handleChange}
                                    style={{ borderColor: '#0FA89C' }} // Turquesa Agua border
                                >
                                    <option value="tourist">Turista</option>
                                    <option value="local">Miembro de la Comunidad</option>
                                </Form.Select>
                                <Form.Text className="text-muted">
                                    {formData.userType === 'local' ?
                                        'Como miembro de la comunidad podrás ofrecer servicios y productos.' :
                                        'Como turista podrás descubrir experiencias auténticas.'}
                                </Form.Text>
                            </Form.Group>

                            <Form.Group id="password" className="mb-3">
                                <Form.Label>Contraseña</Form.Label>
                                <Form.Control
                                    type="password"
                                    name="password"
                                    required
                                    value={formData.password}
                                    onChange={handleChange}
                                    style={{ borderColor: '#0FA89C' }} // Turquesa Agua border
                                />
                                <Form.Text className="text-muted">
                                    La contraseña debe tener al menos 6 caracteres.
                                </Form.Text>
                            </Form.Group>

                            <Form.Group id="confirmPassword" className="mb-3">
                                <Form.Label>Confirmar Contraseña</Form.Label>
                                <Form.Control
                                    type="password"
                                    name="confirmPassword"
                                    required
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    style={{ borderColor: '#0FA89C' }} // Turquesa Agua border
                                />
                            </Form.Group>

                            {/* Security Question Section */}
                            <Form.Group id="securityQuestion" className="mb-3">
                                <Form.Label>Pregunta de Seguridad</Form.Label>
                                <Form.Select
                                    name="securityQuestion"
                                    value={formData.securityQuestion}
                                    onChange={handleChange}
                                    style={{ borderColor: '#0FA89C' }} // Turquesa Agua border
                                >
                                    {securityQuestions.map((question, index) => (
                                        <option key={index} value={question}>{question}</option>
                                    ))}
                                </Form.Select>
                                <Form.Text className="text-muted">
                                    Esta pregunta te ayudará a recuperar tu cuenta si olvidas tu contraseña.
                                </Form.Text>
                            </Form.Group>

                            <Form.Group id="securityAnswer" className="mb-3">
                                <Form.Label>Respuesta de Seguridad</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="securityAnswer"
                                    required
                                    value={formData.securityAnswer}
                                    onChange={handleChange}
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
                                {loading ? 'Registrando...' : 'Registrarse'}
                            </Button>
                        </Form>
                    </Card.Body>
                </Card>
                <div className="w-100 text-center mt-2">
                    ¿Ya tienes una cuenta?{' '}
                    <a
                        href="/login"
                        style={{
                            color: '#9A1E47', // Rojo Guinda text
                            fontWeight: 'bold'
                        }}
                    >
                        Inicia Sesión
                    </a>
                </div>
            </div>
        </Container>
    );
};

>>>>>>> 39e792a0febff33491eff80f548ffaf809d93736
export default Register;