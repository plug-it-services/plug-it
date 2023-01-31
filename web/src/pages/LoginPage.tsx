import React, { useState } from 'react';
import randomstring from 'randomstring';

import { Typography } from '@mui/material';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import LoginCard from '../components/LoginCard';
import api, { getServices } from '../utils/api';
import MessageBox from '../components/MessageBox';

const LoginPage = () => {
  const [open, setOpen] = useState(false);
  const onClose = () => {
    setOpen(false);
  };
  const [message, setMessage] = useState('');
  const [error, setError] = useState("Can't login");

  const onLogin = async (email: string, password: string) => {
    let crsf = localStorage.getItem('crsf-token');

    if (crsf === null) {
      crsf = randomstring.generate();
      localStorage.setItem('crsf-token', crsf);
    }

    try {
      await api.post(
        '/auth/login',
        {
          email,
          password,
        },
        {
          withCredentials: true,
          headers: {
            'crsf-token': crsf,
          },
        },
      );
    } catch (err: any) {
      if (err.response.data.error) {
        setError(err.response.data.error);
      }
      if (err.response.status === 400) {
        setMessage(err.response.data.message[0]);
      } else {
        setMessage(err.response.data.message);
      }
      setOpen(true);
      return;
    }
    window.location.href = '/services';
  };

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
        <LoginCard title={'Login'} description={'Login to your account.'} buttonLabel={'Login'} onClick={onLogin} />
        <MessageBox title={error} description={message} type={'error'} isOpen={open} onClose={onClose} />
        <Typography variant="h6" fontWeight="bold" color={'primary'} padding={2}>
          Or
        </Typography>
        <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID ?? ''}>
          <GoogleLogin
            onSuccess={async (credentialResponse) => {
              try {
                await axios.post(
                  'https://api-area-dev.alexandrejublot.com/auth/google/login',
                  {
                    code: credentialResponse.credential ?? '',
                  },
                  {
                    withCredentials: true,
                    headers: {
                      'crsf-token': crsf ?? '',
                    },
                  },
                );
              } catch (err: any) {
                setError(err);
                if (err.response.status === 400) {
                  setMessage(err.response.data.message[0]);
                } else {
                  setMessage(err.response.data.message);
                }
                setOpen(true);
              }
            }}
            onError={() => {
              setError('Unauthorized');
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
