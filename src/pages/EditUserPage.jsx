import React, { useEffect, useState } from "react";
import { Card } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import UserForm from "../components/UserForm";
import { getUsers, updateUser } from "../services/api";

export default function EditUserPage() {
  const { id } = useParams(); // Extract user ID from URL parameters
  const navigate = useNavigate(); // Hook to navigate programmatically
  const [initial, setInitial] = useState(null); // State to store initial user data for form

  // Fetch user data when component mounts
  useEffect(() => {
    const fetchOne = async () => {
      try {
        const all = await getUsers(); // Fetch all users
        const found = all.find((u) => Number(u.id) === Number(id)); // Find user with matching ID
        if (!found) {
          alert("User not found"); // Show alert if user not found
          navigate("/users"); // Redirect to users page
          return;
        }
        // Prepare initial form data with firstName, lastName, department
        setInitial({
          ...found,
          department: found.company?.name || "",
          firstName: found.name.split(" ")[0],
          lastName: found.name.split(" ").slice(1).join(" "),
        });
      } catch {
        alert("Error fetching user"); // Show alert if API call fails
        navigate("/users"); // Redirect to users page
      }
    };
    fetchOne();
  }, [id]); // Re-run effect if ID changes

  // Handle form submission for updating user
  const handleSubmit = async (payload) => {
    try {
      const updated = await updateUser(id, payload); // Call API to update user
      // Navigate back to users page and pass updated user in state for UI refresh
      navigate("/users", { state: { updatedUser: updated } });
    } catch {
      alert("Failed to update user"); // Show error if update fails
    }
  };

  return (
    <Card className="p-3">
      <h4>Edit User</h4>
      {initial ? (
        // Render form when initial data is ready
        <UserForm 
          initialData={initial} 
          onSubmit={handleSubmit} 
          submitLabel="Update User" 
        />
      ) : (
        // Show loading indicator while fetching data
        <div>Loading...</div>
      )}
    </Card>
  );
}
