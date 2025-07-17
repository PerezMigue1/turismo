// src/Navigation/AuthContext.js
import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        // Verificar si hay usuario en localStorage al cargar
        const user = localStorage.getItem('user');
        if (user) {
            const parsedUser = JSON.parse(user);

            // Si el usuario no tiene rol, asignar 'user' por defecto
            if (!parsedUser.rol) {
                parsedUser.rol = 'user';
            }

            setCurrentUser(parsedUser);
        }
    }, []);

    const login = (userData) => {
        // Asegurar que el usuario tenga un rol
        const userWithRole = { ...userData, rol: userData.rol || 'user' };
        setCurrentUser(userWithRole);
        localStorage.setItem('user', JSON.stringify(userWithRole));
    };

    const logout = () => {
        setCurrentUser(null);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
    };

    return (
        <AuthContext.Provider value={{ currentUser, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}