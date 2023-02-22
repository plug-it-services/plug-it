import React, { useState } from 'react';

import { Typography } from '@mui/material';
import { MDBContainer, MDBTypography } from 'mdb-react-ui-kit';
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import SignupCard from '../components/SignupCard';
import { googleLogin, signupAccount } from '../utils/api';
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

  async function onSsoSignup(code: string) {
    try {
      await googleLogin(code);
    } catch (err: any) {
      setError('Cannot login with SSO');
      setMessage(err.message);
      setOpen(true);
      return;
    }
    window.location.href = '/services';
  }

  return (
    <MDBContainer
      className={'d-flex flex-column justify-content-center align-items-center'}
      style={{ minHeight: '100vh' }}
    >
      <MDBTypography tag="h1" variant="h1" className={'fw-bold'} style={{ fontSize: '3.5rem' }} color="primary">
        Plug-It
      </MDBTypography>
      <MDBTypography tag="h2" variant="h2" className={'fw-bold'} style={{ fontSize: '2.5rem' }} color="primary">
        Signup
      </MDBTypography>
      <SignupCard title={'Signup with email'} description={'Create a new account.'} onClick={onSignup} />
      <Typography variant="h6" fontWeight="bold" color={'primary'} padding={2}>
        Or
      </Typography>
      <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID ?? ''}>
        <GoogleLogin
          onSuccess={async (credentialResponse) => onSsoSignup(credentialResponse.credential ?? '')}
          onError={() => {
            setError('Unable to signup with google!');
            setMessage("Can't sign up with google");
            setOpen(true);
          }}
        />
      </GoogleOAuthProvider>
      <MessageBox title={error} description={message} type={'error'} isOpen={open} onClose={onClose} />
    </MDBContainer>
  );
};

export default SignupPage;
