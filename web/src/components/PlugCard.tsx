import React from 'react';
import { Typography, CardActions } from '@mui/material';
import Button from './Button';
import { Plug } from '../utils/api';

export interface IAreaCardProps {
  plug: Plug;
  onClickButton?: () => void;
}

function PlugCard({ plug, onClickButton }: IAreaCardProps) {
  return (
    <div className={'plug-card'}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="body1" component="div" color={'white'}>
          {plug.name}
        </Typography>
      </div>
      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
        {plug.icons.map((icon) => (
          <div key={icon} className={'plug-card-icon'}>
            <img src={icon} alt="icon" style={{ maxWidth: '20px', maxHeight: '20px' }} />
          </div>
        ))}
      </div>
      <CardActions style={{ display: 'flex', justifyContent: 'center' }}>
        <Button color="primary" text={plug.enabled ? 'Disable' : 'Enable'} onClick={onClickButton} />
      </CardActions>
    </div>
  );
}

export default PlugCard;
