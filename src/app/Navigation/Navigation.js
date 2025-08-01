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
                                <>
                                    <Header />
                                    <PublicarHospedaje />
                                    <Footer />
                                </>
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
                                <>
                                    <Header />
                                    <PublicaChef />
                                    <Footer />
                                </>
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
                                <>
                                    <Header />
                                    <PublicarRestaurante />
                                    <Footer />
                                </>
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
                                <>
                                    <Header />
                                    <Notificaciones />
                                    <Footer />
                                </>
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