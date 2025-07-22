import React, { useState, useEffect } from "react";
import { Container, Card, Button, Form, Row, Col, Alert, Badge } from "react-bootstrap";
import { FaUser, FaPhone, FaEnvelope, FaVenusMars, FaBirthdayCake, FaEdit, FaSave, FaTools, FaMapMarkerAlt, FaHotel } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Perfil = () => {
    const [user, setUser] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({});
    const [alert, setAlert] = useState({ show: false, message: "", variant: "success" });
    const [artesano, setArtesano] = useState(null);
    const [hospedero, setHospedero] = useState(null);
    const navigate = useNavigate();

    const storedUser = JSON.parse(localStorage.getItem("user"));

    const id = storedUser?._id || storedUser?.id || storedUser?.idUsuario;
    console.log("🧪 ID detectado:", id);

    // ✅ Obtener datos del usuario
    useEffect(() => {
        if (!id) {
            setAlert({
                show: true,
                message: "No se pudo cargar el perfil. Por favor, inicia sesión nuevamente.",
                variant: "danger"
            });
            return;
        }

        const fetchUserData = async () => {
            try {
                const response = await axios.get(`https://backend-iota-seven-19.vercel.app/api/usuarios/${id}/perfil`);
                setUser(response.data);
                setFormData(response.data);
            } catch (error) {
                setAlert({
                    show: true,
                    message: "Error al cargar los datos del perfil",
                    variant: "danger"
                });
            }
        };

        const fetchArtesano = async () => {
            try {
                const res = await axios.get(`https://backend-iota-seven-19.vercel.app/api/artesano/por-usuario/${id}`);
                setArtesano(res.data);
            } catch (err) {
                setArtesano(null);
            }
        };

        const fetchHospedero = async () => {
            try {
                const res = await axios.get(`https://backend-iota-seven-19.vercel.app/api/contactoHospedero/por-usuario/${id}`);
                setHospedero(res.data);
            } catch (err) {
                setHospedero(null);
            }
        };

        fetchUserData();
        fetchArtesano();
        fetchHospedero();
    }, [id]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put(`https://backend-iota-seven-19.vercel.app/api/usuarios/${id}/perfil`, formData);
            setUser(response.data.usuario);
            setEditMode(false);
            setAlert({
                show: true,
                message: response.data.message || "Perfil actualizado correctamente",
                variant: "success"
            });
        } catch (error) {
            setAlert({
                show: true,
                message: error.response?.data?.message || "Error al actualizar el perfil",
                variant: "danger"
            });
        }
        setTimeout(() => setAlert({ ...alert, show: false }), 3000);
    };

    if (!user) return (
        <div style={{
            display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", color: "#9A1E47"
        }}>
            Cargando perfil...
        </div>
    );

    return (
        <Container className="py-5">
            <Row className="justify-content-center">
                <Col md={8} lg={6}>
                    <Card style={{ border: "none", borderRadius: "15px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)", backgroundColor: "#FDF2E0" }}>
                        <Card.Header style={{ backgroundColor: "#9A1E47", color: "white", borderTopLeftRadius: "15px", borderTopRightRadius: "15px", padding: "1.5rem" }}>
                            <div className="d-flex justify-content-between align-items-center">
                                <h3 className="mb-0"><FaUser className="me-2" />Mi Perfil</h3>
                                <Button
                                    variant={editMode ? "success" : "outline-light"}
                                    onClick={editMode ? handleSubmit : () => setEditMode(true)}
                                    style={{
                                        backgroundColor: editMode ? "#1E8546" : "transparent",
                                        borderColor: "white",
                                        borderRadius: "20px",
                                        padding: "5px 15px"
                                    }}
                                >
                                    {editMode ? <><FaSave className="me-1" /> Guardar</> : <><FaEdit className="me-1" /> Editar</>}
                                </Button>
                            </div>
                        </Card.Header>

                        <Card.Body style={{ padding: "2rem" }}>
                            {alert.show && (
                                <Alert variant={alert.variant} onClose={() => setAlert({ ...alert, show: false })} dismissible>
                                    {alert.message}
                                </Alert>
                            )}

                            <Form onSubmit={handleSubmit}>
                                <Form.Group className="mb-4">
                                    <Form.Label style={{ color: "#9A1E47", fontWeight: "500" }}>
                                        <FaUser className="me-2" /> Nombre completo
                                    </Form.Label>
                                    {editMode ? (
                                        <Form.Control type="text" name="nombre" value={formData.nombre || ""} onChange={handleInputChange} />
                                    ) : (
                                        <div className="bg-white p-2 rounded border">{user.nombre}</div>
                                    )}
                                </Form.Group>

                                <Row className="mb-4">
                                    <Col md={6}>
                                        <Form.Group>
                                            <Form.Label style={{ color: "#9A1E47", fontWeight: "500" }}><FaPhone className="me-2" /> Teléfono</Form.Label>
                                            {editMode ? (
                                                <Form.Control type="tel" name="telefono" value={formData.telefono || ""} onChange={handleInputChange} />
                                            ) : (
                                                <div className="bg-white p-2 rounded border">{user.telefono}</div>
                                            )}
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group>
                                            <Form.Label style={{ color: "#9A1E47", fontWeight: "500" }}><FaEnvelope className="me-2" /> Correo</Form.Label>
                                            <div className="bg-white p-2 rounded border">{user.email}</div>
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Row className="mb-4">
                                    <Col md={6}>
                                        <Form.Group>
                                            <Form.Label style={{ color: "#9A1E47", fontWeight: "500" }}><FaVenusMars className="me-2" /> Género</Form.Label>
                                            {editMode ? (
                                                <Form.Select name="sexo" value={formData.sexo || ""} onChange={handleInputChange}>
                                                    <option value="Masculino">Masculino</option>
                                                    <option value="Femenino">Femenino</option>
                                                    <option value="Otro">Otro</option>
                                                </Form.Select>
                                            ) : (
                                                <div className="bg-white p-2 rounded border">{user.sexo}</div>
                                            )}
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group>
                                            <Form.Label style={{ color: "#9A1E47", fontWeight: "500" }}><FaBirthdayCake className="me-2" /> Edad</Form.Label>
                                            {editMode ? (
                                                <Form.Control type="number" name="edad" value={formData.edad || ""} onChange={handleInputChange} />
                                            ) : (
                                                <div className="bg-white p-2 rounded border">{user.edad} años</div>
                                            )}
                                        </Form.Group>
                                    </Col>
                                </Row>

                                {/* Mostrar todos los roles como badges */}
                                <Form.Group className="mb-4">
                                    <Form.Label style={{ color: "#9A1E47", fontWeight: "500" }}>Roles</Form.Label>
                                    <div className="p-2 rounded">
                                        {(Array.isArray(user.rol) ? user.rol : [user.rol]).map((rol, idx) => (
                                            <Badge key={rol + idx} bg={rol === "turista" ? "info" : rol === "artesano" ? "warning" : rol === "admin" ? "danger" : "success"} className="me-2 text-capitalize">
                                                {rol}
                                            </Badge>
                                        ))}
                                    </div>
                                </Form.Group>
                            </Form>

                            {/* DATOS DE ARTESANO (si está registrado) */}
                            {artesano && (
                                <>
                                    <hr />
                                    <h5 style={{ color: "#9A1E47" }}><FaTools className="me-2" />Datos como artesano</h5>
                                    <p><strong>Especialidad:</strong> {artesano.especialidad}</p>
                                    <p><strong>Ubicación:</strong> <FaMapMarkerAlt className="me-1" /> {artesano.ubicacion}</p>
                                    <p><strong>Descripción:</strong> {artesano.descripcion}</p>
                                    <p><strong>Redes sociales:</strong></p>
                                    <ul>
                                        {artesano.redesSociales?.facebook && <li>Facebook: {artesano.redesSociales.facebook}</li>}
                                        {artesano.redesSociales?.instagram && <li>Instagram: {artesano.redesSociales.instagram}</li>}
                                        {artesano.redesSociales?.whatsapp && <li>WhatsApp: {artesano.redesSociales.whatsapp}</li>}
                                    </ul>
                                    <p><strong>Teléfono:</strong> {artesano.telefono}</p>
                                    <p><strong>Correo:</strong> {artesano.correo}</p>
                                </>
                            )}

                            {/* DATOS DE HOSPEDERO (si está registrado) */}
                            {hospedero && (
                                <>
                                    <hr />
                                    <h5 style={{ color: "#9A1E47" }}><FaHotel className="me-2" />Datos como hospedero</h5>
                                    <p><strong>Especialidad:</strong> {hospedero.especialidad}</p>
                                    <p><strong>Ubicación:</strong> <FaMapMarkerAlt className="me-1" /> {hospedero.ubicacion}</p>
                                    <p><strong>Descripción:</strong> {hospedero.descripcion}</p>
                                    <p><strong>Redes sociales:</strong></p>
                                    <ul>
                                        {hospedero.redesSociales?.facebook && <li>Facebook: {hospedero.redesSociales.facebook}</li>}
                                        {hospedero.redesSociales?.instagram && <li>Instagram: {hospedero.redesSociales.instagram}</li>}
                                        {hospedero.redesSociales?.whatsapp && <li>WhatsApp: {hospedero.redesSociales.whatsapp}</li>}
                                    </ul>
                                    <p><strong>Teléfono:</strong> {hospedero.telefono}</p>
                                    <p><strong>Correo:</strong> {hospedero.correo}</p>
                                </>
                            )}

                            <div className="d-flex justify-content-between mt-4">
                                <Button variant="outline" onClick={() => navigate('/reservaciones')} style={{ color: "#9A1E47", borderColor: "#9A1E47" }}>
                                    Ver mis reservaciones
                                </Button>
                                <Button variant="primary" onClick={() => navigate('/cambiar-contrasena')} style={{ backgroundColor: "#D24D1C", border: "none" }}>
                                    Cambiar contraseña
                                </Button>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default Perfil;
