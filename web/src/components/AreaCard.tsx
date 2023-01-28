import React from 'react';
import { Typography, CardActions } from '@mui/material';
import Button from './Button';

export interface IAreaCardProps {
  title: string;
  date: string;
  iconList: string[];
  buttonLabel: string;
  onClick: () => void;
}

function AreaCard({ title, date, iconList, buttonLabel, onClick }: IAreaCardProps) {
  return (
    <div
      style={{
        backgroundColor: '#718CDE',
        width: 320,
        height: 170,
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
      </div>
      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
        {iconList.map((icon) => (
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
            <img src={icon} alt="icon" style={{ maxWidth: '20px', maxHeight: '20px' }} />
          </div>
        ))}
      </div>
      <CardActions style={{ display: 'flex', justifyContent: 'center' }}>
        <Button color="primary" text={buttonLabel} onClick={onClick} />
      </CardActions>
    </div>
  );
}

export default AreaCard;
