import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Typography, Button, TextField, Container, Box } from '@mui/material';

function BankAccountDetailsPage() {
  const [account, setAccount] = useState(null);
  const { accountId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAccountDetails = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:5229/api/BankAccounts/${accountId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setAccount(response.data);
        
        
        
      } catch (error) {
        console.error('Error fetching account details:', error);
      }
    };
    fetchAccountDetails();
  }, [accountId]);

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5229/api/BankAccounts/${accountId}`, account, {
        headers: { Authorization: `Bearer ${token}` }
      });
      navigate('/dashboard');
    } catch (error) {
      console.error('Failed to update account:', error);
    }
  };

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5229/api/BankAccounts/${accountId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      navigate('/dashboard');
    } catch (error) {
      console.error('Failed to delete account:', error);
    }
  };

  if (!account) return <Typography>Loading...</Typography>;

  return (
    <Container>
      <Typography variant="h4">Bank Account Details</Typography>
      <TextField
        label="Account Number"
        value={account.accountNumber}
        onChange={(e) => setAccount({ ...account, accountNumber: e.target.value })}
        margin="normal"
        fullWidth
      />
      <TextField
        label="Balance"
        type="number"
        value={account.balance}
        onChange={(e) => setAccount({ ...account, balance: parseFloat(e.target.value) })}
        margin="normal"
        fullWidth
      />
      <TextField
        label="Currency"
        value={account.currency}
        onChange={(e) => setAccount({ ...account, currency: e.target.value })}
        margin="normal"
        fullWidth
      />
      <Box sx={{ mt: 2 }}>
        <Button variant="contained" color="primary" onClick={handleUpdate}>
          Update Account
        </Button>
        <Button variant="contained" color="error" onClick={handleDelete} sx={{ ml: 2 }}>
          Delete Account
        </Button>
      </Box>
    </Container>
  );
}

export default BankAccountDetailsPage;
