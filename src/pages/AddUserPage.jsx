import React from "react";
import { Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import UserForm from "../components/UserForm";
import { addUser } from "../services/api";

export default function AddUserPage() {
  const navigate = useNavigate();

  const handleSubmit = async (payload) => {
    try {
      const created = await addUser(payload); // JSONPlaceholder will return created object with id
      // pass created object back to UsersPage via location.state
      navigate("/users", { state: { addedUser: created } });
    } catch {
      alert("Failed to add user");
    }
  };

  return (
    <Card className="p-3">
      <h4>Add User</h4>
      <UserForm onSubmit={handleSubmit} submitLabel="Add User" />
    </Card>
  );
}
