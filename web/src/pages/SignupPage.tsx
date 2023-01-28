import React from 'react';

import { Typography } from '@mui/material';
import SignupCard from '../components/SignupCard';
import api from '../utils/api';

const SignupPage = () => {
  const onSignup = (email: string, password: string, firstname: string, lastname: string) => {
    api.post('/auth/signup', {
      email,
      password,
      firstname,
      lastname,
    });

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
          Signup
        </Typography>
        <br />
        <SignupCard title={'Signup'} description={'Create a new account.'} buttonLabel={'Signup'} onClick={onSignup} />
      </div>
    </div>
  );
};

export default SignupPage;
