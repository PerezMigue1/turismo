import React, { useState } from 'react';
import { Container, Row, Col, Carousel, Button, Nav, Navbar, Form, FormControl, Card } from 'react-bootstrap';
import { FaMapMarkerAlt, FaHiking, FaUtensils, FaShoppingBasket, FaLeaf, FaUsers, FaHandHoldingHeart, FaSearch, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const Home = () => {
    const [activeTab, setActiveTab] = useState('diversion');

    const slides = [
        {
            image: "https://res.cloudinary.com/dfxyn9ngk/image/upload/v1752075194/home-img-1_em4b3a.jpg",
            title: "GASTRONOMIA",
            subtitle: "A solo 10 minutos de Pachuca encuentras este bonito Pueblo Mágico",
            description: "Descubre la magia de la Huasteca Hidalguense con experiencias auténticas y sostenibles"
        },
        {
            image: "https://res.cloudinary.com/dfxyn9ngk/image/upload/v1752074608/home-img2_bgy4uj.jpg",

            title: "CASCADAS ESCONDIDAS",
            subtitle: "Rutas para evitar aglomeraciones y disfrutar de la naturaleza",
            description: "Conecta con la cultura y naturaleza local de forma responsable"
        },
        {
            image: "https://res.cloudinary.com/dfxyn9ngk/image/upload/v1752073986/home-img_hqb33n.jpg",
            title: "TRADICIONES VIVAS",
            subtitle: "Conoce las danzas huastecas y patrimonio cultural",
            description: "Apoyando directamente a las comunidades locales"
        }
    ];

    const features = [
        {
            icon: <FaMapMarkerAlt style={{ fontSize: '2.5rem', color: '#0FA89C' }} />,
            title: 'Mapas y Rutas',
            text: 'Descubre atracciones con nuestros mapas interactivos y rutas dinámicas.'
        },
        {
            icon: <FaHiking style={{ fontSize: '2.5rem', color: '#0FA89C' }} />,
            title: 'Guías Turísticas',
            text: 'Fichas detalladas de lugares con fotos, descripción y nivel de dificultad.'
        },
        {
            icon: <FaUtensils style={{ fontSize: '2.5rem', color: '#0FA89C' }} />,
            title: 'Gastronomía Local',
            text: 'Disfruta de platillos típicos como el pozole de queso en restaurantes locales.'
        },
        {
            icon: <FaShoppingBasket style={{ fontSize: '2.5rem', color: '#0FA89C' }} />,
            title: 'Marketplace',
            text: 'Compra artesanías directamente de los productores con pagos seguros.'
        }
    ];

    const experiences = [
        {
            image: "https://images.unsplash.com/photo-1551632811-561732d1e306?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
            title: 'Senderismo en el Cerro de las Campanas',
            text: 'Disfruta de la naturaleza con diferentes niveles de dificultad.'
        },
        {
            image: "https://images.unsplash.com/photo-1534224039826-c7a0eda0e6b3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
            title: 'Danzas Huastecas',
            text: 'Conoce las tradiciones culturales de la región.'
        },
        {
            image: "https://res.cloudinary.com/dfxyn9ngk/image/upload/v1752073986/home-img_hqb33n.jpg",
            title: 'Cascadas Escondidas',
            text: 'Ruta para evitar aglomeraciones y disfrutar de la naturaleza.'
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
        
        .navbar-custom {
            background-color: white;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        
        .navbar-custom .navbar-nav .nav-link {
            color: #9A1E47;
            font-weight: 500;
            margin: 0 10px;
            padding: 8px 16px;
            border-radius: 4px;
            transition: all 0.3s ease;
        }
        
        .navbar-custom .navbar-nav .nav-link:hover {
            color: #0FA89C;
            background-color: #FDF2E0;
        }
        
        .navbar-custom .navbar-nav .nav-link.active {
            background-color: #9A1E47;
            color: white;
        }
        
        .carousel-item {
            height: 70vh;
        }
        
        .carousel-item img {
            height: 70vh;
            object-fit: cover;
            filter: brightness(0.6);
        }
        
        .carousel-caption {
            bottom: 30%;
            background-color: rgba(154, 30, 71, 0.9);
            padding: 30px;
            border-radius: 10px;
            max-width: 800px;
            margin: 0 auto;
        }
        
        .carousel-caption h1 {
            font-size: 2.5rem;
            font-weight: bold;
            color: #F28B27;
            margin-bottom: 15px;
        }
        
        .carousel-caption p {
            font-size: 1.2rem;
            margin-bottom: 20px;
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
            padding: 15px 30px;
            margin: 0;
            border-radius: 0;
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
        
        .brand-logo {
            font-size: 1.8rem;
            font-weight: bold;
            color: #9A1E47;
            text-decoration: none;
        }
        
        .brand-logo:hover {
            color: #0FA89C;
            text-decoration: none;
        }
        
        .search-form {
            position: relative;
        }
        
        .search-form .form-control {
            padding-right: 40px;
        }
        
        .search-form .search-icon {
            position: absolute;
            right: 12px;
            top: 50%;
            transform: translateY(-50%);
            color: #6c757d;
        }
        
        @media (max-width: 768px) {
            .carousel-caption h1 {
                font-size: 1.8rem;
            }
            .carousel-caption p {
                font-size: 1rem;
            }
            .section-title {
                font-size: 2rem;
            }
        }
    `;

    return (
        <>
            <style>{customStyles}</style>
            <div className="bg-beige" style={{ minHeight: '100vh' }}>
                {/* Header */}

                {/* Hero Carousel */}
                <Carousel fade controls indicators>
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
                                <Button className="btn-verde-bosque" size="lg">
                                    Explorar ahora
                                </Button>
                            </Carousel.Caption>
                        </Carousel.Item>
                    ))}
                </Carousel>

                {/* Navigation Tabs */}
                <Nav variant="tabs" className="nav-tabs-custom justify-content-center">
                    <Nav.Item>
                        <Nav.Link
                            eventKey="diversion"
                            active={activeTab === 'diversion'}
                            onClick={() => setActiveTab('diversion')}
                        >
                            DIVERSIÓN
                        </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link
                            eventKey="recorridos"
                            active={activeTab === 'recorridos'}
                            onClick={() => setActiveTab('recorridos')}
                        >
                            RECORRIDOS
                        </Nav.Link>
                    </Nav.Item>
                </Nav>

                {/* Experiences Grid */}
                <section style={{ padding: '60px 0' }}>
                    <Container>
                        <Row>
                            {experiences.map((experience, index) => (
                                <Col lg={4} md={6} key={index} className="mb-4">
                                    <Card className="card-hover h-100">
                                        <Card.Img
                                            variant="top"
                                            src={experience.image}
                                            style={{ height: '200px', objectFit: 'cover' }}
                                        />
                                        <Card.Body className="d-flex flex-column">
                                            <Card.Title className="text-rojo-guinda">
                                                {experience.title}
                                            </Card.Title>
                                            <Card.Text className="flex-grow-1">
                                                {experience.text}
                                            </Card.Text>
                                            <Button className="btn-rojo-guinda mt-auto">
                                                Ver detalles
                                            </Button>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    </Container>
                </section>

                {/* Features Section */}
                <section style={{ padding: '60px 0', backgroundColor: 'white' }}>
                    <Container>
                        <h2 className="section-title text-rojo-guinda">
                            Nuestras Funcionalidades
                        </h2>
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
                                        </Card.Body>
                                    </Card>
                                </Col>
                            ))}
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

            </div>
        </>
    );
};

export default Home;