import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Typography, Card, CardContent, List, ListItem, ListItemText, Container, Grid, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function DashboardPage() {
  const [totalBalance, setTotalBalance] = useState(0);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [bankAccounts, setBankAccounts] = useState([]);
  const navigate = useNavigate();

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
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom>
        Dashboard
      </Typography>
      <Typography variant="h6" component="p">
        Total Balance: ${totalBalance.toFixed(2)}
      </Typography>

      <Box sx={{ mt: 4, mb: 2 }}>
        <Typography variant="h6" component="div" gutterBottom>
          Bank Accounts
        </Typography>
        <Grid container spacing={2}>
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

