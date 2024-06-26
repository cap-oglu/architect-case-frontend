import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Typography, TextField, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // Use named export

function ProfilePage() {
    const [user, setUser] = useState({
        firstName: '',
        lastName: '',
        email: ''
    });
    const navigate = useNavigate();

    const getUserIdFromToken = () => {
        const token = localStorage.getItem('token');
        if (!token) return null;

        const decodedToken = jwtDecode(token);
        return decodedToken.id; // Adjust this based on your JWT structure
    };
    useEffect(() => {
        const fetchUser = async () => {
            const userId = getUserIdFromToken();
            if (!userId) {
                console.error('User ID not found in token');
                return;
            }

            try {
                const { data } = await axios.get(`http://localhost:5229/api/users/${userId}`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
                setUser(data);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUser();
    }, []);


    const handleUpdate = async () => {
        try {
            await axios.put(`http://localhost:5229/api/users/${user.id}`, user, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            alert('User updated successfully!');
        } catch (error) {
            console.error('Failed to update user:', error);
        }
    };

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete your account? This cannot be undone.')) {
            try {
                await axios.delete(`http://localhost:5229/api/Users/${user.id}`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
                localStorage.removeItem('token');
                navigate('/');
            } catch (error) {
                console.error('Failed to delete account:', error);
            }
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    return (
        <Container>
            <Typography variant="h4">Profile</Typography>
            <Box component="form" noValidate sx={{ mt: 1 }}>
                <TextField
                    margin="normal"
                    fullWidth
                    label="First Name"
                    name="firstName"
                    value={user.firstName}
                    onChange={e => setUser({ ...user, firstName: e.target.value })}
                />
                <TextField
                    margin="normal"
                    fullWidth
                    label="Last Name"
                    name="lastName"
                    value={user.lastName}
                    onChange={e => setUser({ ...user, lastName: e.target.value })}
                />
                <TextField
                    margin="normal"
                    fullWidth
                    label="Email"
                    name="email"
                    value={user.email}
                    onChange={e => setUser({ ...user, email: e.target.value })}
                />
                <Button
                    type="button"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                    onClick={handleUpdate}
                >
                    Update Profile
                </Button>
                <Button
                    type="button"
                    fullWidth
                    variant="contained"
                    color="error"
                    sx={{ mt: 1 }}
                    onClick={handleDelete}
                >
                    Delete Account
                </Button>
                <Button
                    type="button"
                    fullWidth
                    variant="outlined"
                    sx={{ mt: 1 }}
                    onClick={handleLogout}
                >
                    Log Out
                </Button>
            </Box>
        </Container>
    );
}

export default ProfilePage;
