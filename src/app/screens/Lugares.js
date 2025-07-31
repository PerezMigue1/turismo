import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Spinner, Alert, Pagination } from 'react-bootstrap';
import ListaLugares from '../components/ListaLugares';
import axios from 'axios';
import { FaMapMarkedAlt } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';

const Lugares = () => {
  const [lugares, setLugares] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [municipioFiltro, setMunicipioFiltro] = useState('');
  const [categoriaFiltro, setCategoriaFiltro] = useState('');
  const [busqueda, setBusqueda] = useState('');
  const [ordenamiento, setOrdenamiento] = useState('');
  
  // Estados para paginación
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12; // 3 columnas x 4 filas

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get('https://backend-iota-seven-19.vercel.app/api/lugares');
        setLugares(res.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Obtener valores únicos para los filtros
  const municipios = Array.from(new Set(lugares.map(l => l.Ubicacion?.Municipio || l.municipio).filter(Boolean))).sort();
  const categorias = Array.from(new Set(lugares.map(l => l.idCtgLugar || l.Categoria || l.categoria).filter(Boolean))).sort();

  // Filtrar lugares
  const lugaresFiltrados = lugares.filter(l => {
    const cumpleBusqueda = !busqueda || 
      (l.Nombre || l.nombre)?.toLowerCase().includes(busqueda.toLowerCase()) ||
      (l.Descripcion || l.descripcion)?.toLowerCase().includes(busqueda.toLowerCase());
    
    const coincideMunicipio = !municipioFiltro || (l.Ubicacion?.Municipio || l.municipio) === municipioFiltro;
    const coincideCategoria = !categoriaFiltro || (l.idCtgLugar || l.Categoria || l.categoria) === categoriaFiltro;
    
    return cumpleBusqueda && coincideMunicipio && coincideCategoria;
  });

  // Ordenar lugares
  const lugaresOrdenados = [...lugaresFiltrados].sort((a, b) => {
    switch (ordenamiento) {
      case 'nombre-asc':
        return (a.Nombre || a.nombre).localeCompare(b.Nombre || b.nombre);
      case 'nombre-desc':
        return (b.Nombre || b.nombre).localeCompare(a.Nombre || a.nombre);
      case 'municipio-asc':
        return (a.Ubicacion?.Municipio || a.municipio).localeCompare(b.Ubicacion?.Municipio || b.municipio);
      case 'municipio-desc':
        return (b.Ubicacion?.Municipio || b.municipio).localeCompare(a.Ubicacion?.Municipio || a.municipio);
      default:
        return 0;
    }
  });

  // Lógica de paginación
  const totalPages = Math.ceil(lugaresOrdenados.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = lugaresOrdenados.slice(indexOfFirstItem, indexOfLastItem);

  // Resetear página cuando cambian los filtros
  useEffect(() => {
    setCurrentPage(1);
  }, [municipioFiltro, categoriaFiltro, busqueda, ordenamiento]);

  const limpiarFiltros = () => {
    setMunicipioFiltro('');
    setCategoriaFiltro('');
    setBusqueda('');
    setOrdenamiento('');
    setCurrentPage(1);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
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
  }

  if (error) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#FDF2E0',
        color: '#9A1E47'
      }}>
        <Alert variant="danger">
          Error al cargar los lugares: {error}
        </Alert>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#FDF2E0', minHeight: '100vh', padding: '20px 0' }}>
      <Container className="py-4" style={{
        backgroundColor: '#FDF2E0',
        padding: '20px',
        borderRadius: '8px'
      }}>
        {/* Título y descripción */}
        <div className="text-center mb-5">
          <h1 style={{ color: '#9A1E47', marginBottom: '15px', fontSize: '2.5rem', fontWeight: '700' }}>
            Lugares Turísticos de la Huasteca
          </h1>
          <p style={{ 
            color: '#666', 
            fontSize: '1.1rem', 
            maxWidth: '600px', 
            margin: '0 auto',
            lineHeight: '1.6'
          }}>
            Descubre los mejores lugares turísticos de la región. Desde cascadas naturales hasta sitios históricos, 
            encuentra experiencias únicas que te conectarán con la belleza y cultura de la Huasteca.
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
              <option value="nombre-asc">Nombre: A-Z</option>
              <option value="nombre-desc">Nombre: Z-A</option>
              <option value="municipio-asc">Municipio: A-Z</option>
              <option value="municipio-desc">Municipio: Z-A</option>
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
              {municipios.map((municipio, index) => (
                <option key={index} value={municipio}>
                  {municipio}
                </option>
              ))}
            </Form.Select>
            <Form.Select
              value={categoriaFiltro}
              onChange={e => setCategoriaFiltro(e.target.value)}
              style={{
                width: '140px',
                borderColor: '#1E8546',
                color: '#9A1E47',
                marginRight: '8px',
                fontWeight: 600
              }}
            >
              <option value="">Categoría</option>
              {categorias.map((categoria, index) => (
                <option key={index} value={categoria}>
                  {categoria}
                </option>
              ))}
            </Form.Select>
            <Form.Control
              type="text"
              placeholder="Buscar lugar..."
              value={busqueda}
              onChange={e => setBusqueda(e.target.value)}
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
              disabled={!busqueda && !categoriaFiltro && !municipioFiltro && !ordenamiento}
            >
              Limpiar filtros
            </Button>
          </div>
        </div>

        {/* Contenido */}
        {lugaresOrdenados.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '40px',
            color: '#9A1E47',
            backgroundColor: '#FEF8ED',
            borderRadius: '8px',
            border: '1px dashed #9A1E47'
          }}>
            <div style={{
              width: '80px',
              height: '80px',
              backgroundColor: '#f8f9fa',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
              border: '3px solid #0FA89C'
            }}>
              <FaMapMarkedAlt style={{ 
                fontSize: '2rem', 
                color: '#9A1E47' 
              }} />
            </div>
            <h4 style={{ color: '#9A1E47', marginBottom: '15px' }}>
              No hay lugares disponibles
            </h4>
            <p style={{ color: '#666', margin: 0 }}>
              No hay lugares disponibles con estos criterios
            </p>
          </div>
        ) : (
          <ListaLugares
            lugares={currentItems}
          />
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
                Mostrando {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, lugaresOrdenados.length)} de {lugaresOrdenados.length} lugares
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

export default Lugares;
