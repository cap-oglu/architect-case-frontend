import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Typography, Button, TextField, Grid, Card, CardContent, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function BankAccountsPage() {
  const [error, setError] = useState(''); // State variable for error message
  const [accounts, setAccounts] = useState([]);
  const [newAccount, setNewAccount] = useState({
    accountNumber: '',
    balance: '',
    currency: ''
  });
  const [editMode, setEditMode] = useState(false);
  const [currentAccount, setCurrentAccount] = useState(null); // Used for editing and deleting

  const navigate = useNavigate();

  const handleUpdateAccount = async () => {
    if (!currentAccount) return;
    const token = localStorage.getItem('token');
    try {
      await axios.put(`http://localhost:5229/api/BankAccounts/${currentAccount.id}`, currentAccount, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchAccounts(); // Refresh the list
      setEditMode(false); // Exit edit mode
      setCurrentAccount(null); // Clear current account
    } catch (error) {
      console.error('Failed to update bank account:', error);
    }
  };

  const handleDeleteAccount = async (accountId) => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`http://localhost:5229/api/BankAccounts/${accountId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchAccounts(); // Refresh the list
    } catch (error) {
      console.error('Failed to delete bank account:', error);
      setError('Failed to delete bank account. Please try again later.');
    }
  };

  const enterEditMode = (account) => {
    setCurrentAccount({...account});
    setEditMode(true);
};

const handleCurrentAccountChange = (e) => {
    const { name, value } = e.target;
    setCurrentAccount(prev => ({ ...prev, [name]: value }));
};


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
      {error && <Alert severity="error">{error}</Alert>}
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
                    {editMode && currentAccount.id === account.id ? (
                        <>
                            <TextField
                                label="Account Number"
                                variant="outlined"
                                fullWidth
                                required
                                name="accountNumber"
                                value={currentAccount.accountNumber}
                                onChange={handleCurrentAccountChange}
                            />
                            <TextField
                                label="Balance"
                                variant="outlined"
                                fullWidth
                                required
                                name="balance"
                                value={currentAccount.balance}
                                onChange={handleCurrentAccountChange}
                            />
                            <TextField
                                label="Currency"
                                variant="outlined"
                                fullWidth
                                required
                                name="currency"
                                value={currentAccount.currency}
                                onChange={handleCurrentAccountChange}
                            />
                            <Button onClick={handleUpdateAccount} color="primary">Save</Button>
                            <Button onClick={() => setEditMode(false)}>Cancel</Button>
                        </>
                    ) : (
                        <>
                            <Typography variant="h6"> Account no: {account.accountNumber}</Typography>
                            <Typography>Balance: ${account.balance}</Typography>
                            <Typography>Currency: {account.currency}</Typography>
                            <Typography>Id: {account.id}</Typography>

                            <Button color="primary" onClick={() => enterEditMode(account)}>
                                Edit
                            </Button>
                            <Button color="secondary" onClick={() => handleDeleteAccount(account.id)}>
                                Delete
                            </Button>
                        </>
                    )}
                </CardContent>
            </Card>
        </Grid>
    ))}
</Grid>


      
    </Container>
  );
}

export default BankAccountsPage;
