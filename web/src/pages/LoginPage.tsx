import React, {useState} from 'react';
import randomstring from 'randomstring';

import { Typography } from '@mui/material';
import LoginCard from '../components/LoginCard';
import api from '../utils/api';
import MessageBox from '../components/MessageBox';

const LoginPage = () => {
  const [open, setOpen] = useState(false);
  const onClose = () => {
    setOpen(false);
  }
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
          headers: {
            "crsf-token": crsf,
          },
        },
      );
    } catch (err: any) {
      setError(err.response.data.error);
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
        <MessageBox title={error} description={message} buttons={[]} type={"error"} isOpen={open} onClose={onClose}/>
        <br />
      </div>
    </div>
  );
};

export default LoginPage;
