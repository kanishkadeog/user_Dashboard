export const isRequired = (v) => v && v.toString().trim() !== "";
export const isEmailValid = (email) => {
  if (!email) return false;
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};
