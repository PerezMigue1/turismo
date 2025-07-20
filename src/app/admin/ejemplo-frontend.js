// Ejemplo de cómo hacer las peticiones desde tu frontend

// Para APROBAR un producto:
const aprobarProducto = async (idProducto) => {
    try {
        const response = await fetch(`https://backend-iota-seven-19.vercel.app/api/publicaciones/${idProducto}/aprobar`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                revisadoPor: 'admin' // Opcional, si no lo envías usará 'admin' por defecto
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error al aprobar producto');
        }

        const data = await response.json();
        console.log('✅ Producto aprobado:', data);
        return data;
    } catch (error) {
        console.error('❌ Error al aprobar producto:', error);
        throw error;
    }
};

// Para RECHAZAR un producto:
const rechazarProducto = async (idProducto, motivoRechazo = 'No especificado') => {
    try {
        const response = await fetch(`https://backend-iota-seven-19.vercel.app/api/publicaciones/${idProducto}/rechazar`, {
            method: 'PUT', // Cambiado de DELETE a PUT
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                revisadoPor: 'admin', // Opcional
                motivoRechazo: motivoRechazo // Opcional, si no lo envías usará 'No especificado'
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error al rechazar producto');
        }

        const data = await response.json();
        console.log('❌ Producto rechazado:', data);
        return data;
    } catch (error) {
        console.error('❌ Error al rechazar producto:', error);
        throw error;
    }
};

// Si usas Axios:
const aprobarProductoAxios = async (idProducto) => {
    try {
        const response = await axios.put(`https://backend-iota-seven-19.vercel.app/api/publicaciones/${idProducto}/aprobar`, {
            revisadoPor: 'admin' // Opcional
        });
        console.log('✅ Producto aprobado:', response.data);
        return response.data;
    } catch (error) {
        console.error('❌ Error al aprobar producto:', error.response?.data || error.message);
        throw error;
    }
};

const rechazarProductoAxios = async (idProducto, motivoRechazo = 'No especificado') => {
    try {
        const response = await axios.put(`https://backend-iota-seven-19.vercel.app/api/publicaciones/${idProducto}/rechazar`, {
            revisadoPor: 'admin', // Opcional
            motivoRechazo: motivoRechazo // Opcional
        });
        console.log('❌ Producto rechazado:', response.data);
        return response.data;
    } catch (error) {
        console.error('❌ Error al rechazar producto:', error.response?.data || error.message);
        throw error;
    }
};

// Ejemplo de uso:
// aprobarProducto('P000001');
// rechazarProducto('P000001', 'No cumple con los estándares de calidad'); 


