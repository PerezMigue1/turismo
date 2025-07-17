import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Alert, Row, Col } from 'react-bootstrap';
import axios from 'axios';

const PublicarProducto = () => {
    const [formData, setFormData] = useState({
        Nombre: '',
        Precio: '',
        Descripción: '',
        Dimensiones: '',
        Colores: '',
        Etiquetas: '',
        Origen: '',
        Materiales: '',
        Técnica: '',
        Especificaciones: '',
        Comentarios: '',
        idCategoria: '',
        Imagen: []
    });

    const [mensaje, setMensaje] = useState(null);
    const [categorias, setCategorias] = useState([]);
    const [idArtesano, setIdArtesano] = useState(null);
    const [datosArtesano, setDatosArtesano] = useState(null);

    const user = JSON.parse(localStorage.getItem("user"));
    const token = user?.token;
    const idUsuario = user?._id || user?.idUsuario;

    // ✅ Obtener categorías
    useEffect(() => {
        const cargarCategorias = async () => {
            try {
                const res = await axios.get('https://backend-iota-seven-19.vercel.app/api/categoriaProducto');
                setCategorias(res.data);
            } catch (error) {
                console.error("❌ Error al cargar categorías:", error);
            }
        };
        cargarCategorias();
    }, []);

    // ✅ Obtener artesano desde backend
    useEffect(() => {
        const obtenerArtesano = async () => {
            if (!idUsuario) return;

            try {
                const res = await axios.get(`https://backend-iota-seven-19.vercel.app/api/artesano/por-usuario/${idUsuario}`);
                setIdArtesano(res.data.idArtesano);
                setDatosArtesano(res.data);
            } catch (error) {
                console.warn("⚠️ Este usuario no está registrado como artesano.");
                setIdArtesano(null);
            }
        };
        obtenerArtesano();
    }, [idUsuario]);

    // ✅ Manejar cambios del formulario
    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'Imagen') {
            setFormData({ ...formData, Imagen: files });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    // ✅ Enviar formulario
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!token || !idUsuario || !idArtesano) {
            setMensaje('⚠️ Debes estar registrado como artesano para publicar un producto.');
            return;
        }

        const data = new FormData();
        for (const key in formData) {
            if (key === 'Imagen') {
                for (let i = 0; i < formData.Imagen.length; i++) {
                    data.append('Imagen', formData.Imagen[i]);
                }
            } else {
                data.append(key, formData[key]);
            }
        }

        // Agregar datos obligatorios del backend
        data.append('idUsuario', idUsuario);
        data.append('idArtesano', idArtesano);
        data.append('estadoRevision', 'pendiente');
        data.append('fechaSolicitud', new Date().toISOString());

        try {
            
            await axios.post('https://backend-iota-seven-19.vercel.app/api/publicaciones', data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                }
            });

            setMensaje('✅ Producto enviado para revisión');
            setFormData({
                Nombre: '',
                Precio: '',
                Descripción: '',
                Dimensiones: '',
                Colores: '',
                Etiquetas: '',
                Origen: '',
                Materiales: '',
                Técnica: '',
                Especificaciones: '',
                Comentarios: '',
                idCategoria: '',
                Imagen: []
            });
        } catch (error) {
            console.error("❌ Error al enviar producto:", error.response?.data || error.message);
            setMensaje('❌ Hubo un error al enviar tu producto');
        }
        
    };
console.log("🧾 idUsuario desde localStorage:", idUsuario);
console.log("🎨 idArtesano recuperado del backend:", idArtesano);
console.log("📋 Datos completos del artesano:", datosArtesano);

    return (
        <Container style={{ backgroundColor: '#FDF2E0', padding: '40px', borderRadius: '10px' }}>
            <h3 style={{ color: '#9A1E47', marginBottom: '30px' }}>Publicar nuevo producto artesanal</h3>

            {mensaje && (
                <Alert variant={mensaje.startsWith('✅') ? 'success' : 'danger'}>{mensaje}</Alert>
            )}

            {!idArtesano && (
                <Alert variant="warning">
                    ⚠️ Debes completar tu <a href="/RegistroArtesano">registro como artesano</a> para publicar productos.
                </Alert>
            )}

            {idArtesano && datosArtesano && (
                <Alert variant="info">
                    Publicando como: <strong>{datosArtesano.nombre}</strong> ({datosArtesano.especialidad})
                </Alert>
            )}

            <Form onSubmit={handleSubmit}>
                <Row>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>Nombre del producto</Form.Label>
                            <Form.Control name="Nombre" value={formData.Nombre} onChange={handleChange} required />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Precio</Form.Label>
                            <Form.Control type="number" name="Precio" value={formData.Precio} onChange={handleChange} required />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Descripción</Form.Label>
                            <Form.Control as="textarea" rows={3} name="Descripción" value={formData.Descripción} onChange={handleChange} required />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Colores</Form.Label>
                            <Form.Control name="Colores" value={formData.Colores} onChange={handleChange} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Etiquetas</Form.Label>
                            <Form.Control name="Etiquetas" value={formData.Etiquetas} onChange={handleChange} />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>Dimensiones</Form.Label>
                            <Form.Control name="Dimensiones" value={formData.Dimensiones} onChange={handleChange} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Origen</Form.Label>
                            <Form.Control name="Origen" value={formData.Origen} onChange={handleChange} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Materiales</Form.Label>
                            <Form.Control name="Materiales" value={formData.Materiales} onChange={handleChange} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Técnica</Form.Label>
                            <Form.Control name="Técnica" value={formData.Técnica} onChange={handleChange} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Especificaciones</Form.Label>
                            <Form.Control name="Especificaciones" value={formData.Especificaciones} onChange={handleChange} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Comentarios</Form.Label>
                            <Form.Control name="Comentarios" value={formData.Comentarios} onChange={handleChange} />
                        </Form.Group>
                    </Col>
                </Row>

                <Form.Group className="mb-3">
                    <Form.Label>Categoría</Form.Label>
                    <Form.Select name="idCategoria" value={formData.idCategoria} onChange={handleChange} required>
                        <option value="">Seleccione una categoría</option>
                        {categorias.map((cat) => (
                            <option key={cat.idCategoria} value={cat.idCategoria}>{cat.Nombre}</option>
                        ))}
                    </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Imágenes del producto</Form.Label>
                    <Form.Control type="file" name="Imagen" multiple onChange={handleChange}  />
                </Form.Group>

                <Button
                    type="submit"
                    variant="primary"
                    style={{ backgroundColor: '#9A1E47', borderColor: '#9A1E47' }}
                    disabled={!idArtesano}
                >
                    Enviar publicación
                </Button>
            </Form>
        </Container>
    );
};

export default PublicarProducto;
