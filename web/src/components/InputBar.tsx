import React from 'react';
import { Box, InputBase } from '@mui/material';

export interface IInputBarProps {
  placeholder: string;
  textColor: string;
  backgroundColor: string;
  borderColor: string;
  isPassword: boolean;
  onChange: (value: string) => void;
  autoComplete?: string;
}

function InputBar({
  placeholder,
  textColor,
  backgroundColor,
  borderColor,
  isPassword,
  onChange,
  autoComplete,
}: IInputBarProps) {
  return (
    <Box
      component="form"
      className="input-bar"
      sx={{
        borderColor,
        backgroundColor,
      }}
    >
      <InputBase
        sx={{ ml: 1, flex: 1 }}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        style={{ color: textColor }}
        type={isPassword ? 'password' : 'text'}
        autoComplete={autoComplete}
      />
    </Box>
  );
}

export default InputBar;
