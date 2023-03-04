import React, { useState } from 'react';
import { InputBase } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { MDBIcon } from 'mdb-react-ui-kit';

export interface ISearchBarProps {
  placeholder: string;
  textColor: string;
  backgroundColor: string;
  borderColor: string;
  onChange: (value: string) => void;
  onSearch: (value: string) => void;
}

function SearchBar({ placeholder, textColor, backgroundColor, borderColor, onChange, onSearch }: ISearchBarProps) {
  const [searched, setSearched] = useState('');

  return (
    <div
      className="input-bar"
      style={{
        borderColor,
        backgroundColor,
      }}
    >
      <MDBIcon
        type="submit"
        style={{ fontSize: '10px' }}
        aria-label="search"
        onClick={() => onSearch(searched)}
        color="primary"
      >
        <SearchIcon />
      </MDBIcon>
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
    </div>
  );
}

export default SearchBar;
