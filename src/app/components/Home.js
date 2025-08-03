import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Carousel, Button, Nav, Card, Spinner, Alert, Badge, Modal } from 'react-bootstrap';
import { 
    FaMapMarkerAlt, FaHiking, FaUtensils, FaShoppingBasket, FaLeaf, FaUsers, FaHandHoldingHeart, 
    FaSearch, FaChevronLeft, FaChevronRight, FaBed, FaMountain, FaCalendarAlt, FaStar, FaHeart,
    FaPhone, FaEnvelope, FaGlobe, FaClock, FaInfoCircle, FaArrowRight, FaPlay, FaPause
} from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';

// Importar componentes reales
import ListaArtesanias from './ListaArtesanias';
import ListaLugares from './ListaLugares';
import ListaRestaurantes from './ListaRestaurantes';
import ListaEcoturismo from './ListaEcoturismo';
import ListaNegocios from './ListaNegocios';
import CardFestividades from './CardFestividades';
import CardGastronomia from './CardGastronomia';
import CardHospedaje from './CardHospedaje';
import CardArtesania from './CardArtesania';
import CardLugares from './CardLugares';
import CardRestaurante from './CardRestaurante';

const Home = () => {
    const [activeTab, setActiveTab] = useState('destacados');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showVideoModal, setShowVideoModal] = useState(false);
    const [autoplay, setAutoplay] = useState(true);
    
    // Estados para datos dinámicos
    const [artesanias, setArtesanias] = useState([]);
    const [lugares, setLugares] = useState([]);
    const [restaurantes, setRestaurantes] = useState([]);
    const [ecoturismo, setEcoturismo] = useState([]);
    const [hospedajes, setHospedajes] = useState([]);
    const [festividades, setFestividades] = useState([]);
    const [gastronomia, setGastronomia] = useState([]);
    const [negocios, setNegocios] = useState([]);

    const slides = [
        {
            image: "https://res.cloudinary.com/dfxyn9ngk/image/upload/v1752075194/home-img-1_em4b3a.jpg",
            title: "GASTRONOMIA",
            subtitle: "A solo 10 minutos de Pachuca encuentras este bonito Pueblo Mágico",
            description: "Descubre la magia de la Huasteca Hidalguense con experiencias auténticas y sostenibles",
            buttonText: "Explorar Gastronomía",
            buttonLink: "/gastronomia"
        },
        {
            image: "https://res.cloudinary.com/dfxyn9ngk/image/upload/v1752074608/home-img2_bgy4uj.jpg",
            title: "CASCADAS ESCONDIDAS",
            subtitle: "Rutas para evitar aglomeraciones y disfrutar de la naturaleza",
            description: "Conecta con la cultura y naturaleza local de forma responsable",
            buttonText: "Descubrir Lugares",
            buttonLink: "/lugares"
        },
        {
            image: "https://res.cloudinary.com/dfxyn9ngk/image/upload/v1752073986/home-img_hqb33n.jpg",
            title: "TRADICIONES VIVAS",
            subtitle: "Conoce las danzas huastecas y patrimonio cultural",
            description: "Apoyando directamente a las comunidades locales",
            buttonText: "Ver Artesanías",
            buttonLink: "/artesanias"
        }
    ];

    const features = [
        {
            icon: <FaMapMarkerAlt style={{ fontSize: '2.5rem', color: '#0FA89C' }} />,
            title: 'Mapas y Rutas',
            text: 'Descubre atracciones con nuestros mapas interactivos y rutas dinámicas.',
            link: '/lugares',
            color: '#0FA89C'
        },
        {
            icon: <FaHiking style={{ fontSize: '2.5rem', color: '#1E8546' }} />,
            title: 'Ecoturismo',
            text: 'Explora la naturaleza con actividades de ecoturismo sostenible.',
            link: '/ecoturismo',
            color: '#1E8546'
        },
        {
            icon: <FaUtensils style={{ fontSize: '2.5rem', color: '#F28B27' }} />,
            title: 'Gastronomía Local',
            text: 'Disfruta de platillos típicos como el pozole de queso en restaurantes locales.',
            link: '/gastronomia',
            color: '#F28B27'
        },
        {
            icon: <FaShoppingBasket style={{ fontSize: '2.5rem', color: '#9A1E47' }} />,
            title: 'Artesanías',
            text: 'Compra artesanías directamente de los productores con pagos seguros.',
            link: '/artesanias',
            color: '#9A1E47'
        }
    ];

    const values = [
        {
            icon: <FaLeaf style={{ fontSize: '2.5rem', color: '#1E8546' }} />,
            title: 'Sostenibilidad',
            text: 'Promovemos prácticas de turismo responsable que minimizan el impacto ambiental.'
        },
        {
            icon: <FaUsers style={{ fontSize: '2.5rem', color: '#1E8546' }} />,
            title: 'Comunidad',
            text: 'Los ingresos generados benefician directamente a las comunidades locales.'
        },
        {
            icon: <FaHandHoldingHeart style={{ fontSize: '2.5rem', color: '#1E8546' }} />,
            title: 'Preservación',
            text: 'Protegemos el patrimonio cultural y natural de la Huasteca Hidalguense.'
        }
    ];

    // Cargar datos desde la API
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError('');

                // Solo cargar endpoints que sabemos que funcionan
                const [artesaniasRes, lugaresRes] = await Promise.all([
                    fetch('https://backend-iota-seven-19.vercel.app/api/productos'),
                    fetch('https://backend-iota-seven-19.vercel.app/api/lugares')
                ]);

                // Verificar que las respuestas sean exitosas
                if (!artesaniasRes.ok || !lugaresRes.ok) {
                    throw new Error('Error en la respuesta del servidor');
                }

                const [artesaniasData, lugaresData] = await Promise.all([
                    artesaniasRes.json(),
                    lugaresRes.json()
                ]);

                setArtesanias(Array.isArray(artesaniasData) ? artesaniasData.slice(0, 6) : []);
                setLugares(Array.isArray(lugaresData) ? lugaresData.slice(0, 6) : []);
                
                // Debug: Ver qué datos llegan
                console.log('Artesanías:', artesaniasData);
                console.log('Lugares:', lugaresData);
                console.log('Primera artesanía:', artesaniasData[0]);
                console.log('Primer lugar:', lugaresData[0]);
                if (artesaniasData[0]) {
                    console.log('Propiedades de artesanía:', Object.keys(artesaniasData[0]));
                    console.log('Imagen de artesanía:', artesaniasData[0].Imagen);
                }
                if (lugaresData[0]) {
                    console.log('Propiedades de lugar:', Object.keys(lugaresData[0]));
                    console.log('Imagen de lugar:', lugaresData[0].Imagen);
                }

                // Intentar cargar otros datos opcionalmente
                try {
                    const restaurantesRes = await fetch('https://backend-iota-seven-19.vercel.app/api/restaurante');
                    if (restaurantesRes.ok) {
                        const restaurantesData = await restaurantesRes.json();
                        setRestaurantes(Array.isArray(restaurantesData) ? restaurantesData.slice(0, 6) : []);
                        console.log('Restaurantes:', restaurantesData);
                    }
                } catch (error) {
                    console.log('Restaurantes no disponibles:', error.message);
                    setRestaurantes([]);
                }

                try {
                    const hospedajesRes = await fetch('https://backend-iota-seven-19.vercel.app/api/hospedaje');
                    if (hospedajesRes.ok) {
                        const hospedajesData = await hospedajesRes.json();
                        setHospedajes(Array.isArray(hospedajesData) ? hospedajesData.slice(0, 6) : []);
                        console.log('Hospedajes:', hospedajesData);
                    }
                } catch (error) {
                    console.log('Hospedajes no disponibles:', error.message);
                    setHospedajes([]);
                }

                try {
                    const ecoturismoRes = await fetch('https://backend-iota-seven-19.vercel.app/api/ecoturismo/public');
                    if (ecoturismoRes.ok) {
                        const ecoturismoData = await ecoturismoRes.json();
                        // Verificar si la respuesta tiene la estructura esperada
                        const data = ecoturismoData.data || ecoturismoData;
                        setEcoturismo(Array.isArray(data) ? data.slice(0, 6) : []);
                        console.log('Ecoturismo:', data);
                    }
                } catch (error) {
                    console.log('Ecoturismo no disponible:', error.message);
                    setEcoturismo([]);
                }

                try {
                    const festividadesRes = await fetch('https://backend-iota-seven-19.vercel.app/api/festividades');
                    if (festividadesRes.ok) {
                        const festividadesData = await festividadesRes.json();
                        setFestividades(Array.isArray(festividadesData) ? festividadesData.slice(0, 6) : []);
                        console.log('Festividades:', festividadesData);
                    }
                } catch (error) {
                    console.log('Festividades no disponibles:', error.message);
                    setFestividades([]);
                }

                try {
                    const gastronomiaRes = await fetch('https://backend-iota-seven-19.vercel.app/api/gastronomia');
                    if (gastronomiaRes.ok) {
                        const gastronomiaData = await gastronomiaRes.json();
                        setGastronomia(Array.isArray(gastronomiaData) ? gastronomiaData.slice(0, 6) : []);
                    }
                } catch (error) {
                    console.log('Gastronomía no disponible:', error.message);
                    setGastronomia([]);
                }

                try {
                    const negociosRes = await fetch('https://backend-iota-seven-19.vercel.app/api/negocios');
                    if (negociosRes.ok) {
                        const negociosData = await negociosRes.json();
                        setNegocios(Array.isArray(negociosData) ? negociosData.slice(0, 6) : []);
                    }
                } catch (error) {
                    console.log('Negocios no disponibles:', error.message);
                    setNegocios([]);
                }

            } catch (error) {
                console.error('Error cargando datos:', error);
                setError('Error al cargar algunos datos. Mostrando contenido disponible.');
                
                // Establecer arrays vacíos para evitar errores
                setArtesanias([]);
                setLugares([]);
                setRestaurantes([]);
                setEcoturismo([]);
                setHospedajes([]);
                setFestividades([]);
                setGastronomia([]);
                setNegocios([]);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const customStyles = `
        .bg-beige { background-color: #FDF2E0; }
        .bg-rojo-guinda { background-color: #9A1E47; }
        .bg-turquesa { background-color: #0FA89C; }
        .bg-verde-bosque { background-color: #1E8546; }
        .bg-naranja-sol { background-color: #F28B27; }
        .bg-agua-claro { background-color: #50C2C4; }
        .bg-rojo-tierra { background-color: #D24D10; }
        .bg-verde-oliva { background-color: #A0C070; }
        
        .text-rojo-guinda { color: #9A1E47; }
        .text-turquesa { color: #0FA89C; }
        .text-verde-bosque { color: #1E8546; }
        .text-naranja-sol { color: #F28B27; }
        
        .btn-rojo-guinda {
            background-color: #9A1E47;
            border-color: #9A1E47;
            color: white;
        }
        .btn-rojo-guinda:hover {
            background-color: #D24D10;
            border-color: #D24D10;
            color: white;
        }
        
        .btn-verde-bosque {
            background-color: #1E8546;
            border-color: #1E8546;
            color: white;
        }
        .btn-verde-bosque:hover {
            background-color: #A0C070;
            border-color: #A0C070;
            color: white;
        }
        
        .carousel-item {
            height: 80vh;
        }
        
        .carousel-item img {
            height: 80vh;
            object-fit: cover;
            filter: brightness(0.6);
        }
        
        .carousel-caption {
            bottom: 20%;
            background-color: rgba(154, 30, 71, 0.95);
            padding: 40px;
            border-radius: 15px;
            max-width: 800px;
            margin: 0 auto;
        }
        
        .carousel-caption h1 {
            font-size: 3rem;
            font-weight: bold;
            color: #F28B27;
            margin-bottom: 20px;
        }
        
        .carousel-caption p {
            font-size: 1.3rem;
            margin-bottom: 25px;
        }
        
        .nav-tabs-custom {
            background-color: #9A1E47;
            border: none;
        }
        
        .nav-tabs-custom .nav-link {
            border: none;
            color: white;
            font-weight: bold;
            background-color: #9A1E47;
            padding: 20px 40px;
            margin: 0;
            border-radius: 0;
            font-size: 1.1rem;
        }
        
        .nav-tabs-custom .nav-link:hover {
            background-color: #D24D10;
            color: white;
            border: none;
        }
        
        .nav-tabs-custom .nav-link.active {
            background-color: #D24D10;
            color: white;
            border: none;
        }
        
        .card-hover {
            transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        
        .card-hover:hover {
            transform: translateY(-5px);
            box-shadow: 0 8px 25px rgba(0,0,0,0.15);
        }
        
        .feature-icon {
            margin-bottom: 20px;
        }
        
        .section-title {
            font-size: 2.5rem;
            font-weight: bold;
            margin-bottom: 50px;
            text-align: center;
        }
        
        .section-subtitle {
            font-size: 1.2rem;
            color: #6c757d;
            text-align: center;
            margin-bottom: 40px;
        }
        
        .stats-card {
            background-color: #9A1E47;
            color: white;
            border-radius: 15px;
            padding: 30px;
            text-align: center;
            margin-bottom: 30px;
        }
        
        .stats-icon {
            font-size: 3rem;
            margin-bottom: 15px;
            opacity: 0.8;
        }
        
        .stats-label {
            font-size: 1.1rem;
            opacity: 0.9;
        }
        
        .content-section {
            padding: 15px 0;
            position: relative;
            z-index: 2;
        }
        
        .section-header {
            text-align: center;
            margin-bottom: 8px;
        }
        
        .section-header h2 {
            font-size: 2.2rem;
            font-weight: 800;
            color: #9A1E47;
            margin-bottom: 15px;
            text-transform: uppercase;
            letter-spacing: 1px;
            text-shadow: 0 2px 4px rgba(154, 30, 71, 0.1);
        }
        
        .section-header p {
            font-size: 1.1rem;
            color: #555;
            max-width: 700px;
            margin: 0 auto;
            line-height: 1.6;
            font-weight: 400;
        }
        
        .content-grid {
            display: grid;
            gap: 10px;
            margin-bottom: 15px;
            min-height: 350px;
            grid-template-rows: 1fr;
            width: 100%;
        }
        
        .content-item {
            background: white;
            border-radius: 6px;
            padding: 12px;
            box-shadow: 0 2px 6px rgba(0,0,0,0.08);
            transition: all 0.3s ease;
            border: 1px solid #e0e0e0;
            min-height: 320px;
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            position: relative;
            z-index: 1;
            width: 100%;
        }
        
        .content-item:hover {
            transform: translateY(-5px);
            box-shadow: 0 8px 25px rgba(0,0,0,0.15);
            border-color: #9A1E47;
        }
        
        .content-icon {
            font-size: 1.8rem;
            margin-bottom: 12px;
            text-align: center;
        }
        
        .content-title {
            font-size: 1.1rem;
            font-weight: 700;
            color: #9A1E47;
            margin-bottom: 10px;
            text-align: center;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        .content-description {
            color: #444;
            text-align: center;
            margin-bottom: 15px;
            flex-grow: 1;
            font-size: 0.85rem;
            line-height: 1.5;
            font-weight: 400;
        }
        
        .empty-state {
            text-align: center;
            padding: 15px 12px;
            background: #f8f9fa;
            border-radius: 6px;
            border: 1px dashed #9A1E47;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            flex: 1;
            min-height: 150px;
        }
        
        .empty-state-icon {
            font-size: 2rem;
            color: #9A1E47;
            margin-bottom: 12px;
        }
        
        .empty-state h4 {
            color: #9A1E47;
            margin-bottom: 8px;
            font-size: 1rem;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        .empty-state p {
            color: #666;
            font-size: 0.85rem;
            line-height: 1.4;
            font-weight: 400;
        }
        
        .view-all-button {
            text-align: center;
            margin-top: auto;
            padding-top: 10px;
        }
        
        .view-all-button .btn {
            padding: 6px 15px;
            font-size: 0.85rem;
            font-weight: 600;
            border-radius: 12px;
        }
        
        .video-section {
            background-color: #0FA89C;
            color: white;
            padding: 80px 0;
            position: relative;
            z-index: 0;
        }
        
        .video-thumbnail {
            position: relative;
            border-radius: 15px;
            overflow: hidden;
            cursor: pointer;
        }
        
        .video-thumbnail img {
            width: 100%;
            height: 300px;
            object-fit: cover;
        }
        
        .play-button {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(255,255,255,0.9);
            border-radius: 50%;
            width: 80px;
            height: 80px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 2rem;
            color: #9A1E47;
            transition: all 0.3s ease;
        }
        
        .play-button:hover {
            background: white;
            transform: translate(-50%, -50%) scale(1.1);
        }
        
        .contact-info {
            background: #f8f9fa;
            border-radius: 15px;
            padding: 30px;
            margin-bottom: 20px;
        }
        
        .contact-icon {
            font-size: 2rem;
            color: #9A1E47;
            margin-bottom: 15px;
        }
        
        @media (max-width: 1200px) {
            .content-grid {
                grid-template-columns: repeat(2, 1fr);
            }
        }
        
        @media (max-width: 768px) {
            .carousel-caption h1 {
                font-size: 2rem;
            }
            .carousel-caption p {
                font-size: 1rem;
            }
            .section-title {
                font-size: 2rem;
            }
            .carousel-item {
                height: 60vh;
            }
            .carousel-item img {
                height: 60vh;
            }
            .content-grid {
                grid-template-columns: 1fr;
                gap: 20px;
            }
            .section-header h2 {
                font-size: 2rem;
            }
            .content-section {
                padding: 40px 0;
            }
            .nav-tabs-custom .nav-link {
                padding: 15px 25px;
                font-size: 1rem;
            }
            .content-item {
                min-height: 300px;
            }
        }
        
        @media (max-width: 576px) {
            .carousel-caption {
                padding: 20px;
                bottom: 10%;
            }
            .carousel-caption h1 {
                font-size: 1.5rem;
            }
            .carousel-caption p {
                font-size: 0.9rem;
            }
            .section-header h2 {
                font-size: 1.8rem;
            }
            .content-item {
                padding: 20px;
                min-height: 280px;
            }
            .content-icon {
                font-size: 2rem;
            }
            .content-title {
                font-size: 1.1rem;
            }
            .stats-card {
                padding: 20px;
            }
            .nav-tabs-custom .nav-link {
                padding: 12px 20px;
                font-size: 0.9rem;
            }
        }
    `;

    const renderContent = () => {
        if (loading) {
            return (
                <div className="text-center py-5">
                    <Spinner animation="border" variant="primary" />
                    <p className="mt-3">Cargando contenido...</p>
                </div>
            );
        }

        if (error) {
            return (
                <Alert variant="danger" className="m-3">
                    {error}
                </Alert>
            );
        }

        switch (activeTab) {
            case 'destacados':
                return (
                    <section className="content-section">
                        <Container>
                            <div className="section-header">
                                <h2>Destacados de la Huasteca</h2>
                                <p>Descubre lo mejor que tenemos para ofrecerte en esta región mágica</p>
                            </div>
                            
                            <div style={{ 
                                display: 'grid', 
                                gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', 
                                gap: '28px',
                                marginBottom: '50px'
                            }}>
                                {/* Artesanías */}
                                <div style={{
                                    background: '#9A1E47',
                                    borderRadius: '18px',
                                    overflow: 'hidden',
                                    boxShadow: '0 12px 25px rgba(154, 30, 71, 0.3)',
                                    position: 'relative',
                                    minHeight: '420px', // antes 320px
                                    display: 'flex',
                                    flexDirection: 'column'
                                }}>
                                    <div style={{
                                        position: 'relative',
                                        width: '100%',
                                        aspectRatio: '16/9',
                                        background: '#eee',
                                        borderRadius: '18px 18px 0 0',
                                        overflow: 'hidden',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        {artesanias.length > 0 ? (
                                            <Carousel interval={3000} controls={false} indicators={false} pause={false}>
                                                {artesanias.slice(0, 5).map((artesania, idx) => (
                                                    <Carousel.Item key={idx}>
                                                        <img
                                                            src={Array.isArray(artesania.Imagen) ? artesania.Imagen[0] : artesania.Imagen}
                                                            alt={`Artesanía ${idx + 1}`}
                                                            style={{
                                                                width: '100%',
                                                                height: '100%',
                                                                objectFit: 'contain',
                                                                filter: 'brightness(0.9)',
                                                                backgroundColor: '#eee',
                                                                borderRadius: '18px 18px 0 0'
                                                            }}
                                                        />
                                                    </Carousel.Item>
                                                ))}
                                            </Carousel>
                                        ) : (
                                            <img
                                                src="https://res.cloudinary.com/dfxyn9ngk/image/upload/v1752074608/home-img2_bgy4uj.jpg"
                                                alt="Artesanías"
                                                style={{
                                                    width: '100%',
                                                    height: '100%',
                                                    objectFit: 'contain',
                                                    filter: 'brightness(0.9)',
                                                    backgroundColor: '#eee',
                                                    borderRadius: '18px 18px 0 0'
                                                }}
                                            />
                                        )}
                                        <div style={{
                                            position: 'absolute',
                                            top: '15px',
                                            left: '15px',
                                            background: 'rgba(255, 255, 255, 0.9)',
                                            borderRadius: '50%',
                                            width: '50px',
                                            height: '50px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            boxShadow: '0 6px 15px rgba(0,0,0,0.2)'
                                        }}>
                                            <FaShoppingBasket size={25} color="#9A1E47" />
                                        </div>
                                    </div>
                                    <div style={{
                                        padding: '14px', // antes 22px
                                        flex: 1,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'space-between'
                                    }}>
                                        <div>
                                            <h3 style={{
                                                color: 'white',
                                                fontSize: '1.1rem',
                                                fontWeight: '800',
                                                marginBottom: '10px',
                                                textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.5px'
                                            }}>
                                                Artesanías Locales
                                            </h3>
                                            <p style={{
                                                color: 'rgba(255, 255, 255, 0.95)',
                                                fontSize: '0.85rem',
                                                lineHeight: '1.5',
                                                marginBottom: '12px',
                                                fontWeight: '400'
                                            }}>
                                                Descubre la creatividad y tradición de nuestros artesanos locales. Cada pieza cuenta una historia única de la Huasteca Hidalguense.
                                            </p>
                                            <div style={{
                                                display: 'flex',
                                                gap: '10px',
                                                flexWrap: 'wrap'
                                            }}>
                                                <span style={{
                                                    background: 'rgba(255, 255, 255, 0.25)',
                                                    color: 'white',
                                                    padding: '5px 10px',
                                                    borderRadius: '12px',
                                                    fontSize: '0.75rem',
                                                    fontWeight: '600',
                                                    textTransform: 'uppercase',
                                                    letterSpacing: '0.3px'
                                                }}>
                                                    Cerámica
                                                </span>
                                                <span style={{
                                                    background: 'rgba(255, 255, 255, 0.25)',
                                                    color: 'white',
                                                    padding: '5px 10px',
                                                    borderRadius: '12px',
                                                    fontSize: '0.75rem',
                                                    fontWeight: '600',
                                                    textTransform: 'uppercase',
                                                    letterSpacing: '0.3px'
                                                }}>
                                                    Textiles
                                                </span>
                                            </div>
                                        </div>
                                        <div style={{ marginTop: '15px', textAlign: 'center' }}>
                                            <Link to="/artesanias" className="btn btn-light btn-lg" style={{
                                                fontWeight: '700',
                                                borderRadius: '20px',
                                                padding: '10px 24px',
                                                boxShadow: '0 5px 12px rgba(0,0,0,0.2)',
                                                transition: 'all 0.3s ease',
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.5px',
                                                fontSize: '0.9rem',
                                                display: 'inline-block',
                                                textDecoration: 'none'
                                            }}>
                                                Ver Artesanías
                                            </Link>
                                        </div>
                                    </div>
                                </div>

                                {/* Lugares */}
                                <div style={{
                                    background: '#0FA89C',
                                    borderRadius: '18px',
                                    overflow: 'hidden',
                                    boxShadow: '0 12px 25px rgba(15, 168, 156, 0.3)',
                                    position: 'relative',
                                    minHeight: '220px', // antes 320px
                                    display: 'flex',
                                    flexDirection: 'column'
                                }}>
                                    <div style={{
                                        position: 'relative',
                                        width: '100%',
                                        aspectRatio: '16/9',
                                        background: '#eee',
                                        borderRadius: '18px 18px 0 0',
                                        overflow: 'hidden',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        {lugares.length > 0 ? (
                                            <Carousel interval={3000} controls={false} indicators={false} pause={false}>
                                                {lugares.slice(0, 5).map((lugar, idx) => (
                                                    <Carousel.Item key={idx}>
                                                        <img
                                                            src={Array.isArray(lugar.Imagen) ? lugar.Imagen[0] : lugar.Imagen}
                                                            alt={`Lugar ${idx + 1}`}
                                                            style={{
                                                                width: '100%',
                                                                height: '100%',
                                                                objectFit: 'contain',
                                                                filter: 'brightness(0.9)',
                                                                backgroundColor: '#eee',
                                                                borderRadius: '18px 18px 0 0'
                                                            }}
                                                        />
                                                    </Carousel.Item>
                                                ))}
                                            </Carousel>
                                        ) : (
                                            <img
                                                src="https://huastecapotosina.vip/wp-content/uploads/2024/11/puente-de-dios-huasteca-potosina-768x771.jpg"
                                                alt="Lugares Turísticos"
                                                style={{
                                                    width: '100%',
                                                    height: '100%',
                                                    objectFit: 'contain',
                                                    filter: 'brightness(0.9)',
                                                    backgroundColor: '#eee',
                                                    borderRadius: '18px 18px 0 0'
                                                }}
                                            />
                                        )}
                                        <div style={{
                                            position: 'absolute',
                                            top: '15px',
                                            left: '15px',
                                            background: 'rgba(255, 255, 255, 0.9)',
                                            borderRadius: '50%',
                                            width: '50px',
                                            height: '50px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            boxShadow: '0 6px 15px rgba(0,0,0,0.2)'
                                        }}>
                                            <FaMapMarkerAlt size={25} color="#0FA89C" />
                                        </div>
                                    </div>
                                    <div style={{
                                        padding: '14px', // antes 22px
                                        flex: 1,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'space-between'
                                    }}>
                                        <div>
                                            <h3 style={{
                                                color: 'white',
                                                fontSize: '1.1rem',
                                                fontWeight: '800',
                                                marginBottom: '10px',
                                                textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.5px'
                                            }}>
                                                Lugares Turísticos
                                            </h3>
                                            <p style={{
                                                color: 'rgba(255, 255, 255, 0.95)',
                                                fontSize: '0.85rem',
                                                lineHeight: '1.5',
                                                marginBottom: '12px',
                                                fontWeight: '400'
                                            }}>
                                                Explora cascadas cristalinas, miradores espectaculares y sitios de interés natural que te dejarán sin aliento.
                                            </p>
                                            <div style={{
                                                display: 'flex',
                                                gap: '10px',
                                                flexWrap: 'wrap'
                                            }}>
                                                <span style={{
                                                    background: 'rgba(255, 255, 255, 0.25)',
                                                    color: 'white',
                                                    padding: '5px 10px',
                                                    borderRadius: '12px',
                                                    fontSize: '0.75rem',
                                                    fontWeight: '600',
                                                    textTransform: 'uppercase',
                                                    letterSpacing: '0.3px'
                                                }}>
                                                    Cascadas
                                                </span>
                                                <span style={{
                                                    background: 'rgba(255, 255, 255, 0.25)',
                                                    color: 'white',
                                                    padding: '5px 10px',
                                                    borderRadius: '12px',
                                                    fontSize: '0.75rem',
                                                    fontWeight: '600',
                                                    textTransform: 'uppercase',
                                                    letterSpacing: '0.3px'
                                                }}>
                                                    Miradores
                                                </span>
                                            </div>
                                        </div>
                                        <div style={{ marginTop: '15px', textAlign: 'center' }}>
                                            <Link to="/lugares" className="btn btn-light btn-lg" style={{
                                                fontWeight: '700',
                                                borderRadius: '20px',
                                                padding: '10px 24px',
                                                boxShadow: '0 5px 12px rgba(0,0,0,0.2)',
                                                transition: 'all 0.3s ease',
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.5px',
                                                fontSize: '0.9rem',
                                                display: 'inline-block',
                                                textDecoration: 'none'
                                            }}>
                                                Ver Lugares
                                            </Link>
                                        </div>
                                    </div>
                                </div>

                                {/* Gastronomía */}
                                <div style={{
                                    background: '#F28B27',
                                    borderRadius: '18px',
                                    overflow: 'hidden',
                                    boxShadow: '0 12px 25px rgba(242, 139, 39, 0.3)',
                                    position: 'relative',
                                    minHeight: '220px', // antes 320px
                                    display: 'flex',
                                    flexDirection: 'column'
                                }}>
                                    <div style={{
                                        position: 'relative',
                                        width: '100%',
                                        aspectRatio: '16/9',
                                        background: '#eee',
                                        borderRadius: '18px 18px 0 0',
                                        overflow: 'hidden',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        {restaurantes.length > 0 ? (
                                            <Carousel interval={3000} controls={false} indicators={false} pause={false}>
                                                {restaurantes.slice(0, 5).map((restaurante, idx) => (
                                                    <Carousel.Item key={idx}>
                                                        <img
                                                            src={restaurante.Imagenes && restaurante.Imagenes[0]}
                                                            alt={`Restaurante ${idx + 1}`}
                                                            style={{
                                                                width: '100%',
                                                                height: '100%',
                                                                objectFit: 'contain',
                                                                filter: 'brightness(0.9)',
                                                                backgroundColor: '#eee',
                                                                borderRadius: '18px 18px 0 0'
                                                            }}
                                                        />
                                                    </Carousel.Item>
                                                ))}
                                            </Carousel>
                                        ) : (
                                            <img
                                                src="https://res.cloudinary.com/dfxyn9ngk/image/upload/v1752075194/home-img-1_em4b3a.jpg"
                                                alt="Gastronomía Local"
                                                style={{
                                                    width: '100%',
                                                    height: '100%',
                                                    objectFit: 'contain',
                                                    filter: 'brightness(0.9)',
                                                    backgroundColor: '#eee',
                                                    borderRadius: '18px 18px 0 0'
                                                }}
                                            />
                                        )}
                                        <div style={{
                                            position: 'absolute',
                                            top: '15px',
                                            left: '15px',
                                            background: 'rgba(255, 255, 255, 0.9)',
                                            borderRadius: '50%',
                                            width: '50px',
                                            height: '50px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            boxShadow: '0 6px 15px rgba(0,0,0,0.2)'
                                        }}>
                                            <FaUtensils size={25} color="#F28B27" />
                                        </div>
                                    </div>
                                    <div style={{
                                        padding: '14px', // antes 22px
                                        flex: 1,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'space-between'
                                    }}>
                                        <div>
                                            <h3 style={{
                                                color: 'white',
                                                fontSize: '1.1rem',
                                                fontWeight: '800',
                                                marginBottom: '10px',
                                                textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.5px'
                                            }}>
                                                Gastronomía Local
                                            </h3>
                                            <p style={{
                                                color: 'rgba(255, 255, 255, 0.95)',
                                                fontSize: '0.85rem',
                                                lineHeight: '1.5',
                                                marginBottom: '12px',
                                                fontWeight: '400'
                                            }}>
                                                Saborea los platillos tradicionales de la región. Descubre sabores únicos y auténticos de la Huasteca Hidalguense.
                                            </p>
                                            <div style={{
                                                display: 'flex',
                                                gap: '10px',
                                                flexWrap: 'wrap'
                                            }}>
                                                <span style={{
                                                    background: 'rgba(255, 255, 255, 0.25)',
                                                    color: 'white',
                                                    padding: '5px 10px',
                                                    borderRadius: '12px',
                                                    fontSize: '0.75rem',
                                                    fontWeight: '600',
                                                    textTransform: 'uppercase',
                                                    letterSpacing: '0.3px'
                                                }}>
                                                    Pozole
                                                </span>
                                                <span style={{
                                                    background: 'rgba(255, 255, 255, 0.25)',
                                                    color: 'white',
                                                    padding: '5px 10px',
                                                    borderRadius: '12px',
                                                    fontSize: '0.75rem',
                                                    fontWeight: '600',
                                                    textTransform: 'uppercase',
                                                    letterSpacing: '0.3px'
                                                }}>
                                                    Queso
                                                </span>
                                            </div>
                                        </div>
                                        <div style={{ marginTop: '15px', textAlign: 'center' }}>
                                            <Link to="/gastronomia" className="btn btn-light btn-lg" style={{
                                                fontWeight: '700',
                                                borderRadius: '20px',
                                                padding: '10px 24px',
                                                boxShadow: '0 5px 12px rgba(0,0,0,0.2)',
                                                transition: 'all 0.3s ease',
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.5px',
                                                fontSize: '0.9rem',
                                                display: 'inline-block',
                                                textDecoration: 'none'
                                            }}>
                                                Ver Gastronomía
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Container>
                    </section>
                );
                
            case 'experiencias':
                return (
                    <section className="content-section">
                        <Container>
                            <div className="section-header">
                                <h2>Experiencias Únicas</h2>
                                <p>Vive aventuras inolvidables en la naturaleza y descansa en lugares mágicos</p>
                            </div>
                            
                            <div style={{ 
                                display: 'grid', 
                                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', 
                                gap: '15px',
                                marginBottom: '50px'
                            }}>
                                {/* Ecoturismo */}
                                <div style={{
                                    background: '#1E8546',
                                    borderRadius: '18px',
                                    overflow: 'hidden',
                                    boxShadow: '0 12px 25px rgba(30, 133, 70, 0.3)',
                                    position: 'relative',
                                    minHeight: '220px', // antes 320px
                                    display: 'flex',
                                    flexDirection: 'column'
                                }}>
                                    <div style={{
                                        position: 'relative',
                                        width: '100%',
                                        aspectRatio: '16/9',
                                        background: '#eee',
                                        borderRadius: '18px 18px 0 0',
                                        overflow: 'hidden',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        {ecoturismo.length > 0 ? (
                                            <Carousel interval={3000} controls={false} indicators={false} pause={false}>
                                                {ecoturismo.slice(0, 5).map((ecoturismoItem, idx) => (
                                                    <Carousel.Item key={idx}>
                                                        <img
                                                            src={ecoturismoItem.imagenes && ecoturismoItem.imagenes[0]}
                                                            alt={`Ecoturismo ${idx + 1}`}
                                                            style={{
                                                                width: '100%',
                                                                height: '100%',
                                                                objectFit: 'contain',
                                                                filter: 'brightness(0.9)',
                                                                backgroundColor: '#eee',
                                                                borderRadius: '18px 18px 0 0'
                                                            }}
                                                        />
                                                    </Carousel.Item>
                                                ))}
                                            </Carousel>
                                        ) : (
                                            <img
                                                src="https://huastecapotosina.vip/wp-content/uploads/2024/11/puente-de-dios-huasteca-potosina-768x771.jpg"
                                                alt="Ecoturismo"
                                                style={{
                                                    width: '100%',
                                                    height: '100%',
                                                    objectFit: 'contain',
                                                    filter: 'brightness(0.9)',
                                                    backgroundColor: '#eee',
                                                    borderRadius: '18px 18px 0 0'
                                                }}
                                            />
                                        )}
                                        <div style={{
                                            position: 'absolute',
                                            top: '15px',
                                            left: '15px',
                                            background: 'rgba(255, 255, 255, 0.9)',
                                            borderRadius: '50%',
                                            width: '50px',
                                            height: '50px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            boxShadow: '0 6px 15px rgba(0,0,0,0.2)'
                                        }}>
                                            <FaMountain size={25} color="#1E8546" />
                                        </div>
                                    </div>
                                    <div style={{
                                        padding: '14px', // antes 22px
                                        flex: 1,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'space-between'
                                    }}>
                                        <div>
                                            <h3 style={{
                                                color: 'white',
                                                fontSize: '1.1rem',
                                                fontWeight: '800',
                                                marginBottom: '10px',
                                                textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.5px'
                                            }}>
                                                Ecoturismo
                                            </h3>
                                            <p style={{
                                                color: 'rgba(255, 255, 255, 0.95)',
                                                fontSize: '0.85rem',
                                                lineHeight: '1.5',
                                                marginBottom: '12px',
                                                fontWeight: '400'
                                            }}>
                                                Descubre senderos escénicos, cascadas cristalinas y actividades de ecoturismo que te conectarán con la belleza natural de la Huasteca Hidalguense.
                                            </p>
                                            <div style={{
                                                display: 'flex',
                                                gap: '10px',
                                                flexWrap: 'wrap'
                                            }}>
                                                <span style={{
                                                    background: 'rgba(255, 255, 255, 0.25)',
                                                    color: 'white',
                                                    padding: '5px 10px',
                                                    borderRadius: '12px',
                                                    fontSize: '0.75rem',
                                                    fontWeight: '600',
                                                    textTransform: 'uppercase',
                                                    letterSpacing: '0.3px'
                                                }}>
                                                    Senderismo
                                                </span>
                                                <span style={{
                                                    background: 'rgba(255, 255, 255, 0.25)',
                                                    color: 'white',
                                                    padding: '5px 10px',
                                                    borderRadius: '12px',
                                                    fontSize: '0.75rem',
                                                    fontWeight: '600',
                                                    textTransform: 'uppercase',
                                                    letterSpacing: '0.3px'
                                                }}>
                                                    Cascadas
                                                </span>
                                                <span style={{
                                                    background: 'rgba(255, 255, 255, 0.25)',
                                                    color: 'white',
                                                    padding: '5px 10px',
                                                    borderRadius: '12px',
                                                    fontSize: '0.75rem',
                                                    fontWeight: '600',
                                                    textTransform: 'uppercase',
                                                    letterSpacing: '0.3px'
                                                }}>
                                                    Aventura
                                                </span>
                                            </div>
                                        </div>
                                        <div style={{ marginTop: '15px', textAlign: 'center' }}>
                                            <Link to="/ecoturismo" className="btn btn-light btn-lg" style={{
                                                fontWeight: '700',
                                                borderRadius: '20px',
                                                padding: '10px 24px',
                                                boxShadow: '0 5px 12px rgba(0,0,0,0.2)',
                                                transition: 'all 0.3s ease',
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.5px',
                                                fontSize: '0.9rem',
                                                display: 'inline-block',
                                                textDecoration: 'none'
                                            }}>
                                                Explorar Actividades
                                            </Link>
                                        </div>
                                    </div>
                                </div>

                                {/* Hospedajes */}
                                <div style={{
                                    background: '#0FA89C',
                                    borderRadius: '18px',
                                    overflow: 'hidden',
                                    boxShadow: '0 12px 25px rgba(15, 168, 156, 0.3)',
                                    position: 'relative',
                                    minHeight: '220px', // antes 320px
                                    display: 'flex',
                                    flexDirection: 'column'
                                }}>
                                    <div style={{
                                        position: 'relative',
                                        width: '100%',
                                        aspectRatio: '16/9',
                                        background: '#eee',
                                        borderRadius: '18px 18px 0 0',
                                        overflow: 'hidden',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        {hospedajes.length > 0 ? (
                                            <Carousel interval={3000} controls={false} indicators={false} pause={false}>
                                                {hospedajes.slice(0, 5).map((hospedaje, idx) => (
                                                    <Carousel.Item key={idx}>
                                                        <img
                                                            src={hospedaje.Imagenes && hospedaje.Imagenes[0]}
                                                            alt={`Hospedaje ${idx + 1}`}
                                                            style={{
                                                                width: '100%',
                                                                height: '100%',
                                                                objectFit: 'contain',
                                                                filter: 'brightness(0.9)',
                                                                backgroundColor: '#eee',
                                                                borderRadius: '18px 18px 0 0'
                                                            }}
                                                        />
                                                    </Carousel.Item>
                                                ))}
                                            </Carousel>
                                        ) : (
                                            <img
                                                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTRsS5spaMdkZ9uO1BuPCYBnPJ3m3gxczF1Rw&s"
                                                alt="Hospedajes"
                                                style={{
                                                    width: '100%',
                                                    height: '100%',
                                                    objectFit: 'contain',
                                                    filter: 'brightness(0.9)',
                                                    backgroundColor: '#eee',
                                                    borderRadius: '18px 18px 0 0'
                                                }}
                                            />
                                        )}
                                        <div style={{
                                            position: 'absolute',
                                            top: '15px',
                                            left: '15px',
                                            background: 'rgba(255, 255, 255, 0.9)',
                                            borderRadius: '50%',
                                            width: '50px',
                                            height: '50px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            boxShadow: '0 6px 15px rgba(0,0,0,0.2)'
                                        }}>
                                            <FaBed size={25} color="#0FA89C" />
                                        </div>
                                    </div>
                                    <div style={{
                                        padding: '14px', // antes 22px
                                        flex: 1,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'space-between'
                                    }}>
                                        <div>
                                            <h3 style={{
                                                color: 'white',
                                                fontSize: '1.1rem',
                                                fontWeight: '800',
                                                marginBottom: '10px',
                                                textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.5px'
                                            }}>
                                                Hospedaje
                                            </h3>
                                            <p style={{
                                                color: 'rgba(255, 255, 255, 0.95)',
                                                fontSize: '0.85rem',
                                                lineHeight: '1.5',
                                                marginBottom: '12px',
                                                fontWeight: '400'
                                            }}>
                                                Experimenta la hospitalidad local en casas rurales, cabañas ecológicas y hoteles boutique que te harán sentir como en casa en medio de la naturaleza.
                                            </p>
                                            <div style={{
                                                display: 'flex',
                                                gap: '10px',
                                                flexWrap: 'wrap'
                                            }}>
                                                <span style={{
                                                    background: 'rgba(255, 255, 255, 0.25)',
                                                    color: 'white',
                                                    padding: '5px 10px',
                                                    borderRadius: '12px',
                                                    fontSize: '0.75rem',
                                                    fontWeight: '600',
                                                    textTransform: 'uppercase',
                                                    letterSpacing: '0.3px'
                                                }}>
                                                    Cabañas
                                                </span>
                                                <span style={{
                                                    background: 'rgba(255, 255, 255, 0.25)',
                                                    color: 'white',
                                                    padding: '5px 10px',
                                                    borderRadius: '12px',
                                                    fontSize: '0.75rem',
                                                    fontWeight: '600',
                                                    textTransform: 'uppercase',
                                                    letterSpacing: '0.3px'
                                                }}>
                                                    Casas Rurales
                                                </span>
                                                <span style={{
                                                    background: 'rgba(255, 255, 255, 0.25)',
                                                    color: 'white',
                                                    padding: '5px 10px',
                                                    borderRadius: '12px',
                                                    fontSize: '0.75rem',
                                                    fontWeight: '600',
                                                    textTransform: 'uppercase',
                                                    letterSpacing: '0.3px'
                                                }}>
                                                    Boutique
                                                </span>
                                            </div>
                                        </div>
                                        <div style={{ marginTop: '15px', textAlign: 'center' }}>
                                            <Link to="/hospedajes" className="btn btn-light btn-lg" style={{
                                                fontWeight: '700',
                                                borderRadius: '20px',
                                                padding: '10px 24px',
                                                boxShadow: '0 5px 12px rgba(0,0,0,0.2)',
                                                transition: 'all 0.3s ease',
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.5px',
                                                fontSize: '0.9rem',
                                                display: 'inline-block',
                                                textDecoration: 'none'
                                            }}>
                                                Ver Hospedajes
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Container>
                    </section>
                );
                
            case 'festividades':
                return (
                    <section className="content-section">
                        <Container>
                            <div className="section-header">
                                <h2>Festividades y Eventos</h2>
                                <p>Celebra las tradiciones y eventos culturales de la Huasteca Hidalguense</p>
                            </div>
                            
                            <div style={{ 
                                display: 'flex', 
                                justifyContent: 'center',
                                marginBottom: '50px'
                            }}>
                                {/* Festividades Culturales */}
                                <div style={{
                                    background: '#9A1E47',
                                    borderRadius: '18px',
                                    overflow: 'hidden',
                                    boxShadow: '0 12px 25px rgba(154, 30, 71, 0.3)',
                                    position: 'relative',
                                    minHeight: '220px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    maxWidth: '450px',
                                    width: '100%'
                                }}>
                                    <div style={{
                                        position: 'relative',
                                        width: '100%',
                                        aspectRatio: '16/9',
                                        background: '#eee',
                                        borderRadius: '18px 18px 0 0',
                                        overflow: 'hidden',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        {festividades.length > 0 ? (
                                            <Carousel interval={3000} controls={false} indicators={false} pause={false}>
                                                {festividades.slice(0, 5).map((festividad, idx) => (
                                                    <Carousel.Item key={idx}>
                                                        <img
                                                            src={Array.isArray(festividad.Imagen) ? festividad.Imagen[0] : festividad.Imagen}
                                                            alt={`Festividad ${idx + 1}`}
                                                            style={{
                                                                width: '100%',
                                                                height: '100%',
                                                                objectFit: 'contain',
                                                                filter: 'brightness(0.9)',
                                                                backgroundColor: '#eee',
                                                                borderRadius: '18px 18px 0 0'
                                                            }}
                                                        />
                                                    </Carousel.Item>
                                                ))}
                                            </Carousel>
                                        ) : (
                                            <img
                                                src="https://www.gob.mx/cms/uploads/article/main_image/139376/xantolo.jpg"
                                                alt="Festividades Culturales"
                                                style={{
                                                    width: '100%',
                                                    height: '100%',
                                                    objectFit: 'contain',
                                                    filter: 'brightness(0.9)',
                                                    backgroundColor: '#eee',
                                                    borderRadius: '18px 18px 0 0'
                                                }}
                                            />
                                        )}
                                        <div style={{
                                            position: 'absolute',
                                            top: '15px',
                                            left: '15px',
                                            background: 'rgba(255, 255, 255, 0.9)',
                                            borderRadius: '50%',
                                            width: '50px',
                                            height: '50px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            boxShadow: '0 6px 15px rgba(0,0,0,0.2)'
                                        }}>
                                            <FaCalendarAlt size={25} color="#9A1E47" />
                                        </div>
                                    </div>
                                    <div style={{
                                        padding: '14px', // antes 22px
                                        flex: 1,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'space-between'
                                    }}>
                                        <div>
                                            <h3 style={{
                                                color: 'white',
                                                fontSize: '1.1rem',
                                                fontWeight: '800',
                                                marginBottom: '10px',
                                                textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.5px'
                                            }}>
                                                Festividades
                                            </h3>
                                            <p style={{
                                                color: 'rgba(255, 255, 255, 0.95)',
                                                fontSize: '0.85rem',
                                                lineHeight: '1.5',
                                                marginBottom: '12px',
                                                fontWeight: '400'
                                            }}>
                                                Sumérgete en la rica cultura de la Huasteca a través de sus festividades tradicionales, danzas autóctonas y celebraciones que mantienen vivas las raíces de esta región mágica.
                                            </p>
                                            <div style={{
                                                display: 'flex',
                                                gap: '10px',
                                                flexWrap: 'wrap'
                                            }}>
                                                <span style={{
                                                    background: 'rgba(255, 255, 255, 0.25)',
                                                    color: 'white',
                                                    padding: '5px 10px',
                                                    borderRadius: '12px',
                                                    fontSize: '0.75rem',
                                                    fontWeight: '600',
                                                    textTransform: 'uppercase',
                                                    letterSpacing: '0.3px'
                                                }}>
                                                    Danzas
                                                </span>
                                                <span style={{
                                                    background: 'rgba(255, 255, 255, 0.25)',
                                                    color: 'white',
                                                    padding: '5px 10px',
                                                    borderRadius: '12px',
                                                    fontSize: '0.75rem',
                                                    fontWeight: '600',
                                                    textTransform: 'uppercase',
                                                    letterSpacing: '0.3px'
                                                }}>
                                                    Tradiciones
                                                </span>
                                                <span style={{
                                                    background: 'rgba(255, 255, 255, 0.25)',
                                                    color: 'white',
                                                    padding: '5px 10px',
                                                    borderRadius: '12px',
                                                    fontSize: '0.75rem',
                                                    fontWeight: '600',
                                                    textTransform: 'uppercase',
                                                    letterSpacing: '0.3px'
                                                }}>
                                                    Cultura
                                                </span>
                                            </div>
                                        </div>
                                        <div style={{ marginTop: '15px', textAlign: 'center' }}>
                                            <Link to="/festividades" className="btn btn-light btn-lg" style={{
                                                fontWeight: '700',
                                                borderRadius: '20px',
                                                padding: '10px 24px',
                                                boxShadow: '0 5px 12px rgba(0,0,0,0.2)',
                                                transition: 'all 0.3s ease',
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.5px',
                                                fontSize: '0.9rem',
                                                display: 'inline-block',
                                                textDecoration: 'none'
                                            }}>
                                                Ver Festividades
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Container>
                    </section>
                );
                
            default:
                return null;
        }
    };

    return (
        <>
            <style>{customStyles}</style>
            <div className="bg-beige" style={{ minHeight: '100vh' }}>
                {/* Hero Carousel */}
                <Carousel fade controls indicators interval={5000}>
                    {slides.map((slide, index) => (
                        <Carousel.Item key={index}>
                            <img
                                className="d-block w-100"
                                src={slide.image}
                                alt={slide.title}
                            />
                            <Carousel.Caption>
                                <h1>{slide.title}</h1>
                                <p style={{ fontSize: '1.3rem', marginBottom: '15px' }}>
                                    {slide.subtitle}
                                </p>
                                <p>{slide.description}</p>
                                <Link to={slide.buttonLink} className="btn btn-verde-bosque btn-lg">
                                    {slide.buttonText}
                                </Link>
                            </Carousel.Caption>
                        </Carousel.Item>
                    ))}
                </Carousel>

                {/* Navigation Tabs */}
                <Nav variant="tabs" className="nav-tabs-custom justify-content-center">
                    <Nav.Item>
                        <Nav.Link
                            eventKey="destacados"
                            active={activeTab === 'destacados'}
                            onClick={() => setActiveTab('destacados')}
                        >
                            DESTACADOS
                        </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link
                            eventKey="experiencias"
                            active={activeTab === 'experiencias'}
                            onClick={() => setActiveTab('experiencias')}
                        >
                            EXPERIENCIAS
                        </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link
                            eventKey="festividades"
                            active={activeTab === 'festividades'}
                            onClick={() => setActiveTab('festividades')}
                        >
                            FESTIVIDADES
                        </Nav.Link>
                    </Nav.Item>
                </Nav>

                {/* Dynamic Content */}
                {renderContent()}

                {/* Video Section */}
                <section className="video-section">
                    <Container>
                        <Row className="align-items-center">
                            <Col lg={6} className="mb-4">
                                <h2 className="text-white mb-4" style={{
                                    fontSize: '2.2rem',
                                    fontWeight: '800',
                                    textTransform: 'uppercase',
                                    letterSpacing: '1px',
                                    textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                                }}>
                                    Descubre la Huasteca Hidalguense
                                </h2>
                                <p className="text-white-50 mb-4" style={{
                                    fontSize: '1.1rem',
                                    lineHeight: '1.6',
                                    fontWeight: '400',
                                    opacity: '0.95'
                                }}>
                                    Sumérgete en la belleza natural y cultural de esta región mágica. 
                                    Desde cascadas cristalinas hasta tradiciones centenarias, 
                                    cada rincón tiene una historia que contar.
                                </p>
                                <Button 
                                    variant="light" 
                                    size="lg"
                                    onClick={() => setShowVideoModal(true)}
                                    style={{
                                        fontWeight: '700',
                                        borderRadius: '18px',
                                        padding: '10px 24px',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.5px',
                                        fontSize: '0.9rem',
                                        boxShadow: '0 5px 12px rgba(0,0,0,0.2)'
                                    }}
                                >
                                    <FaPlay className="me-2" />
                                    Ver Video
                                </Button>
                            </Col>
                            <Col lg={6}>
                                <div 
                                    className="video-thumbnail"
                                    onClick={() => setShowVideoModal(true)}
                                >
                                    <img 
                                        src="https://res.cloudinary.com/dfxyn9ngk/image/upload/v1752073986/home-img_hqb33n.jpg" 
                                        alt="Video thumbnail"
                                    />
                                    <div className="play-button">
                                        <FaPlay />
                                    </div>
                                </div>
                                </Col>
                        </Row>
                    </Container>
                </section>

                {/* Features Section */}
                <section style={{ padding: '60px 0', backgroundColor: 'white' }}>
                    <Container>
                        <h2 className="section-title text-rojo-guinda" style={{
                            fontSize: '2.2rem',
                            fontWeight: '800',
                            textTransform: 'uppercase',
                            letterSpacing: '1px',
                            textShadow: '0 2px 4px rgba(154, 30, 71, 0.1)'
                        }}>
                            Nuestras Funcionalidades
                        </h2>
                        <p className="section-subtitle" style={{
                            fontSize: '1.1rem',
                            color: '#555',
                            lineHeight: '1.6',
                            fontWeight: '400'
                        }}>
                            Descubre todo lo que tenemos para ofrecerte en la Huasteca Hidalguense
                        </p>
                        <Row>
                            {features.map((feature, index) => (
                                <Col lg={3} md={6} key={index} className="mb-4">
                                    <Card className="card-hover h-100 text-center bg-beige">
                                        <Card.Body>
                                            <div className="feature-icon">
                                                {feature.icon}
                                            </div>
                                            <Card.Title className="text-rojo-guinda" style={{
                                                fontSize: '1.1rem',
                                                fontWeight: '700',
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.5px',
                                                marginBottom: '12px'
                                            }}>
                                                {feature.title}
                                            </Card.Title>
                                            <Card.Text style={{
                                                fontSize: '0.85rem',
                                                lineHeight: '1.5',
                                                color: '#444',
                                                fontWeight: '400'
                                            }}>
                                                {feature.text}
                                            </Card.Text>
                                            <Link to={feature.link} className="btn btn-rojo-guinda" style={{
                                                fontWeight: '700',
                                                borderRadius: '18px',
                                                padding: '8px 20px',
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.5px',
                                                fontSize: '0.85rem',
                                                boxShadow: '0 5px 12px rgba(0,0,0,0.2)'
                                            }}>
                                                Explorar
                                            </Link>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    </Container>
                </section>

                {/* Contact Section */}
                <section style={{ padding: '60px 0', backgroundColor: '#f8f9fa' }}>
                    <Container>
                        <h2 className="section-title text-rojo-guinda" style={{
                            fontSize: '2.2rem',
                            fontWeight: '800',
                            textTransform: 'uppercase',
                            letterSpacing: '1px',
                            textShadow: '0 2px 4px rgba(154, 30, 71, 0.1)'
                        }}>
                            ¿Necesitas ayuda?
                        </h2>
                        <Row>
                            <Col lg={4} md={6} className="mb-4">
                                <div className="contact-info text-center">
                                    <div className="contact-icon">
                                        <FaPhone />
                                    </div>
                                    <h5 style={{
                                        fontSize: '1.1rem',
                                        fontWeight: '700',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.5px',
                                        marginBottom: '12px'
                                    }}>
                                        Línea de Atención
                                    </h5>
                                    <p className="text-muted" style={{
                                        fontSize: '1rem',
                                        fontWeight: '600',
                                        marginBottom: '8px'
                                    }}>
                                        +52 123 456 7890
                                    </p>
                                    <p className="text-muted small" style={{
                                        fontSize: '0.85rem',
                                        lineHeight: '1.4',
                                        fontWeight: '400'
                                    }}>
                                        Lun - Dom: 8:00 - 20:00
                                    </p>
                                </div>
                            </Col>
                            <Col lg={4} md={6} className="mb-4">
                                <div className="contact-info text-center">
                                    <div className="contact-icon">
                                        <FaEnvelope />
                                    </div>
                                    <h5 style={{
                                        fontSize: '1.1rem',
                                        fontWeight: '700',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.5px',
                                        marginBottom: '12px'
                                    }}>
                                        Correo Electrónico
                                    </h5>
                                    <p className="text-muted" style={{
                                        fontSize: '1rem',
                                        fontWeight: '600',
                                        marginBottom: '8px'
                                    }}>
                                        info@elturismo.com
                                    </p>
                                    <p className="text-muted small" style={{
                                        fontSize: '0.85rem',
                                        lineHeight: '1.4',
                                        fontWeight: '400'
                                    }}>
                                        Respuesta en 24 horas
                                    </p>
                                </div>
                            </Col>
                            <Col lg={4} md={6} className="mb-4">
                                <div className="contact-info text-center">
                                    <div className="contact-icon">
                                        <FaGlobe />
                                    </div>
                                    <h5 style={{
                                        fontSize: '1.1rem',
                                        fontWeight: '700',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.5px',
                                        marginBottom: '12px'
                                    }}>
                                        Redes Sociales
                                    </h5>
                                    <p className="text-muted" style={{
                                        fontSize: '1rem',
                                        fontWeight: '600',
                                        marginBottom: '8px'
                                    }}>
                                        @elturismo
                                    </p>
                                    <p className="text-muted small" style={{
                                        fontSize: '0.85rem',
                                        lineHeight: '1.4',
                                        fontWeight: '400'
                                    }}>
                                        Síguenos para más contenido
                                    </p>
                                </div>
                            </Col>
                        </Row>
                    </Container>
                </section>

                {/* Values Section */}
                <section className="bg-agua-claro text-white" style={{ padding: '60px 0' }}>
                    <Container>
                        <h2 className="section-title" style={{
                            fontSize: '2.2rem',
                            fontWeight: '800',
                            textTransform: 'uppercase',
                            letterSpacing: '1px',
                            textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                        }}>
                            Nuestros Valores
                        </h2>
                        <Row>
                            {values.map((value, index) => (
                                <Col lg={4} md={6} key={index} className="mb-4 text-center">
                                    <div className="feature-icon">
                                        {value.icon}
                                    </div>
                                    <h3 style={{ 
                                        fontSize: '1.3rem', 
                                        marginBottom: '20px',
                                        fontWeight: '800',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.5px',
                                        textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                                    }}>
                                        {value.title}
                                    </h3>
                                    <p style={{ 
                                        fontSize: '1rem', 
                                        opacity: '0.95',
                                        lineHeight: '1.6',
                                        fontWeight: '400'
                                    }}>
                                        {value.text}
                                    </p>
                                </Col>
                            ))}
                        </Row>
                    </Container>
                </section>

                {/* Video Modal */}
                <Modal 
                    show={showVideoModal} 
                    onHide={() => setShowVideoModal(false)}
                    size="lg"
                    centered
                >
                    <Modal.Header closeButton>
                        <Modal.Title style={{
                            fontSize: '1.3rem',
                            fontWeight: '700',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px'
                        }}>
                            Descubre la Huasteca Hidalguense
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0 }}>
                            <iframe
                                src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
                                style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width: '100%',
                                    height: '100%',
                                    border: 0
                                }}
                                allowFullScreen
                                title="Video de la Huasteca Hidalguense"
                            />
                        </div>
                    </Modal.Body>
                </Modal>

            </div>
        </>
    );
};

export default Home;