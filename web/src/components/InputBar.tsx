// SearchBar.tsx
import React from 'react';
import { Box, InputBase } from '@mui/material';

export interface IInputBarProps {
  defaultDummyValue: string;
  textColor: string;
  backgroundColor: string;
  borderColor: string;
  isPassword: boolean;
  onChange: (value: string) => void;
  autoComplete?: string;
}

function InputBar({
  defaultDummyValue,
  textColor,
  backgroundColor,
  borderColor,
  isPassword,
  onChange,
  autoComplete
}: IInputBarProps) {
  return (
    <Box
      component="form"
      sx={{
        p: '2px 4px',
        display: 'flex',
        alignItems: 'center',
        width: 400,
        height: 40,
        border: '1px solid',
        borderColor,
        borderRadius: '10px',
        boxShadow: '0px 4px 10px 0px rgba(0,0,0,0.30)',
        backgroundColor,
      }}
    >
      <InputBase
        sx={{ ml: 1, flex: 1 }}
        placeholder={defaultDummyValue}
        onChange={(e) => onChange(e.target.value)}
        style={{ color: textColor }}
        type={isPassword ? 'password' : 'text'}
        autoComplete={autoComplete}
      />
    </Box>
  );
}

export default InputBar;
