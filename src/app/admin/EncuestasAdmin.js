// src/admin/EncuestasAdmin.js
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Table, Modal, Form, Alert, Badge, Spinner } from 'react-bootstrap';
import { FaPlus, FaEdit, FaTrash, FaEye, FaChartBar, FaClipboardList, FaCalendarAlt, FaUsers } from 'react-icons/fa';
import axios from 'axios';
import { useAuth } from '../Navigation/AuthContext';

const EncuestasAdmin = () => {
    const { currentUser } = useAuth();
    const [encuestas, setEncuestas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [editingEncuesta, setEditingEncuesta] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [encuestaToDelete, setEncuestaToDelete] = useState(null);
    const [showStatsModal, setShowStatsModal] = useState(false);
    const [selectedEncuesta, setSelectedEncuesta] = useState(null);
    const [stats, setStats] = useState(null);

    const [formData, setFormData] = useState({
        titulo: '',
        descripcion: '',
        categoria: 'general',
        preguntas: [],
        fecha_inicio: new Date().toISOString().split('T')[0],
        fecha_fin: '',
        estado: 'borrador',
        publica: true,
        permitir_anonimos: true,
        max_respuestas: 0,
        tags: '',
        imagen: '',
        color_tema: '#9A1E47'
    });

    useEffect(() => {
        if (currentUser) {
            cargarEncuestas();
        }
    }, [currentUser]);

    const cargarEncuestas = async () => {
        try {
            const token = currentUser.token;
            const response = await fetch('https://backend-iota-seven-19.vercel.app/api/encuestas', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                if (data.success) {
                    setEncuestas(data.data);
                } else {
                    setError(data.message || 'Error al cargar las encuestas');
                }
            } else {
                setError('Error al cargar las encuestas');
            }
        } catch (error) {
            setError('Error de conexión');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = currentUser.token;
            const dataToSend = {
                ...formData,
                tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
                preguntas: formData.preguntas.map((pregunta, index) => ({
                    ...pregunta,
                    orden: index
                }))
            };

            const url = editingEncuesta 
                ? `https://backend-iota-seven-19.vercel.app/api/encuestas/${editingEncuesta._id}`
                : 'https://backend-iota-seven-19.vercel.app/api/encuestas';
            
            const method = editingEncuesta ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(dataToSend)
            });

            if (response.ok) {
                const result = await response.json();
                if (result.success) {
                    setShowModal(false);
                    setEditingEncuesta(null);
                    resetForm();
                    cargarEncuestas();
                    alert(editingEncuesta ? 'Encuesta actualizada exitosamente' : 'Encuesta creada exitosamente');
                } else {
                    alert(result.message || 'Error al guardar la encuesta');
                }
            } else {
                alert('Error al guardar la encuesta');
            }
        } catch (error) {
            alert('Error de conexión');
        }
    };

    const handleDelete = async () => {
        try {
            const token = currentUser.token;
            const response = await fetch(`https://backend-iota-seven-19.vercel.app/api/encuestas/${encuestaToDelete._id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const result = await response.json();
                if (result.success) {
                    setShowDeleteModal(false);
                    setEncuestaToDelete(null);
                    cargarEncuestas();
                    alert('Encuesta eliminada exitosamente');
                } else {
                    alert(result.message || 'Error al eliminar la encuesta');
                }
            } else {
                alert('Error al eliminar la encuesta');
            }
        } catch (error) {
            alert('Error de conexión');
        }
    };

    const cargarEstadisticas = async (encuestaId) => {
        try {
            const token = currentUser.token;
            const response = await fetch(`https://backend-iota-seven-19.vercel.app/api/encuestas/${encuestaId}/estadisticas`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                if (data.success) {
                    setStats(data.data);
                }
            }
        } catch (error) {
            console.error('Error al cargar estadísticas:', error);
        }
    };

    const resetForm = () => {
        setFormData({
            titulo: '',
            descripcion: '',
            categoria: 'general',
            preguntas: [],
            fecha_inicio: new Date().toISOString().split('T')[0],
            fecha_fin: '',
            estado: 'borrador',
            publica: true,
            permitir_anonimos: true,
            max_respuestas: 0,
            tags: '',
            imagen: '',
            color_tema: '#9A1E47'
        });
    };

    const agregarPregunta = () => {
        setFormData(prev => ({
            ...prev,
            preguntas: [...prev.preguntas, {
                pregunta: '',
                tipo: 'opcion_unica',
                opciones: [''],
                requerida: true,
                orden: prev.preguntas.length
            }]
        }));
    };

    const eliminarPregunta = (index) => {
        setFormData(prev => ({
            ...prev,
            preguntas: prev.preguntas.filter((_, i) => i !== index)
        }));
    };

    const actualizarPregunta = (index, campo, valor) => {
        setFormData(prev => ({
            ...prev,
            preguntas: prev.preguntas.map((pregunta, i) => 
                i === index ? { ...pregunta, [campo]: valor } : pregunta
            )
        }));
    };

    const agregarOpcion = (preguntaIndex) => {
        setFormData(prev => ({
            ...prev,
            preguntas: prev.preguntas.map((pregunta, i) => 
                i === preguntaIndex 
                    ? { ...pregunta, opciones: [...pregunta.opciones, ''] }
                    : pregunta
            )
        }));
    };

    const eliminarOpcion = (preguntaIndex, opcionIndex) => {
        setFormData(prev => ({
            ...prev,
            preguntas: prev.preguntas.map((pregunta, i) => 
                i === preguntaIndex 
                    ? { ...pregunta, opciones: pregunta.opciones.filter((_, j) => j !== opcionIndex) }
                    : pregunta
            )
        }));
    };

    const actualizarOpcion = (preguntaIndex, opcionIndex, valor) => {
        setFormData(prev => ({
            ...prev,
            preguntas: prev.preguntas.map((pregunta, i) => 
                i === preguntaIndex 
                    ? { 
                        ...pregunta, 
                        opciones: pregunta.opciones.map((opcion, j) => 
                            j === opcionIndex ? valor : opcion
                        )
                    }
                    : pregunta
            )
        }));
    };

    const getEstadoColor = (estado) => {
        const colores = {
            'activa': 'success',
            'inactiva': 'danger',
            'borrador': 'warning'
        };
        return colores[estado] || 'secondary';
    };

    const getCategoriaLabel = (categoria) => {
        const labels = {
            'turismo': 'Turismo',
            'servicios': 'Servicios',
            'experiencia_usuario': 'Experiencia de Usuario',
            'satisfaccion': 'Satisfacción',
            'mejoras': 'Mejoras',
            'general': 'General'
        };
        return labels[categoria] || categoria;
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <Spinner animation="border" variant="primary" />
            </div>
        );
    }

    return (
        <Container fluid>
            <Row className="mb-4">
                <Col>
                    <div className="d-flex justify-content-between align-items-center">
                        <h2 style={{ color: '#9A1E47' }}>
                            <FaClipboardList style={{ marginRight: '10px' }} />
                            Gestión de Encuestas
                        </h2>
                        <Button
                            variant="success"
                            onClick={() => {
                                setEditingEncuesta(null);
                                resetForm();
                                setShowModal(true);
                            }}
                        >
                            <FaPlus style={{ marginRight: '5px' }} />
                            Nueva Encuesta
                        </Button>
                    </div>
                </Col>
            </Row>

            {error && (
                <Alert variant="danger" onClose={() => setError(null)} dismissible>
                    {error}
                </Alert>
            )}

            <Card>
                <Card.Body>
                    <Table responsive striped hover>
                        <thead>
                            <tr>
                                <th>Título</th>
                                <th>Categoría</th>
                                <th>Estado</th>
                                <th>Fecha Fin</th>
                                <th>Respuestas</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {encuestas.map((encuesta) => (
                                <tr key={encuesta._id}>
                                    <td>
                                        <strong>{encuesta.titulo}</strong>
                                        <br />
                                        <small className="text-muted">{encuesta.descripcion.substring(0, 50)}...</small>
                                    </td>
                                    <td>
                                        <Badge bg="info">{getCategoriaLabel(encuesta.categoria)}</Badge>
                                    </td>
                                    <td>
                                        <Badge bg={getEstadoColor(encuesta.estado)}>
                                            {encuesta.estado.charAt(0).toUpperCase() + encuesta.estado.slice(1)}
                                        </Badge>
                                    </td>
                                    <td>
                                        <FaCalendarAlt style={{ marginRight: '5px', color: '#1E8546' }} />
                                        {new Date(encuesta.fecha_fin).toLocaleDateString()}
                                    </td>
                                    <td>
                                        <FaUsers style={{ marginRight: '5px', color: '#F28B27' }} />
                                        {encuesta.respuestas_actuales || 0}
                                    </td>
                                    <td>
                                        <Button
                                            variant="outline-primary"
                                            size="sm"
                                            className="me-2"
                                            onClick={() => {
                                                setSelectedEncuesta(encuesta);
                                                cargarEstadisticas(encuesta._id);
                                                setShowStatsModal(true);
                                            }}
                                        >
                                            <FaChartBar />
                                        </Button>
                                        <Button
                                            variant="outline-warning"
                                            size="sm"
                                            className="me-2"
                                            onClick={() => {
                                                setEditingEncuesta(encuesta);
                                                setFormData({
                                                    ...encuesta,
                                                    tags: encuesta.tags ? encuesta.tags.join(', ') : ''
                                                });
                                                setShowModal(true);
                                            }}
                                        >
                                            <FaEdit />
                                        </Button>
                                        <Button
                                            variant="outline-danger"
                                            size="sm"
                                            onClick={() => {
                                                setEncuestaToDelete(encuesta);
                                                setShowDeleteModal(true);
                                            }}
                                        >
                                            <FaTrash />
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>

            {/* Modal para crear/editar encuesta */}
            <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>
                        {editingEncuesta ? 'Editar Encuesta' : 'Nueva Encuesta'}
                    </Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleSubmit}>
                    <Modal.Body>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Título *</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={formData.titulo}
                                        onChange={(e) => setFormData({...formData, titulo: e.target.value})}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Categoría *</Form.Label>
                                    <Form.Select
                                        value={formData.categoria}
                                        onChange={(e) => setFormData({...formData, categoria: e.target.value})}
                                    >
                                        <option value="turismo">Turismo</option>
                                        <option value="servicios">Servicios</option>
                                        <option value="experiencia_usuario">Experiencia de Usuario</option>
                                        <option value="satisfaccion">Satisfacción</option>
                                        <option value="mejoras">Mejoras</option>
                                        <option value="general">General</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                        </Row>

                        <Form.Group className="mb-3">
                            <Form.Label>Descripción *</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                value={formData.descripcion}
                                onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
                                required
                            />
                        </Form.Group>

                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Fecha de Inicio *</Form.Label>
                                    <Form.Control
                                        type="date"
                                        value={formData.fecha_inicio}
                                        onChange={(e) => setFormData({...formData, fecha_inicio: e.target.value})}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Fecha de Fin *</Form.Label>
                                    <Form.Control
                                        type="date"
                                        value={formData.fecha_fin}
                                        onChange={(e) => setFormData({...formData, fecha_fin: e.target.value})}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row>
                            <Col md={4}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Estado</Form.Label>
                                    <Form.Select
                                        value={formData.estado}
                                        onChange={(e) => setFormData({...formData, estado: e.target.value})}
                                    >
                                        <option value="borrador">Borrador</option>
                                        <option value="activa">Activa</option>
                                        <option value="inactiva">Inactiva</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col md={4}>
                                <Form.Group className="mb-3">
                                    <Form.Check
                                        type="checkbox"
                                        label="Pública"
                                        checked={formData.publica}
                                        onChange={(e) => setFormData({...formData, publica: e.target.checked})}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={4}>
                                <Form.Group className="mb-3">
                                    <Form.Check
                                        type="checkbox"
                                        label="Permitir anónimos"
                                        checked={formData.permitir_anonimos}
                                        onChange={(e) => setFormData({...formData, permitir_anonimos: e.target.checked})}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Form.Group className="mb-3">
                            <Form.Label>Tags (separados por comas)</Form.Label>
                            <Form.Control
                                type="text"
                                value={formData.tags}
                                onChange={(e) => setFormData({...formData, tags: e.target.value})}
                                placeholder="turismo, satisfacción, mejora"
                            />
                        </Form.Group>

                        <hr />

                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h5>Preguntas</h5>
                            <Button variant="outline-primary" size="sm" onClick={agregarPregunta}>
                                <FaPlus /> Agregar Pregunta
                            </Button>
                        </div>

                        {formData.preguntas.map((pregunta, index) => (
                            <Card key={index} className="mb-3" style={{ border: '1px solid #ddd' }}>
                                <Card.Body>
                                    <Row>
                                        <Col md={8}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Pregunta {index + 1} *</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    value={pregunta.pregunta}
                                                    onChange={(e) => actualizarPregunta(index, 'pregunta', e.target.value)}
                                                    required
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col md={4}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Tipo</Form.Label>
                                                <Form.Select
                                                    value={pregunta.tipo}
                                                    onChange={(e) => actualizarPregunta(index, 'tipo', e.target.value)}
                                                >
                                                    <option value="opcion_unica">Opción Única</option>
                                                    <option value="opcion_multiple">Opción Múltiple</option>
                                                    <option value="texto_corto">Texto Corto</option>
                                                    <option value="texto_largo">Texto Largo</option>
                                                    <option value="escala_1_5">Escala 1-5</option>
                                                    <option value="escala_1_10">Escala 1-10</option>
                                                </Form.Select>
                                            </Form.Group>
                                        </Col>
                                    </Row>

                                    {(pregunta.tipo === 'opcion_unica' || pregunta.tipo === 'opcion_multiple') && (
                                        <div>
                                            <Form.Label>Opciones</Form.Label>
                                            {pregunta.opciones.map((opcion, opcionIndex) => (
                                                <div key={opcionIndex} className="d-flex mb-2">
                                                    <Form.Control
                                                        type="text"
                                                        value={opcion}
                                                        onChange={(e) => actualizarOpcion(index, opcionIndex, e.target.value)}
                                                        placeholder={`Opción ${opcionIndex + 1}`}
                                                        className="me-2"
                                                    />
                                                    <Button
                                                        variant="outline-danger"
                                                        size="sm"
                                                        onClick={() => eliminarOpcion(index, opcionIndex)}
                                                        disabled={pregunta.opciones.length <= 1}
                                                    >
                                                        <FaTrash />
                                                    </Button>
                                                </div>
                                            ))}
                                            <Button
                                                variant="outline-primary"
                                                size="sm"
                                                onClick={() => agregarOpcion(index)}
                                            >
                                                <FaPlus /> Agregar Opción
                                            </Button>
                                        </div>
                                    )}

                                    <div className="d-flex justify-content-between align-items-center mt-3">
                                        <Form.Check
                                            type="checkbox"
                                            label="Pregunta requerida"
                                            checked={pregunta.requerida}
                                            onChange={(e) => actualizarPregunta(index, 'requerida', e.target.checked)}
                                        />
                                        <Button
                                            variant="outline-danger"
                                            size="sm"
                                            onClick={() => eliminarPregunta(index)}
                                        >
                                            <FaTrash /> Eliminar Pregunta
                                        </Button>
                                    </div>
                                </Card.Body>
                            </Card>
                        ))}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowModal(false)}>
                            Cancelar
                        </Button>
                        <Button variant="primary" type="submit">
                            {editingEncuesta ? 'Actualizar' : 'Crear'} Encuesta
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>

            {/* Modal de confirmación de eliminación */}
            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirmar Eliminación</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    ¿Estás seguro de que quieres eliminar la encuesta "{encuestaToDelete?.titulo}"?
                    Esta acción no se puede deshacer.
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
                        Cancelar
                    </Button>
                    <Button variant="danger" onClick={handleDelete}>
                        Eliminar
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Modal de estadísticas */}
            <Modal show={showStatsModal} onHide={() => setShowStatsModal(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Estadísticas - {selectedEncuesta?.titulo}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {stats ? (
                        <div>
                            <Row className="mb-4">
                                <Col md={4}>
                                    <Card className="text-center">
                                        <Card.Body>
                                            <h3>{stats.total_respuestas}</h3>
                                            <p>Total Respuestas</p>
                                        </Card.Body>
                                    </Card>
                                </Col>
                                <Col md={4}>
                                    <Card className="text-center">
                                        <Card.Body>
                                            <h3>{stats.tiempo_promedio}s</h3>
                                            <p>Tiempo Promedio</p>
                                        </Card.Body>
                                    </Card>
                                </Col>
                                <Col md={4}>
                                    <Card className="text-center">
                                        <Card.Body>
                                            <h3>{selectedEncuesta?.preguntas?.length || 0}</h3>
                                            <p>Total Preguntas</p>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            </Row>

                            <h5>Estadísticas por Pregunta</h5>
                            {stats.preguntas.map((pregunta, index) => (
                                <Card key={index} className="mb-3">
                                    <Card.Header>
                                        <strong>{pregunta.pregunta}</strong>
                                        <br />
                                        <small className="text-muted">
                                            Tipo: {pregunta.tipo} | Respuestas: {pregunta.total_respuestas}
                                        </small>
                                    </Card.Header>
                                    <Card.Body>
                                        {pregunta.tipo.includes('opcion') && (
                                            <div>
                                                {Object.entries(pregunta.opciones).map(([opcion, data]) => (
                                                    <div key={opcion} className="mb-2">
                                                        <div className="d-flex justify-content-between">
                                                            <span>{opcion}</span>
                                                            <span>{data.count} ({data.porcentaje}%)</span>
                                                        </div>
                                                        <div className="progress" style={{ height: '10px' }}>
                                                            <div 
                                                                className="progress-bar" 
                                                                style={{ width: `${data.porcentaje}%` }}
                                                            ></div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                        {pregunta.tipo.includes('escala') && (
                                            <div>
                                                <p>Promedio: {pregunta.promedio}</p>
                                                <p>Rango: {pregunta.min} - {pregunta.max}</p>
                                            </div>
                                        )}
                                        {pregunta.tipo.includes('texto') && (
                                            <div>
                                                <p>Respuestas de texto recibidas: {pregunta.respuestas_texto?.length || 0}</p>
                                            </div>
                                        )}
                                    </Card.Body>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center">
                            <Spinner animation="border" variant="primary" />
                            <p>Cargando estadísticas...</p>
                        </div>
                    )}
                </Modal.Body>
            </Modal>
        </Container>
    );
};

export default EncuestasAdmin; 