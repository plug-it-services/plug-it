import React from 'react';
import { AppBar, Link, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Button from './Button';
import AccountTile from './AccountTile';
import { logout } from '../utils/api';

export interface IHeaderProps {
  title: string;
  area: string;
}

function Header({ title }: IHeaderProps) {
  const navigate = useNavigate();

  function onDisconnect() {
    logout().finally(() => {
      localStorage.removeItem('crsf-token');
      navigate('/login');
    });
  }

  return (
    <AppBar position="static" style={{ backgroundColor: '#EAF1FF' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', height: '80px', verticalAlign: 'middle' }}>
        <Typography
          variant="h4"
          fontWeight="bold"
          color={'primary'}
          style={{ marginLeft: '20px', display: 'flex', alignItems: 'center' }}
        >
          <Link href="/">{title}</Link>
        </Typography>
        <div style={{ marginRight: '20px', display: 'flex', alignItems: 'center', gap: '20px' }}>
          <Button
            color="primary"
            text={'Services'}
            onClick={() => {
              window.location.href = '/services';
            }}
          />
          <Button
            color="primary"
            text={'PLUGS'}
            onClick={() => {
              window.location.href = '/plugs';
            }}
          />
          <AccountTile name="Jean Michel" email="jeanmichel@plugit.org" onDisconnect={onDisconnect} />
        </div>
      </div>
    </AppBar>
  );
}

export default Header;
