import React, { useState } from 'react';

import { Typography } from '@mui/material';
import SignupCard from '../components/SignupCard';
import { signupAccount } from '../utils/api';
import MessageBox from '../components/MessageBox';

const SignupPage = () => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState("Can't signup");

  const onClose = () => {
    setOpen(false);
  };

  const onSignup = async (email: string, password: string, firstname: string, lastname: string) => {
    try {
      await signupAccount(email, password, firstname, lastname);
    } catch (errorEx: any) {
      setError(`Can't signup`);
      setMessage(errorEx.message);
      setOpen(true);
      return;
    }
    window.location.href = '/login';
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography variant="h2" fontWeight="bold" color={'primary'}>
          Plug-It
        </Typography>
        <Typography variant="h4" fontWeight="bold" color={'primary'}>
          Signup
        </Typography>
        <br />
        <SignupCard title={'Signup'} description={'Create a new account.'} onClick={onSignup} />
        <MessageBox title={error} description={message} type={'error'} isOpen={open} onClose={onClose} />
      </div>
    </div>
  );
};

export default SignupPage;
