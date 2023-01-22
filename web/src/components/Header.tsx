import React from 'react';
import { AppBar, Typography } from '@mui/material';
import Button from './Button';
import AccountTile from './AccountTile';

export interface IHeaderProps {
  title: string;
  area: string;
}

function Header({ title, area }: IHeaderProps) {
  // AppBar with a title at the left and a button at the right
  return (
    <AppBar position="static" style={{ backgroundColor: '#EAF1FF' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', height: '80px', verticalAlign: 'middle' }}>
        <Typography
          variant="h4"
          fontWeight="bold"
          color={'primary'}
          style={{ marginLeft: '20px', display: 'flex', alignItems: 'center' }}
        >
          {title}
        </Typography>
        <div style={{ marginRight: '20px', display: 'flex', alignItems: 'center', gap: '20px' }}>
          <Button color="primary" text={area} onClick={() => alert('Hello')} />
          <Button color="primary" text={area} onClick={() => alert('Hello')} />
          <AccountTile name="Jean Michel" email="jeanmichel@plugit.org" />
        </div>

      </div>
    </AppBar>
  );
}

export default Header;
