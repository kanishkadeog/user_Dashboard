import React, { useEffect, useState } from "react";
import UserForm from "../components/UserForm";
import { updateUser, getUsers } from "../services/api";
import { useParams, useNavigate } from "react-router-dom";

const EditUserPage = () => {
  const { id } = useParams(); // Get user ID from URL
  const navigate = useNavigate(); // Navigation hook
  const [user, setUser] = useState(null); // State to store user data

  // Fetch user data when component mounts or id changes
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const users = await getUsers(); // Fetch all users
        const u = users.find((u) => u.id === Number(id)); // Find user by ID
        const [firstName, lastName] = u.name.split(" "); // Split full name into first and last
        setUser({ 
          firstName, 
          lastName, 
          email: u.email, 
          department: u.department || "IT" // Default department if missing
        });
      } catch {
        alert("Error fetching user");
      }
    };
    fetchUser();
  }, [id]);

  // Handle form submission
  const handleSubmit = async (data) => {
    try {
      // Update user data via API
      await updateUser(id, { 
        name: `${data.firstName} ${data.lastName}`, 
        email: data.email, 
        department: data.department 
      });
      alert("User updated successfully");
      navigate("/users"); // Navigate back to Users page
    } catch {
      alert("Error updating user");
    }
  };

  return user ? (
    <div className="card p-4 shadow-sm">
      <h4>Edit User</h4>
      {/* UserForm component pre-filled with user data */}
      <UserForm initialData={user} onSubmit={handleSubmit} />
    </div>
  ) : (
    <p>Loading...</p> // Show loading until user data is fetched
  );
};

export default EditUserPage;
