import React from 'react';
import { Avatar, Card } from '@mui/material';

export interface IAccountTileProps {
  name: string;
  email: string;
  onDisconnect: () => void;
}

function AccountTile({ name, email, onDisconnect }: IAccountTileProps) {
  return (
    <Card className={'card-generic-small'} onClick={onDisconnect}>
      <Avatar sx={{ bgcolor: 'primary.main' }}>{name[0]}</Avatar>
      <div className={'account-card-separator'}>
        <div>{name}</div>
        <div>{email}</div>
      </div>
    </Card>
  );
}

export default AccountTile;
