import React, { useState } from 'react';
import randomstring from 'randomstring';
import { Typography } from '@mui/material';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import LoginCard from '../components/LoginCard';
import api, { googleLogin, loginAccount } from '../utils/api';
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
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography variant="h2" fontWeight="bold" color={'primary'}>
          Plug-It
        </Typography>
        <Typography variant="h4" fontWeight="bold" color={'primary'}>
          Login
        </Typography>
        <br />
        <LoginCard title={'Login'} description={'Login to your account.'} onClick={onLogin} />
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
      </div>
    </div>
  );
};

export default LoginPage;
