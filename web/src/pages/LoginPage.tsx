import React from 'react';
import randomstring from 'randomstring';

import { Typography } from '@mui/material';
import LoginCard from '../components/LoginCard';
import api from '../utils/api';

const LoginPage = () => {
  const onLogin = (email: string, password: string) => {
    let crsf = localStorage.getItem('crsf_token');

    if (crsf === null) {
      crsf = randomstring.generate();
      localStorage.setItem('crsf_token', crsf);
    }

    api.post(
      '/auth/login',
      {
        email,
        password,
      },
      {
        headers: {
          crsf_token: crsf,
        },
      },
    );

    window.location.href = '/services';
  };

  return (
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
        <LoginCard title={'Login'} description={'Login to your account.'} buttonLabel={'Login'} onClick={onLogin} />
      </div>
    </div>
  );
};

export default LoginPage;
