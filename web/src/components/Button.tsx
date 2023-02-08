import React from 'react';
import MuiButton from '@mui/material/Button';

// extends Material UI Button
export interface IButtonProps extends React.ComponentProps<typeof MuiButton> {
  text: string;
  onClick?: () => void;
  buttonStyle?: 'rectangle' | 'circle';
}

function Button({ text, color, onClick, buttonStyle = 'rectangle' }: IButtonProps) {
  return (
    <MuiButton
      variant="contained"
      color={color}
      onClick={onClick}
      style={{ borderRadius: buttonStyle === 'circle' ? '50%' : '4px' }}
    >
      {text}
    </MuiButton>
  );
}

export default Button;
