// src/components/ListaArtesanias.js
import React from 'react';
import { Row, Col, Container, Form } from 'react-bootstrap';
import CardArtesania from './CardArtesania';

const ListaArtesanias = ({ artesanias, categoriaFiltro, setCategoriaFiltro }) => {
    const categorias = ['Textiles', 'Madera', 'Cerámica', 'Orfebrería'];

    return (
        <Container className="py-4" style={{
            backgroundColor: '#FDF2E0',
            padding: '20px',
            borderRadius: '8px'
        }}>
            <div className="d-flex justify-content-between mb-4">
                <h2 style={{ color: '#9A1E47' }}>Artesanías de la Huasteca</h2>
                <Form.Select
                    style={{
                        width: '200px',
                        borderColor: '#1E8546',
                        color: '#9A1E47',
                        ':focus': {
                            boxShadow: '0 0 0 0.25rem rgba(242, 139, 39, 0.25)'
                        }
                    }}
                    value={categoriaFiltro}
                    onChange={(e) => setCategoriaFiltro(e.target.value)}
                >
                    <option value="">Todas las categorías</option>
                    {categorias.map((categoria, index) => (
                        <option key={index} value={categoria}>{categoria}</option>
                    ))}
                </Form.Select>
            </div>
            <Row xs={1} md={2} lg={3} className="g-4">
                {artesanias.map((artesania) => (
                    <Col key={artesania.id}>
                        <CardArtesania artesania={artesania} />
                    </Col>
                ))}
            </Row>
        </Container>
    );
};

export default ListaArtesanias;