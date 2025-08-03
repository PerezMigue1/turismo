import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Carousel, Button, Nav, Card, Spinner, Alert, Badge, Modal } from 'react-bootstrap';
import { 
    FaMapMarkerAlt, FaHiking, FaUtensils, FaShoppingBasket, FaLeaf, FaUsers, FaHandHoldingHeart, 
    FaSearch, FaChevronLeft, FaChevronRight, FaBed, FaMountain, FaCalendarAlt, FaStar, FaHeart,
    FaPhone, FaEnvelope, FaGlobe, FaClock, FaInfoCircle, FaArrowRight, FaPlay, FaPause
} from 'react-icons/fa';
import { Link } from 'react-router-dom';

// Importar componentes reales
import ListaArtesanias from './ListaArtesanias';
import ListaLugares from './ListaLugares';
import ListaRestaurantes from './ListaRestaurantes';
import ListaEcoturismo from './ListaEcoturismo';
import ListaNegocios from './ListaNegocios';
import CardFestividades from './CardFestividades';
import CardGastronomia from './CardGastronomia';
import CardHospedaje from './CardHospedaje';

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

    const testimonials = [
        {
            name: "María González",
            role: "Turista",
            text: "Una experiencia increíble. Los lugares son hermosos y la gente muy amable.",
            rating: 5,
            avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face"
        },
        {
            name: "Carlos Rodríguez",
            role: "Viajero",
            text: "Las artesanías son únicas y los precios muy justos. Definitivamente volveré.",
            rating: 5,
            avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
        },
        {
            name: "Ana Martínez",
            role: "Fotógrafa",
            text: "Los paisajes son espectaculares. Perfecto para fotografía de naturaleza.",
            rating: 5,
            avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face"
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

                // Intentar cargar otros datos opcionalmente
                try {
                    const restaurantesRes = await fetch('https://backend-iota-seven-19.vercel.app/api/restaurantes');
                    if (restaurantesRes.ok) {
                        const restaurantesData = await restaurantesRes.json();
                        setRestaurantes(Array.isArray(restaurantesData) ? restaurantesData.slice(0, 6) : []);
                    }
                } catch (error) {
                    console.log('Restaurantes no disponibles:', error.message);
                    setRestaurantes([]);
                }

                try {
                    const hospedajesRes = await fetch('https://backend-iota-seven-19.vercel.app/api/hospedajes');
                    if (hospedajesRes.ok) {
                        const hospedajesData = await hospedajesRes.json();
                        setHospedajes(Array.isArray(hospedajesData) ? hospedajesData.slice(0, 6) : []);
                    }
                } catch (error) {
                    console.log('Hospedajes no disponibles:', error.message);
                    setHospedajes([]);
                }

                try {
                    const ecoturismoRes = await fetch('https://backend-iota-seven-19.vercel.app/api/ecoturismo');
                    if (ecoturismoRes.ok) {
                        const ecoturismoData = await ecoturismoRes.json();
                        setEcoturismo(Array.isArray(ecoturismoData) ? ecoturismoData.slice(0, 6) : []);
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
            backdrop-filter: blur(10px);
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
            background: linear-gradient(135deg, #9A1E47 0%, #D24D10 100%);
            border: none;
            padding: 0;
            box-shadow: 0 4px 15px rgba(154, 30, 71, 0.3);
        }
        
        .nav-tabs-custom .nav-link {
            border: none;
            color: white;
            font-weight: bold;
            background: transparent;
            padding: 18px 35px;
            margin: 0;
            border-radius: 0;
            transition: all 0.3s ease;
            position: relative;
            font-size: 1.1rem;
            letter-spacing: 0.5px;
        }
        
        .nav-tabs-custom .nav-link:hover {
            background-color: rgba(255,255,255,0.1);
            color: white;
            border: none;
            transform: translateY(-2px);
        }
        
        .nav-tabs-custom .nav-link.active {
            background-color: rgba(255,255,255,0.2);
            color: white;
            border: none;
            box-shadow: inset 0 -3px 0 #F28B27;
        }
        
        .nav-tabs-custom .nav-link.active::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 50%;
            transform: translateX(-50%);
            width: 60%;
            height: 3px;
            background-color: #F28B27;
            border-radius: 2px;
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
            background: linear-gradient(135deg, #9A1E47 0%, #D24D10 100%);
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
        
        .testimonial-card {
            background: white;
            border-radius: 15px;
            padding: 30px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.1);
            margin-bottom: 20px;
        }
        
        .testimonial-avatar {
            width: 60px;
            height: 60px;
            border-radius: 50%;
            object-fit: cover;
            margin-bottom: 15px;
        }
        
        .video-section {
            background: linear-gradient(135deg, #0FA89C 0%, #1E8546 100%);
            color: white;
            padding: 80px 0;
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
        
        .content-section {
            padding: 60px 0;
        }
        
        .section-header {
            text-align: center;
            margin-bottom: 40px;
        }
        
        .section-header h2 {
            font-size: 2.5rem;
            font-weight: bold;
            color: #9A1E47;
            margin-bottom: 15px;
        }
        
        .section-header p {
            font-size: 1.1rem;
            color: #6c757d;
            max-width: 600px;
            margin: 0 auto;
        }
        
        .content-grid {
            display: grid;
            gap: 30px;
            margin-bottom: 40px;
        }
        
        .content-item {
            background: white;
            border-radius: 15px;
            padding: 25px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.1);
            transition: all 0.3s ease;
            border: 2px solid transparent;
            min-height: 350px;
            display: flex;
            flex-direction: column;
        }
        
        .content-item:hover {
            transform: translateY(-5px);
            box-shadow: 0 8px 25px rgba(0,0,0,0.15);
            border-color: #9A1E47;
        }
        
        .content-icon {
            font-size: 2.5rem;
            margin-bottom: 20px;
            text-align: center;
        }
        
        .content-title {
            font-size: 1.3rem;
            font-weight: 600;
            color: #9A1E47;
            margin-bottom: 15px;
            text-align: center;
        }
        
        .content-description {
            color: #6c757d;
            text-align: center;
            margin-bottom: 20px;
            flex-grow: 1;
        }
        

        
        .empty-state {
            text-align: center;
            padding: 40px 20px;
            background: #f8f9fa;
            border-radius: 15px;
            border: 2px dashed #9A1E47;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
        }
        
        .empty-state-icon {
            font-size: 4rem;
            color: #9A1E47;
            margin-bottom: 20px;
        }
        
        .empty-state h4 {
            color: #9A1E47;
            margin-bottom: 10px;
        }
        
        .empty-state p {
            color: #6c757d;
            margin-bottom: 0;
        }
        
        .view-all-button {
            text-align: center;
            margin-top: auto;
            padding-top: 20px;
        }
        
        .view-all-button .btn {
            padding: 12px 30px;
            font-size: 1.1rem;
            font-weight: 600;
            border-radius: 25px;
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
            .stats-number {
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
                padding: 10px 15px;
                font-size: 0.9rem;
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
            .stats-number {
                font-size: 1.8rem;
            }
            .nav-tabs-custom .nav-link {
                padding: 8px 12px;
                font-size: 0.8rem;
            }
        }
        
        @media (max-width: 480px) {
            .carousel-caption {
                padding: 15px;
                bottom: 5%;
            }
            .carousel-caption h1 {
                font-size: 1.3rem;
            }
            .carousel-caption p {
                font-size: 0.8rem;
            }
            .section-header h2 {
                font-size: 1.5rem;
            }
            .content-item {
                padding: 15px;
                min-height: 250px;
            }
            .content-icon {
                font-size: 1.8rem;
            }
            .content-title {
                font-size: 1rem;
            }
            .stats-card {
                padding: 15px;
            }
            .stats-number {
                font-size: 1.5rem;
            }
            .nav-tabs-custom .nav-link {
                padding: 6px 10px;
                font-size: 0.7rem;
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
                            
                            <div className="content-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
                                {/* Artesanías */}
                                <div className="content-item">
                                    <div className="content-icon" style={{ color: '#9A1E47' }}>
                                        <FaShoppingBasket />
                                    </div>
                                    <div className="content-title">Artesanías Locales</div>
                                    <div className="content-description">
                                        Descubre la creatividad y tradición de nuestros artesanos locales
                                    </div>
                                    
                                    {artesanias.length > 0 ? (
                                        <div style={{ flex: 1, minHeight: '200px', overflow: 'hidden' }}>
                                            <ListaArtesanias artesanias={artesanias.slice(0, 2)} />
                                        </div>
                                    ) : (
                                        <div className="empty-state" style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                            <div className="empty-state-icon">
                                                <FaShoppingBasket />
                                            </div>
                                            <h4>Próximamente</h4>
                                            <p>Artesanías locales únicas</p>
                                        </div>
                                    )}
                                    
                                    <div className="view-all-button">
                                        <Link to="/artesanias" className="btn btn-rojo-guinda">
                                            Ver todas las artesanías
                                        </Link>
                                    </div>
                                </div>

                                {/* Lugares */}
                                <div className="content-item">
                                    <div className="content-icon" style={{ color: '#0FA89C' }}>
                                        <FaMapMarkerAlt />
                                    </div>
                                    <div className="content-title">Lugares Turísticos</div>
                                    <div className="content-description">
                                        Explora cascadas, miradores y sitios de interés natural
                                    </div>
                                    
                                    {lugares.length > 0 ? (
                                        <div style={{ flex: 1, minHeight: '200px', overflow: 'hidden' }}>
                                            <ListaLugares lugares={lugares.slice(0, 2)} />
                                        </div>
                                    ) : (
                                        <div className="empty-state" style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                            <div className="empty-state-icon">
                                                <FaMapMarkerAlt />
                                            </div>
                                            <h4>Próximamente</h4>
                                            <p>Lugares turísticos increíbles</p>
                                        </div>
                                    )}
                                    
                                    <div className="view-all-button">
                                        <Link to="/lugares" className="btn btn-rojo-guinda">
                                            Ver todos los lugares
                                        </Link>
                                    </div>
                                </div>

                                {/* Restaurantes */}
                                <div className="content-item">
                                    <div className="content-icon" style={{ color: '#F28B27' }}>
                                        <FaUtensils />
                                    </div>
                                    <div className="content-title">Gastronomía Local</div>
                                    <div className="content-description">
                                        Saborea los platillos tradicionales de la región
                                    </div>
                                    
                                    {restaurantes.length > 0 ? (
                                        <div style={{ flex: 1, minHeight: '200px', overflow: 'hidden' }}>
                                            <ListaRestaurantes restaurantes={restaurantes.slice(0, 2)} />
                                        </div>
                                    ) : (
                                        <div className="empty-state" style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                            <div className="empty-state-icon">
                                                <FaUtensils />
                                            </div>
                                            <h4>Próximamente</h4>
                                            <p>Restaurantes con sabor local</p>
                                        </div>
                                    )}
                                    
                                    <div className="view-all-button">
                                        <Link to="/restaurantes" className="btn btn-rojo-guinda">
                                            Ver todos los restaurantes
                                        </Link>
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
                            
                            <div className="content-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))' }}>
                                {/* Ecoturismo */}
                                <div className="content-item">
                                    <div className="content-icon" style={{ color: '#1E8546' }}>
                                        <FaMountain />
                                    </div>
                                    <div className="content-title">Ecoturismo y Aventura</div>
                                    <div className="content-description">
                                        Explora senderos, cascadas y actividades al aire libre
                                    </div>
                                    
                                    {ecoturismo.length > 0 ? (
                                        <div style={{ flex: 1, minHeight: '200px', overflow: 'hidden' }}>
                                            <ListaEcoturismo ecoturismos={ecoturismo.slice(0, 2)} />
                                        </div>
                                    ) : (
                                        <div className="empty-state" style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                            <div className="empty-state-icon">
                                                <FaMountain />
                                            </div>
                                            <h4>Próximamente</h4>
                                            <p>Actividades de ecoturismo</p>
                                        </div>
                                    )}
                                    
                                    <div className="view-all-button">
                                        <Link to="/ecoturismo" className="btn btn-verde-bosque">
                                            Ver todas las actividades
                                        </Link>
                                    </div>
                                </div>

                                {/* Hospedajes */}
                                <div className="content-item">
                                    <div className="content-icon" style={{ color: '#0FA89C' }}>
                                        <FaBed />
                                    </div>
                                    <div className="content-title">Hospedajes Únicos</div>
                                    <div className="content-description">
                                        Descansa en casas rurales y hoteles con encanto local
                                    </div>
                                    
                                    {hospedajes.length > 0 ? (
                                        <div style={{ flex: 1, minHeight: '200px', overflow: 'hidden' }}>
                                            {hospedajes.slice(0, 2).map((hospedaje) => (
                                                <Card key={hospedaje._id} className="card-hover mb-3">
                                                    <Card.Body>
                                                        <h6 className="text-rojo-guinda">{hospedaje.nombre}</h6>
                                                        <p className="text-muted small">{hospedaje.descripcion?.substring(0, 100)}...</p>
                                                        <Link to={`/hospedajes/${hospedaje._id}`} className="btn btn-sm btn-rojo-guinda">
                                                            Ver detalles
                                                        </Link>
                                                    </Card.Body>
                                                </Card>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="empty-state" style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                            <div className="empty-state-icon">
                                                <FaBed />
                                            </div>
                                            <h4>Próximamente</h4>
                                            <p>Hospedajes con encanto local</p>
                                        </div>
                                    )}
                                    
                                    <div className="view-all-button">
                                        <Link to="/hospedajes" className="btn btn-verde-bosque">
                                            Ver todos los hospedajes
                                        </Link>
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
                            
                            {festividades.length > 0 ? (
                                <div className="content-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
                                    {festividades.slice(0, 6).map((festividad) => (
                                        <div key={festividad._id} className="content-item">
                                            <CardFestividades 
                                                festividad={festividad}
                                                onVerDetalle={(fest) => console.log('Ver festividad:', fest)}
                                            />
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="empty-state" style={{ minHeight: '300px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                                    <div className="empty-state-icon">
                                        <FaCalendarAlt />
                                    </div>
                                    <h4>Próximamente: Festividades</h4>
                                    <p>Eventos culturales y tradiciones locales</p>
                                </div>
                            )}
                            
                            <div className="view-all-button">
                                <Link to="/festividades" className="btn btn-rojo-guinda">
                                    Ver todas las festividades
                                </Link>
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
                                <h2 className="text-white mb-4">Descubre la Huasteca Hidalguense</h2>
                                <p className="text-white-50 mb-4">
                                    Sumérgete en la belleza natural y cultural de esta región mágica. 
                                    Desde cascadas cristalinas hasta tradiciones centenarias, 
                                    cada rincón tiene una historia que contar.
                                </p>
                                <Button 
                                    variant="light" 
                                    size="lg"
                                    onClick={() => setShowVideoModal(true)}
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
                        <h2 className="section-title text-rojo-guinda">
                            Nuestras Funcionalidades
                        </h2>
                        <p className="section-subtitle">
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
                                            <Card.Title className="text-rojo-guinda">
                                                {feature.title}
                                            </Card.Title>
                                            <Card.Text>
                                                {feature.text}
                                            </Card.Text>
                                            <Link to={feature.link} className="btn btn-rojo-guinda">
                                                Explorar
                                            </Link>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    </Container>
                </section>

                {/* Stats Section */}
                <section style={{ padding: '60px 0', backgroundColor: '#f8f9fa' }}>
                    <Container>
                        <h2 className="section-title text-rojo-guinda">
                            Descubre la Huasteca Hidalguense
                        </h2>
                        <p className="section-subtitle">
                            Una región llena de tradiciones, naturaleza y experiencias únicas
                        </p>
                        <Row>
                            <Col lg={3} md={6} className="mb-4">
                                <div className="stats-card">
                                    <div className="stats-icon">
                                        <FaMapMarkerAlt />
                                    </div>
                                    <div className="stats-label">Lugares Turísticos</div>
                                    <small style={{ opacity: 0.8 }}>Cascadas, miradores y sitios históricos</small>
                                </div>
                            </Col>
                            <Col lg={3} md={6} className="mb-4">
                                <div className="stats-card">
                                    <div className="stats-icon">
                                        <FaUtensils />
                                    </div>
                                    <div className="stats-label">Gastronomía Local</div>
                                    <small style={{ opacity: 0.8 }}>Sabores tradicionales y únicos</small>
                                </div>
                            </Col>
                            <Col lg={3} md={6} className="mb-4">
                                <div className="stats-card">
                                    <div className="stats-icon">
                                        <FaShoppingBasket />
                                    </div>
                                    <div className="stats-label">Artesanías</div>
                                    <small style={{ opacity: 0.8 }}>Creadas por manos artesanas</small>
                                </div>
                            </Col>
                            <Col lg={3} md={6} className="mb-4">
                                <div className="stats-card">
                                    <div className="stats-icon">
                                        <FaBed />
                                    </div>
                                    <div className="stats-label">Hospedajes</div>
                                    <small style={{ opacity: 0.8 }}>Experiencias únicas de alojamiento</small>
                                </div>
                            </Col>
                        </Row>
                    </Container>
                </section>



                {/* Contact Section */}
                <section style={{ padding: '60px 0', backgroundColor: '#f8f9fa' }}>
                    <Container>
                        <h2 className="section-title text-rojo-guinda">
                            ¿Necesitas ayuda?
                        </h2>
                        <Row>
                            <Col lg={4} md={6} className="mb-4">
                                <div className="contact-info text-center">
                                    <div className="contact-icon">
                                        <FaPhone />
                                    </div>
                                    <h5>Línea de Atención</h5>
                                    <p className="text-muted">+52 123 456 7890</p>
                                    <p className="text-muted small">Lun - Dom: 8:00 - 20:00</p>
                                </div>
                            </Col>
                            <Col lg={4} md={6} className="mb-4">
                                <div className="contact-info text-center">
                                    <div className="contact-icon">
                                        <FaEnvelope />
                                    </div>
                                    <h5>Correo Electrónico</h5>
                                    <p className="text-muted">info@elturismo.com</p>
                                    <p className="text-muted small">Respuesta en 24 horas</p>
                                </div>
                            </Col>
                            <Col lg={4} md={6} className="mb-4">
                                <div className="contact-info text-center">
                                    <div className="contact-icon">
                                        <FaGlobe />
                                    </div>
                                    <h5>Redes Sociales</h5>
                                    <p className="text-muted">@elturismo</p>
                                    <p className="text-muted small">Síguenos para más contenido</p>
                                </div>
                            </Col>
                        </Row>
                    </Container>
                </section>

                {/* Values Section */}
                <section className="bg-agua-claro text-white" style={{ padding: '60px 0' }}>
                    <Container>
                        <h2 className="section-title">
                            Nuestros Valores
                        </h2>
                        <Row>
                            {values.map((value, index) => (
                                <Col lg={4} md={6} key={index} className="mb-4 text-center">
                                    <div className="feature-icon">
                                        {value.icon}
                                    </div>
                                    <h3 style={{ fontSize: '1.5rem', marginBottom: '20px' }}>
                                        {value.title}
                                    </h3>
                                    <p style={{ fontSize: '1.1rem', opacity: '0.9' }}>
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
                        <Modal.Title>Descubre la Huasteca Hidalguense</Modal.Title>
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