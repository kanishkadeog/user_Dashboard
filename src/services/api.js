import axios from "axios"; // Import Axios for HTTP requests

// Base URL for the mock backend API
const API_BASE_URL = "https://jsonplaceholder.typicode.com/users";

/**
 * Fetch all users from the API
 * @returns {Promise<Array>} List of users
 */
export const getUsers = async () => {
  try {
    const response = await axios.get(API_BASE_URL); // GET request to fetch users
    return response.data; // Return the data from response
  } catch (error) {
    throw error; // Throw error to handle in calling function
  }
};

/**
 * Add a new user
 * @param {Object} user - User data to add
 * @returns {Promise<Object>} Created user
 */
export const addUser = async (user) => {
  try {
    const response = await axios.post(API_BASE_URL, user); // POST request to add user
    return response.data; // Return the newly added user
  } catch (error) {
    throw error;
  }
};

/**
 * Update an existing user by ID
 * @param {number|string} id - User ID
 * @param {Object} user - Updated user data
 * @returns {Promise<Object>} Updated user
 */
export const updateUser = async (id, user) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/${id}`, user); // PUT request to update user
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Delete a user by ID
 * @param {number|string} id - User ID
 * @returns {Promise<Object>} Response from delete request
 */
export const deleteUser = async (id) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/${id}`); // DELETE request to remove user
    return response.data;
  } catch (error) {
    throw error;
  }
};
