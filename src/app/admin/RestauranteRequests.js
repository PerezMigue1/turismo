import React, { useState, useEffect } from "react";
import axios from "axios";
import {
    Container, Table, Button, Modal, Badge, Alert, Form, Toast, Row, Col, Card, ButtonGroup, ProgressBar
} from "react-bootstrap";
import { FaCheck, FaTimes, FaEye, FaSpinner, FaFilter, FaChartBar, FaSync, FaImage, FaUtensils } from "react-icons/fa";

const RestauranteRequests = () => {
    const [publicaciones, setPublicaciones] = useState([]);
    const [publicacionSeleccionada, setPublicacionSeleccionada] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [accion, setAccion] = useState("");
    const [mensaje, setMensaje] = useState("");
    const [motivo, setMotivo] = useState("");
    const [toast, setToast] = useState({ show: false, mensaje: "", bg: "success" });
    const [loading, setLoading] = useState(false);
    const [filtroActual, setFiltroActual] = useState("todos");
    const [estadisticas, setEstadisticas] = useState({ total: 0, pendientes: 0, aprobadas: 0, rechazadas: 0 });
    const [publicacionesFiltradas, setPublicacionesFiltradas] = useState([]);
    const [showDetalleModal, setShowDetalleModal] = useState(false);
    const [platillos, setPlatillos] = useState([]);
    const [showPlatillosModal, setShowPlatillosModal] = useState(false);
    const [platilloAccion, setPlatilloAccion] = useState({});
    const [loadingPlatillo, setLoadingPlatillo] = useState(false);

    const customStyles = {
        primary: { backgroundColor: '#9A1E47', borderColor: '#9A1E47' },
        secondary: { backgroundColor: '#0FA89C', borderColor: '#0FA89C' },
        success: { backgroundColor: '#1E8546', borderColor: '#1E8546' },
        warning: { backgroundColor: '#F28B27', borderColor: '#F28B27' },
        danger: { backgroundColor: '#D24D1C', borderColor: '#D24D1C' },
        info: { backgroundColor: '#50C2C4', borderColor: '#50C2C4' },
        light: { backgroundColor: '#FDF2E0', borderColor: '#FDF2E0' }
    };

    const obtenerPublicaciones = async () => {
        try {
            const res = await axios.get("https://backend-iota-seven-19.vercel.app/api/publicaRestaurantes");
            setPublicaciones(res.data);
        } catch (error) {
            console.error("❌ Error al obtener publicaciones:", error);
        }
    };

    const obtenerEstadisticas = async () => {
        try {
            const res = await axios.get("https://backend-iota-seven-19.vercel.app/api/publicaRestaurantes/estadisticas");
            setEstadisticas(res.data.estadisticas || {
                total: publicaciones.length,
                pendientes: publicaciones.filter(p => p.estadoRevision === "pendiente").length,
                aprobadas: publicaciones.filter(p => p.estadoRevision === "aprobado").length,
                rechazadas: publicaciones.filter(p => p.estadoRevision === "rechazado").length
            });
        } catch (error) {
            setEstadisticas({
                total: publicaciones.length,
                pendientes: publicaciones.filter(p => p.estadoRevision === "pendiente").length,
                aprobadas: publicaciones.filter(p => p.estadoRevision === "aprobado").length,
                rechazadas: publicaciones.filter(p => p.estadoRevision === "rechazado").length
            });
        }
    };

    const filtrarPublicaciones = () => {
        let filtradas = [...publicaciones];
        if (filtroActual !== "todos") {
            filtradas = publicaciones.filter(pub => pub.estadoRevision === filtroActual);
        }
        setPublicacionesFiltradas(filtradas);
    };

    useEffect(() => { obtenerPublicaciones(); }, []);
    useEffect(() => { filtrarPublicaciones(); obtenerEstadisticas(); }, [publicaciones, filtroActual]);

    const mostrarToast = (mensaje, bg = "success") => {
        setToast({ show: true, mensaje, bg });
        setTimeout(() => { setToast({ show: false, mensaje: "", bg }); }, 3000);
    };

    const handleAccion = (publicacion, tipoAccion) => {
        setPublicacionSeleccionada(publicacion);
        setAccion(tipoAccion);
        setMensaje("");
        setMotivo("");
        setShowModal(true);
    };

    const aprobarORechazarPublicacion = async () => {
        if (!publicacionSeleccionada) return;
        setLoading(true);
        try {
            if (accion === "aprobar") {
                await axios.put(
                    `https://backend-iota-seven-19.vercel.app/api/publicaRestaurantes/${publicacionSeleccionada._id}/aprobar`,
                    { revisadoPor: "admin" }
                );
            } else {
                await axios.put(
                    `https://backend-iota-seven-19.vercel.app/api/publicaRestaurantes/${publicacionSeleccionada._id}/rechazar`,
                    { revisadoPor: "admin", motivoRechazo: motivo || "No especificado" }
                );
            }
            const notificacion = {
                idUsuario: publicacionSeleccionada.idUsuario,
                tipo: "publicacion",
                producto: publicacionSeleccionada.Nombre,
                estado: accion === "aprobar" ? "aprobado" : "rechazado",
                mensaje: mensaje,
                Motivo: accion === "rechazar" ? motivo : "",
                fecha: new Date()
            };
            await axios.post("https://backend-iota-seven-19.vercel.app/api/notificaciones", notificacion);
            mostrarToast(`Publicación ${accion === "aprobar" ? "aprobada" : "rechazada"} y notificación enviada`, "success");
            setShowModal(false);
            obtenerPublicaciones();
        } catch (error) {
            mostrarToast("Error al procesar la solicitud", "danger");
        } finally {
            setLoading(false);
        }
    };

    const abrirModalPlatillos = async (publicacion) => {
        setPublicacionSeleccionada(publicacion);
        setShowPlatillosModal(true);
        try {
            const res = await axios.get(`https://backend-iota-seven-19.vercel.app/api/comidaRestaurante/por-restaurante/${publicacion.idRestaurante}`);
            setPlatillos(res.data);
        } catch (error) {
            setPlatillos([]);
        }
    };

    const aprobarORechazarPlatillo = async (platillo, tipo) => {
        setPlatilloAccion({ id: platillo._id, loading: true });
        try {
            if (tipo === "aprobar") {
                await axios.post(`https://backend-iota-seven-19.vercel.app/api/publicaRestaurantes/platillo/${platillo._id}/aprobar`);
            } else {
                await axios.post(`https://backend-iota-seven-19.vercel.app/api/publicaRestaurantes/platillo/${platillo._id}/rechazar`);
            }
            mostrarToast(`Platillo ${tipo === "aprobar" ? "aprobado" : "rechazado"}`);
            const res = await axios.get(`https://backend-iota-seven-19.vercel.app/api/publicaRestaurantes/${publicacionSeleccionada._id}/detalle-con-platillos`);
            setPlatillos(res.data.platillos);
        } catch (error) {
            mostrarToast("Error al procesar el platillo", "danger");
        } finally {
            setPlatilloAccion({});
        }
    };

    return (
        <Container fluid className="py-4" style={customStyles.light}>
            <Row className="mb-4">
                <Col>
                    <h1 style={{ color: customStyles.primary.backgroundColor }}>
                        <strong>Publicaciones de Restaurantes</strong>
                    </h1>
                    <div style={{ width: '80px', height: '4px', backgroundColor: customStyles.secondary.backgroundColor, borderRadius: '2px' }}></div>
                </Col>
            </Row>
            {/* Panel de Estadísticas */}
            <Row className="mb-4">
                <Col>
                    <Card className="shadow-sm">
                        <Card.Header style={customStyles.info} className="text-white">
                            <FaChartBar className="me-2" /> Estadísticas
                        </Card.Header>
                        <Card.Body>
                            <Row>
                                <Col md={3} className="text-center">
                                    <h4 style={{ color: customStyles.primary.backgroundColor }}>{estadisticas.total}</h4>
                                    <small className="text-muted">Total</small>
                                </Col>
                                <Col md={3} className="text-center">
                                    <h4 style={{ color: customStyles.warning.backgroundColor }}>{estadisticas.pendientes}</h4>
                                    <small className="text-muted">Pendientes</small>
                                </Col>
                                <Col md={3} className="text-center">
                                    <h4 style={{ color: customStyles.success.backgroundColor }}>{estadisticas.aprobadas}</h4>
                                    <small className="text-muted">Aprobadas</small>
                                </Col>
                                <Col md={3} className="text-center">
                                    <h4 style={{ color: customStyles.danger.backgroundColor }}>{estadisticas.rechazadas}</h4>
                                    <small className="text-muted">Rechazadas</small>
                                </Col>
                            </Row>
                            {estadisticas.total > 0 && (
                                <ProgressBar className="mt-3">
                                    <ProgressBar variant="warning" now={(estadisticas.pendientes / estadisticas.total) * 100} label={`${Math.round((estadisticas.pendientes / estadisticas.total) * 100)}%`} />
                                    <ProgressBar variant="success" now={(estadisticas.aprobadas / estadisticas.total) * 100} label={`${Math.round((estadisticas.aprobadas / estadisticas.total) * 100)}%`} />
                                    <ProgressBar variant="danger" now={(estadisticas.rechazadas / estadisticas.total) * 100} label={`${Math.round((estadisticas.rechazadas / estadisticas.total) * 100)}%`} />
                                </ProgressBar>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            {/* Filtros */}
            <Row className="mb-4">
                <Col>
                    <Card className="shadow-sm">
                        <Card.Body>
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <FaFilter className="me-2" /> <strong>Filtros:</strong>
                                </div>
                                <ButtonGroup>
                                    <Button variant={filtroActual === "todos" ? "primary" : "outline-primary"} onClick={() => setFiltroActual("todos")} style={filtroActual === "todos" ? customStyles.primary : {}}>Todos ({publicaciones.length})</Button>
                                    <Button variant={filtroActual === "pendiente" ? "warning" : "outline-warning"} onClick={() => setFiltroActual("pendiente")} style={filtroActual === "pendiente" ? customStyles.warning : {}}>Pendientes ({publicaciones.filter(p => p.estadoRevision === "pendiente").length})</Button>
                                    <Button variant={filtroActual === "aprobado" ? "success" : "outline-success"} onClick={() => setFiltroActual("aprobado")} style={filtroActual === "aprobado" ? customStyles.success : {}}>Aprobadas ({publicaciones.filter(p => p.estadoRevision === "aprobado").length})</Button>
                                    <Button variant={filtroActual === "rechazado" ? "danger" : "outline-danger"} onClick={() => setFiltroActual("rechazado")} style={filtroActual === "rechazado" ? customStyles.danger : {}}>Rechazadas ({publicaciones.filter(p => p.estadoRevision === "rechazado").length})</Button>
                                </ButtonGroup>
                                <Button variant="outline-secondary" onClick={() => { obtenerPublicaciones(); obtenerEstadisticas(); }}><FaSync /></Button>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            {publicacionesFiltradas.length === 0 ? (
                <Alert variant="info" className="mt-3">
                    {filtroActual === "todos" ? "No hay publicaciones en el sistema." : `No hay publicaciones ${filtroActual} para mostrar.`}
                </Alert>
            ) : (
                <Card className="shadow-sm">
                    <Card.Body className="p-0">
                        <Table responsive hover className="mb-0">
                            <thead style={customStyles.secondary}>
                                <tr className="text-white">
                                    <th>Restaurante</th>
                                    <th>Usuario</th>
                                    <th className="text-center">Estado</th>
                                    <th className="text-center">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {publicacionesFiltradas.map((pub) => (
                                    <tr key={pub._id}>
                                        <td>
                                            <div className="fw-bold">{pub.Nombre}</div>
                                            <small className="text-muted">{pub.Categoria}</small>
                                        </td>
                                        <td className="align-middle">{pub.idUsuario}</td>
                                        <td className="text-center align-middle">
                                            <Badge bg={pub.estadoRevision === "pendiente" ? "warning" : pub.estadoRevision === "aprobado" ? "success" : pub.estadoRevision === "rechazado" ? "danger" : "secondary"}>{pub.estadoRevision || "Sin estado"}</Badge>
                                        </td>
                                        <td className="text-center align-middle">
                                            {pub.estadoRevision === "pendiente" && (
                                                <>
                                                    <Button variant="success" size="sm" className="me-2" onClick={() => handleAccion(pub, "aprobar")} style={customStyles.success}><FaCheck /> Aprobar</Button>
                                                    <Button variant="danger" size="sm" className="me-2" onClick={() => handleAccion(pub, "rechazar")} style={customStyles.danger}><FaTimes /> Rechazar</Button>
                                                </>
                                            )}
                                            <Button size="sm" onClick={() => { setPublicacionSeleccionada(pub); setShowDetalleModal(true); }} style={customStyles.warning}><FaEye /></Button>
                                            <Button size="sm" className="ms-2" onClick={() => abrirModalPlatillos(pub)} style={customStyles.info}><FaUtensils /> Platillos</Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </Card.Body>
                </Card>
            )}
            {/* Modal de Detalles de la Publicación */}
            <Modal show={showDetalleModal} onHide={() => setShowDetalleModal(false)} size="lg" centered>
                <Modal.Header closeButton style={customStyles.secondary}>
                    <Modal.Title className="text-white">Detalles del Restaurante</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {publicacionSeleccionada && (
                        <>
                            <Row>
                                <Col md={5}>
                                    <Card className="mb-4">
                                        <Card.Header style={customStyles.primary} className="text-white">Imágenes</Card.Header>
                                        <Card.Body>
                                            {publicacionSeleccionada.Imagenes?.length > 0 ? (
                                                <Row>
                                                    {publicacionSeleccionada.Imagenes.map((img, i) => (
                                                        <Col xs={6} key={i} className="mb-3">
                                                            <Card>
                                                                <Card.Img variant="top" src={img} style={{ height: 120, objectFit: 'cover' }} />
                                                            </Card>
                                                        </Col>
                                                    ))}
                                                </Row>
                                            ) : (
                                                <div className="text-center py-4">
                                                    <FaImage size={48} style={{ color: customStyles.info.backgroundColor }} className="mb-3" />
                                                    <p>No hay imágenes disponibles</p>
                                                </div>
                                            )}
                                        </Card.Body>
                                    </Card>
                                </Col>
                                <Col md={7}>
                                    <Card className="mb-4">
                                        <Card.Header style={customStyles.primary} className="text-white">Información Básica</Card.Header>
                                        <Card.Body>
                                            <Row>
                                                <Col sm={6}><h6 className="text-muted">Nombre</h6><p>{publicacionSeleccionada.Nombre}</p></Col>
                                                <Col sm={6}><h6 className="text-muted">Categoría</h6><p>{publicacionSeleccionada.Categoria}</p></Col>
                                                <Col sm={6}><h6 className="text-muted">Usuario</h6><p>{publicacionSeleccionada.idUsuario}</p></Col>
                                                <Col sm={6}><h6 className="text-muted">Estado</h6><Badge bg={publicacionSeleccionada.estadoRevision === "pendiente" ? "warning" : publicacionSeleccionada.estadoRevision === "aprobado" ? "success" : publicacionSeleccionada.estadoRevision === "rechazado" ? "danger" : "secondary"}>{publicacionSeleccionada.estadoRevision || "Sin estado"}</Badge></Col>
                                            </Row>
                                        </Card.Body>
                                    </Card>
                                    <Card className="mb-4">
                                        <Card.Header style={customStyles.primary} className="text-white">Descripción</Card.Header>
                                        <Card.Body><p>{publicacionSeleccionada.Descripcion || 'No disponible'}</p></Card.Body>
                                    </Card>
                                </Col>
                            </Row>
                        </>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={() => setShowDetalleModal(false)} style={customStyles.primary}>Cerrar</Button>
                </Modal.Footer>
            </Modal>
            {/* Modal de Platillos */}
            <Modal show={showPlatillosModal} onHide={() => setShowPlatillosModal(false)} size="lg" centered>
                <Modal.Header closeButton style={customStyles.info}>
                    <Modal.Title className="text-white">Platillos del Restaurante</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {platillos.length === 0 ? (
                        <Alert variant="info">No hay platillos registrados para este restaurante.</Alert>
                    ) : (
                        <Row>
                            {platillos.map((platillo) => (
                                <Col md={6} lg={4} key={platillo._id} className="mb-4">
                                    <Card className="h-100 border-0 shadow-sm">
                                        {platillo.Imagenes && platillo.Imagenes.length > 0 && (
                                            <Card.Img variant="top" src={platillo.Imagenes[0]} style={{ height: 140, objectFit: 'cover' }} />
                                        )}
                                        <Card.Body>
                                            <Card.Title>{platillo.Nombre}</Card.Title>
                                            <Card.Subtitle className="mb-2 text-muted">{platillo.Categoria}</Card.Subtitle>
                                            <div className="mb-2">💲 <strong>{platillo.Precio}</strong></div>
                                            <div style={{ fontSize: 13 }}>{platillo.Descripcion}</div>
                                            <div className="mt-3">
                                                {platillo.estadoRevision === "aprobado" && <Badge bg="success">Aprobado</Badge>}
                                                {platillo.estadoRevision === "rechazado" && <Badge bg="danger">Rechazado</Badge>}
                                                {(!platillo.estadoRevision || platillo.estadoRevision === "pendiente") && (
                                                    <>
                                                        <Button size="sm" variant="success" className="me-2" disabled={loadingPlatillo && platilloAccion.id === platillo._id} onClick={() => aprobarORechazarPlatillo(platillo, "aprobar")}>{loadingPlatillo && platilloAccion.id === platillo._id ? <FaSpinner className="spin" /> : <FaCheck />} Aprobar</Button>
                                                        <Button size="sm" variant="danger" disabled={loadingPlatillo && platilloAccion.id === platillo._id} onClick={() => aprobarORechazarPlatillo(platillo, "rechazar")}>{loadingPlatillo && platilloAccion.id === platillo._id ? <FaSpinner className="spin" /> : <FaTimes />} Rechazar</Button>
                                                    </>
                                                )}
                                            </div>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={() => setShowPlatillosModal(false)} style={customStyles.primary}>Cerrar</Button>
                </Modal.Footer>
            </Modal>
            {/* Modal de Notificación para publicación */}
            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton style={accion === "aprobar" ? customStyles.success : customStyles.danger}>
                    <Modal.Title className="text-white">{accion === "aprobar" ? "Aprobar publicación" : "Rechazar publicación"}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="mensaje">
                            <Form.Label>Mensaje para el usuario</Form.Label>
                            <Form.Control as="textarea" rows={3} value={mensaje} onChange={(e) => setMensaje(e.target.value)} />
                        </Form.Group>
                        {accion === "rechazar" && (
                            <Form.Group controlId="motivo" className="mt-3">
                                <Form.Label>Motivo del rechazo</Form.Label>
                                <Form.Control as="textarea" rows={2} value={motivo} onChange={(e) => setMotivo(e.target.value)} placeholder="Indica el motivo del rechazo" />
                            </Form.Group>
                        )}
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>Cancelar</Button>
                    <Button variant={accion === "aprobar" ? "success" : "danger"} onClick={aprobarORechazarPublicacion} disabled={loading} style={accion === "aprobar" ? customStyles.success : customStyles.danger}>
                        {loading ? (<><FaSpinner className="spin me-2" /> Procesando...</>) : (accion === "aprobar" ? "Aprobar y Notificar" : "Rechazar y Notificar")}
                    </Button>
                </Modal.Footer>
            </Modal>
            {/* Toast de Mensaje */}
            <Toast bg={toast.bg} show={toast.show} onClose={() => setToast({ ...toast, show: false })} delay={3000} autohide style={{ position: "fixed", bottom: 20, right: 20, zIndex: 9999 }}>
                <Toast.Body className="text-white">{toast.mensaje}</Toast.Body>
            </Toast>
        </Container>
    );
};

export default RestauranteRequests; 