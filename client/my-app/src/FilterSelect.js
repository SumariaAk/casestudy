import React from 'react';
import { FormControl, InputLabel, Select, MenuItem } from '@material-ui/core';

const FilterSelect = ({ value, onChange }) => {
  return (
    <FormControl variant="outlined">
      <InputLabel>Gender</InputLabel>
      <Select value={value} onChange={onChange} label="Gender">
        <MenuItem value="">
          <em>All</em>
        </MenuItem>
        <MenuItem value="Male">Male</MenuItem>
        <MenuItem value="Female">Female</MenuItem>
      </Select>
    </FormControl>
  );
};

export default FilterSelect;
