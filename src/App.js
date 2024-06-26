import React from 'react';
import { BrowserRouter as Router, useLocation  } from 'react-router-dom';
import Dashboard from './components/DashboardPage.js';
import TransactionsPage from './components/TransactionsPage.js';
import TransfersPage from './components/TransfersPage.js';
import HomePage from './components/HomePage';
import RegisterPage from './components/RegisterPage';
import Header from './components/Header';
import Footer from './components/Footer';
import Container from '@mui/material/Container';
import BankAccountsPage from './components/BankAccountsPage.js';
import ProfilePage from './components/ProfilePage.js';



function AppContent() {
  const location = useLocation();  // Now this is safe to use
  const noHeaderPaths = ['/', '/register'];
  const showHeader = !noHeaderPaths.includes(location.pathname);

  return (
      <>
          {showHeader && <Header />}
          <Container component="main" maxWidth="xl" style={{ height: '100vh' }}>
              {location.pathname === '/' && <HomePage />}
              {location.pathname === '/register' && <RegisterPage />}
              {location.pathname === '/dashboard' && <Dashboard />}
              {location.pathname === '/transfers' && <TransfersPage />}
              {location.pathname === '/transactions' && <TransactionsPage />}
              {location.pathname === '/bank-accounts' && <BankAccountsPage />}
              {location.pathname === '/profile' && <ProfilePage />}
              {/* Add more routes as needed */}
          </Container>
          <Footer />
      </>
  );
}
function App() {



  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
