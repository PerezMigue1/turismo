import React from 'react';
import { Row, Col } from 'react-bootstrap';
import CardLugares from './CardLugares';

const ListaLugares = ({ lugares }) => {
  return (
    <>
      {lugares.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '40px',
          color: '#9A1E47',
          backgroundColor: '#FEF8ED',
          borderRadius: '8px',
          border: '1px dashed #9A1E47'
        }}>
          No se encontraron lugares en esta categoría
        </div>
      ) : (
        <Row xs={1} md={2} lg={3} className="g-4">
          {lugares.map((lugar) => (
            <Col key={lugar._id}>
              <CardLugares lugar={lugar} />
            </Col>
          ))}
        </Row>
      )}
    </>
  );
};

export default ListaLugares;
