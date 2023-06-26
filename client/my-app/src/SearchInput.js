import React from 'react';
import { TextField } from '@material-ui/core';

const SearchInput = ({ value, onChange }) => {
  return (
    <TextField
      label="Search"
      variant="outlined"
      value={value}
      onChange={onChange}
    />
  );
};

export default SearchInput;
