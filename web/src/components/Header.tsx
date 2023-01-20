import React from 'react';
import { AppBar, Typography } from '@mui/material';
import Button from './Button';

export interface IHeaderProps {
  title: string;
  area: string;
}

function Header({ title, area }: IHeaderProps) {
  // AppBar with a title at the left and a button at the right
  return (
    <AppBar position="static" color={'primary'}>
      <div style={{ display: 'flex', justifyContent: 'space-between', height: '80px', verticalAlign: 'middle' }}>
        <Typography variant="h4" style={{ color: 'white', marginLeft: '20px', display: 'flex', alignItems: 'center' }}>
          {title}
        </Typography>
        <div style={{ marginRight: '20px', display: 'flex', alignItems: 'center' }}>
          <Button color="primary" text={area} onClick={() => alert('Hello')} />
        </div>
      </div>
    </AppBar>
  );
}

export default Header;
