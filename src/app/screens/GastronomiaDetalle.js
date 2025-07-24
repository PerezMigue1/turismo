import React, { useState } from 'react';
import { ArrowLeft, MapPin, Clock, Utensils, History, List } from 'lucide-react';

const GastronomiaDetalle = ({ gastronomia, onVolver }) => {
  const [activeTab, setActiveTab] = useState('descripcion');

  if (!gastronomia) {
    return (
      <div className="container d-flex justify-content-center align-items-center min-vh-100">
        <div className="alert alert-warning text-center">
          No se encontró la receta
          <button 
            onClick={onVolver}
            className="btn btn-link ms-2"
          >
            Volver
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <button onClick={onVolver} className="btn btn-outline-danger mb-4 d-flex align-items-center">
        <ArrowLeft className="me-2" size={20} />
        Volver
      </button>

      <div className="row g-4">
        {/* Columna Izquierda */}
        <div className="col-lg-7">
          <div className="card mb-4">
            <img
              src={gastronomia.imagen?.url || '/placeholder-food.jpg'}
              className="card-img-top"
              alt={gastronomia.nombre}
              onError={(e) => (e.target.src = '/placeholder-food.jpg')}
              style={{ maxHeight: '400px', objectFit: 'cover' }}
            />
          </div>

          <div className="card">
            <div className="card-body">
              {/* Tabs */}
              <ul className="nav nav-tabs mb-4">
                <li className="nav-item">
                  <button
                    className={`nav-link ${activeTab === 'descripcion' ? 'active' : ''}`}
                    onClick={() => setActiveTab('descripcion')}
                  >
                    Descripción
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    className={`nav-link ${activeTab === 'ingredientes' ? 'active' : ''}`}
                    onClick={() => setActiveTab('ingredientes')}
                  >
                    Ingredientes & Receta
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    className={`nav-link ${activeTab === 'info' ? 'active' : ''}`}
                    onClick={() => setActiveTab('info')}
                  >
                    Información adicional
                  </button>
                </li>
              </ul>

              {/* Contenido dinámico */}
              {activeTab === 'descripcion' && (
                <>
                  <h5 className="text-danger mb-3">Descripción del platillo</h5>
                  <p>{gastronomia.descripcion}</p>
                  {gastronomia.historiaOrigen && (
                    <>
                      <h5 className="text-danger d-flex align-items-center mt-4 mb-3">
                        <History className="me-2" size={20} />
                        Historia del platillo
                      </h5>
                      <p>{gastronomia.historiaOrigen}</p>
                    </>
                  )}
                </>
              )}

              {activeTab === 'ingredientes' && (
                <>
                  <h5 className="text-danger d-flex align-items-center mb-3">
                    <Utensils className="me-2" size={20} />
                    Ingredientes principales
                  </h5>
                  <ul className="list-group mb-4">
                    {gastronomia.ingredientes?.length > 0 ? (
                      gastronomia.ingredientes.map((ing, i) => (
                        <li key={i} className="list-group-item">{ing}</li>
                      ))
                    ) : (
                      <li className="list-group-item text-muted">No se especifican ingredientes</li>
                    )}
                  </ul>

                  {gastronomia.receta?.pasos && (
                    <>
                      <h5 className="text-danger d-flex align-items-center mb-3">
                        <List className="me-2" size={20} />
                        Pasos de preparación
                      </h5>
                      <ol className="ps-3">
                        {gastronomia.receta.pasos.map((paso, i) => (
                          <li key={i} className="mb-2">{paso}</li>
                        ))}
                      </ol>
                    </>
                  )}
                </>
              )}

              {activeTab === 'info' && (
                <>
                  <h5 className="text-danger mb-3">Detalles del platillo</h5>
                  <ul className="list-group">
                    <li className="list-group-item">
                      <strong>Tipo de platillo:</strong> {gastronomia.tipoPlatillo || 'No especificado'}
                    </li>
                    <li className="list-group-item">
                      <strong>Región de origen:</strong> {gastronomia.regionOrigen || 'No especificado'}
                    </li>
                    {gastronomia.receta && (
                      <>
                        <li className="list-group-item">
                          <strong>Tiempo de preparación:</strong> {gastronomia.receta.tiempoPreparacionMinutos} min
                        </li>
                        <li className="list-group-item">
                          <strong>Tiempo de cocción:</strong> {gastronomia.receta.tiempoCoccionHoras} h
                        </li>
                        <li className="list-group-item">
                          <strong>Porciones:</strong> {gastronomia.receta.porciones}
                        </li>
                      </>
                    )}
                  </ul>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Columna Derecha */}
        <div className="col-lg-5">
          <div className="card sticky-top" style={{ top: '1rem' }}>
            <div className="card-body">
              <h4 className="card-title text-danger">{gastronomia.nombre}</h4>
              <span className="badge bg-success mb-3">{gastronomia.tipoPlatillo}</span>

              <p className="d-flex align-items-center text-muted">
                <MapPin className="me-2" size={20} />
                Originario de {gastronomia.regionOrigen}
              </p>

              {/* Tiempo de preparación */}
              {gastronomia.receta && (
                <div className="row text-muted mb-3">
                  <div className="col-6 d-flex align-items-center">
                    <Clock className="me-2" size={20} /> {gastronomia.receta.tiempoPreparacionMinutos} min
                  </div>
                  <div className="col-6 d-flex align-items-center">
                    <Clock className="me-2" size={20} /> {gastronomia.receta.tiempoCoccionHoras} h
                  </div>
                </div>
              )}

              {/* Ubicaciones */}
              {gastronomia.ubicacionDondeEncontrar?.length > 0 && (
                <>
                  <h6 className="text-danger mt-4 mb-2 d-flex align-items-center">
                    <MapPin className="me-2" size={20} /> Dónde encontrarlo
                  </h6>
                  {gastronomia.ubicacionDondeEncontrar.map((lugar, i) => (
                    <div key={i} className="mb-3">
                      <p><strong>Lugar:</strong> {lugar.nombreLugar}</p>
                      <p><strong>Tipo:</strong> {lugar.tipoLugar}</p>
                      <p><strong>Dirección:</strong> {lugar.direccion}</p>
                    </div>
                  ))}
                </>
              )}

              {/* Consejos */}
              {gastronomia.consejosServir?.length > 0 && (
                <>
                  <h6 className="text-danger mt-4 mb-2 d-flex align-items-center">
                    <Utensils className="me-2" size={20} /> Consejos para servir
                  </h6>
                  <ul>
                    {gastronomia.consejosServir.map((consejo, i) => (
                      <li key={i} className="text-muted mb-1">• {consejo}</li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GastronomiaDetalle;
