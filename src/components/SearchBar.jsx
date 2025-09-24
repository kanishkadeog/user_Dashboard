import React from "react";

// SearchBar component for live searching/filtering users
// Props:
// - value: current search input value
// - onChange: callback function to notify parent of input changes
export default function SearchBar({ value, onChange }) {
  return (
    <input
      type="text"
      className="form-control mb-2" // Bootstrap styling
      placeholder="Search by first name, last name, email or department..." // User-friendly placeholder
      value={value} // Controlled input value
      onChange={(e) => onChange(e.target.value)} // Call parent callback on change
    />
  );
}
