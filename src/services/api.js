import axios from "axios";

// Create an Axios instance with default configuration
const api = axios.create({
  baseURL: "https://jsonplaceholder.typicode.com", // Base URL for all API requests
  timeout: 10000, // Timeout after 10 seconds
});

// Function to fetch all users
export const getUsers = async () => {
  const res = await api.get("/users"); // Send GET request to /users endpoint
  return res.data; // Return the response data (list of users)
};

// Function to add a new user
export const addUser = async (user) => {
  const res = await api.post("/users", user); // Send POST request with user data
  return res.data; // Return the newly created user data
};

// Function to update an existing user by ID
export const updateUser = async (id, user) => {
  const res = await api.put(`/users/${id}`, user); // Send PUT request with updated user data
  return res.data; // Return the updated user data
};

// Function to delete a user by ID
export const deleteUser = async (id) => {
  const res = await api.delete(`/users/${id}`); // Send DELETE request to remove the user
  return res.data; // Return the response data (usually an empty object)
};
