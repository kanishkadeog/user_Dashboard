import React from "react";
import { FaSort, FaSortUp, FaSortDown, FaEdit, FaTrash } from "react-icons/fa"; // Import icons for sorting and actions
import { Button } from "react-bootstrap";

export default function UserTable({ users = [], onEdit, onDelete, onSort, sortConfig }) {
  // Function to render sort icon for a column based on current sort state
  const renderSortIcon = (field) => {
    if (sortConfig.key !== field) 
      return <FaSort style={{ marginLeft: 6, opacity: 0.4 }} />; // Default sort icon
    return sortConfig.direction === "asc" 
      ? <FaSortUp style={{ marginLeft: 6 }} /> // Ascending sort icon
      : <FaSortDown style={{ marginLeft: 6 }} />; // Descending sort icon
  };

  return (
    <div className="table-responsive">
      <table className="table table-hover align-middle">
        <thead className="table-dark">
          <tr>
            {/* Column headers with clickable sorting */}
            <th style={{ cursor: "pointer" }} onClick={() => onSort("id")}>
              ID {renderSortIcon("id")}
            </th>
            <th style={{ cursor: "pointer" }} onClick={() => onSort("firstName")}>
              First Name {renderSortIcon("firstName")}
            </th>
            <th style={{ cursor: "pointer" }} onClick={() => onSort("lastName")}>
              Last Name {renderSortIcon("lastName")}
            </th>
            <th style={{ cursor: "pointer" }} onClick={() => onSort("email")}>
              Email {renderSortIcon("email")}
            </th>
            <th style={{ cursor: "pointer" }} onClick={() => onSort("department")}>
              Department {renderSortIcon("department")}
            </th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {/* Render table rows for each user */}
          {users.map((u) => (
            <tr key={u.id}>
              <td>{u.id}</td>
              {/* Fallback to split name if firstName/lastName not available */}
              <td>{u.firstName ?? (u.name ? u.name.split(" ")[0] : "")}</td>
              <td>{u.lastName ?? (u.name ? u.name.split(" ").slice(1).join(" ") : "")}</td>
              <td>{u.email}</td>
              <td>{u.department ?? u.company?.name ?? "N/A"}</td>
              <td>
                {/* Edit button triggers onEdit callback with user id */}
                <Button size="sm" variant="outline-primary" className="me-2" onClick={() => onEdit(u.id)}>
                  <FaEdit /> Edit
                </Button>
                {/* Delete button triggers onDelete callback with user id */}
                <Button size="sm" variant="outline-danger" onClick={() => onDelete(u.id)}>
                  <FaTrash /> Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
