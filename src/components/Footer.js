import React from 'react';
import { Typography, Box, Container } from '@mui/material';

function Footer() {
  return (
    <Box sx={{ bgcolor: 'text.secondary', p: 6 }} component="footer">
      <Container maxWidth="lg">
        <Typography variant="body2" color="white" align="center">
          © {new Date().getFullYear()} My Financial App, Inc. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
}

export default Footer;
