// src/screens/Artesanias.js
import React, { useState, useEffect } from 'react';
import ListaArtesanias from '../components/ListaArtesanias';
import axios from 'axios';

const Artesanias = () => {
    const [categoriaFiltro, setCategoriaFiltro] = useState('');
    const [productos, setProductos] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Obtener productos y categorías en paralelo
                const [productosRes, categoriasRes] = await Promise.all([
                    axios.get('https://backend-iota-seven-19.vercel.app/api/productos'),
                    axios.get('https://backend-iota-seven-19.vercel.app/api/categoriProducto')
                ]);

                setProductos(productosRes.data);
                setCategorias(categoriasRes.data);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Mapear los datos de la API al formato esperado
    const artesanias = productos.map(producto => {
        // Encontrar la categoría correspondiente
        const categoria = categorias.find(cat => cat.idCategoria === producto.idCategoria);
        
        return {
            id: producto.idProducto,
            nombre: producto.Nombre,
            descripcion: producto.Descripción,
            precio: producto.Precio,
            categoria: categoria ? categoria.Nombre : producto.idCategoria,
            idCategoria: producto.idCategoria,
            comunidad: producto.Origen,
            imagen: producto.Imagen,
            envio: producto.Disponibilidad === 'En stock',
            valoracion: 4, // Valoración por defecto
            forma: producto.Forma,
            dimensiones: producto["Largo x Ancho"],
            materiales: producto.Materiales,
            tiempoEntrega: producto["Tiempo-estimado-llegada"]
        };
    });

    const artesaniasFiltradas = categoriaFiltro
        ? artesanias.filter(artesania => artesania.idCategoria === categoriaFiltro)
        : artesanias;

    if (loading) return (
        <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '100vh',
            backgroundColor: '#FDF2E0'
        }}>
            <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Cargando...</span>
            </div>
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
                Error al cargar los productos: {error}
            </div>
        </div>
    );

    return (
        <div style={{
            backgroundColor: '#FDF2E0',
            minHeight: '100vh',
            padding: '20px 0',
        }}>
            <ListaArtesanias
                artesanias={artesaniasFiltradas}
                categorias={categorias}
                categoriaFiltro={categoriaFiltro}
                setCategoriaFiltro={setCategoriaFiltro}
            />
        </div>
    );
};

export default Artesanias;