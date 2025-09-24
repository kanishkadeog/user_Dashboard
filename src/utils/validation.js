// Check if a value is not empty or only whitespace
export const isRequired = (value) => value && value.trim() !== "";

// Validate if a string is in proper email format
export const isEmailValid = (email) => {
  // Regular expression to match standard email pattern
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email); // Returns true if email is valid, false otherwise
};
