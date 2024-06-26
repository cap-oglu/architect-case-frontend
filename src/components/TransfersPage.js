import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Container,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  Paper,
  Box,
  Grid,
  Card,
  CardContent
} from '@mui/material';

function TransfersPage() {
  const [transfers, setTransfers] = useState([]);
  const [fromAccountId, setFromAccountId] = useState('');
  const [toAccountId, setToAccountId] = useState('');
  const [amount, setAmount] = useState('');
  const [transferDate, setTransferDate] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    const fetchTransfers = async () => {
      const token = localStorage.getItem('token');
      try {
        const { data } = await axios.get('http://localhost:5229/api/Transfers', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setTransfers(data);
      } catch (error) {
        console.error('Failed to fetch transfers:', error);
      }
    };

    fetchTransfers();
  }, []);

  const handleTransfer = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      await axios.post('http://localhost:5229/api/transfers', {
        fromAccountId, 
        toAccountId, 
        amount, 
        transferDate, 
        description
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Re-fetch or update state to show new transfer
      const { data } = await axios.get('http://localhost:5229/api/transfers', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTransfers(data);
    } catch (error) {
      console.error('Failed to create transfer:', error);
    }
  };

  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        Transfers
      </Typography>
      <Paper elevation={3} style={{ padding: 16 }}>
        <Box component="form" onSubmit={handleTransfer}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="From Account ID"
                type="number"
                value={fromAccountId}
                onChange={e => setFromAccountId(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="To Account ID"
                type="number"
                value={toAccountId}
                onChange={e => setToAccountId(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Amount"
                type="number"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Transfer Date"
                type="date"
                value={transferDate}
                onChange={e => setTransferDate(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                value={description}
                onChange={e => setDescription(e.target.value)}
                required
              />
            </Grid>
          </Grid>
          <Box mt={2}>
            <Button variant="contained" color="primary" type="submit">
              Transfer
            </Button>
          </Box>
        </Box>
      </Paper>
      <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 2 }}>
          Recent Transfers
        </Typography>
        {transfers.length === 0 ? (
          <Typography variant="body1" color="textSecondary">
            No transfers available.
          </Typography>
        ) : (
          <Grid container spacing={2}>
            {transfers.map((transfer) => (
              <Grid item xs={12} sm={6} md={4} key={transfer.id}>
                <Card sx={{ minHeight: '150px' }}>
                  <CardContent>
                    <Typography variant="h6">
                      {transfer.fromAccount?.accountNumber} to {transfer.toAccount?.accountNumber}
                    </Typography>
                    <Typography variant="body1" color="textSecondary">
                      Amount: ${transfer.amount.toFixed(2)}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Date: {new Date(transfer.transferDate).toLocaleDateString()}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Description: {transfer.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

    </Container>
  );
}

export default TransfersPage;

