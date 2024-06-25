import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Typography, Button, TextField, Grid, Card, CardContent } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function BankAccountsPage() {
  const [accounts, setAccounts] = useState([]);
  const [newAccount, setNewAccount] = useState({
    accountNumber: '',
    balance: '',
    currency: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
        const token = localStorage.getItem('token');
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const response = await axios.get('http://localhost:5229/api/BankAccounts', config);
        setAccounts(response.data);
    } catch (error) {
        console.error('Error fetching bank accounts:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAccount(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token'); // Retrieve the token from local storage
    if (!token) {
        console.log('Authentication token is not available.');
        // Optionally, redirect to login or display a message prompting to log in
        return;
    }

    try {
        await axios.post('http://localhost:5229/api/BankAccounts', newAccount, {
            headers: { 'Authorization': `Bearer ${token}` } // Include the token in the request headers
        });
        fetchAccounts();  // Refresh the list of accounts
        setNewAccount({ accountNumber: '', balance: '', currency: '' }); // Reset the form
    } catch (error) {
        console.error('Failed to add bank account:', error);
        if (error.response && error.response.status === 401) {
            // Handle unauthorized access, e.g., redirect to login or refresh the token
        }
    }
    
};


  return (
    <Container maxWidth="md">
      <Typography variant="h4" gutterBottom>
                Bank Accounts
      </Typography>
        
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Account Number"
              variant="outlined"
              fullWidth
              required
              name="accountNumber"
              value={newAccount.accountNumber}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              label="Balance"
              variant="outlined"
              fullWidth
              required
              name="balance"
              value={newAccount.balance}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              label="Currency"
              variant="outlined"
              fullWidth
              required
              name="currency"
              value={newAccount.currency}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary">
              Add New Account
            </Button>
          </Grid>
        </Grid>
      </form>
      <Grid container spacing={2} style={{ marginTop: 20 }}>
        {accounts.map(account => (
          <Grid item xs={12} sm={6} md={4} key={account.id}>
            <Card>
              <CardContent>
                <Typography variant="h6">{account.accountNumber}</Typography>
                <Typography>Balance: ${account.balance}</Typography>
                <Typography>Currency: {account.currency}</Typography>
                <Button color="primary" onClick={() => navigate(`/bank-accounts/${account.id}`)}>
                  View Details
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default BankAccountsPage;
