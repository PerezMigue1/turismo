// Ejemplo completo de cómo usar las APIs de productoRevision desde el frontend

// ===== FUNCIONES PARA APROBAR/RECHAZAR PRODUCTOS =====

// Aprobar producto con modal
const aprobarProducto = async (idProducto, datosModal) => {
    try {
        const response = await fetch(`https://backend-iota-seven-19.vercel.app/api/publicaciones/${idProducto}/aprobar`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                revisadoPor: datosModal.revisadoPor || 'admin',
                comentarios: datosModal.comentarios || ''
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error al aprobar producto');
        }

        const data = await response.json();
        console.log('✅ Producto aprobado:', data);
        
        // Mostrar notificación de éxito
        mostrarNotificacion('Producto aprobado exitosamente', 'success');
        
        return data;
    } catch (error) {
        console.error('❌ Error al aprobar producto:', error);
        mostrarNotificacion('Error al aprobar producto', 'error');
        throw error;
    }
};

// Rechazar producto con modal
const rechazarProducto = async (idProducto, datosModal) => {
    try {
        const response = await fetch(`https://backend-iota-seven-19.vercel.app/api/publicaciones/${idProducto}/rechazar`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                revisadoPor: datosModal.revisadoPor || 'admin',
                motivoRechazo: datosModal.motivoRechazo || 'No especificado',
                comentarios: datosModal.comentarios || ''
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error al rechazar producto');
        }

        const data = await response.json();
        console.log('❌ Producto rechazado:', data);
        
        // Mostrar notificación de éxito
        mostrarNotificacion('Producto rechazado exitosamente', 'success');
        
        return data;
    } catch (error) {
        console.error('❌ Error al rechazar producto:', error);
        mostrarNotificacion('Error al rechazar producto', 'error');
        throw error;
    }
};

// ===== FUNCIONES PARA FILTRAR PRODUCTOS =====

// Obtener todos los productos
const obtenerTodosLosProductos = async () => {
    try {
        const response = await fetch('https://backend-iota-seven-19.vercel.app/api/publicaciones/');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('❌ Error al obtener productos:', error);
        throw error;
    }
};

// Obtener productos por estado
const obtenerProductosPorEstado = async (estado) => {
    try {
        const response = await fetch(`https://backend-iota-seven-19.vercel.app/api/publicaciones/estado/${estado}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(`❌ Error al obtener productos ${estado}:`, error);
        throw error;
    }
};

// Obtener estadísticas
const obtenerEstadisticas = async () => {
    try {
        const response = await fetch('https://backend-iota-seven-19.vercel.app/api/publicaciones/estadisticas/totales');
        const data = await response.json();
        return data.estadisticas;
    } catch (error) {
        console.error('❌ Error al obtener estadísticas:', error);
        throw error;
    }
};

// ===== FUNCIONES PARA NOTIFICACIONES =====

// Obtener notificaciones de un usuario
const obtenerNotificacionesUsuario = async (idUsuario) => {
    try {
        const response = await fetch(`https://backend-iota-seven-19.vercel.app/api/notificaciones/usuario/${idUsuario}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('❌ Error al obtener notificaciones:', error);
        throw error;
    }
};

// ===== EJEMPLO DE USO CON MODAL =====

// Función para mostrar modal de aprobación
const mostrarModalAprobacion = (producto) => {
    const modal = `
        <div class="modal" id="modalAprobacion">
            <div class="modal-content">
                <h3>Aprobar Producto: ${producto.Nombre}</h3>
                <form id="formAprobacion">
                    <div class="form-group">
                        <label>Revisado por:</label>
                        <input type="text" id="revisadoPor" value="admin" />
                    </div>
                    <div class="form-group">
                        <label>Comentarios (opcional):</label>
                        <textarea id="comentarios" rows="3"></textarea>
                    </div>
                    <div class="modal-buttons">
                        <button type="button" onclick="cerrarModal()">Cancelar</button>
                        <button type="submit">Aprobar</button>
                    </div>
                </form>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modal);
    
    // Manejar envío del formulario
    document.getElementById('formAprobacion').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const datos = {
            revisadoPor: document.getElementById('revisadoPor').value,
            comentarios: document.getElementById('comentarios').value
        };
        
        try {
            await aprobarProducto(producto.idProducto, datos);
            cerrarModal();
            // Recargar la lista de productos
            cargarProductos();
        } catch (error) {
            console.error('Error:', error);
        }
    });
};

// Función para mostrar modal de rechazo
const mostrarModalRechazo = (producto) => {
    const modal = `
        <div class="modal" id="modalRechazo">
            <div class="modal-content">
                <h3>Rechazar Producto: ${producto.Nombre}</h3>
                <form id="formRechazo">
                    <div class="form-group">
                        <label>Revisado por:</label>
                        <input type="text" id="revisadoPor" value="admin" />
                    </div>
                    <div class="form-group">
                        <label>Motivo de rechazo:</label>
                        <select id="motivoRechazo" required>
                            <option value="">Seleccionar motivo</option>
                            <option value="No cumple con los estándares de calidad">No cumple con los estándares de calidad</option>
                            <option value="Información incompleta">Información incompleta</option>
                            <option value="Precio no competitivo">Precio no competitivo</option>
                            <option value="Imágenes de baja calidad">Imágenes de baja calidad</option>
                            <option value="Otro">Otro</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Comentarios adicionales:</label>
                        <textarea id="comentarios" rows="3"></textarea>
                    </div>
                    <div class="modal-buttons">
                        <button type="button" onclick="cerrarModal()">Cancelar</button>
                        <button type="submit">Rechazar</button>
                    </div>
                </form>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modal);
    
    // Manejar envío del formulario
    document.getElementById('formRechazo').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const datos = {
            revisadoPor: document.getElementById('revisadoPor').value,
            motivoRechazo: document.getElementById('motivoRechazo').value,
            comentarios: document.getElementById('comentarios').value
        };
        
        try {
            await rechazarProducto(producto.idProducto, datos);
            cerrarModal();
            // Recargar la lista de productos
            cargarProductos();
        } catch (error) {
            console.error('Error:', error);
        }
    });
};

// Función para cerrar modal
const cerrarModal = () => {
    const modales = document.querySelectorAll('.modal');
    modales.forEach(modal => modal.remove());
};

// ===== EJEMPLO DE FILTROS =====

// Función para cargar productos con filtros
const cargarProductos = async (filtro = 'todos') => {
    try {
        let productos;
        
        if (filtro === 'todos') {
            productos = await obtenerTodosLosProductos();
        } else {
            const response = await obtenerProductosPorEstado(filtro);
            productos = response.productos;
        }
        
        mostrarProductos(productos);
        actualizarEstadisticas();
    } catch (error) {
        console.error('Error al cargar productos:', error);
    }
};

// Función para mostrar productos en la interfaz
const mostrarProductos = (productos) => {
    const contenedor = document.getElementById('productos-container');
    
    if (productos.length === 0) {
        contenedor.innerHTML = '<p>No hay productos para mostrar</p>';
        return;
    }
    
    const html = productos.map(producto => `
        <div class="producto-card ${producto.estadoRevision}">
            <img src="${producto.Imagen[0]}" alt="${producto.Nombre}" />
            <h4>${producto.Nombre}</h4>
            <p>Precio: $${producto.Precio}</p>
            <p>Estado: ${producto.estadoRevision}</p>
            <p>Artesano: ${producto.idArtesano}</p>
            <p>Fecha: ${new Date(producto.fechaSolicitud).toLocaleDateString()}</p>
            
            ${producto.estadoRevision === 'pendiente' ? `
                <div class="acciones">
                    <button onclick="mostrarModalAprobacion(${JSON.stringify(producto)})" class="btn-aprobar">
                        ✅ Aprobar
                    </button>
                    <button onclick="mostrarModalRechazo(${JSON.stringify(producto)})" class="btn-rechazar">
                        ❌ Rechazar
                    </button>
                </div>
            ` : ''}
        </div>
    `).join('');
    
    contenedor.innerHTML = html;
};

// Función para actualizar estadísticas
const actualizarEstadisticas = async () => {
    try {
        const stats = await obtenerEstadisticas();
        
        document.getElementById('total-productos').textContent = stats.total;
        document.getElementById('pendientes').textContent = stats.pendientes;
        document.getElementById('aprobados').textContent = stats.aprobados;
        document.getElementById('rechazados').textContent = stats.rechazados;
    } catch (error) {
        console.error('Error al actualizar estadísticas:', error);
    }
};

// Función para mostrar notificaciones
const mostrarNotificacion = (mensaje, tipo) => {
    const notificacion = document.createElement('div');
    notificacion.className = `notificacion ${tipo}`;
    notificacion.textContent = mensaje;
    
    document.body.appendChild(notificacion);
    
    setTimeout(() => {
        notificacion.remove();
    }, 3000);
};

// ===== INICIALIZACIÓN =====

// Cargar todo al iniciar la página
document.addEventListener('DOMContentLoaded', () => {
    cargarProductos();
    
    // Configurar filtros
    document.getElementById('filtro-todos').addEventListener('click', () => cargarProductos('todos'));
    document.getElementById('filtro-pendientes').addEventListener('click', () => cargarProductos('pendiente'));
    document.getElementById('filtro-aprobados').addEventListener('click', () => cargarProductos('aprobado'));
    document.getElementById('filtro-rechazados').addEventListener('click', () => cargarProductos('rechazado'));
}); 