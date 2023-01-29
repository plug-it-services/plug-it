import React from 'react';

// Message box component
import { Card, CardContent, Typography, CardActions, IconButton } from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import CloseIcon from '@mui/icons-material/Close';
import Button from './Button';

export interface IMessageBoxProps {
  title: string;
  description: string;
  buttons: { label: string; onClick: () => void }[];
  type: 'error' | 'success' | 'warning';
}

function MessageBox({ title, description, buttons, type }: IMessageBoxProps) {
  // Display a MessageBox
  // with an icon before the title and dynamic buttons
  // the color and icon must change according to the type
  // type: error, success, warning

  // store the color to use

  return (
    <Card
      sx={{
        width: 400,
        maxWidth: 800,
        borderRadius: '8px',
        boxShadow: '0px 0px 10px 0px rgba(0,0,0,0.30)',
        backgroundColor: '#FFFFFF',
      }}
    >
      <CardContent>
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
          {type === 'error' && <CancelIcon sx={{ color: '#F44336' }} />}
          {type === 'success' && <CheckCircleIcon sx={{ color: '#4CAF50' }} />}
          {type === 'warning' && <WarningIcon sx={{ color: '#FF9800' }} />}
          <Typography variant="h5" component="div" style={{ marginLeft: '10px' }}>
            {title}
          </Typography>
          <IconButton
            sx={{
              marginLeft: 'auto',
              padding: '0px',
            }}
            onClick={() => alert('TODO: close')}
          >
            <CloseIcon />
          </IconButton>
        </div>
        <Typography variant="body2" style={{ marginTop: '10px' }}>
          {description}
        </Typography>
      </CardContent>
      <CardActions style={{ display: 'flex', justifyContent: 'flex-end' }}>
        {buttons.map((button, index) => (
          <Button
            key={index}
            color="primary"
            text={button.label}
            onClick={() => {
              alert('TODO: close');
              button.onClick();
            }}
          />
        ))}
      </CardActions>
    </Card>
  );
}

export default MessageBox;
