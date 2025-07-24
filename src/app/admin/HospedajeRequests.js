import React, { useState, useEffect } from "react";
import axios from "axios";
import {
    Container, Table, Button, Modal, Badge, Alert, Form, Toast, Row, Col, Card, ButtonGroup, ProgressBar
} from "react-bootstrap";
import { FaCheck, FaTimes, FaEye, FaSpinner, FaFilter, FaChartBar, FaSync, FaImage } from "react-icons/fa";

const HospedajeRequests = () => {
    const [hospedajes, setHospedajes] = useState([]);
    const [hospedajeSeleccionado, setHospedajeSeleccionado] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [mensaje, setMensaje] = useState("");
    const [motivo, setMotivo] = useState("");
    const [accion, setAccion] = useState(""); // "aprobar" o "rechazar"
    const [toast, setToast] = useState({ show: false, mensaje: "", bg: "success" });
    const [loading, setLoading] = useState(false);
    const [filtroActual, setFiltroActual] = useState("todos");
    const [estadisticas, setEstadisticas] = useState({
        total: 0, pendientes: 0, aprobados: 0, rechazados: 0
    });
    const [hospedajesFiltrados, setHospedajesFiltrados] = useState([]);
    const [showDetalleModal, setShowDetalleModal] = useState(false);

    const customStyles = {
        primary: { backgroundColor: '#1E40AF', borderColor: '#1E40AF' },
        secondary: { backgroundColor: '#0FA89C', borderColor: '#0FA89C' },
        success: { backgroundColor: '#1E8546', borderColor: '#1E8546' },
        warning: { backgroundColor: '#F28B27', borderColor: '#F28B27' },
        danger: { backgroundColor: '#D24D1C', borderColor: '#D24D1C' },
        info: { backgroundColor: '#50C2C4', borderColor: '#50C2C4' },
        light: { backgroundColor: '#F8E8D0', borderColor: '#F8E8D0' }
    };

    const obtenerHospedajes = async () => {
        try {
            const response = await axios.get("https://backend-iota-seven-19.vercel.app/api/publicaHospedaje");
            setHospedajes(response.data);
        } catch (error) {
            console.error("❌ Error al obtener hospedajes:", error);
        }
    };

    const obtenerEstadisticas = async () => {
        try {
            const response = await axios.get("https://backend-iota-seven-19.vercel.app/api/publicaHospedaje/estadisticas/totales");
            setEstadisticas(response.data.estadisticas || {
                total: hospedajes.length,
                pendientes: hospedajes.filter(h => h.estadoRevision === "pendiente").length,
                aprobados: hospedajes.filter(h => h.estadoRevision === "aprobado").length,
                rechazados: hospedajes.filter(h => h.estadoRevision === "rechazado").length
            });
        } catch (error) {
            setEstadisticas({
                total: hospedajes.length,
                pendientes: hospedajes.filter(h => h.estadoRevision === "pendiente").length,
                aprobados: hospedajes.filter(h => h.estadoRevision === "aprobado").length,
                rechazados: hospedajes.filter(h => h.estadoRevision === "rechazado").length
            });
        }
    };

    const filtrarHospedajes = () => {
        let filtrados = [...hospedajes];
        if (filtroActual !== "todos") {
            filtrados = hospedajes.filter(h => h.estadoRevision === filtroActual);
        }
        setHospedajesFiltrados(filtrados);
    };

    useEffect(() => { obtenerHospedajes(); }, []);
    useEffect(() => { filtrarHospedajes(); obtenerEstadisticas(); }, [hospedajes, filtroActual]);

    const mostrarToast = (mensaje, bg = "success") => {
        setToast({ show: true, mensaje, bg });
        setTimeout(() => setToast({ show: false, mensaje: "", bg }), 3000);
    };

    const handleAccion = (hospedaje, tipoAccion) => {
        setHospedajeSeleccionado(hospedaje);
        setAccion(tipoAccion);
        setMensaje(
            tipoAccion === "aprobar"
                ? `Tu hospedaje "${hospedaje.Nombre}" ha sido aprobado y publicado exitosamente.`
                : `Tu hospedaje "${hospedaje.Nombre}" ha sido rechazado. Por favor revisa el motivo.`
        );
        setMotivo("");
        setShowModal(true);
    };

    const enviarNotificacion = async () => {
        if (!hospedajeSeleccionado) return;
        try {
            setLoading(true);
            if (accion === "aprobar") {
                await axios.put(`https://backend-iota-seven-19.vercel.app/api/publicaHospedaje/${hospedajeSeleccionado._id}/aprobar`, { revisadoPor: "admin" });
            } else {
                await axios.put(`https://backend-iota-seven-19.vercel.app/api/publicaHospedaje/${hospedajeSeleccionado._id}/rechazar`, {
                    revisadoPor: "admin",
                    motivoRechazo: motivo || "No especificado"
                });
            }
            mostrarToast(`Hospedaje ${accion === "aprobar" ? "aprobado" : "rechazado"} y notificación enviada`, "success");
            setShowModal(false);
            obtenerHospedajes();
        } catch (error) {
            console.error("❌ Error al realizar la acción:", error);
            mostrarToast("Error al procesar la solicitud", "danger");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container fluid className="py-4" style={customStyles.light}>
            {/* Panel de Estadísticas */}
            <Row className="mb-4">
                <Col>
                    <h1 style={{ color: customStyles.primary.backgroundColor }}>
                        <strong>Hospedajes en Revisión</strong>
                    </h1>
                    <div style={{ width: '80px', height: '4px', backgroundColor: customStyles.secondary.backgroundColor, borderRadius: '2px' }}></div>
                </Col>
            </Row>
            <Row className="mb-4">
                <Col>
                    <Card className="shadow-sm">
                        <Card.Header style={customStyles.info} className="text-white">
                            <FaChartBar className="me-2" />
                            Estadísticas
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
                                    <h4 style={{ color: customStyles.success.backgroundColor }}>{estadisticas.aprobados}</h4>
                                    <small className="text-muted">Aprobados</small>
                                </Col>
                                <Col md={3} className="text-center">
                                    <h4 style={{ color: customStyles.danger.backgroundColor }}>{estadisticas.rechazados}</h4>
                                    <small className="text-muted">Rechazados</small>
                                </Col>
                            </Row>
                            {estadisticas.total > 0 && (
                                <ProgressBar className="mt-3">
                                    <ProgressBar 
                                        variant="warning" 
                                        now={(estadisticas.pendientes / estadisticas.total) * 100} 
                                        label={`${Math.round((estadisticas.pendientes / estadisticas.total) * 100)}%`}
                                    />
                                    <ProgressBar 
                                        variant="success" 
                                        now={(estadisticas.aprobados / estadisticas.total) * 100} 
                                        label={`${Math.round((estadisticas.aprobados / estadisticas.total) * 100)}%`}
                                    />
                                    <ProgressBar 
                                        variant="danger" 
                                        now={(estadisticas.rechazados / estadisticas.total) * 100} 
                                        label={`${Math.round((estadisticas.rechazados / estadisticas.total) * 100)}%`}
                                    />
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
                                    <FaFilter className="me-2" />
                                    <strong>Filtros:</strong>
                                </div>
                                <ButtonGroup>
                                    <Button 
                                        variant={filtroActual === "todos" ? "primary" : "outline-primary"}
                                        onClick={() => setFiltroActual("todos")}
                                        style={filtroActual === "todos" ? customStyles.primary : {}}
                                    >
                                        Todos ({hospedajes.length})
                                    </Button>
                                    <Button 
                                        variant={filtroActual === "pendiente" ? "warning" : "outline-warning"}
                                        onClick={() => setFiltroActual("pendiente")}
                                        style={filtroActual === "pendiente" ? customStyles.warning : {}}
                                    >
                                        Pendientes ({hospedajes.filter(h => h.estadoRevision === "pendiente").length})
                                    </Button>
                                    <Button 
                                        variant={filtroActual === "aprobado" ? "success" : "outline-success"}
                                        onClick={() => setFiltroActual("aprobado")}
                                        style={filtroActual === "aprobado" ? customStyles.success : {}}
                                    >
                                        Aprobados ({hospedajes.filter(h => h.estadoRevision === "aprobado").length})
                                    </Button>
                                    <Button 
                                        variant={filtroActual === "rechazado" ? "danger" : "outline-danger"}
                                        onClick={() => setFiltroActual("rechazado")}
                                        style={filtroActual === "rechazado" ? customStyles.danger : {}}
                                    >
                                        Rechazados ({hospedajes.filter(h => h.estadoRevision === "rechazado").length})
                                    </Button>
                                </ButtonGroup>
                                <Button 
                                    variant="outline-secondary" 
                                    onClick={() => {
                                        obtenerHospedajes();
                                        obtenerEstadisticas();
                                    }}
                                >
                                    <FaSync />
                                </Button>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            {hospedajesFiltrados.length === 0 ? (
                <Alert variant="info" className="mt-3">
                    {filtroActual === "todos" 
                        ? "No hay hospedajes en el sistema." 
                        : `No hay hospedajes ${filtroActual} para mostrar.`
                    }
                </Alert>
            ) : (
                <Card className="shadow-sm">
                    <Card.Body className="p-0">
                        <Table responsive hover className="mb-0">
                            <thead style={customStyles.secondary}>
                                <tr className="text-white">
                                    <th>Hospedaje</th>
                                    <th>Hospedero</th>
                                    <th className="text-center">Precio</th>
                                    <th className="text-center">Estado</th>
                                    <th className="text-center">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {hospedajesFiltrados.map((hosp) => (
                                    <tr key={hosp._id}>
                                        <td>
                                            <div className="d-flex align-items-center">
                                                {hosp.Imagenes?.[0] && (
                                                    <img 
                                                        src={hosp.Imagenes[0]} 
                                                        alt="" 
                                                        className="rounded me-3" 
                                                        style={{ width: 50, height: 50, objectFit: 'cover' }} 
                                                    />
                                                )}
                                                <div>
                                                    <div className="fw-bold">{hosp.Nombre}</div>
                                                    <small className="text-muted text-truncate d-block" style={{ maxWidth: 200 }}>
                                                        {hosp.Ubicacion}
                                                    </small>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="align-middle">{hosp.idHospedero || hosp.idUsuario}</td>
                                        <td className="text-center align-middle fw-bold" style={{ color: customStyles.success.backgroundColor }}>
                                            ${hosp.Precio}
                                        </td>
                                        <td className="text-center align-middle">
                                            <Badge 
                                                bg={
                                                    hosp.estadoRevision === "pendiente" ? "warning" :
                                                    hosp.estadoRevision === "aprobado" ? "success" :
                                                    hosp.estadoRevision === "rechazado" ? "danger" : "secondary"
                                                }
                                            >
                                                {hosp.estadoRevision || "Sin estado"}
                                            </Badge>
                                        </td>
                                        <td className="text-center align-middle">
                                            {hosp.estadoRevision === "pendiente" && (
                                                <>
                                                    <Button
                                                        variant="success"
                                                        size="sm"
                                                        className="me-2"
                                                        onClick={() => handleAccion(hosp, "aprobar")}
                                                        style={customStyles.success}
                                                    >
                                                        <FaCheck /> Aprobar
                                                    </Button>
                                                    <Button
                                                        variant="danger"
                                                        size="sm"
                                                        className="me-2"
                                                        onClick={() => handleAccion(hosp, "rechazar")}
                                                        style={customStyles.danger}
                                                    >
                                                        <FaTimes /> Rechazar
                                                    </Button>
                                                </>
                                            )}
                                            <Button 
                                                size="sm" 
                                                onClick={() => { setHospedajeSeleccionado(hosp); setShowDetalleModal(true); }} 
                                                style={customStyles.warning}
                                            >
                                                <FaEye />
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </Card.Body>
                </Card>
            )}
            {/* Modal de Detalles del Hospedaje */}
            <Modal show={showDetalleModal} onHide={() => setShowDetalleModal(false)} size="lg" centered>
                <Modal.Header closeButton style={customStyles.secondary}>
                    <Modal.Title className="text-white">Detalles del Hospedaje</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {hospedajeSeleccionado && (
                        <>
                            <Row>
                                <Col md={5}>
                                    <Card className="mb-4">
                                        <Card.Header style={customStyles.primary} className="text-white">
                                            Imágenes del Hospedaje
                                        </Card.Header>
                                        <Card.Body>
                                            {hospedajeSeleccionado.Imagenes?.length > 0 ? (
                                                <Row>
                                                    {hospedajeSeleccionado.Imagenes.map((img, i) => (
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
                                        <Card.Header style={customStyles.primary} className="text-white">
                                            Información Básica
                                        </Card.Header>
                                        <Card.Body>
                                            <Row>
                                                <Col sm={6}>
                                                    <h6 className="text-muted">Nombre</h6>
                                                    <p>{hospedajeSeleccionado.Nombre}</p>
                                                </Col>
                                                <Col sm={6}>
                                                    <h6 className="text-muted">Ubicación</h6>
                                                    <p>{hospedajeSeleccionado.Ubicacion || 'N/A'}</p>
                                                </Col>
                                                <Col sm={6}>
                                                    <h6 className="text-muted">Hospedero</h6>
                                                    <p>{hospedajeSeleccionado.idHospedero || hospedajeSeleccionado.idUsuario}</p>
                                                </Col>
                                                <Col sm={6}>
                                                    <h6 className="text-muted">Categoría</h6>
                                                    <p>{hospedajeSeleccionado.Categoria || 'N/A'}</p>
                                                </Col>
                                                <Col sm={6}>
                                                    <h6 className="text-muted">Estado</h6>
                                                    <Badge 
                                                        bg={
                                                            hospedajeSeleccionado.estadoRevision === "pendiente" ? "warning" :
                                                            hospedajeSeleccionado.estadoRevision === "aprobado" ? "success" :
                                                            hospedajeSeleccionado.estadoRevision === "rechazado" ? "danger" : "secondary"
                                                        }
                                                    >
                                                        {hospedajeSeleccionado.estadoRevision || "Sin estado"}
                                                    </Badge>
                                                </Col>
                                            </Row>
                                        </Card.Body>
                                    </Card>
                                    <Card className="mb-4">
                                        <Card.Header style={customStyles.primary} className="text-white">
                                            Servicios y Horario
                                        </Card.Header>
                                        <Card.Body>
                                            <h6 className="text-muted">Servicios</h6>
                                            <p>{hospedajeSeleccionado.Servicios || 'N/A'}</p>
                                            <h6 className="text-muted">Horario</h6>
                                            <p>{hospedajeSeleccionado.Horario || 'N/A'}</p>
                                            <h6 className="text-muted">Teléfono</h6>
                                            <p>{hospedajeSeleccionado.Telefono || 'N/A'}</p>
                                        </Card.Body>
                                    </Card>
                                    <Row>
                                        <Col md={6}>
                                            <Card className="mb-4">
                                                <Card.Header style={customStyles.primary} className="text-white">
                                                    Capacidad y Precio
                                                </Card.Header>
                                                <Card.Body>
                                                    <h6 className="text-muted">Huéspedes</h6>
                                                    <p>{hospedajeSeleccionado.Huespedes || 'N/A'}</p>
                                                    <h6 className="text-muted">Precio</h6>
                                                    <p style={{ color: customStyles.success.backgroundColor, fontWeight: 'bold' }}>
                                                        ${hospedajeSeleccionado.Precio}
                                                    </p>
                                                </Card.Body>
                                            </Card>
                                        </Col>
                                        <Col md={6}>
                                            <Card className="mb-4">
                                                <Card.Header style={customStyles.primary} className="text-white">
                                                    Ubicación Geográfica
                                                </Card.Header>
                                                <Card.Body>
                                                    <h6 className="text-muted">Coordenadas</h6>
                                                    <p>
                                                        Lat: {hospedajeSeleccionado.Coordenadas?.lat || 'N/A'}<br />
                                                        Lng: {hospedajeSeleccionado.Coordenadas?.lng || 'N/A'}
                                                    </p>
                                                </Card.Body>
                                            </Card>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                        </>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={() => setShowDetalleModal(false)} style={customStyles.primary}>
                        Cerrar
                    </Button>
                </Modal.Footer>
            </Modal>
            {/* Modal de Notificación */}
            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton style={accion === "aprobar" ? customStyles.success : customStyles.danger}>
                    <Modal.Title className="text-white">
                        {accion === "aprobar" ? "Aprobar hospedaje" : "Rechazar hospedaje"}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="mensaje">
                            <Form.Label>Mensaje para el hospedero</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                value={mensaje}
                                onChange={(e) => setMensaje(e.target.value)}
                            />
                        </Form.Group>
                        {accion === "rechazar" && (
                            <Form.Group controlId="motivo" className="mt-3">
                                <Form.Label>Motivo del rechazo</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={2}
                                    value={motivo}
                                    onChange={(e) => setMotivo(e.target.value)}
                                    placeholder="Indica el motivo del rechazo"
                                />
                            </Form.Group>
                        )}
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Cancelar
                    </Button>
                    <Button
                        variant={accion === "aprobar" ? "success" : "danger"}
                        onClick={enviarNotificacion}
                        disabled={loading}
                        style={accion === "aprobar" ? customStyles.success : customStyles.danger}
                    >
                        {loading ? (
                            <>
                                <FaSpinner className="spin me-2" /> Procesando...
                            </>
                        ) : (
                            accion === "aprobar" ? "Aprobar y Notificar" : "Rechazar y Notificar"
                        )}
                    </Button>
                </Modal.Footer>
            </Modal>
            {/* Toast de Mensaje */}
            <Toast
                bg={toast.bg}
                show={toast.show}
                onClose={() => setToast({ ...toast, show: false })}
                delay={3000}
                autohide
                style={{ position: "fixed", bottom: 20, right: 20, zIndex: 9999 }}
            >
                <Toast.Body className="text-white">{toast.mensaje}</Toast.Body>
            </Toast>
        </Container>
    );
};

export default HospedajeRequests; 