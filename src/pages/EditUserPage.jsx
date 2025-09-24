import React, { useEffect, useState } from "react";
import { Card } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import UserForm from "../components/UserForm";
import { getUsers, updateUser } from "../services/api";

export default function EditUserPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [initial, setInitial] = useState(null);

  useEffect(() => {
    const fetchOne = async () => {
      try {
        const all = await getUsers();
        const found = all.find((u) => Number(u.id) === Number(id));
        if (!found) {
          alert("User not found");
          navigate("/users");
          return;
        }
        setInitial({
          ...found,
          department: found.company?.name || "",
          firstName: found.name.split(" ")[0],
          lastName: found.name.split(" ").slice(1).join(" "),
        });
      } catch {
        alert("Error fetching user");
        navigate("/users");
      }
    };
    fetchOne();
  }, [id]); // eslint-disable-line

  const handleSubmit = async (payload) => {
    try {
      const updated = await updateUser(id, payload);
      navigate("/users", { state: { updatedUser: updated } });
    } catch {
      alert("Failed to update user");
    }
  };

  return (
    <Card className="p-3">
      <h4>Edit User</h4>
      {initial ? (
        <UserForm initialData={initial} onSubmit={handleSubmit} submitLabel="Update User" />
      ) : (
        <div>Loading...</div>
      )}
    </Card>
  );
}
