import React from 'react';
import MuiButton from '@mui/material/Button';

// extends Material UI Button
export interface IButtonProps extends React.ComponentProps<typeof MuiButton> {
  text: string;
  onClick?: () => void;
}

function Button({ text, color, onClick }: IButtonProps) {
  return (
    <MuiButton variant="contained" color={color} onClick={onClick}>
      {text}
    </MuiButton>
  );
}

export default Button;
