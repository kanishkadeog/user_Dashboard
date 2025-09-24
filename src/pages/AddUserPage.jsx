import React from "react";
import UserForm from "../components/UserForm";
import { addUser } from "../services/api";
import { useNavigate } from "react-router-dom";

const AddUserPage = () => {
  const navigate = useNavigate(); // Hook to programmatically navigate between pages

  // Handle form submission
  const handleSubmit = async (data) => {
    try {
      // Call API to add new user
      await addUser({ 
        name: `${data.firstName} ${data.lastName}`, 
        email: data.email, 
        department: data.department 
      });
      alert("User added successfully");
      navigate("/users"); // Navigate back to Users page after adding
    } catch {
      alert("Error adding user"); // Show error if API call fails
    }
  };

  return (
    <div className="card p-4 shadow-sm">
      <h4>Add User</h4>
      {/* Render form for adding user */}
      <UserForm onSubmit={handleSubmit} />
    </div>
  );
};

export default AddUserPage;
