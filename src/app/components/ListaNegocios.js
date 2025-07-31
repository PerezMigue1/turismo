
// src/app/components/ListaNegocios.js
import React from 'react';
import { Row, Col } from 'react-bootstrap';
import CardNegocio from './CardNegocio';

const ListaNegocios = ({ negocios }) => {
  return (
    <>
      {negocios.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '40px',
          color: '#9A1E47',
          backgroundColor: '#FEF8ED',
          borderRadius: '8px',
          border: '1px dashed #9A1E47'
        }}>
          No se encontraron negocios en esta categoría
        </div>
      ) : (
        <Row xs={1} md={2} lg={3} className="g-4">
          {negocios.map((negocio) => (
            <Col key={negocio._id}>
              <CardNegocio negocio={negocio} />
            </Col>
          ))}
        </Row>
      )}
    </>
  );
};

export default ListaNegocios;
