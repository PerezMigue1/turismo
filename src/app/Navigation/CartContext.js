// src/Navigation/CartContext.js
import { createContext, useState } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [carrito, setCarrito] = useState([]);

    const agregarAlCarrito = (producto) => {
        setCarrito((prevCarrito) => {
            const existe = prevCarrito.find((item) => item.id === producto.id);
            if (existe) {
                return prevCarrito.map((item) =>
                    item.id === producto.id
                        ? { ...item, cantidad: item.cantidad + (producto.cantidad || 1) }
                        : item
                );
            }
            return [...prevCarrito, { ...producto, cantidad: producto.cantidad || 1 }];
        });
    };

    const actualizarCantidad = (id, nuevaCantidad) => {
        setCarrito((prevCarrito) =>
            prevCarrito.map((item) =>
                item.id === id ? { ...item, cantidad: Math.max(1, nuevaCantidad) } : item
            )
        );
    };

    const eliminarDelCarrito = (id) => {
        setCarrito((prevCarrito) => prevCarrito.filter((item) => item.id !== id));
    };

    return (
        <CartContext.Provider
            value={{ carrito, agregarAlCarrito, actualizarCantidad, eliminarDelCarrito }}
        >
            {children}
        </CartContext.Provider>
    );
};