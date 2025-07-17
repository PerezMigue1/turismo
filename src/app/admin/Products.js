// src/app/admin/Products.jsx
import React, { useState, useEffect } from 'react';
import { Table, Button, Form, InputGroup, Badge } from 'react-bootstrap';
import { FaSearch, FaEdit, FaTrash, FaPlus, FaEye } from 'react-icons/fa';
import axios from 'axios';
import styled from 'styled-components';
import { useAuth } from '../Navigation/AuthContext';

const ProductsContent = styled.div`
  h2 {
    color: #9A1E47; /* Rojo Guinda */
    font-weight: 600;
    margin-bottom: 1.5rem;
  }
`;

const Products = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState('all');

    const { currentUser } = useAuth();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const token = currentUser?.token;
                const response = await axios.get('https://backend-iota-seven-19.vercel.app/api/productos', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setProducts(response.data);
                setLoading(false);
            } catch (error) {
                setError('Error al cargar productos');
                setLoading(false);
            }
        };

        fetchProducts();
    }, [currentUser]);

    const filteredProducts = products.filter(product => {
        const matchesSearch =
            product.Nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.Descripción.toLowerCase().includes(searchTerm.toLowerCase());

        if (filter === 'all') return matchesSearch;
        if (filter === 'published') return matchesSearch && product.estado === 'aprobado';
        if (filter === 'pending') return matchesSearch && product.estado === 'pendiente';
        if (filter === 'rejected') return matchesSearch && product.estado === 'rechazado';
        return matchesSearch;
    });

    if (loading) return <p>Cargando productos...</p>;
    if (error) return <p>{error}</p>;

    return (
        <ProductsContent>
            <h2 className="mb-4">Gestión de Productos</h2>

            <div className="d-flex justify-content-between mb-4">
                <div className="d-flex">
                    <Button
                        variant={filter === 'all' ? 'primary' : 'outline-secondary'}
                        className="me-2"
                        onClick={() => setFilter('all')}
                    >
                        Todos
                    </Button>
                    <Button
                        variant={filter === 'published' ? 'primary' : 'outline-secondary'}
                        className="me-2"
                        onClick={() => setFilter('published')}
                    >
                        Publicados
                    </Button>
                    <Button
                        variant={filter === 'pending' ? 'primary' : 'outline-secondary'}
                        className="me-2"
                        onClick={() => setFilter('pending')}
                    >
                        Pendientes
                    </Button>
                    <Button
                        variant={filter === 'rejected' ? 'primary' : 'outline-secondary'}
                        onClick={() => setFilter('rejected')}
                    >
                        Rechazados
                    </Button>
                </div>
                <Button variant="primary">
                    <FaPlus className="me-2" /> Nuevo Producto
                </Button>
            </div>

            <div className="mb-4">
                <InputGroup className="w-50">
                    <Form.Control
                        type="search"
                        placeholder="Buscar productos..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Button variant="outline-secondary">
                        <FaSearch />
                    </Button>
                </InputGroup>
            </div>

            <Table striped bordered hover responsive>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Producto</th>
                        <th>Descripción</th>
                        <th>Precio</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredProducts.map((product) => (
                        <tr key={product.idProducto}>
                            <td>{product.idProducto}</td>
                            <td>{product.Nombre}</td>
                            <td>{product.Descripción.substring(0, 50)}...</td>
                            <td>${product.Precio}</td>
                            <td>
                                <Badge
                                    bg={
                                        product.estado === 'aprobado' ? 'success' :
                                            product.estado === 'pendiente' ? 'warning' :
                                                'danger'
                                    }
                                >
                                    {product.estado}
                                </Badge>
                            </td>
                            <td>
                                <Button variant="outline-primary" size="sm" className="me-2">
                                    <FaEye />
                                </Button>
                                <Button variant="outline-success" size="sm" className="me-2">
                                    <FaEdit />
                                </Button>
                                <Button variant="outline-danger" size="sm">
                                    <FaTrash />
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            <div className="d-flex justify-content-between align-items-center mt-4">
                <div>Mostrando {filteredProducts.length} de {products.length} productos</div>
                <div>
                    <Button variant="outline-secondary" size="sm" className="me-2">
                        Anterior
                    </Button>
                    <Button variant="outline-secondary" size="sm">
                        Siguiente
                    </Button>
                </div>
            </div>
        </ProductsContent>
    );
};

export default Products;