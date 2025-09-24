import React from "react";

// SearchBar component for filtering users by name, email, or department
const SearchBar = ({ searchQuery, setSearchQuery }) => {
  return (
    <input
      type="text"
      className="form-control mb-2" // Bootstrap styling
      placeholder="Search by Name, Email, Department" // Placeholder text
      value={searchQuery} // Controlled input value
      onChange={(e) => setSearchQuery(e.target.value)} // Update parent state on change
    />
  );
};

export default SearchBar;
