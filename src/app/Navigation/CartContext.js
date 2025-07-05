// src/Navigation/CartContext.js
import { createContext, useState, useEffect  } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    // Cargar el carrito desde localStorage al inicio
    const [carrito, setCarrito] = useState(() => {
        const savedCart = localStorage.getItem('cart');
        return savedCart ? JSON.parse(savedCart) : [];
    });

    // Guardar en localStorage cada vez que cambie el carrito
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(carrito));
    }, [carrito]);

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

    
    const vaciarCarrito = () => {
        setCarrito([]);
    };

    return (
        <CartContext.Provider
            value={{
                carrito,
                agregarAlCarrito,
                actualizarCantidad,
                eliminarDelCarrito,
                vaciarCarrito // ← agrega aquí la función al contexto
            }}
        >
            {children}
        </CartContext.Provider>
    );
};