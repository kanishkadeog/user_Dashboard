import React from "react";
import { Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import UserForm from "../components/UserForm";
import { addUser } from "../services/api";

export default function AddUserPage() {
  const navigate = useNavigate(); // Hook to navigate programmatically

  // Handle form submission for adding a new user
  const handleSubmit = async (payload) => {
    try {
      const created = await addUser(payload); // Call API to create new user, returns created object with id
      // Navigate back to UsersPage and pass created user in location.state
      // so UsersPage can immediately update its UI
      navigate("/users", { state: { addedUser: created } });
    } catch {
      alert("Failed to add user"); // Show error if API call fails
    }
  };

  return (
    <Card className="p-3">
      <h4>Add User</h4>
      {/* Render form component for adding a user */}
      <UserForm onSubmit={handleSubmit} submitLabel="Add User" />
    </Card>
  );
}
