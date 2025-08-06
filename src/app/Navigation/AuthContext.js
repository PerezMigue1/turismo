// src/Navigation/AuthContext.js
import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Verificar si hay usuario en localStorage al cargar
        const checkUser = () => {
            try {
                const user = localStorage.getItem('user');
                if (user) {
                    const parsedUser = JSON.parse(user);

                    // Si el usuario no tiene rol, asignar 'user' por defecto
                    if (!parsedUser.rol) {
                        parsedUser.rol = 'user';
                    }

                    // Verificar que el usuario tenga token válido
                    if (parsedUser.token) {
                        setCurrentUser(parsedUser);
                        console.log('🔍 AuthContext - Usuario cargado desde localStorage:', parsedUser);
                    } else {
                        // Si no hay token válido, limpiar localStorage
                        localStorage.removeItem('user');
                        localStorage.removeItem('token');
                        console.log('🔍 AuthContext - Usuario sin token válido, limpiando datos');
                    }
                } else {
                    console.log('🔍 AuthContext - No hay usuario en localStorage');
                }
            } catch (error) {
                console.error('🔍 AuthContext - Error al parsear usuario:', error);
                // Si hay error, limpiar localStorage
                localStorage.removeItem('user');
                localStorage.removeItem('token');
            } finally {
                setIsLoading(false);
            }
        };

        checkUser();
    }, []);

    const login = (userData) => {
        // Asegurar que el usuario tenga un rol y token
        const userWithRole = { 
            ...userData, 
            rol: userData.rol || 'user',
            token: userData.token // Asegurar que el token esté incluido
        };
        setCurrentUser(userWithRole);
        localStorage.setItem('user', JSON.stringify(userWithRole));
        console.log('🔍 AuthContext - Usuario guardado:', userWithRole);
    };

    const logout = () => {
        setCurrentUser(null);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
    };

    return (
        <AuthContext.Provider value={{ currentUser, login, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}