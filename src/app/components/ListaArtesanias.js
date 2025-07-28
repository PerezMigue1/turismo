// src/components/ListaArtesanias.js
import React from 'react';
import { Row, Col } from 'react-bootstrap';
import CardArtesania from './CardArtesania';

const ListaArtesanias = ({ artesanias }) => {
    return (
        <>
            {artesanias.length === 0 ? (
                <div style={{
                    textAlign: 'center',
                    padding: '40px',
                    color: '#9A1E47',
                    backgroundColor: '#FEF8ED',
                    borderRadius: '8px',
                    border: '1px dashed #9A1E47'
                }}>
                    No se encontraron productos en esta categoría
                </div>
            ) : (
                <Row xs={1} md={2} lg={3} className="g-4">
                    {artesanias.map((artesania) => (
                        <Col key={artesania.idProducto}>
                            <CardArtesania artesania={artesania} />
                        </Col>
                    ))}
                </Row>
            )}
        </>
    );
};

export default ListaArtesanias;