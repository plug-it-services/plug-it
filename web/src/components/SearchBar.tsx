import React, { useState } from 'react';
import { Box, InputBase, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

export interface ISearchBarProps {
  placeholder: string;
  textColor: string;
  backgroundColor: string;
  borderColor: string;
  onChange: (value: string) => void;
  onSearch: (value: string) => void;
}
// with shadow
function SearchBar({ placeholder, textColor, backgroundColor, borderColor, onChange, onSearch }: ISearchBarProps) {
  const [searched, setSearched] = useState('');

  return (
    <Box
      component="form"
      className="input-bar"
      sx={{
        borderColor,
        backgroundColor,
      }}
    >
      <IconButton
        type="submit"
        sx={{ p: '10px' }}
        aria-label="search"
        onClick={() => onSearch(searched)}
        color="primary"
      >
        <SearchIcon />
      </IconButton>
      <InputBase
        sx={{ ml: 1, flex: 1 }}
        placeholder={placeholder}
        onChange={(e) => {
          setSearched(e.target.value);
          onChange(e.target.value);
        }}
        onSubmit={(e) => {
          e.preventDefault();
          onSearch(searched);
        }}
        style={{ color: textColor }}
      />
    </Box>
  );
}

export default SearchBar;
