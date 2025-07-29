import { TextField } from "@mui/material";
import React from "react";

interface SearchBoxProps {
  value: string;
  onChange: (value: string) => void;
}

const SearchBox: React.FC<SearchBoxProps> = ({ value, onChange }) => {
  return (
    <TextField
      label="Search"
      variant="outlined"
      size="small"
      fullWidth
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
};

export default SearchBox;
