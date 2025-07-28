import React, { useState, useRef } from 'react';
import { Form, Button, Row, Col, InputGroup, Card, Alert, Spinner } from 'react-bootstrap';

const API_URL = 'https://backend-iota-seven-19.vercel.app/api/festividades';
const CLOUDINARY_UPLOAD_PRESET = 'festividades_unsigned'; // Reemplaza por tu upload_preset
const CLOUDINARY_CLOUD_NAME = 'dlisat1cx'; // Reemplaza por tu cloud_name
const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;
const customStyles = {
    primary: { backgroundColor: '#9A1E47', borderColor: '#9A1E47', color: '#fff' },
    secondary: { backgroundColor: '#0FA89C', borderColor: '#0FA89C', color: '#fff' },
    success: { backgroundColor: '#1E8546', borderColor: '#1E8546', color: '#fff' },
    danger: { backgroundColor: '#D24D1C', borderColor: '#D24D1C', color: '#fff' },
    info: { backgroundColor: '#50C2C4', borderColor: '#50C2C4', color: '#fff' },
    light: { backgroundColor: '#FDF2E0', borderColor: '#FDF2E0', color: '#000' }
};

const emptyFuente = { titulo: '', url: '' };

const FestividadForm = ({ festividad, onClose, onSave }) => {
    const [nombre, setNombre] = useState(festividad ? festividad.nombre : '');
    const [descripcion, setDescripcion] = useState(festividad ? festividad.descripcion : '');
    const [Imagen, setImagen] = useState(festividad ? festividad.Imagen || [] : []);
    const [fechaInicio, setFechaInicio] = useState(festividad && festividad.fecha ? festividad.fecha.inicio : '');
    const [fechaDuracion, setFechaDuracion] = useState(festividad && festividad.fecha ? festividad.fecha.duracion_dias || '' : '');
    const [municipios, setMunicipios] = useState(festividad ? festividad.municipios || [] : []);
    const [tipo, setTipo] = useState(festividad ? festividad.tipo : '');
    const [origen, setOrigen] = useState(festividad ? festividad.origen : '');
    const [actividades, setActividades] = useState(festividad ? festividad.actividades || [] : []);
    const [elementosCulturales, setElementosCulturales] = useState(festividad ? festividad.elementosCulturales || [] : []);
    const [importancia, setImportancia] = useState(festividad ? festividad.importancia : '');
    const [fuentes, setFuentes] = useState(festividad ? festividad.fuentes || [emptyFuente] : [emptyFuente]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const fileInputRef = useRef(null);

    // Helpers para arrays
    const handleArrayChange = (setter, arr, idx, value) => {
        const newArr = [...arr];
        newArr[idx] = value;
        setter(newArr);
    };
    const handleAddToArray = (setter, arr, emptyVal) => setter([...arr, emptyVal]);
    const handleRemoveFromArray = (setter, arr, idx) => setter(arr.filter((_, i) => i !== idx));

    const handleFuenteChange = (idx, field, value) => {
        const newArr = [...fuentes];
        newArr[idx][field] = value;
        setFuentes(newArr);
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
        formData.append('folder', 'productos'); // Subir a carpeta productos
        try {
            const res = await fetch(CLOUDINARY_URL, {
                method: 'POST',
                body: formData
            });
            const data = await res.json();
            if (data.secure_url) {
                setImagen([...Imagen, data.secure_url]);
            } else {
                setError('Error al subir imagen');
            }
        } catch (err) {
            setError('Error al subir imagen');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(false);
        if (!nombre || !descripcion) {
            setError('Nombre y descripción son obligatorios');
            setLoading(false);
            return;
        }
        try {
            const method = festividad ? 'PUT' : 'POST';
            const url = festividad ? `${API_URL}/${festividad._id}` : API_URL;
            const body = {
                nombre,
                descripcion,
                Imagen,
                fecha: { inicio: fechaInicio, duracion_dias: fechaDuracion },
                municipios,
                tipo,
                origen,
                actividades,
                elementosCulturales,
                importancia,
                fuentes
            };
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });
            if (!res.ok) throw new Error('Error al guardar festividad');
            setSuccess(true);
            onSave();
        } catch (err) {
            setError(err.message);
        }
        setLoading(false);
    };

    return (
        <Form onSubmit={handleSubmit}>
            <Row>
                <Col md={6}>
                    <Form.Group className="mb-3">
                        <Form.Label>Nombre</Form.Label>
                        <Form.Control value={nombre} onChange={e => setNombre(e.target.value)} required />
                    </Form.Group>
                </Col>
                <Col md={6}>
                    <Form.Group className="mb-3">
                        <Form.Label>Tipo</Form.Label>
                        <Form.Control value={tipo} onChange={e => setTipo(e.target.value)} />
                    </Form.Group>
                </Col>
            </Row>
            <Row>
                <Col md={6}>
                    <Form.Group className="mb-3">
                        <Form.Label>Fecha de inicio</Form.Label>
                        <Form.Control value={fechaInicio} onChange={e => setFechaInicio(e.target.value)} />
                    </Form.Group>
                </Col>
                <Col md={6}>
                    <Form.Group className="mb-3">
                        <Form.Label>Duración (días)</Form.Label>
                        <Form.Control type="number" value={fechaDuracion} onChange={e => setFechaDuracion(e.target.value)} />
                    </Form.Group>
                </Col>
            </Row>
            <Form.Group className="mb-3">
                <Form.Label>Descripción</Form.Label>
                <Form.Control as="textarea" rows={2} value={descripcion} onChange={e => setDescripcion(e.target.value)} required />
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>Origen</Form.Label>
                <Form.Control value={origen} onChange={e => setOrigen(e.target.value)} />
            </Form.Group>
            <Row>
                <Col md={6}>
                    <Form.Group className="mb-3">
                        <Form.Label>Municipios</Form.Label>
                        {municipios.map((m, idx) => (
                            <InputGroup className="mb-2" key={idx}>
                                <Form.Control value={m} onChange={e => handleArrayChange(setMunicipios, municipios, idx, e.target.value)} />
                                <Button variant="outline-danger" onClick={() => handleRemoveFromArray(setMunicipios, municipios, idx)}>-</Button>
                            </InputGroup>
                        ))}
                        <Button variant="outline-primary" size="sm" onClick={() => handleAddToArray(setMunicipios, municipios, '')}>+ Agregar Municipio</Button>
                    </Form.Group>
                </Col>
                <Col md={6}>
                    <Form.Group className="mb-3">
                        <Form.Label>Imágenes</Form.Label>
                        {Imagen.map((img, idx) => (
                            <div key={idx} style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                                <img
                                    src={img}
                                    alt={`preview-${idx}`}
                                    style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 4, marginRight: 8, border: '1px solid #ccc' }}
                                />
                                <Button variant="outline-danger" size="sm" onClick={() => handleRemoveFromArray(setImagen, Imagen, idx)}>-</Button>
                            </div>
                        ))}
                        <Form.Control
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            style={{ display: 'none' }}
                            ref={fileInputRef}
                        />
                        <Button
                            variant="outline-primary"
                            size="sm"
                            onClick={() => fileInputRef.current.click()}
                        >
                            + Agregar Imagen
                        </Button>
                    </Form.Group>
                </Col>
            </Row>
            <Row>
                <Col md={6}>
                    <Form.Group className="mb-3">
                        <Form.Label>Actividades</Form.Label>
                        {actividades.map((a, idx) => (
                            <InputGroup className="mb-2" key={idx}>
                                <Form.Control value={a} onChange={e => handleArrayChange(setActividades, actividades, idx, e.target.value)} />
                                <Button variant="outline-danger" onClick={() => handleRemoveFromArray(setActividades, actividades, idx)}>-</Button>
                            </InputGroup>
                        ))}
                        <Button variant="outline-primary" size="sm" onClick={() => handleAddToArray(setActividades, actividades, '')}>+ Agregar Actividad</Button>
                    </Form.Group>
                </Col>
                <Col md={6}>
                    <Form.Group className="mb-3">
                        <Form.Label>Elementos Culturales</Form.Label>
                        {elementosCulturales.map((el, idx) => (
                            <InputGroup className="mb-2" key={idx}>
                                <Form.Control value={el} onChange={e => handleArrayChange(setElementosCulturales, elementosCulturales, idx, e.target.value)} />
                                <Button variant="outline-danger" onClick={() => handleRemoveFromArray(setElementosCulturales, elementosCulturales, idx)}>-</Button>
                            </InputGroup>
                        ))}
                        <Button variant="outline-primary" size="sm" onClick={() => handleAddToArray(setElementosCulturales, elementosCulturales, '')}>+ Agregar Elemento</Button>
                    </Form.Group>
                </Col>
            </Row>
            <Form.Group className="mb-3">
                <Form.Label>Importancia</Form.Label>
                <Form.Control as="textarea" rows={2} value={importancia} onChange={e => setImportancia(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>Fuentes</Form.Label>
                {fuentes.map((fuente, idx) => (
                    <InputGroup className="mb-2" key={idx}>
                        <Form.Control placeholder="Título" value={fuente.titulo} onChange={e => handleFuenteChange(idx, 'titulo', e.target.value)} />
                        <Form.Control placeholder="URL" value={fuente.url} onChange={e => handleFuenteChange(idx, 'url', e.target.value)} />
                        <Button variant="outline-danger" onClick={() => handleRemoveFromArray(setFuentes, fuentes, idx)}>-</Button>
                    </InputGroup>
                ))}
                <Button variant="outline-primary" size="sm" onClick={() => handleAddToArray(setFuentes, fuentes, { ...emptyFuente })}>+ Agregar Fuente</Button>
            </Form.Group>
            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">Festividad guardada correctamente</Alert>}
            <div className="d-flex justify-content-end mt-4">
                <Button type="submit" style={customStyles.primary} disabled={loading} className="me-2">
                    {loading ? <Spinner size="sm" animation="border" /> : 'Guardar'}
                </Button>
                <Button variant="secondary" onClick={onClose}>Cancelar</Button>
            </div>
        </Form>
    );
};

export default FestividadForm;
