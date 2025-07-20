// src/Navigation.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from '../components/Header';
import Home from '../components/Home';
import Artesanias from '../screens/Artesanias';
import DetalleArtesania from '../screens/DetalleArtesania';
import Carrito from '../screens/Carrito';
import Checkout from '../screens/Checkout';
import ConfirmacionCompra from '../screens/ConfirmacionCompra';
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
import Hoteles from '../screens/Hoteles'
import DetallesHoteles from '../screens/HotelesDetalle'
import Notificaciones from '../screens/Notificaciones'


import AdminLayout from '../admin/AdminLayout';


// Componente para proteger rutas
const ProtectedRoute = ({ children, requiredRole = 'user' }) => {
    const { currentUser } = useAuth();

    if (!currentUser) {
        return <Navigate to="/login" />;
    }

    // Si se requiere un rol específico y el usuario no lo tiene
    if (requiredRole !== 'user' && currentUser.rol !== requiredRole) {
        return <Navigate to="/home" />;
    }

    return children;
};


const Navigation = () => {
    return (
        <AuthProvider>
            <CartProvider>
                <Router>
                    <div style={{ backgroundColor: '#FDF2E0', minHeight: '100vh' }}>
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
                            <Route path="/carrito" element={
                                <>
                                    <Header />
                                    <Carrito />
                                    <Footer />
                                </>
                            } />
                            <Route path="/checkout" element={
                                <>
                                    <Header />
                                    <Checkout />
                                    <Footer />
                                </>
                            } />
                            <Route path="/confirmacion" element={
                                <>
                                    <Header />
                                    <ConfirmacionCompra />
                                    <Footer />
                                </>
                            } />

                            <Route path="/perfil" element={
                                <>
                                    <Header />
                                    <Perfil />
                                    <Footer />
                                </>
                            } />

                            <Route path="/cambiar-contrasena" element={
                                <>
                                    <Header />
                                    <CambiarContrasena />
                                    <Footer />
                                </>
                            } />

                            <Route path="/RegistroArtesano" element={
                                <>
                                    <Header />
                                    <RegistroArtesano />
                                    <Footer />
                                </>
                            } />

                            <Route path="/PublicarProducto" element={
                                <>
                                    <Header />
                                    <PublicarProducto />
                                    <Footer />
                                </>
                            } />

                            <Route path="/Hoteles" element={
                                <>
                                    <Header />
                                    <Hoteles />
                                    <Footer />
                                </>
                            } />

                            <Route path="/DetallesHoteles" element={
                                <>
                                    <Header />
                                    <DetallesHoteles />
                                    <Footer />
                                </>
                            } />

                            <Route path="/Notificaciones" element={
                                <>
                                    <Header />
                                    <Notificaciones />
                                    <Footer />
                                </>
                            } />


                            {/* Rutas de autenticación SIN Header y Footer */}
                            <Route path="/login" element={<Login />} />
                            <Route path="/registro" element={<Registro />} />
                            <Route path="/recuperarContra" element={<RecuperarPassword />} />

                            {/* Rutas de administración */}
                            <Route path="/admin/*" element={
                                    <AdminLayout />
                            } />
                        </Routes>
                    </div>
                </Router>
            </CartProvider>
        </AuthProvider >
    );
};

export default Navigation;