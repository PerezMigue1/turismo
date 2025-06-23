<<<<<<< HEAD
// src/screens/Artesanias.js
import React, { useState } from 'react';
import ListaArtesanias from '../components/ListaArtesanias';

const Artesanias = () => {
    const [categoriaFiltro, setCategoriaFiltro] = useState('');

    const artesanias = [
        {
            id: 1,
            nombre: 'Bordado Tenango',
            descripcion: 'Bordado tradicional de la comunidad Otomí con diseños coloridos de flora y fauna local.',
            precio: 350,
            precioOriginal: 450,
            valoracion: 4,
            categoria: 'Textiles',
            comunidad: 'Tenango de Doria',
            imagen: '/calnali.png',
            envio: true,
            tecnica: 'Bordado a mano',
            tiempoElaboracion: '2 semanas'
        },
        {
            id: 2,
            nombre: 'Máscara de Carnaval',
            descripcion: 'Máscara tallada en madera utilizada en las danzas tradicionales de la Huasteca.',
            precio: 280,
            categoria: 'Madera',
            comunidad: 'Huejutla',
            imagen: '/src/app/image/cascada.jpeg',
            envio: false,
            tecnica: 'Tallado en cedro',
            tiempoElaboracion: '5 días'
        }
    ];

    const artesaniasFiltradas = categoriaFiltro
        ? artesanias.filter(artesania => artesania.categoria === categoriaFiltro)
        : artesanias;

    return (
        <div style={{
            backgroundColor: '#FDF2E0',
            minHeight: '100vh',
            padding: '20px 0',
        }}>
            <ListaArtesanias
                artesanias={artesaniasFiltradas}
                categoriaFiltro={categoriaFiltro}
                setCategoriaFiltro={setCategoriaFiltro}
            />
        </div>
    );
};

=======
// src/screens/Artesanias.js
import React, { useState } from 'react';
import ListaArtesanias from '../components/ListaArtesanias';

const Artesanias = () => {
    const [categoriaFiltro, setCategoriaFiltro] = useState('');

    const artesanias = [
        {
            id: 1,
            nombre: 'Bordado Tenango',
            descripcion: 'Bordado tradicional de la comunidad Otomí con diseños coloridos de flora y fauna local.',
            precio: 350,
            precioOriginal: 450,
            valoracion: 4,
            categoria: 'Textiles',
            comunidad: 'Tenango de Doria',
            imagen: '/calnali.png',
            envio: true,
            tecnica: 'Bordado a mano',
            tiempoElaboracion: '2 semanas'
        },
        {
            id: 2,
            nombre: 'Máscara de Carnaval',
            descripcion: 'Máscara tallada en madera utilizada en las danzas tradicionales de la Huasteca.',
            precio: 280,
            categoria: 'Madera',
            comunidad: 'Huejutla',
            imagen: '/src/app/image/cascada.jpeg',
            envio: false,
            tecnica: 'Tallado en cedro',
            tiempoElaboracion: '5 días'
        }
    ];

    const artesaniasFiltradas = categoriaFiltro
        ? artesanias.filter(artesania => artesania.categoria === categoriaFiltro)
        : artesanias;

    return (
        <div style={{
            backgroundColor: '#FDF2E0',
            minHeight: '100vh',
            padding: '20px 0',
        }}>
            <ListaArtesanias
                artesanias={artesaniasFiltradas}
                categoriaFiltro={categoriaFiltro}
                setCategoriaFiltro={setCategoriaFiltro}
            />
        </div>
    );
};

>>>>>>> 39e792a0febff33491eff80f548ffaf809d93736
export default Artesanias;