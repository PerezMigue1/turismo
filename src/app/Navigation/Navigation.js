// src/Navigation.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from '../components/Header';
import Home from '../components/Home';
import Artesanias from '../screens/Artesanias';
import DetalleArtesania from '../screens/DetalleArtesania';
import Footer from '../components/Footer';
import { CartProvider } from './CartContext';
import Login from '../screens/Login';
import Registro from '../screens/Registro';
import RecuperarPassword from '../screens/RecuperarPassword';
import Perfil from '../screens/Perfil';
import CambiarContrasena from '../screens/CambiarContrasena';
import RegistroArtesano from '../screens/RegistroArtesano';
import PublicarProducto from '../screens/PublicarProducto';
import { AuthProvider, useAuth } from '../Navigation/AuthContext';
import Hospedaje from '../screens/Hospedajes'
import DetalleHospedaje from '../screens/DetalleHospedaje'
import Notificaciones from '../screens/Notificaciones'
import RegistroHospedaje from '../screens/RegistroHospedero';
import PublicarHospedaje from '../screens/PublicarHospedaje';

import Gastronomia from '../screens/Gastronomia'
import GastronomiaDetalle from '../screens/GastronomiaDetalle'
import RegistroChef from '../screens/RegistroChef';
import PublicaChef from '../screens/PublicarGastronomia';
import RegistroRestaurante from '../screens/RegistroRestaurante';
import PublicarRestaurante from '../screens/PublicarRestaurante';
import Restaurante from '../screens/Restaurantes';
import RestauranteDetalle from '../screens/DetalleRestaurante'


import AdminLayout from '../admin/AdminLayout';
import Festividades from '../screens/Festividades';
import Negocios from '../screens/Negocios';
import DetalleNegocio from '../screens/DetalleNegocio';
import Lugares from '../screens/Lugares';
import DetalleLugar from '../screens/DetalleLugar';
import MisionVision from '../screens/MisionVision';
import Politicas from '../screens/Politicas';
import FAQ from '../screens/FAQ';
import Ecoturismo from '../screens/Ecoturismo';
import DetalleEcoturismo from '../screens/DetalleEcoturismo';
import Encuestas from '../screens/Encuestas';
import ResponderEncuesta from '../screens/ResponderEncuesta';

import Mapa from '../Mapa/Mapa'

// Error Boundary para capturar errores y evitar pantallas en blanco
class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error('🔍 ErrorBoundary - Error capturado:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={{ 
                    display: 'flex', 
                    flexDirection: 'column',
                    justifyContent: 'center', 
                    alignItems: 'center', 
                    height: '100vh',
                    backgroundColor: '#FDF2E0',
                    padding: '20px',
                    textAlign: 'center'
                }}>
                    <h2 style={{ color: '#9A1E47', marginBottom: '20px' }}>
                        ¡Oops! Algo salió mal
                    </h2>
                    <p style={{ color: '#6B4F3F', marginBottom: '30px' }}>
                        Parece que hubo un problema. Te redirigiremos al inicio.
                    </p>
                    <button 
                        className="btn btn-primary"
                        onClick={() => window.location.href = '/home'}
                        style={{ backgroundColor: '#9A1E47', borderColor: '#9A1E47' }}
                    >
                        Ir al Inicio
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

// Componente para rutas que requieren redirección si no hay usuario
const RouteWithFallback = ({ children, fallbackPath = "/home" }) => {
    const { currentUser, isLoading } = useAuth();

    // Mostrar loading mientras se verifica la autenticación
    if (isLoading) {
        return (
            <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                height: '100vh',
                backgroundColor: '#FDF2E0'
            }}>
                <div className="text-center">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Cargando...</span>
                    </div>
                    <p className="mt-3" style={{ color: '#9A1E47' }}>Cargando...</p>
                </div>
            </div>
        );
    }

    // Si no hay usuario, redirigir al home o login
    if (!currentUser) {
        console.log('🔍 RouteWithFallback - No hay usuario, redirigiendo a:', fallbackPath);
        return <Navigate to={fallbackPath} />;
    }

    return children;
};

// Componente para proteger rutas
const ProtectedRoute = ({ children, requiredRole = 'user' }) => {
    const { currentUser, isLoading } = useAuth();

    console.log('🔍 ProtectedRoute - Usuario actual:', currentUser);
    console.log('🔍 ProtectedRoute - Rol requerido:', requiredRole);
    console.log('🔍 ProtectedRoute - Rol del usuario:', currentUser?.rol);
    console.log('🔍 ProtectedRoute - Cargando:', isLoading);

    // Mostrar loading mientras se verifica la autenticación
    if (isLoading) {
        return (
            <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                height: '100vh',
                backgroundColor: '#FDF2E0'
            }}>
                <div className="text-center">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Cargando...</span>
                    </div>
                    <p className="mt-3" style={{ color: '#9A1E47' }}>Verificando sesión...</p>
                </div>
            </div>
        );
    }

    if (!currentUser) {
        console.log('🔍 ProtectedRoute - No hay usuario, redirigiendo a login');
        return <Navigate to="/login" />;
    }

    // Si se requiere un rol específico y el usuario no lo tiene
    // Manejar tanto roles como string como roles como array
    const userRoles = Array.isArray(currentUser.rol) ? currentUser.rol : [currentUser.rol];
    const hasRequiredRole = userRoles.includes(requiredRole);
    
    if (requiredRole !== 'user' && !hasRequiredRole) {
        console.log('🔍 ProtectedRoute - Rol no coincide, redirigiendo a home');
        console.log('🔍 ProtectedRoute - Rol requerido:', requiredRole);
        console.log('🔍 ProtectedRoute - Roles del usuario:', userRoles);
        return <Navigate to="/home" />;
    }

    console.log('🔍 ProtectedRoute - Acceso permitido');
    return children;
};


const Navigation = () => {
    return (
        <ErrorBoundary>
            <AuthProvider>
                <CartProvider>
                    <Router>
                    <div style={{ backgroundColor: '#FDF2E0', minHeight: '100vh', paddingTop: '125px' }}>
                        <Routes>
                            {/* Ruta principal redirige a Home */}
                            <Route path="/" element={<Navigate to="/home" replace />} />

                            {/* Rutas públicas con Header y Footer */}
                            <Route path="/home" element={
                                <>
                                    <Header />
                                    <Home />
                                    <Footer />
                                </>
                            } />

                            <Route path="/mapa" element={
                                <>
                                    <Header />
                                    <Mapa />
                                    <Footer />
                                </>
                            } />


                            <Route path="/artesanias" element={
                                <>
                                    <Header />
                                    <Artesanias />
                                    <Footer />
                                </>
                            } />
                            <Route path="/artesanias/:id" element={
                                <>
                                    <Header />
                                    <DetalleArtesania />
                                    <Footer />
                                </>
                            } />

                            <Route path="/perfil" element={
                                <RouteWithFallback fallbackPath="/login">
                                    <Header />
                                    <Perfil />
                                    <Footer />
                                </RouteWithFallback>
                            } />

                            <Route path="/cambiar-contrasena" element={
                                <RouteWithFallback fallbackPath="/login">
                                    <Header />
                                    <CambiarContrasena />
                                    <Footer />
                                </RouteWithFallback>
                            } />

                            <Route path="/RegistroArtesano" element={
                                <>
                                    <Header />
                                    <RegistroArtesano />
                                    <Footer />
                                </>
                            } />

                            <Route path="/PublicarProducto" element={
                                <RouteWithFallback fallbackPath="/login">
                                    <Header />
                                    <PublicarProducto />
                                    <Footer />
                                </RouteWithFallback>
                            } />

                            <Route path="/hospedajes" element={
                                <>
                                    <Header />
                                    <Hospedaje />
                                    <Footer />
                                </>
                            } />

                            <Route path="/hospedajes/:id" element={
                                <>
                                    <Header />
                                    <DetalleHospedaje />
                                    <Footer />
                                </>
                            } />

                            <Route path="/RegistroHospedaje" element={
                                <>
                                    <Header />
                                    <RegistroHospedaje />
                                    <Footer />
                                </>
                            } />

                            <Route path="/PublicarHospedaje" element={
                                <RouteWithFallback fallbackPath="/login">
                                    <Header />
                                    <PublicarHospedaje />
                                    <Footer />
                                </RouteWithFallback>
                            } />



                            <Route path="/gastronomia" element={
                                <>
                                    <Header />
                                    <Gastronomia />
                                    <Footer />
                                </>
                            } />

                            <Route path="/gastronomia/:id" element={
                                <>
                                    <Header />
                                    <GastronomiaDetalle />
                                    <Footer />
                                </>
                            } />

                            <Route path="/RegistroChef" element={
                                <>
                                    <Header />
                                    <RegistroChef />
                                    <Footer />
                                </>
                            } />

                            <Route path="/PublicaChef" element={
                                <RouteWithFallback fallbackPath="/login">
                                    <Header />
                                    <PublicaChef />
                                    <Footer />
                                </RouteWithFallback>
                            } />


                            <Route path="/restaurantes" element={
                                <>
                                    <Header />
                                    <Restaurante />
                                    <Footer />
                                </>
                            } />

                            <Route path="/restaurantes/:id" element={
                                <>
                                    <Header />
                                    <RestauranteDetalle />
                                    <Footer />
                                </>
                            } />

                            <Route path="/RegistroRestaurante" element={
                                <>
                                    <Header />
                                    <RegistroRestaurante />
                                    <Footer />
                                </>
                            } />

                            <Route path="/PublicarRestaurante" element={
                                <RouteWithFallback fallbackPath="/login">
                                    <Header />
                                    <PublicarRestaurante />
                                    <Footer />
                                </RouteWithFallback>
                            } />



                            <Route path="/negocios" element={
                                <>
                                    <Header />
                                    <Negocios />
                                    <Footer />
                                </>
                            } />

                            <Route path="/negocios/:id" element={
                                <>
                                    <Header />
                                    <DetalleNegocio />
                                    <Footer />
                                </>
                            } />


                            <Route path="/lugares" element={
                                <>
                                    <Header />
                                    <Lugares />
                                    <Footer />
                                </>
                            } />

                            <Route path="/lugares/:id" element={
                                <>
                                    <Header />
                                    <DetalleLugar />
                                    <Footer />
                                </>
                            } />


                            <Route path="/Notificaciones" element={
                                <RouteWithFallback fallbackPath="/login">
                                    <Header />
                                    <Notificaciones />
                                    <Footer />
                                </RouteWithFallback>
                            } />

                            <Route path="/festividades" element={
                                <>
                                    <Header />
                                    <Festividades />
                                    <Footer />
                                </>
                            } />

                            <Route path="/ecoturismo" element={
                                <>
                                    <Header />
                                    <Ecoturismo />
                                    <Footer />
                                </>
                            } />

                            <Route path="/ecoturismo/:id" element={
                                <>
                                    <Header />
                                    <DetalleEcoturismo />
                                    <Footer />
                                </>
                            } />

                            <Route path="/encuestas" element={
                                <>
                                    <Header />
                                    <Encuestas />
                                    <Footer />
                                </>
                            } />

                            <Route path="/encuestas/:id" element={
                                <>
                                    <Header />
                                    <ResponderEncuesta />
                                    <Footer />
                                </>
                            } />



                            <Route path="/mision-vision" element={
                                <>
                                    <Header />
                                    <MisionVision />
                                    <Footer />
                                </>
                            } />

                            <Route path="/mision-vision" element={
                                <>
                                    <Header />
                                    <MisionVision />
                                    <Footer />
                                </>
                            } />


                            <Route path="/mision-vision" element={
                                <>
                                    <Header />
                                    <MisionVision />
                                    <Footer />
                                </>
                            } />

                            <Route path="/politicas" element={
                                <>
                                    <Header />
                                    <Politicas />
                                    <Footer />
                                </>
                            } />
                            
                            <Route path="/faq" element={
                                <>
                                    <Header />
                                    <FAQ />
                                    <Footer />
                                </>
                            } />

                            {/* Rutas de autenticación SIN Header y Footer */}
                            <Route path="/login" element={<Login />} />
                            <Route path="/registro" element={<Registro />} />
                            <Route path="/recuperarContra" element={<RecuperarPassword />} />

                            {/* Rutas de administración */}
                            <Route path="/admin/*" element={
                                <ProtectedRoute requiredRole="admin">
                                    <AdminLayout />
                                </ProtectedRoute>
                            } />
                        </Routes>
                    </div>
                </Router>
            </CartProvider>
        </AuthProvider>
        </ErrorBoundary>
    );
};

export default Navigation;