import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import {
    FaFacebook, FaInstagram, FaTwitter, FaYoutube,
    FaMapMarkerAlt, FaPhone, FaEnvelope, FaInfoCircle
} from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer style={{
            backgroundColor: '#1E8546',
            color: 'white',
            padding: '50px 0 20px',
            marginTop: 'auto'
        }}>
            <Container>
                <Row>
                    <Col md={4} style={{ marginBottom: '30px' }}>
                        <h5 style={{
                            color: '#F28B27',
                            marginBottom: '20px',
                            fontWeight: 'bold',
                            fontSize: '1.2rem'
                        }}>
                            Aventura Huasteca
                        </h5>
                        <p style={{ marginBottom: '20px' }}>
                            Plataforma digital que conecta turistas con experiencias auténticas
                            y sostenibles en la Huasteca Hidalguense.
                        </p>
                        <div style={{ display: 'flex', gap: '15px' }}>
                            <a href="#facebook" style={{ color: 'white', fontSize: '1.5rem' }}>
                                <FaFacebook />
                            </a>
                            <a href="#instagram" style={{ color: 'white', fontSize: '1.5rem' }}>
                                <FaInstagram />
                            </a>
                            <a href="#twitter" style={{ color: 'white', fontSize: '1.5rem' }}>
                                <FaTwitter />
                            </a>
                            <a href="#youtube" style={{ color: 'white', fontSize: '1.5rem' }}>
                                <FaYoutube />
                            </a>
                        </div>
                    </Col>

                    <Col md={4} style={{ marginBottom: '30px' }}>
                        <h5 style={{
                            color: '#F28B27',
                            marginBottom: '20px',
                            fontWeight: 'bold',
                            fontSize: '1.2rem'
                        }}>
                            Enlaces rápidos
                        </h5>
                        <ul style={{ listStyle: 'none', padding: 0 }}>
                            {[
                                { path: '/ecoturismo', label: 'Ecoturismo' },
                                { path: '/cultura', label: 'Turismo cultural' },
                                { path: '/encuestas', label: 'Encuestas' },
                                { path: '/mision-vision', label: 'Misión y Visión' },
                                { path: '/politicas', label: 'Políticas' },
                                { path: '/faq', label: 'FAQ' },
                                { path: '/nosotros', label: 'Sobre nosotros' }
                            ].map((link, index) => (
                                <li key={index} style={{ marginBottom: '10px' }}>
                                    <Link
                                        to={link.path}
                                        style={{
                                            color: 'white',
                                            textDecoration: 'none',
                                            transition: 'color 0.3s',
                                            ':hover': {
                                                color: '#F28B27'
                                            }
                                        }}
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </Col>

                    <Col md={4} style={{ marginBottom: '30px' }}>
                        <h5 style={{
                            color: '#F28B27',
                            marginBottom: '20px',
                            fontWeight: 'bold',
                            fontSize: '1.2rem'
                        }}>
                            Contacto
                        </h5>
                        <ul style={{ listStyle: 'none', padding: 0 }}>
                            <li style={{
                                marginBottom: '15px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px'
                            }}>
                                <FaMapMarkerAlt />
                                Huasteca Hidalguense, México
                            </li>
                            <li style={{
                                marginBottom: '15px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px'
                            }}>
                                <FaPhone />
                                +52 123 456 7890
                            </li>
                            <li style={{
                                marginBottom: '15px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px'
                            }}>
                                <FaEnvelope />
                                contacto@aventurahuasteca.com
                            </li>
                            <li style={{
                                marginBottom: '15px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px'
                            }}>
                                <FaInfoCircle />
                                Horario: Lunes a Viernes 9:00 - 18:00
                            </li>
                        </ul>
                    </Col>
                </Row>

                <Row>
                    <Col style={{
                        textAlign: 'center',
                        marginTop: '30px',
                        paddingTop: '20px',
                        borderTop: '1px solid rgba(255, 255, 255, 0.2)'
                    }}>
                        <p style={{ marginBottom: '10px' }}>
                            &copy; {new Date().getFullYear()} Aventura Huasteca. Todos los derechos reservados.
                        </p>
                        <p style={{ fontSize: '0.9rem' }}>
                            Plataforma creada para promover el turismo responsable y apoyar a las comunidades locales.
                        </p>
                    </Col>
                </Row>
            </Container>
        </footer>
    );
};

export default Footer;