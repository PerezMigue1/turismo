import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Tooltip, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";

// Componente para controlar el mapa
const MapController = ({ center, zoom }) => {
  const map = useMap();
  
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  
  return null;
};

// Iconos personalizados
const hospedajeIcon = new L.Icon({ iconUrl: "/icons/hospedaje.png", iconSize: [32, 32] });
const restauranteIcon = new L.Icon({ iconUrl: "/icons/restaurante.png", iconSize: [32, 32] });
const lugarTuristicoIcon = new L.Icon({ iconUrl: "/icons/lugarTuristico.png", iconSize: [32, 32] });
const ecoturismoIcon = new L.Icon({ iconUrl: "/icons/ecoturismo.png", iconSize: [32, 32] });
const API_BASE = "https://backend-iota-seven-19.vercel.app/api";

const CarruselImagenes = ({ imagenes }) => {
  const [indice, setIndice] = useState(0);
  if (!imagenes || imagenes.length === 0) return null;
  const siguiente = (e) => { e.stopPropagation(); setIndice((prev) => (prev + 1) % imagenes.length); };
  const anterior = (e) => { e.stopPropagation(); setIndice((prev) => (prev - 1 + imagenes.length) % imagenes.length); };

  return (
    <div style={{ position: 'relative', width: '100%', height: 90, marginBottom: 8 }}>
      <img
        src={imagenes[indice]}
        alt={`Imagen ${indice + 1}`}
        style={{ width: '110%', height: 90, objectFit: 'cover', borderTopLeftRadius: 8, borderTopRightRadius: 8 }}
      />
      {imagenes.length > 1 && (
        <>
          <button onClick={anterior} style={{ position: 'absolute', left: 4, top: '40%', background: 'rgba(0,0,0,0.4)', color: 'white', border: 'none', borderRadius: '50%', width: 24, height: 24, cursor: 'pointer', fontWeight: 'bold' }}>&lt;</button>
          <button onClick={siguiente} style={{ position: 'absolute', right: 4, top: '40%', background: 'rgba(0,0,0,0.4)', color: 'white', border: 'none', borderRadius: '50%', width: 24, height: 24, cursor: 'pointer', fontWeight: 'bold' }}>&gt;</button>
        </>
      )}
      {imagenes.length > 1 && (
        <div style={{ position: 'absolute', bottom: 4, right: 8, background: 'rgba(0,0,0,0.4)', color: 'white', borderRadius: 8, fontSize: 11, padding: '1px 6px' }}>
          {indice + 1}/{imagenes.length}
        </div>
      )}
    </div>
  );
};

const Mapa = () => {
  const [hospedajes, setHospedajes] = useState([]);
  const [lugaresTuristicos, setLugaresTuristicos] = useState([]);
  const [restaurantes, setRestaurantes] = useState([]);
  const [ecoturismo, setEcoturismo] = useState([]);
  const [tipoFiltro, setTipoFiltro] = useState("todos");
  const [municipioFiltro, setMunicipioFiltro] = useState("");
  const [mapCenter, setMapCenter] = useState([21.142, -98.423]);
  const [mapZoom, setMapZoom] = useState(14);

  // Función para mover el mapa al municipio seleccionado
  const moverAMunicipio = (municipio) => {
    // Coordenadas hardcodeadas para municipios principales
    const coordenadasHardcodeadas = {
      "Atlapexco": [21.017, -98.350],
      "Huautla": [21.033, -98.283],
      "Huazalingo": [20.9803762, -98.509207],
      "Huejutla de Reyes": [21.133, -98.417],
      "Jaltocán": [21.133, -98.533],
      "San Felipe Orizatlán": [21.167, -98.600],
      "Xochiatipan": [20.833, -98.283],
      "Yahualica": [20.950, -98.383],
      "Calnali": [20.917, -98.583],
      "Tepehuacán de Guerrero": [21.017, -98.850]
    };

    // Si tenemos coordenadas hardcodeadas, usarlas
    if (coordenadasHardcodeadas[municipio]) {
      setMapCenter(coordenadasHardcodeadas[municipio]);
      setMapZoom(13);
      return;
    }

    // Si no tenemos coordenadas hardcodeadas, calcular el centro basado en los datos
    const datosMunicipio = [
      ...hospedajes.filter(h => extraerMunicipioHospedaje(h) === municipio),
      ...lugaresTuristicos.filter(l => extraerMunicipioLugar(l) === municipio),
      ...restaurantes.filter(r => extraerMunicipioRestaurante(r) === municipio),
      ...ecoturismo.filter(e => extraerMunicipioEcoturismo(e) === municipio)
    ];

    const coordenadas = datosMunicipio
      .map(item => {
        if (item.Coordenadas?.lat && item.Coordenadas?.lng) {
          return [item.Coordenadas.lat, item.Coordenadas.lng];
        }
        if (item.Ubicacion?.Coordenadas?.lat && item.Ubicacion?.Coordenadas?.lng) {
          return [item.Ubicacion.Coordenadas.lat, item.Ubicacion.Coordenadas.lng];
        }
        if (item.coordenadas?.latitud && item.coordenadas?.longitud) {
          return [parseFloat(item.coordenadas.latitud), parseFloat(item.coordenadas.longitud)];
        }
        return null;
      })
      .filter(Boolean);

    if (coordenadas.length > 0) {
      // Calcular el centro promedio de todas las coordenadas
      const latPromedio = coordenadas.reduce((sum, coord) => sum + coord[0], 0) / coordenadas.length;
      const lngPromedio = coordenadas.reduce((sum, coord) => sum + coord[1], 0) / coordenadas.length;
      
      setMapCenter([latPromedio, lngPromedio]);
      setMapZoom(13);
    } else {
      // Si no hay coordenadas, usar el centro por defecto
      setMapCenter([21.142, -98.423]);
      setMapZoom(14);
    }
  };

  useEffect(() => {
    axios.get(`${API_BASE}/hospedaje`).then(res => setHospedajes(res.data));
    axios.get(`${API_BASE}/lugares`).then(res => setLugaresTuristicos(res.data));
    axios.get(`${API_BASE}/restaurante`).then(res => setRestaurantes(res.data));
    axios.get(`${API_BASE}/ecoturismo/public`).then(res => {
      if (res.data.success) {
        setEcoturismo(res.data.data);
      }
    });
  }, []);

  // Función para extraer municipio de hospedajes
  const extraerMunicipioHospedaje = (hospedaje) => {
    if (!hospedaje.Ubicacion) return "";
    const partes = hospedaje.Ubicacion.split(",");
    return partes.length >= 3 ? partes[2].replace(/[0-9]/g, '').trim() : "";
  };

  // Función para extraer municipio de lugares turísticos
  const extraerMunicipioLugar = (lugar) => {
    return lugar.Ubicacion?.Municipio || "";
  };

  // Función para extraer municipio de restaurantes
  const extraerMunicipioRestaurante = (restaurante) => {
    return restaurante.Ubicacion?.Municipio || "";
  };

  // Función para extraer municipio de ecoturismo
  const extraerMunicipioEcoturismo = (ecoturismo) => {
    if (!ecoturismo.ubicacion) return "";
    
    // Intentar diferentes formatos de ubicación
    const ubicacion = ecoturismo.ubicacion.trim();
    
    // Si la ubicación contiene comas, intentar extraer el municipio
    if (ubicacion.includes(',')) {
      const partes = ubicacion.split(',');
      // Buscar el municipio en las partes (generalmente está en la posición 2 o 3)
      for (let i = 0; i < partes.length; i++) {
        const parte = partes[i].trim();
        // Verificar si esta parte parece ser un municipio (no números, no muy corto)
        if (parte.length > 2 && !/^\d+$/.test(parte) && !parte.toLowerCase().includes('hidalgo')) {
          return parte;
        }
      }
    }
    
    // Si no se puede extraer de forma estructurada, devolver la ubicación completa
    return ubicacion;
  };

  const municipiosHospedaje = Array.from(new Set(
    hospedajes.map(h => extraerMunicipioHospedaje(h))
  )).filter(Boolean);
  const municipiosLugares = Array.from(new Set(
    lugaresTuristicos.map(l => extraerMunicipioLugar(l))
  )).filter(Boolean);
  const municipiosRestaurantes = Array.from(new Set(
    restaurantes.map(r => extraerMunicipioRestaurante(r))
  )).filter(Boolean);
  const municipiosEcoturismo = Array.from(new Set(
    ecoturismo.map(e => extraerMunicipioEcoturismo(e))
  )).filter(Boolean);
  const municipios = Array.from(new Set([...municipiosHospedaje, ...municipiosLugares, ...municipiosRestaurantes, ...municipiosEcoturismo])).sort();

  const hospedajesFiltrados = hospedajes.filter(h => {
    if (!municipioFiltro) return true;
    const municipio = extraerMunicipioHospedaje(h);
    return municipio === municipioFiltro;
  });
  
  const lugaresFiltrados = lugaresTuristicos.filter(l => {
    if (!municipioFiltro) return true;
    const municipio = extraerMunicipioLugar(l);
    return municipio === municipioFiltro;
  });
  
  const restaurantesFiltrados = restaurantes.filter(r => {
    const tieneID = r.idRestaurante || r._id;
    if (!tieneID) return false;
    if (!municipioFiltro) return true;
    const municipio = extraerMunicipioRestaurante(r);
    return municipio === municipioFiltro;
  });
  
  const ecoturismoFiltrado = ecoturismo.filter(e => {
    if (!municipioFiltro) return true;
    const municipio = extraerMunicipioEcoturismo(e);
    return municipio === municipioFiltro;
  });

  return (
    <div>
      <div style={{ display: 'flex', gap: 16, alignItems: 'center', margin: '16px 0 8px 0', flexWrap: 'wrap' }}>
        <div>
          {["todos", "hospedaje", "lugar", "restaurante", "ecoturismo"].map(tipo => (
            <button
              key={tipo}
              onClick={() => setTipoFiltro(tipo)}
              style={{
                background: tipoFiltro === tipo ? '#1E8546' : '#eee',
                color: tipoFiltro === tipo ? 'white' : '#222',
                border: 'none',
                borderRadius: 8,
                padding: '6px 16px',
                marginRight: 8,
                cursor: 'pointer',
                fontWeight: 600
              }}
            >
              {tipo === "todos" ? "Todos" : tipo === "hospedaje" ? "Hospedajes" : tipo === "lugar" ? "Lugares turísticos" : tipo === "restaurante" ? "Restaurantes" : "Ecoturismo"}
            </button>
          ))}
        </div>
        <div>
          <select
            value={municipioFiltro}
            onChange={e => {
              const municipioSeleccionado = e.target.value;
              setMunicipioFiltro(municipioSeleccionado);
              if (municipioSeleccionado) {
                moverAMunicipio(municipioSeleccionado);
              } else {
                // Si se selecciona "Todos los municipios", volver al centro original
                setMapCenter([21.142, -98.423]);
                setMapZoom(14);
              }
            }}
            style={{ borderRadius: 8, padding: '6px 12px', border: '1px solid #1E8546', color: '#1E8546', fontWeight: 600 }}
          >
            <option value="">Todos los municipios</option>
            {municipios.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>
      </div>

      <MapContainer center={mapCenter} zoom={mapZoom} style={{ height: "80vh", width: "100%" }}>
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapController center={mapCenter} zoom={mapZoom} />

        {(tipoFiltro === "todos" || tipoFiltro === "hospedaje") && hospedajesFiltrados.map(h => (
          h.Coordenadas?.lat && h.Coordenadas?.lng && (
            <Marker
              key={h.idHotel || h._id}
              position={[h.Coordenadas.lat, h.Coordenadas.lng]}
              icon={hospedajeIcon}
            >
              <Popup minWidth={250}>
                <div style={{ textAlign: 'left', padding: 0, width: 220 }}>
                  {h.Imagenes?.length > 0 && <CarruselImagenes imagenes={h.Imagenes} />}
                  <div style={{ padding: '0 8px 8px 8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ fontWeight: 700, fontSize: 16, color: '#222' }}>{h.Nombre}</div>
                      <span
                        style={{ cursor: 'pointer', fontSize: 20, marginLeft: 8 }}
                        title="Ver detalle"
                        onClick={() => window.location.href = `/hospedajes/${h.idHotel || h._id}`}
                      >ℹ️</span>
                    </div>
                    <div style={{ fontSize: 13, color: '#1E8546', fontWeight: 500, margin: '4px 0' }}>
                      {(h.Ubicacion?.split(",")[2] || "").replace(/[0-9]/g, '').trim()}
                    </div>
                    {h.Horario && <div style={{ fontSize: 13, color: '#388e3c', fontWeight: 500 }}>{h.Horario}</div>}
                  </div>
                </div>
              </Popup>
              <Tooltip>{h.Nombre}</Tooltip>
            </Marker>
          )
        ))}

        {(tipoFiltro === "todos" || tipoFiltro === "lugar") && lugaresFiltrados.map(l => (
          l.Ubicacion?.Coordenadas?.lat && l.Ubicacion?.Coordenadas?.lng && (
            <Marker
              key={l.idLugar || l._id}
              position={[l.Ubicacion.Coordenadas.lat, l.Ubicacion.Coordenadas.lng]}
              icon={lugarTuristicoIcon}
            >
              <Popup minWidth={250}>
                <div style={{ textAlign: 'left', padding: 0, width: 220 }}>
                  {l.Imagen && <img src={l.Imagen} alt={l.Nombre} style={{ width: '110%', height: 90, objectFit: 'cover', borderTopLeftRadius: 8, borderTopRightRadius: 8, marginBottom: 8 }} />}
                  <div style={{ padding: '0 8px 8px 8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ fontWeight: 700, fontSize: 16, color: '#222' }}>{l.Nombre}</div>
                    <span
                      style={{ cursor: 'pointer', fontSize: 20, marginLeft: 8 }}
                      title="Ver detalle"
                      onClick={() => {
                        const id = l.idLugar || l._id;
                        if (id) {
                          window.location.href = `/lugares/${id}`;
                        } else {
                          console.warn('Lugar sin ID válido:', l);
                          alert('Este lugar no tiene un ID válido para mostrar detalles.');
                        }
                      }}
                    >ℹ️</span>
                  </div>
                  <div style={{ fontSize: 13, color: '#1E8546', fontWeight: 500 }}>{l.Ubicacion.Municipio}</div>
                  {l.Horarios && <div style={{ fontSize: 13, color: '#388e3c', fontWeight: 500 }}>{l.Horarios}</div>}
                </div>
              </div>
            </Popup>
            <Tooltip>{l.Nombre}</Tooltip>
          </Marker>
        )
      ))}


        {(tipoFiltro === "todos" || tipoFiltro === "restaurante") && restaurantesFiltrados.map(r => (
          r.Ubicacion?.Coordenadas?.lat && r.Ubicacion?.Coordenadas?.lng && (
            <Marker
              key={r.idRestaurante || r._id}
              position={[r.Ubicacion.Coordenadas.lat, r.Ubicacion.Coordenadas.lng]}
              icon={restauranteIcon}
            >
              <Popup minWidth={250}>
                <div style={{ textAlign: 'left', padding: 0, width: 220 }}>
                  {r.Imagenes?.length > 0 && <CarruselImagenes imagenes={r.Imagenes} />}
                  <div style={{ padding: '0 8px 8px 8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ fontWeight: 700, fontSize: 16, color: '#222' }}>{r.Nombre}</div>
                      <span
                        style={{ cursor: 'pointer', fontSize: 20, marginLeft: 8 }}
                        title="Ver detalle"
                        onClick={() => {
                          const id = r.idRestaurante || r._id;
                          if (id) {
                            window.location.href = `/restaurantes/${id}`;
                          } else {
                            console.warn('Restaurante sin ID válido:', r);
                            alert('Este restaurante no tiene un ID válido para mostrar detalles.');
                          }
                        }}
                      >ℹ️</span>
                    </div>
                    <div style={{ fontSize: 13, color: '#1E8546', fontWeight: 500 }}>{r.Ubicacion.Municipio}</div>
                    {r.Horario && <div style={{ fontSize: 13, color: '#388e3c', fontWeight: 500 }}>{r.Horario}</div>}
                  </div>
                </div>
              </Popup>
              <Tooltip>{r.Nombre}</Tooltip>
            </Marker>
          )
        ))}

        {(tipoFiltro === "todos" || tipoFiltro === "ecoturismo") && ecoturismoFiltrado.map(e => (
          e.coordenadas?.latitud && e.coordenadas?.longitud && (
            <Marker
              key={e._id}
              position={[parseFloat(e.coordenadas.latitud), parseFloat(e.coordenadas.longitud)]}
              icon={ecoturismoIcon}
            >
              <Popup minWidth={250}>
                <div style={{ textAlign: 'left', padding: 0, width: 220 }}>
                  {e.imagenes?.length > 0 && <CarruselImagenes imagenes={e.imagenes} />}
                  <div style={{ padding: '0 8px 8px 8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ fontWeight: 700, fontSize: 16, color: '#222' }}>{e.nombre}</div>
                      <span
                        style={{ cursor: 'pointer', fontSize: 20, marginLeft: 8 }}
                        title="Ver detalle"
                        onClick={() => {
                          if (e._id) {
                            window.location.href = `/ecoturismo/${e._id}`;
                          } else {
                            console.warn('Ecoturismo sin ID válido:', e);
                            alert('Este destino de ecoturismo no tiene un ID válido para mostrar detalles.');
                          }
                        }}
                      >ℹ️</span>
                    </div>
                    <div style={{ fontSize: 13, color: '#1E8546', fontWeight: 500, margin: '4px 0' }}>
                      {e.ubicacion?.split(",")[2]?.trim() || ""}
                    </div>
                    {e.duracion && <div style={{ fontSize: 13, color: '#388e3c', fontWeight: 500 }}>{e.duracion}</div>}
                  </div>
                </div>
              </Popup>
              <Tooltip>{e.nombre}</Tooltip>
            </Marker>
          )
        ))}
      </MapContainer>
    </div>
  );
};

export default Mapa;
