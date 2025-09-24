import React from "react";
import { Table, Button } from "react-bootstrap";
import { FaSort, FaSortUp, FaSortDown } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const UserTable = ({ users, onDelete, onSort, sortField, sortOrder }) => {
  const navigate = useNavigate(); // Hook to navigate programmatically

  // Function to render appropriate sort icon for each column
  const renderSortIcon = (field) => {
    if (sortField !== field) return <FaSort />; // Default sort icon if not active
    return sortOrder === "asc" ? <FaSortUp /> : <FaSortDown />; // Show asc/desc icon
  };

  return (
    <Table striped bordered hover responsive>
      <thead className="table-dark">
        <tr>
          {/* Column headers with sorting */}
          <th onClick={() => onSort("id")} style={{ cursor: "pointer" }}>
            ID {renderSortIcon("id")}
          </th>
          <th onClick={() => onSort("firstName")} style={{ cursor: "pointer" }}>
            First Name {renderSortIcon("firstName")}
          </th>
          <th onClick={() => onSort("lastName")} style={{ cursor: "pointer" }}>
            Last Name {renderSortIcon("lastName")}
          </th>
          <th onClick={() => onSort("email")} style={{ cursor: "pointer" }}>
            Email {renderSortIcon("email")}
          </th>
          <th onClick={() => onSort("department")} style={{ cursor: "pointer" }}>
            Department {renderSortIcon("department")}
          </th>
          <th>Actions</th> {/* Column for Edit/Delete buttons */}
        </tr>
      </thead>
      <tbody>
        {users.map((u) => {
          const [firstName, lastName] = u.name.split(" "); // Split full name into first & last
          return (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>{firstName}</td>
              <td>{lastName || ""}</td>
              <td>{u.email}</td>
              <td>{u.department || ""}</td>
              <td>
                {/* Edit button navigates to Edit User page */}
                <Button
                  variant="primary"
                  size="sm"
                  className="me-2"
                  onClick={() => navigate(`/edit/${u.id}`)}
                >
                  Edit
                </Button>
                {/* Delete button calls onDelete prop */}
                <Button variant="danger" size="sm" onClick={() => onDelete(u.id)}>
                  Delete
                </Button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </Table>
  );
};

export default UserTable;
