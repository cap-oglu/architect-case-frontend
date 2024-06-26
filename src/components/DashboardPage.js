import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Typography, Card, CardContent, List, ListItem, ListItemText, Container, Grid, Box, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function DashboardPage() {
  const [totalBalance, setTotalBalance] = useState(0);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [bankAccounts, setBankAccounts] = useState([]);
  const [exchangeRate, setExchangeRate] = useState(null);
  const navigate = useNavigate();


  useEffect(() => {
    const fetchExchangeRate = async () => {
      try {
        const response = await axios.get('http://localhost:5229/api/ExchangeRates/rate?baseCurrency=USD&targetCurrency=EUR', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setExchangeRate(response.data);
      } catch (error) {
        console.error('Failed to fetch exchange rate:', error);
      }
    };

    fetchExchangeRate();
  }, []);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const config = { headers: { Authorization: `Bearer ${token}` } };

        const accountsRes = await axios.get('http://localhost:5229/api/Bankaccounts', config);
        const transactionsRes = await axios.get('http://localhost:5229/api/Transactions', config);

        const accounts = accountsRes.data;
        const transactions = transactionsRes.data;

        if (!Array.isArray(accounts)) {
          console.error('Expected accounts to be an array, received:', accounts);
          return; // Exit the function or handle the case where accounts is not an array
        }

        const total = accounts.reduce((sum, account) => sum + account.balance, 0);
        setTotalBalance(total);
        setRecentTransactions(transactions.slice(0, 5));
        setBankAccounts(accounts);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Dashboard
        </Typography>
        {exchangeRate && (
          <Typography variant="h6">
            Exchange Rate from {exchangeRate.baseCurrency} to {exchangeRate.targetCurrency}: {exchangeRate.rate.toFixed(4)}
          </Typography>
        )}
        <Typography variant="h6" component="p" sx={{ mt: 2 }}>
          Total Balance: ${totalBalance.toFixed(2)}
        </Typography>
      </Paper>

      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" component="div" gutterBottom>
          Bank Accounts
        </Typography>
        <Grid container spacing={4}>
          {bankAccounts.map((account) => (
            <Grid item xs={12} sm={6} md={4} key={account.id}>
              <Card sx={{ cursor: 'pointer' }} onClick={() => navigate(`/bank-accounts`)}>
                <CardContent>
                  <Typography variant="h6">{account.accountNumber}</Typography>
                  <Typography>Balance: ${account.balance.toFixed(2)}</Typography>
                  <Typography variant="body2">Currency: {account.currency}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Box sx={{ mt: 4, cursor: 'pointer' }} onClick={() => navigate('/transactions')}>
        <Typography variant="h6" component="div" gutterBottom>
          Recent Transactions
        </Typography>
        <List dense>
          {recentTransactions.map((transaction) => (
            <ListItem key={transaction.id}>
              <ListItemText
                primary={`${transaction.description} - $${transaction.amount.toFixed(2)}`}
              />
            </ListItem>
          ))}
        </List>
      </Box>
    </Container>
  );
}

export default DashboardPage;

