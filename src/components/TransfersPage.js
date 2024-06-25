import React, { useEffect, useState } from 'react';
import axios from 'axios';

function TransfersPage() {
  const [transfers, setTransfers] = useState([]);
  const [fromAccountId, setFromAccountId] = useState('');
  const [toAccountId, setToAccountId] = useState('');
  const [amount, setAmount] = useState('');

  useEffect(() => {
    const fetchTransfers = async () => {
      const token = localStorage.getItem('token');
      try {
        const { data } = await axios.get('http://localhost:5229/api/transfers', {
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
        fromAccountId, toAccountId, amount
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
    <div>
      <h1>Transfers</h1>
      <form onSubmit={handleTransfer}>
        <input type="number" value={fromAccountId} onChange={e => setFromAccountId(e.target.value)} placeholder="From Account ID" />
        <input type="number" value={toAccountId} onChange={e => setToAccountId(e.target.value)} placeholder="To Account ID" />
        <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="Amount" />
        <button type="submit">Transfer</button>
      </form>
      <h2>Recent Transfers</h2>
      <ul>
        {transfers.map((transfer) => (
          <li key={transfer.id}>
            {transfer.fromAccount && transfer.fromAccount.accountNumber} to 
            {transfer.toAccount && transfer.toAccount.accountNumber} - 
            ${transfer.amount}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TransfersPage;
