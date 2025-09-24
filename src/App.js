import React from "react";
import { Routes, Route, Navigate } from "react-router-dom"; // Importing routing components from react-router-dom
import UsersPage from "./pages/UsersPage"; // Component to display list of users
import AddUserPage from "./pages/AddUserPage"; // Component to add a new user
import EditUserPage from "./pages/EditUserPage"; // Component to edit an existing user

// Main App component
function App() {
  return (
    <div className="container my-4">
      {/* Heading of the dashboard */}
      <h2 className="text-center mb-4">User Management Dashboard</h2>

      {/* Define routes for the application */}
      <Routes>
        {/* Default route: redirect "/" to "/users" */}
        <Route path="/" element={<Navigate to="/users" replace />} />

        {/* Route to display all users */}
        <Route path="/users" element={<UsersPage />} />

        {/* Route to add a new user */}
        <Route path="/users/add" element={<AddUserPage />} />

        {/* Route to edit an existing user by ID */}
        <Route path="/users/edit/:id" element={<EditUserPage />} />
      </Routes>
    </div>
  );
}

// Export App component as default
export default App;
