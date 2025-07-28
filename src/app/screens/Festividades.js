import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Spinner, Pagination } from 'react-bootstrap';
import CardFestividades from '../components/CardFestividades';
import DetalleFestividades from '../screens/DetalleFestividades';
import axios from 'axios';

const Festividades = () => {
  const [festividades, setFestividades] = useState([]);
  const [municipioFiltro, setMunicipioFiltro] = useState('');
  const [tipoFiltro, setTipoFiltro] = useState('');
  const [busquedaTexto, setBusquedaTexto] = useState('');
  const [ordenamiento, setOrdenamiento] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [festividadSeleccionada, setFestividadSeleccionada] = useState(null);
  const [mostrarDetalle, setMostrarDetalle] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12; // 3 columnas x 4 filas
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Cambia la URL por la de tu API real
        const res = await axios.get('https://backend-iota-seven-19.vercel.app/api/festividades');
        setFestividades(res.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Obtener municipios y tipos únicos
  const municipios = Array.from(new Set(festividades.flatMap(f => f.municipios))).sort();
  const tipos = Array.from(new Set(festividades.flatMap(f => f.tipo.split(',').map(t => t.trim())))).sort();

  // Filtrar festividades
  const festividadesFiltradas = festividades.filter(f => {
    const cumpleMunicipio = !municipioFiltro || f.municipios.includes(municipioFiltro);
    const cumpleTipo = !tipoFiltro || f.tipo.split(',').map(t => t.trim()).includes(tipoFiltro);
    const cumpleBusqueda = !busquedaTexto || f.nombre.toLowerCase().includes(busquedaTexto.toLowerCase());
    return cumpleMunicipio && cumpleTipo && cumpleBusqueda;
  });

  // Ordenar festividades
  const festividadesOrdenadas = [...festividadesFiltradas].sort((a, b) => {
    switch (ordenamiento) {
      case 'fecha-inicio':
        return a.fecha?.inicio.localeCompare(b.fecha?.inicio);
      case 'nombre-asc':
        return a.nombre.localeCompare(b.nombre);
      case 'nombre-desc':
        return b.nombre.localeCompare(a.nombre);
      default:
        return 0;
    }
  });

  // Lógica de paginación
  const totalPages = Math.ceil(festividadesOrdenadas.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = festividadesOrdenadas.slice(indexOfFirstItem, indexOfLastItem);

  // Resetear página cuando cambian los filtros
  useEffect(() => {
    setCurrentPage(1);
  }, [busquedaTexto, municipioFiltro, tipoFiltro, ordenamiento]);

  const onVerFestividad = (festividad) => {
    setFestividadSeleccionada(festividad);
    setMostrarDetalle(true);
  };

  const onVolver = () => {
    setMostrarDetalle(false);
    setFestividadSeleccionada(null);
  };

  const limpiarFiltros = () => {
    setMunicipioFiltro('');
    setTipoFiltro('');
    setBusquedaTexto('');
    setOrdenamiento('');
    setCurrentPage(1);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (mostrarDetalle) {
    return <DetalleFestividades festividad={festividadSeleccionada} onVolver={onVolver} />;
  }

  if (loading) return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      backgroundColor: '#FDF2E0'
    }}>
      <Spinner animation="border" variant="primary" />
    </div>
  );

  if (error) return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      backgroundColor: '#FDF2E0',
      color: '#9A1E47'
    }}>
      <div className="alert alert-danger" role="alert">
        Error al cargar las festividades: {error}
      </div>
    </div>
  );

  return (
    <div style={{
      backgroundColor: '#FDF2E0',
      minHeight: '100vh',
      padding: '20px 0',
    }}>
      <Container className="py-4" style={{
        backgroundColor: '#FDF2E0',
        padding: '20px',
        borderRadius: '8px'
      }}>
        {/* Título y descripción */}
        <div className="text-center mb-5">
          <h1 style={{ color: '#9A1E47', marginBottom: '15px', fontSize: '2.5rem', fontWeight: '700' }}>
            Festividades de la Huasteca
          </h1>
          <p style={{ 
            color: '#666', 
            fontSize: '1.1rem', 
            maxWidth: '600px', 
            margin: '0 auto',
            lineHeight: '1.6'
          }}>
            Vive la magia de las tradiciones huastecas a través de sus festividades más importantes. 
            Celebra la cultura, la música y las costumbres que hacen única a esta región.
          </p>
        </div>

        {/* Filtros */}
        <div className="d-flex justify-content-center mb-4">
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <Form.Select
              value={ordenamiento}
              onChange={e => setOrdenamiento(e.target.value)}
              style={{
                width: '160px',
                borderColor: '#1E8546',
                color: '#9A1E47',
                marginRight: '8px',
                fontWeight: 600
              }}
            >
              <option value="">Ordenar por</option>
              <option value="fecha-inicio">Fecha de inicio</option>
              <option value="nombre-asc">Nombre: A-Z</option>
              <option value="nombre-desc">Nombre: Z-A</option>
            </Form.Select>
            <Form.Select
              value={tipoFiltro}
              onChange={e => setTipoFiltro(e.target.value)}
              style={{
                width: '140px',
                borderColor: '#1E8546',
                color: '#9A1E47',
                marginRight: '8px',
                fontWeight: 600
              }}
            >
              <option value="">Tipo</option>
              {tipos.map(tipo => (
                <option key={tipo} value={tipo}>{tipo}</option>
              ))}
            </Form.Select>
            <Form.Select
              value={municipioFiltro}
              onChange={e => setMunicipioFiltro(e.target.value)}
              style={{
                width: '140px',
                borderColor: '#1E8546',
                color: '#9A1E47',
                marginRight: '8px',
                fontWeight: 600
              }}
            >
              <option value="">Municipio</option>
              {municipios.map(mun => (
                <option key={mun} value={mun}>{mun}</option>
              ))}
            </Form.Select>
            <Form.Control
              type="text"
              placeholder="Buscar festividad..."
              value={busquedaTexto}
              onChange={e => setBusquedaTexto(e.target.value)}
              style={{
                width: '180px',
                borderColor: '#1E8546',
                color: '#9A1E47',
                marginRight: '8px',
                fontWeight: 600
              }}
            />
            <Button
              variant="outline-secondary"
              size="sm"
              onClick={limpiarFiltros}
              style={{
                borderColor: '#9A1E47',
                color: '#9A1E47',
                fontWeight: '500',
                borderRadius: '8px',
                padding: '8px 16px',
                fontSize: '0.85rem',
                height: '40px'
              }}
              disabled={!municipioFiltro && !tipoFiltro && !busquedaTexto && !ordenamiento}
            >
              Limpiar filtros
            </Button>
          </div>
        </div>

        {/* Contenido */}
        {festividadesOrdenadas.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '40px',
            color: '#9A1E47',
            backgroundColor: '#FEF8ED',
            borderRadius: '8px',
            border: '1px dashed #9A1E47'
          }}>
            No se encontraron festividades con estos criterios
          </div>
        ) : (
          <Row xs={1} md={2} lg={3} className="g-4">
            {currentItems.map(fest => (
              <Col key={fest._id.$oid || fest._id}>
                <CardFestividades festividad={fest} onVerDetalle={onVerFestividad} />
              </Col>
            ))}
          </Row>
        )}

        {/* Paginación */}
        {totalPages > 1 && (
          <div className="d-flex justify-content-center mt-4">
            <div className="text-center">
              <p style={{ 
                color: '#9A1E47', 
                marginBottom: '15px',
                fontSize: '0.9rem',
                fontWeight: '500'
              }}>
                Mostrando {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, festividadesOrdenadas.length)} de {festividadesOrdenadas.length} festividades
              </p>
              <Pagination style={{ margin: 0 }}>
                <Pagination.Prev 
                  onClick={() => handlePageChange(currentPage - 1)} 
                  disabled={currentPage === 1}
                  style={{
                    color: currentPage === 1 ? '#ccc' : '#9A1E47',
                    borderColor: '#1E8546'
                  }}
                />
                {Array.from({ length: totalPages }, (_, i) => (
                  <Pagination.Item 
                    key={i + 1} 
                    active={i + 1 === currentPage}
                    onClick={() => handlePageChange(i + 1)}
                    style={{
                      backgroundColor: i + 1 === currentPage ? '#9A1E47' : 'transparent',
                      borderColor: '#1E8546',
                      color: i + 1 === currentPage ? 'white' : '#9A1E47'
                    }}
                  >
                    {i + 1}
                  </Pagination.Item>
                ))}
                <Pagination.Next 
                  onClick={() => handlePageChange(currentPage + 1)} 
                  disabled={currentPage === totalPages}
                  style={{
                    color: currentPage === totalPages ? '#ccc' : '#9A1E47',
                    borderColor: '#1E8546'
                  }}
                />
              </Pagination>
            </div>
          </div>
        )}
      </Container>
    </div>
  );
};

export default Festividades;