import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Tooltip } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";

// Iconos personalizados
const hospedajeIcon = new L.Icon({ iconUrl: "/icons/hospedaje.jpeg", iconSize: [32, 32] });
const restauranteIcon = new L.Icon({ iconUrl: "/icons/restaurante.jpeg", iconSize: [32, 32] });
const lugarTuristicoIcon = new L.Icon({ iconUrl: "/icons/lugarTuristico.jpeg", iconSize: [32, 32] });
const API_BASE = process.env.REACT_APP_API_URL || "https://backend-iota-seven-19.vercel.app/api";

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
  const [tipoFiltro, setTipoFiltro] = useState("todos");
  const [municipioFiltro, setMunicipioFiltro] = useState("");

  useEffect(() => {
    axios.get(`${API_BASE}/hospedaje`).then(res => setHospedajes(res.data));
    axios.get(`${API_BASE}/lugares`).then(res => setLugaresTuristicos(res.data));
    axios.get(`${API_BASE}/restaurante`).then(res => setRestaurantes(res.data));
  }, []);

  const municipiosHospedaje = Array.from(new Set(
    hospedajes.map(h => {
      const partes = h.Ubicacion ? h.Ubicacion.split(",") : [];
      return partes.length >= 3 ? partes[2].replace(/[0-9]/g, '').trim() : "";
    })
  )).filter(Boolean);
  const municipiosLugares = Array.from(new Set(
    lugaresTuristicos.map(l => l.Ubicacion?.Municipio || "")
  )).filter(Boolean);
  const municipiosRestaurantes = Array.from(new Set(
    restaurantes.map(r => r.Ubicacion?.Municipio || "")
  )).filter(Boolean);
  const municipios = Array.from(new Set([...municipiosHospedaje, ...municipiosLugares, ...municipiosRestaurantes])).sort();

  const hospedajesFiltrados = hospedajes.filter(h => {
    if (!municipioFiltro) return true;
    const partes = h.Ubicacion ? h.Ubicacion.split(",") : [];
    const municipio = partes.length >= 3 ? partes[2].replace(/[0-9]/g, '').trim() : "";
    return municipio === municipioFiltro;
  });
  const lugaresFiltrados = lugaresTuristicos.filter(l => !municipioFiltro || (l.Ubicacion?.Municipio === municipioFiltro));
  const restaurantesFiltrados = restaurantes.filter(r => {
    const tieneID = r.idRestaurante || r._id;
    if (!tieneID) return false;
    if (!municipioFiltro) return true;
    return r.Ubicacion?.Municipio === municipioFiltro;
  });

  return (
    <div>
      <div style={{ display: 'flex', gap: 16, alignItems: 'center', margin: '16px 0 8px 0', flexWrap: 'wrap' }}>
        <div>
          {["todos", "hospedaje", "lugar", "restaurante"].map(tipo => (
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
              {tipo === "todos" ? "Todos" : tipo === "hospedaje" ? "Hospedajes" : tipo === "lugar" ? "Lugares turísticos" : "Restaurantes"}
            </button>
          ))}
        </div>
        <div>
          <select
            value={municipioFiltro}
            onChange={e => setMunicipioFiltro(e.target.value)}
            style={{ borderRadius: 8, padding: '6px 12px', border: '1px solid #1E8546', color: '#1E8546', fontWeight: 600 }}
          >
            <option value="">Todos los municipios</option>
            {municipios.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>
      </div>

      <MapContainer center={[21.142, -98.423]} zoom={14} style={{ height: "80vh", width: "100%" }}>
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

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
      </MapContainer>
    </div>
  );
};

export default Mapa;
