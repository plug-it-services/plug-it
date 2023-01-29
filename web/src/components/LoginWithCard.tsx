import React from 'react';

import { Typography, CardActions, IconButton } from '@mui/material';
import Button from './Button';

export interface ILoginWithCardProps {
  title: string;
  description: string;
  onClick: (service: string) => void;

  // store service name and icon url
  iconList: { service: string; icon: string }[];
}

function LoginWithCard({ title, description, onClick, iconList }: ILoginWithCardProps) {
  return (
    <div
      style={{
        backgroundColor: '#718CDE',
        width: 320,
        borderRadius: '8px',
        boxShadow: '0px 0px 10px 0px rgba(0,0,0,0.30)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '10px',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <Typography variant="h4" component="div" color={'white'}>
          {title}
        </Typography>
        <Typography variant="body2" color={'white'}>
          {description}
        </Typography>
      </div>
      <br />
      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
        {iconList.map((icon) => (
          // icon a map of service name and icon url
          <div
            style={{
              backgroundColor: '#EAF1FF',
              width: '30px',
              height: '30px',
              borderRadius: '50%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              margin: '8px',
            }}
          >
            <IconButton
              onClick={() => {
                onClick(icon.service);
              }}
            >
              <img src={icon.icon} alt="icon" style={{ maxWidth: '20px', maxHeight: '20px' }} />
            </IconButton>
          </div>
        ))}
      </div>
    </div>
  );
}
export default LoginWithCard;
