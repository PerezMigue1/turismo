<<<<<<< HEAD
import React from 'react';
import { Container, Row, Col, Carousel, Button } from 'react-bootstrap';
import { FaMapMarkerAlt, FaHiking, FaUtensils, FaShoppingBasket, FaLeaf, FaUsers, FaHandHoldingHeart } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div style={{ backgroundColor: '#FDF2E0', minHeight: '100vh' }}>
            {/* Hero Section */}
            <section style={{ position: 'relative' }}>
                <Carousel>
                    <Carousel.Item>
                        <img
                            className="d-block w-100"
                            src="../image/Yahualica.png"
                            alt="Primer slide"
                            style={{ height: '70vh', objectFit: 'cover', filter: 'brightness(0.7)' }}
                        />
                        <Carousel.Caption style={{
                            bottom: '30%',
                            backgroundColor: 'rgba(154, 30, 71, 0.7)',
                            padding: '20px',
                            borderRadius: '10px',
                            maxWidth: '800px',
                            margin: '0 auto'
                        }}>
                            <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'white' }}>
                                Descubre la Huasteca Hidalguense
                            </h1>
                            <p style={{ fontSize: '1.2rem', color: 'white' }}>
                                Experiencias auténticas y sostenibles que conectan con la cultura y naturaleza local
                            </p>
                            <Button
                                as={Link}
                                to="/experiencias"
                                style={{
                                    backgroundColor: '#1E8546',
                                    border: 'none',
                                    padding: '10px 25px',
                                    fontSize: '1.1rem',
                                    fontWeight: '500'
                                }}
                            >
                                Explorar ahora
                            </Button>
                        </Carousel.Caption>
                    </Carousel.Item>
                    <Carousel.Item>
                        <img
                            className="d-block w-100"
                            src="../image/calnali.png"
                            alt="Segundo slide"
                            style={{ height: '70vh', objectFit: 'cover', filter: 'brightness(0.7)' }}
                        />
                        <Carousel.Caption style={{
                            bottom: '30%',
                            backgroundColor: 'rgba(154, 30, 71, 0.7)',
                            padding: '20px',
                            borderRadius: '10px',
                            maxWidth: '800px',
                            margin: '0 auto'
                        }}>
                            <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'white' }}>
                                Turismo Responsable
                            </h1>
                            <p style={{ fontSize: '1.2rem', color: 'white' }}>
                                Apoyando directamente a las comunidades y preservando el patrimonio cultural
                            </p>
                            <Button
                                as={Link}
                                to="/comunidades"
                                style={{
                                    backgroundColor: '#1E8546',
                                    border: 'none',
                                    padding: '10px 25px',
                                    fontSize: '1.1rem',
                                    fontWeight: '500'
                                }}
                            >
                                Conoce más
                            </Button>
                        </Carousel.Caption>
                    </Carousel.Item>
                </Carousel>
            </section>

            {/* Features Section */}
            <section style={{ padding: '60px 0' }}>
                <Container>
                    <h2 style={{
                        textAlign: 'center',
                        marginBottom: '50px',
                        color: '#9A1E47',
                        fontSize: '2rem',
                        fontWeight: 'bold'
                    }}>
                        Nuestras Funcionalidades
                    </h2>
                    <Row>
                        {[
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
                        ].map((feature, index) => (
                            <Col md={3} key={index} style={{ marginBottom: '30px' }}>
                                <div style={{
                                    backgroundColor: 'white',
                                    borderRadius: '10px',
                                    padding: '25px 20px',
                                    height: '100%',
                                    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                                    transition: 'transform 0.3s',
                                    textAlign: 'center',
                                    ':hover': {
                                        transform: 'translateY(-5px)'
                                    }
                                }}>
                                    <div style={{ marginBottom: '20px' }}>{feature.icon}</div>
                                    <h3 style={{
                                        color: '#9A1E47',
                                        fontSize: '1.3rem',
                                        marginBottom: '15px'
                                    }}>{feature.title}</h3>
                                    <p style={{ color: '#555' }}>{feature.text}</p>
                                </div>
                            </Col>
                        ))}
                    </Row>
                </Container>
            </section>

            {/* Experiences Section */}
            <section style={{
                padding: '60px 0',
                backgroundColor: '#50C2C4',
                color: 'white'
            }}>
                <Container>
                    <h2 style={{
                        textAlign: 'center',
                        marginBottom: '50px',
                        fontSize: '2rem',
                        fontWeight: 'bold'
                    }}>
                        Experiencias Destacadas
                    </h2>
                    <Row>
                        {[
                            {
                                image: '../image/senderismo.jpeg',
                                title: 'Senderismo en el Cerro de las Campanas',
                                text: 'Disfruta de la naturaleza con diferentes niveles de dificultad.'
                            },
                            {
                                image: '../image/danzas.jpg',
                                title: 'Danzas Huastecas',
                                text: 'Conoce las tradiciones culturales de la región.'
                            },
                            {
                                image: '../image/cascada.jpeg',
                                title: 'Cascadas Escondidas',
                                text: 'Ruta para evitar aglomeraciones y disfrutar de la naturaleza.'
                            }
                        ].map((experience, index) => (
                            <Col md={4} key={index} style={{ marginBottom: '30px' }}>
                                <div style={{
                                    backgroundColor: 'white',
                                    borderRadius: '10px',
                                    overflow: 'hidden',
                                    boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                                    transition: 'transform 0.3s',
                                    ':hover': {
                                        transform: 'translateY(-5px)'
                                    }
                                }}>
                                    <img
                                        src={experience.image}
                                        alt={experience.title}
                                        style={{
                                            width: '100%',
                                            height: '200px',
                                            objectFit: 'cover'
                                        }}
                                    />
                                    <div style={{ padding: '20px' }}>
                                        <h3 style={{
                                            color: '#9A1E47',
                                            fontSize: '1.2rem',
                                            marginBottom: '15px'
                                        }}>{experience.title}</h3>
                                        <p style={{
                                            color: '#555',
                                            marginBottom: '20px'
                                        }}>{experience.text}</p>
                                        <Button
                                            as={Link}
                                            to={`/experiencia/${index}`}
                                            style={{
                                                backgroundColor: '#9A1E47',
                                                border: 'none',
                                                padding: '8px 20px',
                                                fontSize: '0.9rem'
                                            }}
                                        >
                                            Ver detalles
                                        </Button>
                                    </div>
                                </div>
                            </Col>
                        ))}
                    </Row>
                </Container>
            </section>

            {/* Values Section */}
            <section style={{ padding: '60px 0' }}>
                <Container>
                    <h2 style={{
                        textAlign: 'center',
                        marginBottom: '50px',
                        color: '#9A1E47',
                        fontSize: '2rem',
                        fontWeight: 'bold'
                    }}>
                        Nuestros Valores
                    </h2>
                    <Row>
                        {[
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
                        ].map((value, index) => (
                            <Col md={4} key={index} style={{ marginBottom: '30px' }}>
                                <div style={{
                                    textAlign: 'center',
                                    padding: '20px'
                                }}>
                                    <div style={{ marginBottom: '20px' }}>{value.icon}</div>
                                    <h3 style={{
                                        color: '#9A1E47',
                                        fontSize: '1.3rem',
                                        marginBottom: '15px'
                                    }}>{value.title}</h3>
                                    <p style={{ color: '#555' }}>{value.text}</p>
                                </div>
                            </Col>
                        ))}
                    </Row>
                </Container>
            </section>
        </div>
    );
};

=======
import React from 'react';
import { Container, Row, Col, Carousel, Button } from 'react-bootstrap';
import { FaMapMarkerAlt, FaHiking, FaUtensils, FaShoppingBasket, FaLeaf, FaUsers, FaHandHoldingHeart } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div style={{ backgroundColor: '#FDF2E0', minHeight: '100vh' }}>
            {/* Hero Section */}
            <section style={{ position: 'relative' }}>
                <Carousel>
                    <Carousel.Item>
                        <img
                            className="d-block w-100"
                            src="../image/Yahualica.png"
                            alt="Primer slide"
                            style={{ height: '70vh', objectFit: 'cover', filter: 'brightness(0.7)' }}
                        />
                        <Carousel.Caption style={{
                            bottom: '30%',
                            backgroundColor: 'rgba(154, 30, 71, 0.7)',
                            padding: '20px',
                            borderRadius: '10px',
                            maxWidth: '800px',
                            margin: '0 auto'
                        }}>
                            <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'white' }}>
                                Descubre la Huasteca Hidalguense
                            </h1>
                            <p style={{ fontSize: '1.2rem', color: 'white' }}>
                                Experiencias auténticas y sostenibles que conectan con la cultura y naturaleza local
                            </p>
                            <Button
                                as={Link}
                                to="/experiencias"
                                style={{
                                    backgroundColor: '#1E8546',
                                    border: 'none',
                                    padding: '10px 25px',
                                    fontSize: '1.1rem',
                                    fontWeight: '500'
                                }}
                            >
                                Explorar ahora
                            </Button>
                        </Carousel.Caption>
                    </Carousel.Item>
                    <Carousel.Item>
                        <img
                            className="d-block w-100"
                            src="../image/calnali.png"
                            alt="Segundo slide"
                            style={{ height: '70vh', objectFit: 'cover', filter: 'brightness(0.7)' }}
                        />
                        <Carousel.Caption style={{
                            bottom: '30%',
                            backgroundColor: 'rgba(154, 30, 71, 0.7)',
                            padding: '20px',
                            borderRadius: '10px',
                            maxWidth: '800px',
                            margin: '0 auto'
                        }}>
                            <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'white' }}>
                                Turismo Responsable
                            </h1>
                            <p style={{ fontSize: '1.2rem', color: 'white' }}>
                                Apoyando directamente a las comunidades y preservando el patrimonio cultural
                            </p>
                            <Button
                                as={Link}
                                to="/comunidades"
                                style={{
                                    backgroundColor: '#1E8546',
                                    border: 'none',
                                    padding: '10px 25px',
                                    fontSize: '1.1rem',
                                    fontWeight: '500'
                                }}
                            >
                                Conoce más
                            </Button>
                        </Carousel.Caption>
                    </Carousel.Item>
                </Carousel>
            </section>

            {/* Features Section */}
            <section style={{ padding: '60px 0' }}>
                <Container>
                    <h2 style={{
                        textAlign: 'center',
                        marginBottom: '50px',
                        color: '#9A1E47',
                        fontSize: '2rem',
                        fontWeight: 'bold'
                    }}>
                        Nuestras Funcionalidades
                    </h2>
                    <Row>
                        {[
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
                        ].map((feature, index) => (
                            <Col md={3} key={index} style={{ marginBottom: '30px' }}>
                                <div style={{
                                    backgroundColor: 'white',
                                    borderRadius: '10px',
                                    padding: '25px 20px',
                                    height: '100%',
                                    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                                    transition: 'transform 0.3s',
                                    textAlign: 'center',
                                    ':hover': {
                                        transform: 'translateY(-5px)'
                                    }
                                }}>
                                    <div style={{ marginBottom: '20px' }}>{feature.icon}</div>
                                    <h3 style={{
                                        color: '#9A1E47',
                                        fontSize: '1.3rem',
                                        marginBottom: '15px'
                                    }}>{feature.title}</h3>
                                    <p style={{ color: '#555' }}>{feature.text}</p>
                                </div>
                            </Col>
                        ))}
                    </Row>
                </Container>
            </section>

            {/* Experiences Section */}
            <section style={{
                padding: '60px 0',
                backgroundColor: '#50C2C4',
                color: 'white'
            }}>
                <Container>
                    <h2 style={{
                        textAlign: 'center',
                        marginBottom: '50px',
                        fontSize: '2rem',
                        fontWeight: 'bold'
                    }}>
                        Experiencias Destacadas
                    </h2>
                    <Row>
                        {[
                            {
                                image: '../image/senderismo.jpeg',
                                title: 'Senderismo en el Cerro de las Campanas',
                                text: 'Disfruta de la naturaleza con diferentes niveles de dificultad.'
                            },
                            {
                                image: '../image/danzas.jpg',
                                title: 'Danzas Huastecas',
                                text: 'Conoce las tradiciones culturales de la región.'
                            },
                            {
                                image: '../image/cascada.jpeg',
                                title: 'Cascadas Escondidas',
                                text: 'Ruta para evitar aglomeraciones y disfrutar de la naturaleza.'
                            }
                        ].map((experience, index) => (
                            <Col md={4} key={index} style={{ marginBottom: '30px' }}>
                                <div style={{
                                    backgroundColor: 'white',
                                    borderRadius: '10px',
                                    overflow: 'hidden',
                                    boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                                    transition: 'transform 0.3s',
                                    ':hover': {
                                        transform: 'translateY(-5px)'
                                    }
                                }}>
                                    <img
                                        src={experience.image}
                                        alt={experience.title}
                                        style={{
                                            width: '100%',
                                            height: '200px',
                                            objectFit: 'cover'
                                        }}
                                    />
                                    <div style={{ padding: '20px' }}>
                                        <h3 style={{
                                            color: '#9A1E47',
                                            fontSize: '1.2rem',
                                            marginBottom: '15px'
                                        }}>{experience.title}</h3>
                                        <p style={{
                                            color: '#555',
                                            marginBottom: '20px'
                                        }}>{experience.text}</p>
                                        <Button
                                            as={Link}
                                            to={`/experiencia/${index}`}
                                            style={{
                                                backgroundColor: '#9A1E47',
                                                border: 'none',
                                                padding: '8px 20px',
                                                fontSize: '0.9rem'
                                            }}
                                        >
                                            Ver detalles
                                        </Button>
                                    </div>
                                </div>
                            </Col>
                        ))}
                    </Row>
                </Container>
            </section>

            {/* Values Section */}
            <section style={{ padding: '60px 0' }}>
                <Container>
                    <h2 style={{
                        textAlign: 'center',
                        marginBottom: '50px',
                        color: '#9A1E47',
                        fontSize: '2rem',
                        fontWeight: 'bold'
                    }}>
                        Nuestros Valores
                    </h2>
                    <Row>
                        {[
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
                        ].map((value, index) => (
                            <Col md={4} key={index} style={{ marginBottom: '30px' }}>
                                <div style={{
                                    textAlign: 'center',
                                    padding: '20px'
                                }}>
                                    <div style={{ marginBottom: '20px' }}>{value.icon}</div>
                                    <h3 style={{
                                        color: '#9A1E47',
                                        fontSize: '1.3rem',
                                        marginBottom: '15px'
                                    }}>{value.title}</h3>
                                    <p style={{ color: '#555' }}>{value.text}</p>
                                </div>
                            </Col>
                        ))}
                    </Row>
                </Container>
            </section>
        </div>
    );
};

>>>>>>> 39e792a0febff33491eff80f548ffaf809d93736
export default Home;