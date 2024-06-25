import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Typography, List, ListItem, ListItemText, Button, Container, IconButton, TextField, Box } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';

function TransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  const [newTransaction, setNewTransaction] = useState({
    description: '',
    amount: '',
    transactionDate: new Date().toISOString().slice(0, 10), // today's date in YYYY-MM-DD format
    BankAccountId: ''  // Assuming a default or user-selected value might be set here
  });
  const [editId, setEditId] = useState(null);
  const [editFormData, setEditFormData] = useState({ description: '', amount: '', transactionDate: '', BankAccountId: '' });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get('http://localhost:5229/api/transactions', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setTransactions(data);
      } catch (error) {
        console.error('Error fetching transactions:', error);
      }
    };
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5229/api/transactions/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setTransactions(transactions.filter(transaction => transaction.id !== id));
    } catch (error) {
      console.error('Failed to delete transaction:', error);
    }
  };

  const handleEdit = (transaction) => {
    setEditId(transaction.id);
    setEditFormData({
      description: transaction.description,
      amount: transaction.amount,
      transactionDate: transaction.transactionDate.slice(0, 10),
      BankAccountId: transaction.BankAccountId
    });
  };

  const handleCancel = () => {
    setEditId(null);
  };

  const handleSave = async (id) => {
    try {
      const updatedTransaction = { ...editFormData, amount: parseFloat(editFormData.amount) };
      await axios.put(`http://localhost:5229/api/transactions/${id}`, updatedTransaction, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      const updatedTransactions = transactions.map(transaction => {
        if (transaction.id === id) {
          return { ...transaction, ...updatedTransaction };
        }
        return transaction;
      });
      setTransactions(updatedTransactions);
      setEditId(null);
    } catch (error) {
      console.error('Failed to update transaction:', error);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post('http://localhost:5229/api/transactions', {
        ...newTransaction,
        amount: parseFloat(newTransaction.amount)
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setTransactions([...transactions, data]);
      setNewTransaction({ description: '', amount: '', transactionDate: new Date().toISOString().slice(0, 10), BankAccountId: '' });
    } catch (error) {
      console.error('Error adding transaction:', error);
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Transactions
      </Typography>
      <Box component="form" onSubmit={handleAdd}>
        <TextField label="Description" value={newTransaction.description} onChange={(e) => setNewTransaction({ ...newTransaction, description: e.target.value })} required margin="normal" />
        <TextField label="Amount" value={newTransaction.amount} onChange={(e) => setNewTransaction({ ...newTransaction, amount: e.target.value })} type="number" required margin="normal" />
        <TextField label="Date" value={newTransaction.transactionDate} onChange={(e) => setNewTransaction({ ...newTransaction, transactionDate: e.target.value })} type="date" required margin="normal" />
        <TextField label="Bank Account ID" value={newTransaction.BankAccountId} onChange={(e) => setNewTransaction({ ...newTransaction, BankAccountId: e.target.value })} type="number" required margin="normal" />
        <Button
          type="submit"
          color="primary"
          variant="contained"
          style={{ marginTop: '25px', marginLeft: '20px' }} // You can adjust the value to better fit your design
        >Add </Button>
      </Box>
      <List>
        {transactions.map((transaction) => (
          transaction.id === editId ? (
            <ListItem key={transaction.id}>
              <TextField label="Description" value={editFormData.description} onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })} margin="normal" />
              <TextField label="Amount" value={editFormData.amount} onChange={(e) => setEditFormData({ ...editFormData, amount: e.target.value })} type="number" margin="normal" />
              <TextField label="Date" value={editFormData.transactionDate} onChange={(e) => setEditFormData({ ...editFormData, transactionDate: e.target.value })} type="date" margin="normal" />
              <TextField label="Bank Account ID" value={editFormData.BankAccountId} onChange={(e) => setEditFormData({ ...editFormData, BankAccountId: e.target.value })} type="number" margin="normal" />
              <IconButton onClick={() => handleSave(transaction.id)}><SaveIcon /></IconButton>
              <IconButton onClick={handleCancel}><CancelIcon /></IconButton>
            </ListItem>
          ) : (
            <ListItem key={transaction.id}>
              <ListItemText primary={`${transaction.description} - $${transaction.amount} on ${transaction.transactionDate.slice(0, 10)}`} />
              <IconButton onClick={() => handleEdit(transaction)}><EditIcon /></IconButton>
              <IconButton onClick={() => handleDelete(transaction.id)}><DeleteIcon /></IconButton>
            </ListItem>
          )
        ))}
      </List>
    </Container>
  );
}

export default TransactionsPage;

