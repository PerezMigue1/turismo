import React from 'react';
import { Row, Col, Container } from 'react-bootstrap';
import CardRestaurante from './CardRestaurante';

const ListaRestaurantes = ({ restaurantes }) => {
    return (
        <Container className="py-4" style={{
            backgroundColor: '#FDF2E0',
            padding: '20px',
            borderRadius: '8px'
        }}>
            <h2 style={{ color: '#9A1E47', marginBottom: 24 }}>Restaurantes de la Huasteca</h2>
            {restaurantes.length === 0 ? (
                <div style={{
                    textAlign: 'center',
                    padding: '40px',
                    color: '#9A1E47',
                    backgroundColor: '#FEF8ED',
                    borderRadius: '8px',
                    border: '1px dashed #9A1E47'
                }}>
                    No se encontraron restaurantes
                </div>
            ) : (
                <Row xs={1} md={2} lg={3} className="g-4">
                    {restaurantes.map((restaurante) => (
                        <Col key={restaurante._id}>
                            <CardRestaurante restaurante={restaurante} />
                        </Col>
                    ))}
                </Row>
            )}
        </Container>
    );
};

export default ListaRestaurantes; 