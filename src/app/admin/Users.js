// src/app/admin/Users.jsx
import React, { useState, useEffect } from 'react';
import { Table, Button, Form, InputGroup } from 'react-bootstrap';
import { FaSearch, FaEdit, FaTrash, FaPlus, FaUser } from 'react-icons/fa';
import axios from 'axios';
import styled from 'styled-components';
import { useAuth } from '../Navigation/AuthContext';

const UsersContent = styled.div`
  h2 {
    color: #9A1E47; /* Rojo Guinda */
    font-weight: 600;
    margin-bottom: 1.5rem;
  }
`;

const UserAvatar = styled.div`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: #50C2C4; /* Aqua Claro */
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
`;

const Users = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    const { currentUser } = useAuth();

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const token = currentUser?.token;
                const response = await axios.get('https://backend-iota-seven-19.vercel.app/api/usuarios', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setUsers(response.data);
                setLoading(false);
            } catch (error) {
                setError('Error al cargar usuarios');
                setLoading(false);
            }
        };

        fetchUsers();
    }, [currentUser]);

    const filteredUsers = users.filter(user =>
        user.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <p>Cargando usuarios...</p>;
    if (error) return <p>{error}</p>;

    return (
        <UsersContent>
            <h2 className="mb-4">Gestión de Usuarios</h2>

            <div className="d-flex justify-content-between mb-4">
                <div className="w-50">
                    <InputGroup>
                        <Form.Control
                            type="search"
                            placeholder="Buscar usuarios..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <Button variant="outline-secondary">
                            <FaSearch />
                        </Button>
                    </InputGroup>
                </div>
                <Button variant="primary">
                    <FaPlus className="me-2" /> Nuevo Usuario
                </Button>
            </div>

            <Table striped bordered hover responsive>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Email</th>
                        <th>Rol</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredUsers.map((user) => (
                        <tr key={user._id}>
                            <td>{user._id}</td>
                            <td>
                                <div className="d-flex align-items-center">
                                    <UserAvatar className="me-2">
                                        <FaUser />
                                    </UserAvatar>
                                    {user.nombre}
                                </div>
                            </td>
                            <td>{user.email}</td>
                            <td>{user.rol}</td>
                            <td>
                                <span className={`badge ${user.estado === 'activo' ? 'bg-success' : 'bg-secondary'}`}>
                                    {user.estado}
                                </span>
                            </td>
                            <td>
                                <Button variant="outline-primary" size="sm" className="me-2">
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

            {/* ... paginación ... */}
        </UsersContent>
    );
};

export default Users;