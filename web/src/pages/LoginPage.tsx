import React from 'react';

import { Typography } from '@mui/material';
import LoginCard from '../components/LoginCard';

const LoginPage = () => (
  // Title and LoginCard
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Typography variant="h2" fontWeight="bold" color={'primary'}>
        Plug-It
      </Typography>
      <Typography variant="h4" fontWeight="bold" color={'primary'}>
        Login
      </Typography>
      <br />
      <LoginCard
        title={'Login'}
        description={'Login to your account.'}
        buttonLabel={'Login'}
        // navigate to the dashboard on click
        onClick={() => {
          window.location.href = '/services';
        }}
      />
    </div>
  </div>
);

export default LoginPage;
