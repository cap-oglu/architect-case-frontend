import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button, TextField, Box, Typography, Container } from '@mui/material';

function HomePage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin =  async (event) => {
    event.preventDefault();
        try {
            const { data } = await axios.post('http://localhost:5229/api/Users/login', { email, password });
            localStorage.setItem('token', data.token); // Save the token
            navigate('/dashboard'); // Redirect to dashboard
        } catch (error) {
            console.error('Login failed:', error);
        }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <Box component="form" onSubmit={handleLogin} sx={{ mt: 1 }}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            label="Email Address"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            label="Password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign In
          </Button>
          <Button
            fullWidth
            variant="text"
            onClick={() => navigate('/register')}
          >
            Don't have an account? Register
          </Button>
        </Box>
      </Box>
    </Container>
  );
}

export default HomePage;
