import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"; // Import routing components
import UsersPage from "./pages/UsersPage"; // Page to display all users
import AddUserPage from "./pages/AddUserPage"; // Page to add a new user
import EditUserPage from "./pages/EditUserPage"; // Page to edit an existing user

function App() {
  return (
    // Main app container
    // <Router> {/* Uncomment if BrowserRouter not wrapped in index.js */}
      <div className="container my-4">
        {/* App title */}
        <h2 className="text-center mb-4">User Management Dashboard</h2>

        {/* Define routes for the app */}
        <Routes>
          {/* Redirect root path to /users */}
          <Route path="/" element={<Navigate to="/users" />} />

          {/* Display all users */}
          <Route path="/users" element={<UsersPage />} />

          {/* Add a new user */}
          <Route path="/add" element={<AddUserPage />} />

          {/* Edit user by ID */}
          <Route path="/edit/:id" element={<EditUserPage />} />
        </Routes>
      </div>
    // </Router>
  );
}

export default App; // Export App component as default
