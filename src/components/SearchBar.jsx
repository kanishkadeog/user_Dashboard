import React from "react";

export default function SearchBar({ value, onChange }) {
  return (
    <input
      type="text"
      className="form-control mb-2"
      placeholder="Search by first name, last name, email or department..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}
