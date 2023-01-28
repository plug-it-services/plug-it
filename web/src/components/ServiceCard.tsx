import React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import Typography from '@mui/material/Typography';
import Button from './Button';

export interface IServiceCardProps {
  img: string;
  title: string;
  description: string;
  buttonLabel: string;
  onClick: () => void;
}

function ServiceCard({ img, title, description, buttonLabel, onClick }: IServiceCardProps) {
  // Card with an image, a title, a description and a button (#718CDE)
  // The card have 2 containers: one for the image, title and description and another one for button
  // The image is left aligned and the title and description are centered in the right
  // The button is centered in the bottom
  return (
    <Card
      sx={{
        backgroundColor: '#718CDE',
        width: 320,
        height: 170,
        borderRadius: '8px',
        boxShadow: '0px 0px 10px 0px rgba(0,0,0,0.30)',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'row', gap: '10px', padding: '10px' }}>
        <img
          src={img}
          alt="service"
          style={{ maxWidth: '100px', maxHeight: '100px', objectFit: 'contain', margin: '10px' }}
        />
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <Typography variant="h5" component="div" color={'white'}>
            {title}
          </Typography>
          <Typography variant="body2" color={'white'}>
            {description}
          </Typography>
        </div>
      </div>
      <CardActions style={{ display: 'flex', justifyContent: 'center' }}>
        <Button color="primary" text={buttonLabel} onClick={onClick} />
      </CardActions>
    </Card>
  );
}

export default ServiceCard;
