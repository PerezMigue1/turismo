// src/components/ListaEcoturismo.js
import React from 'react';
import { Row, Col } from 'react-bootstrap';
import CardEcoturismo from './CardEcoturismo';

const ListaEcoturismo = ({ ecoturismos }) => {
    return (
        <>
            {ecoturismos.length === 0 ? (
                <div style={{
                    textAlign: 'center',
                    padding: '40px',
                    color: '#9A1E47',
                    backgroundColor: '#FEF8ED',
                    borderRadius: '8px',
                    border: '1px dashed #9A1E47'
                }}>
                    No se encontraron destinos de ecoturismo en esta categoría
                </div>
            ) : (
                <Row xs={1} md={2} lg={3} className="g-4">
                    {ecoturismos.map((ecoturismo) => (
                        <Col key={ecoturismo._id}>
                            <CardEcoturismo ecoturismo={ecoturismo} />
                        </Col>
                    ))}
                </Row>
            )}
        </>
    );
};

export default ListaEcoturismo; 