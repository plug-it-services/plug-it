import { Box, InputBase } from '@mui/material';

export interface IInputBarProps {
  placeholder: string;
  textColor: string;
  backgroundColor: string;
  borderColor: string;
  isPassword: boolean;
  onChange: (value: string) => void;
  onSubmit: () => void;
  autoComplete?: string;
  onBlur?: () => void;
  onFocus?: () => void;
  value?: string;
}

function InputBar({
  placeholder,
  textColor,
  backgroundColor,
  borderColor,
  isPassword,
  onChange,
  onSubmit,
  autoComplete,
  value,
  onBlur,
  onFocus,
}: IInputBarProps) {
  return (
    <Box
      component="form"
      className="input-bar d-flex"
      sx={{
        borderColor,
        backgroundColor,
      }}
    >
      <InputBase
        sx={{ ml: 1, flex: 1 }}
        placeholder={placeholder}
        onChange={(e) => {
          onChange(e.target.value);
        }}
        style={{ color: textColor }}
        type={isPassword ? 'password' : 'text'}
        value={value}
        autoComplete={autoComplete}
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
        onBlur={onBlur}
        onFocus={onFocus}
      />
    </Box>
  );
}

export default InputBar;
