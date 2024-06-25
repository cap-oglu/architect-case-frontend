import React from 'react';
import { AppBar, Toolbar, Typography, Button, Container } from '@mui/material';
import { Link } from 'react-router-dom';

function Header() {
  return (
    <AppBar position="static">
      <Container>
        <Toolbar>
           <Typography
        variant="h6"
        component={Link}
        to="/dashboard"
        sx={{ flexGrow: 1, textDecoration: 'none', color: 'inherit' }}
      >
        IFinance
      </Typography>
          <Button color="inherit" component={Link} to="/bank-accounts">Bank Accounts</Button>
          <Button color="inherit" component={Link} to="/transfers">Transfers</Button>
          <Button color="inherit" component={Link} to="/transactions">Transactions</Button>
          <Button color="inherit" component={Link} to="/profile">Profile</Button>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Header;
