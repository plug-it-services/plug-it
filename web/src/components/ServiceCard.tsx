import React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
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
  return (
    <div>
      <Card style={{ boxShadow: '0 4px 8px 0 rgba(0,0,0,0.5)' }}>
        <CardContent>
          <div>
            <div>
              <img src={img} alt={title} style={{ maxHeight: '100px', maxWidth: '150px' }} />
            </div>
          </div>
          <Typography variant="h4" gutterBottom>
            {title}
          </Typography>
          <Typography color="text">{description}</Typography>
        </CardContent>
        <CardActions style={{ justifyContent: 'center' }}>
          <Button color="primary" text="Click me" onClick={() => alert('Hello')} />
        </CardActions>
      </Card>
    </div>
  );
}

export default ServiceCard;
