import { useEffect, useState } from 'react';
import { AppBar, Link, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Button from './Button';
import AccountTile from './AccountTile';
import { getUserInfos, logout, UserInfos } from '../utils/api';

export interface IHeaderProps {
  title: string;
  area: string;
}

function Header({ title }: IHeaderProps) {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserInfos | null>(null);

  function onDisconnect() {
    logout().finally(() => {
      localStorage.removeItem('crsf-token');
      navigate('/login');
    });
  }

  useEffect(() => {
    getUserInfos().then((userInfos) => {
      setUser(userInfos);
    });
  }, []);

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
          <AccountTile
            name={user?.lastname || ''}
            firstName={user?.firstname || ''}
            id={user?.id || -1}
            email={user?.email || ''}
            onDisconnect={onDisconnect}
          />
        </div>
      </div>
    </AppBar>
  );
}

export default Header;
