import React from 'react';
import { MDBBtn } from 'mdb-react-ui-kit';

// extends Material UI Button
export interface IButtonProps extends React.ComponentProps<typeof MDBBtn> {
  text: string;
  onClick?: () => void;
  buttonStyle?: 'rectangle' | 'circle';
}

function Button({ text, color, onClick, buttonStyle = 'rectangle' }: IButtonProps) {
  return (
    <MDBBtn color={color} onClick={onClick} style={{ borderRadius: buttonStyle === 'circle' ? '50%' : '4px' }}>
      {text}
    </MDBBtn>
  );
}

export default Button;
