// SearchBar.tsx
import React from 'react';
import { Box, InputBase, IconButton } from '@mui/material';
import Typography from '@mui/material/Typography';
import SearchIcon from '@mui/icons-material/Search';

export interface ISearchBarProps {
  defaultDummyValue: string;
  textColor: string;
  backgroundColor: string;
  borderColor: string;
  onChange: (value: string) => void;
  onSearch: (value: string) => void;
}
// with shadow
function SearchBar({
  defaultDummyValue,
  textColor,
  backgroundColor,
  borderColor,
  onChange,
  onSearch,
}: ISearchBarProps) {
  return (
    <Box
      component="form"
      sx={{
        p: '2px 4px',
        display: 'flex',
        alignItems: 'center',
        width: 400,
        border: '1px solid',
        borderColor,
        borderRadius: '10px',
        boxShadow: '0px 4px 10px 0px rgba(0,0,0,0.30)',
        backgroundColor,
      }}
    >
      <IconButton
        type="submit"
        sx={{ p: '10px' }}
        aria-label="search"
        onClick={() => onSearch(defaultDummyValue)}
        color="primary"
      >
        <SearchIcon />
      </IconButton>
      <InputBase
        sx={{ ml: 1, flex: 1 }}
        placeholder={defaultDummyValue}
        onChange={(e) => onChange(e.target.value)}
        style={{ color: textColor }}
      />
    </Box>
  );
}

export default SearchBar;
