import React from 'react';
import { Avatar, Card } from '@mui/material';

export interface IAccountTileProps {
  name: string;
  firstName: string;
  id: number;
  email: string;
  onDisconnect: () => void;
}

function AccountTile({ name, firstName, id, email, onDisconnect }: IAccountTileProps) {
  return (
    <Card className={'card-generic-small'} onClick={onDisconnect}>
      <Avatar sx={{ bgcolor: 'primary.main' }}>{name.length > 0 ? name[0] : '?'}</Avatar>
      <div className={'account-card-separator'}>
        <div>
          {firstName} {name} ({id})
        </div>
        <div>{email}</div>
      </div>
    </Card>
  );
}

export default AccountTile;
