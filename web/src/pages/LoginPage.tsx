import React, { useState } from 'react';
import randomstring from 'randomstring';
import { Typography } from '@mui/material';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { MDBContainer, MDBTypography } from 'mdb-react-ui-kit';
import LoginCard from '../components/LoginCard';
import { googleLogin, loginAccount } from '../utils/api';
import MessageBox from '../components/MessageBox';

const LoginPage = () => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState("Can't login");

  const onClose = () => {
    setOpen(false);
  };

  const onLogin = async (email: string, password: string) => {
    let crsf = localStorage.getItem('crsf-token');

    if (crsf === null) {
      crsf = randomstring.generate();
      localStorage.setItem('crsf-token', crsf);
    }

    try {
      await loginAccount(email, password);
      window.location.href = '/services';
    } catch (err: any) {
      setError('Cannot login');
      setMessage(err.message);
      setOpen(true);
    }
  };

  async function onSsoLogin(code: string) {
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

  let crsf = localStorage.getItem('crsf-token');
  if (crsf === null) {
    crsf = randomstring.generate();
    localStorage.setItem('crsf-token', crsf);
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
        Login
      </MDBTypography>
      <LoginCard title={'Login with email'} description={'Login to your account.'} onClick={onLogin} />
      <MessageBox title={error} description={message} type={'error'} isOpen={open} onClose={onClose} />
      <Typography variant="h6" fontWeight="bold" color={'primary'} padding={2}>
        Or
      </Typography>
      <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID ?? ''}>
        <GoogleLogin
          onSuccess={async (credentialResponse) => onSsoLogin(credentialResponse.credential ?? '')}
          onError={() => {
            setError('Unable to login with google!');
            setMessage("Can't log in with google");
            setOpen(true);
          }}
        />
      </GoogleOAuthProvider>
    </MDBContainer>
  );
};

export default LoginPage;
