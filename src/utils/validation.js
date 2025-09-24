// Function to check if a value is provided (not empty or only whitespace)
export const isRequired = (v) => v && v.toString().trim() !== "";

// Function to validate if a given string is a valid email format
export const isEmailValid = (email) => {
  if (!email) return false; // Return false if email is empty or undefined
  // Regular expression to match valid email format
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email); // Returns true if email matches the regex, else false
};
