<<<<<<< HEAD
// src/Navigation.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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

const Navigation = () => {
    return (
        <CartProvider> {/* Envuelve todo con CartProvider */}
            <Router>
                <div style={{ backgroundColor: '#FDF2E0', minHeight: '100vh' }}>
                    <Header />
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/artesanias" element={<Artesanias />} />
                        <Route path="/artesanias/:id" element={<DetalleArtesania />} />
                        <Route path="/carrito" element={<Carrito />} />
                        <Route path="/checkout" element={<Checkout />} />
                        <Route path="/confirmacion" element={<ConfirmacionCompra />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/registro" element={<Registro />} />
                        <Route path="/recuperarContra" element={<RecuperarPassword />} />
                    </Routes>
                    <Footer />
                </div>
            </Router>
        </CartProvider>
    );
};

=======
// src/Navigation.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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

const Navigation = () => {
    return (
        <CartProvider> {/* Envuelve todo con CartProvider */}
            <Router>
                <div style={{ backgroundColor: '#FDF2E0', minHeight: '100vh' }}>
                    <Header />
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/artesanias" element={<Artesanias />} />
                        <Route path="/artesanias/:id" element={<DetalleArtesania />} />
                        <Route path="/carrito" element={<Carrito />} />
                        <Route path="/checkout" element={<Checkout />} />
                        <Route path="/confirmacion" element={<ConfirmacionCompra />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/registro" element={<Registro />} />
                        <Route path="/recuperarContra" element={<RecuperarPassword />} />
                    </Routes>
                    <Footer />
                </div>
            </Router>
        </CartProvider>
    );
};

>>>>>>> 39e792a0febff33491eff80f548ffaf809d93736
export default Navigation;