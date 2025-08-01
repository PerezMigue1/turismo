// src/screens/ResponderEncuesta.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Form, Alert, Spinner, ProgressBar } from 'react-bootstrap';
import axios from 'axios';
import { FaArrowLeft, FaCheck, FaTimes, FaClipboardList, FaClock } from 'react-icons/fa';

const ResponderEncuesta = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [encuesta, setEncuesta] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [respuestas, setRespuestas] = useState({});
    const [preguntaActual, setPreguntaActual] = useState(0);
    const [enviando, setEnviando] = useState(false);
    const [tiempoInicio] = useState(Date.now());

    useEffect(() => {
        const fetchEncuesta = async () => {
            try {
                const response = await axios.get(`https://backend-iota-seven-19.vercel.app/api/encuestas/public/${id}`);
                if (response.data.success) {
                    setEncuesta(response.data.data);
                    // Inicializar respuestas vacías
                    const respuestasIniciales = {};
                    response.data.data.preguntas.forEach((pregunta, index) => {
                        respuestasIniciales[index] = {
                            pregunta_id: pregunta.orden,
                            pregunta: pregunta.pregunta,
                            tipo: pregunta.tipo,
                            respuesta: null,
                            opciones_seleccionadas: [],
                            texto_respuesta: '',
                            valor_numerico: null
                        };
                    });
                    setRespuestas(respuestasIniciales);
                } else {
                    setError(response.data.message || 'Error al cargar la encuesta');
                }
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchEncuesta();
    }, [id]);

    const handleRespuesta = (preguntaIndex, valor, tipo = 'texto') => {
        setRespuestas(prev => ({
            ...prev,
            [preguntaIndex]: {
                ...prev[preguntaIndex],
                respuesta: valor,
                ...(tipo === 'opcion_unica' && { opciones_seleccionadas: [valor] }),
                ...(tipo === 'opcion_multiple' && { opciones_seleccionadas: valor }),
                ...(tipo === 'texto' && { texto_respuesta: valor }),
                ...(tipo === 'escala' && { valor_numerico: parseInt(valor) })
            }
        }));
    };

    const handleOpcionMultiple = (preguntaIndex, opcion, checked) => {
        const preguntaActual = respuestas[preguntaIndex];
        let opcionesSeleccionadas = preguntaActual.opciones_seleccionadas || [];

        if (checked) {
            opcionesSeleccionadas = [...opcionesSeleccionadas, opcion];
        } else {
            opcionesSeleccionadas = opcionesSeleccionadas.filter(o => o !== opcion);
        }

        setRespuestas(prev => ({
            ...prev,
            [preguntaIndex]: {
                ...prev[preguntaIndex],
                respuesta: opcionesSeleccionadas,
                opciones_seleccionadas: opcionesSeleccionadas
            }
        }));
    };

    const siguientePregunta = () => {
        if (preguntaActual < encuesta.preguntas.length - 1) {
            setPreguntaActual(preguntaActual + 1);
        }
    };

    const preguntaAnterior = () => {
        if (preguntaActual > 0) {
            setPreguntaActual(preguntaActual - 1);
        }
    };

    const enviarEncuesta = async () => {
        setEnviando(true);
        try {
            const tiempoCompletado = Math.round((Date.now() - tiempoInicio) / 1000);
            const respuestasArray = Object.values(respuestas);

            const response = await axios.post('https://backend-iota-seven-19.vercel.app/api/encuestas/public/respuesta', {
                encuesta_id: id,
                respuestas: respuestasArray,
                tiempoCompletado,
                comentarios_adicionales: ''
            });

            if (response.data.success) {
                alert('¡Gracias por participar en nuestra encuesta!');
                navigate('/encuestas');
            }
        } catch (error) {
            alert('Error al enviar la encuesta: ' + (error.response?.data?.message || error.message));
        } finally {
            setEnviando(false);
        }
    };

    const renderPregunta = (pregunta, index) => {
        const respuestaActual = respuestas[index];

        switch (pregunta.tipo) {
            case 'opcion_unica':
                return (
                    <div>
                        {pregunta.opciones.map((opcion, opcionIndex) => (
                            <Form.Check
                                key={opcionIndex}
                                type="radio"
                                id={`pregunta-${index}-opcion-${opcionIndex}`}
                                name={`pregunta-${index}`}
                                label={opcion}
                                checked={respuestaActual?.opciones_seleccionadas?.includes(opcion)}
                                onChange={() => handleRespuesta(index, opcion, 'opcion_unica')}
                                style={{ marginBottom: '10px' }}
                            />
                        ))}
                    </div>
                );

            case 'opcion_multiple':
                return (
                    <div>
                        {pregunta.opciones.map((opcion, opcionIndex) => (
                            <Form.Check
                                key={opcionIndex}
                                type="checkbox"
                                id={`pregunta-${index}-opcion-${opcionIndex}`}
                                label={opcion}
                                checked={respuestaActual?.opciones_seleccionadas?.includes(opcion)}
                                onChange={(e) => handleOpcionMultiple(index, opcion, e.target.checked)}
                                style={{ marginBottom: '10px' }}
                            />
                        ))}
                    </div>
                );

            case 'texto_corto':
                return (
                    <Form.Control
                        type="text"
                        placeholder="Escribe tu respuesta..."
                        value={respuestaActual?.texto_respuesta || ''}
                        onChange={(e) => handleRespuesta(index, e.target.value, 'texto')}
                        maxLength={200}
                    />
                );

            case 'texto_largo':
                return (
                    <Form.Control
                        as="textarea"
                        rows={4}
                        placeholder="Escribe tu respuesta detallada..."
                        value={respuestaActual?.texto_respuesta || ''}
                        onChange={(e) => handleRespuesta(index, e.target.value, 'texto')}
                        maxLength={1000}
                    />
                );

            case 'escala_1_5':
                return (
                    <div className="d-flex justify-content-between align-items-center">
                        {[1, 2, 3, 4, 5].map((valor) => (
                            <Button
                                key={valor}
                                variant={respuestaActual?.valor_numerico === valor ? 'primary' : 'outline-primary'}
                                onClick={() => handleRespuesta(index, valor, 'escala')}
                                style={{ width: '60px', height: '60px', borderRadius: '50%' }}
                            >
                                {valor}
                            </Button>
                        ))}
                    </div>
                );

            case 'escala_1_10':
                return (
                    <div className="d-flex justify-content-between align-items-center flex-wrap">
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((valor) => (
                            <Button
                                key={valor}
                                variant={respuestaActual?.valor_numerico === valor ? 'primary' : 'outline-primary'}
                                onClick={() => handleRespuesta(index, valor, 'escala')}
                                style={{ width: '50px', height: '50px', borderRadius: '50%', margin: '2px' }}
                            >
                                {valor}
                            </Button>
                        ))}
                    </div>
                );

            default:
                return <p>Tipo de pregunta no soportado</p>;
        }
    };

    if (loading) {
        return (
            <Container style={{ backgroundColor: '#FDF2E0', padding: '30px 0', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Spinner animation="border" variant="primary" />
            </Container>
        );
    }

    if (error) {
        return (
            <Container style={{ backgroundColor: '#FDF2E0', padding: '30px 0', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Alert variant="danger">
                    Error al cargar la encuesta: {error}
                    <Button variant="link" onClick={() => navigate('/encuestas')}>Volver a encuestas</Button>
                </Alert>
            </Container>
        );
    }

    if (!encuesta) {
        return (
            <Container style={{ backgroundColor: '#FDF2E0', padding: '30px 0', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Alert variant="warning">
                    Encuesta no encontrada
                    <Button variant="link" onClick={() => navigate('/encuestas')}>Volver a encuestas</Button>
                </Alert>
            </Container>
        );
    }

    const pregunta = encuesta.preguntas[preguntaActual];
    const progreso = ((preguntaActual + 1) / encuesta.preguntas.length) * 100;
    const esUltimaPregunta = preguntaActual === encuesta.preguntas.length - 1;

    return (
        <Container style={{ backgroundColor: '#FDF2E0', padding: '30px 0', minHeight: '100vh' }}>
            <Button
                variant="link"
                onClick={() => navigate('/encuestas')}
                style={{ color: '#9A1E47', textDecoration: 'none', marginBottom: '20px' }}
            >
                <FaArrowLeft /> Volver a encuestas
            </Button>

            <Row className="justify-content-center">
                <Col md={8}>
                    <Card style={{ borderColor: '#0FA89C', boxShadow: '0 4px 12px rgba(154, 30, 71, 0.15)' }}>
                        <Card.Header style={{ backgroundColor: '#FEF8ED', borderBottom: '2px solid #F28B27' }}>
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <h3 style={{ color: '#9A1E47', margin: 0 }}>{encuesta.titulo}</h3>
                                    <p style={{ color: '#666', margin: '5px 0 0 0' }}>{encuesta.descripcion}</p>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ color: '#F28B27', fontSize: '0.9rem' }}>
                                        <FaClipboardList style={{ marginRight: '5px' }} />
                                        Pregunta {preguntaActual + 1} de {encuesta.preguntas.length}
                                    </div>
                                    <div style={{ color: '#1E8546', fontSize: '0.9rem' }}>
                                        <FaClock style={{ marginRight: '5px' }} />
                                        {Math.round((Date.now() - tiempoInicio) / 1000)}s
                                    </div>
                                </div>
                            </div>
                        </Card.Header>

                        <Card.Body style={{ backgroundColor: '#FEF8ED', padding: '30px' }}>
                            {/* Barra de progreso */}
                            <ProgressBar 
                                now={progreso} 
                                style={{ marginBottom: '30px', height: '10px' }}
                                variant="success"
                            />

                            {/* Pregunta actual */}
                            <div style={{ marginBottom: '30px' }}>
                                <h4 style={{ color: '#9A1E47', marginBottom: '20px' }}>
                                    {pregunta.pregunta}
                                    {pregunta.requerida && <span style={{ color: 'red' }}> *</span>}
                                </h4>

                                {renderPregunta(pregunta, preguntaActual)}
                            </div>

                            {/* Navegación */}
                            <div className="d-flex justify-content-between">
                                <Button
                                    variant="outline-secondary"
                                    onClick={preguntaAnterior}
                                    disabled={preguntaActual === 0}
                                >
                                    Anterior
                                </Button>

                                {esUltimaPregunta ? (
                                    <Button
                                        variant="success"
                                        onClick={enviarEncuesta}
                                        disabled={enviando}
                                    >
                                        {enviando ? (
                                            <>
                                                <Spinner animation="border" size="sm" style={{ marginRight: '5px' }} />
                                                Enviando...
                                            </>
                                        ) : (
                                            <>
                                                <FaCheck style={{ marginRight: '5px' }} />
                                                Enviar Encuesta
                                            </>
                                        )}
                                    </Button>
                                ) : (
                                    <Button
                                        variant="primary"
                                        onClick={siguientePregunta}
                                    >
                                        Siguiente
                                    </Button>
                                )}
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default ResponderEncuesta; 