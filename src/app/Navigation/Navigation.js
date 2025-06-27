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
import CambiarContrasena from '../screens/CambiarContrasena'

const Navigation = () => {
    return (
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

                        <Route path="/perfil/:id" element={
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

                        {/* Rutas de autenticación SIN Header y Footer */}
                        <Route path="/login" element={<Login />} />
                        <Route path="/registro" element={<Registro />} />
                        <Route path="/recuperarContra" element={<RecuperarPassword />} />
                    </Routes>
                </div>
            </Router>
        </CartProvider>
    );
};

export default Navigation;