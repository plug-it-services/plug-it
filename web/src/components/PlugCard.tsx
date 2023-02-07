import React from 'react';
import { Typography, CardActions } from '@mui/material';
import Button from './Button';
import { Plug, setPlugEnable } from '../utils/api';

export interface IAreaCardProps {
  plug: Plug;
}

function PlugCard({ plug }: IAreaCardProps) {
  const onClick = () => {
    setPlugEnable(!plug.enabled, plug.id); // TODO should be passed as props
  };

  return (
    <div
      style={{
        backgroundColor: '#718CDE',
        width: 320, // TODO make this responsive
        borderRadius: '8px',
        boxShadow: '0px 0px 10px 0px rgba(0,0,0,0.30)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '10px',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="body1" component="div" color={'white'}>
          {plug.name}
        </Typography>
      </div>
      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
        {plug.icons.map((icon) => (
          <div
            key={icon}
            style={{
              width: '30px', // TODO make this responsive
              height: '30px', // TODO make this responsive
              borderRadius: '50%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              margin: '8px',
            }}
          >
            <img src={icon} alt="icon" style={{ maxWidth: '20px', maxHeight: '20px' }} />
          </div>
        ))}
      </div>
      <CardActions style={{ display: 'flex', justifyContent: 'center' }}>
        <Button color="primary" text={plug.enabled ? 'Disable' : 'Enable'} onClick={onClick} />
      </CardActions>
    </div>
  );
}

export default PlugCard;
