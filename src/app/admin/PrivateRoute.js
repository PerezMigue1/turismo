// src/components/PrivateRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const PrivateRoute = ({ children, roles }) => {
    const token = localStorage.getItem('token');
    
    if (!token) {
        return <Navigate to="/login" />;
    }

    try {
        const decoded = jwtDecode(token);
        if (!roles.includes(decoded.rol)) {
            return <Navigate to="/home" />;
        }
        return children;
    } catch (error) {
        return <Navigate to="/login" />;
    }
};

export default PrivateRoute;