import React, { useState, useEffect } from "react";
import { Paper, InputBase, IconButton } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

const SearchBar = ({ initialQuery, onSearch }) => {
  const [query, setQuery] = useState(initialQuery || "");

  useEffect(() => {
    setQuery(initialQuery || "");
  }, [initialQuery]);

  const handleInputChange = (event) => {
    setQuery(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    } else {
      onSearch(""); // Clear search results if the query is empty
    }
  };

  return (
    <Paper
      component="form"
      onSubmit={handleSubmit}
      sx={{
        p: "2px 4px",
        display: "flex",
        alignItems: "center",
        width: "100%",
        maxWidth: "600px",
        margin: "20px auto",
        mb: 4,
      }}
    >
      <InputBase
        sx={{ ml: 1, flex: 1 }}
        placeholder="Search for a movie..."
        inputProps={{ "aria-label": "search for a movie" }}
        value={query}
        onChange={handleInputChange}
      />
      <IconButton type="submit" sx={{ p: "10px" }} aria-label="search">
        <SearchIcon />
      </IconButton>
    </Paper>
  );
};

export default SearchBar;
