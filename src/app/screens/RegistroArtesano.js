import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import axios from 'axios';

const RegistroArtesano = () => {
    const [formData, setFormData] = useState({
        nombre: '',
        correo: '',
        telefono: '',
        ubicacion: '',
        especialidad: '',
        descripcion: '',
        imagenPerfil: null,
        facebook: '',
        instagram: '',
        whatsapp: '',
    });

    const [mensaje, setMensaje] = useState(null);

    // ✅ Cargar datos del usuario logeado
    useEffect(() => {

        const usuarioLogeado = JSON.parse(localStorage.getItem("user"));
        if (usuarioLogeado) {
            setFormData(prev => ({
                ...prev,
                nombre: usuarioLogeado.nombre || '',
                correo: usuarioLogeado.email || '',
                telefono: usuarioLogeado.telefono || ''
            }));
        }
    }, []);

    // ✅ Manejador de cambios
    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'imagenPerfil') {
            setFormData({ ...formData, imagenPerfil: files[0] });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    // ✅ Enviar formulario
    const handleSubmit = async (e) => {
        e.preventDefault();

        const usuarioLogeado = JSON.parse(localStorage.getItem("user"));
        const token = usuarioLogeado?.token;
        const idUsuario = usuarioLogeado?._id;


        if (!token || !idUsuario) {
            setMensaje('⚠️ Debes iniciar sesión para registrar un artesano.');
            return;
        }

        const data = new FormData();
        data.append('idUsuario', idUsuario);
        data.append('nombre', formData.nombre);
        data.append('correo', formData.correo);
        data.append('telefono', formData.telefono);
        data.append('ubicacion', formData.ubicacion);
        data.append('especialidad', formData.especialidad);
        data.append('descripcion', formData.descripcion);
        if (formData.imagenPerfil) {
            data.append('imagenPerfil', formData.imagenPerfil);
        }
        data.append('redesSociales.facebook', formData.facebook);
        data.append('redesSociales.instagram', formData.instagram);
        data.append('redesSociales.whatsapp', formData.whatsapp);


        try {
            for (let pair of data.entries()) {
                console.log(`${pair[0]}: ${pair[1]}`);
            }

            await axios.post('https://backend-iota-seven-19.vercel.app/api/artesano', data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                },

            });


            // Actualizar el usuario con el rol de artesano
            const updatedUser = { ...usuarioLogeado, rol: 'artesano' };
            localStorage.setItem('user', JSON.stringify(updatedUser));


            setMensaje('✅ Registro exitoso');
            setFormData({
                nombre: '', correo: '', telefono: '', ubicacion: '',
                especialidad: '', descripcion: '', imagenPerfil: null,
                facebook: '', instagram: '', whatsapp: ''
            });
        } catch (error) {
            console.error("❌ Backend response:", error.response?.data || error.message);
            setMensaje('❌ Error al registrar artesano');
        }
    };

    return (
        <Container style={{ backgroundColor: '#FDF2E0', padding: '40px', borderRadius: '10px' }}>
            <h3 style={{ color: '#9A1E47', marginBottom: '30px' }}>Registro de Artesano</h3>
            {mensaje && <Alert variant={mensaje.startsWith('✅') ? 'success' : 'danger'}>{mensaje}</Alert>}
            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                    <Form.Label>Nombre completo</Form.Label>
                    <Form.Control name="nombre" value={formData.nombre} onChange={handleChange} required readOnly />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Correo electrónico</Form.Label>
                    <Form.Control type="email" name="correo" value={formData.correo} onChange={handleChange} required readOnly />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Teléfono</Form.Label>
                    <Form.Control name="telefono" value={formData.telefono} onChange={handleChange} required />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Ubicación</Form.Label>
                    <Form.Control name="ubicacion" value={formData.ubicacion} onChange={handleChange} />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Especialidad</Form.Label>
                    <Form.Control name="especialidad" value={formData.especialidad} onChange={handleChange} />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Descripción</Form.Label>
                    <Form.Control as="textarea" rows={3} name="descripcion" value={formData.descripcion} onChange={handleChange} />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Foto de perfil</Form.Label>
                    <Form.Control type="file" name="imagenPerfil" onChange={handleChange} />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Facebook</Form.Label>
                    <Form.Control name="facebook" value={formData.facebook} onChange={handleChange} />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Instagram</Form.Label>
                    <Form.Control name="instagram" value={formData.instagram} onChange={handleChange} />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>WhatsApp</Form.Label>
                    <Form.Control name="whatsapp" value={formData.whatsapp} onChange={handleChange} />
                </Form.Group>
                <Button type="submit" variant="primary" style={{ backgroundColor: '#9A1E47', borderColor: '#9A1E47' }}>
                    Registrar artesano
                </Button>
            </Form>
        </Container>
    );
};

export default RegistroArtesano;
