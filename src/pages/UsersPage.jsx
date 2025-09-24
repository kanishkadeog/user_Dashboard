import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import UserTable from "../components/UserTable";
import { getUsers, deleteUser } from "../services/api";
import { useNavigate } from "react-router-dom";
import FilterPopup from "../components/FilterPopup";

const UsersPage = () => {
  // State to store all users fetched from API
  const [users, setUsers] = useState([]);
  // State to store filtered/search results
  const [filteredUsers, setFilteredUsers] = useState([]);
  // State for search input value
  const [searchQuery, setSearchQuery] = useState("");
  // State to toggle filter popup
  const [showFilter, setShowFilter] = useState(false);
  // State to track sorting key and direction
  const [sortConfig, setSortConfig] = useState({ key: "id", direction: "asc" });

  const navigate = useNavigate();

  // Fetch users when component mounts
  useEffect(() => {
    fetchUsers();
  }, []);

  // Function to fetch users from API
  const fetchUsers = async () => {
    try {
      const data = await getUsers();
      // Enrich data: use company.name as department
      const enrichedData = data.map((user) => ({
        ...user,
        department: user.company?.name || "N/A",
      }));
      setUsers(enrichedData);
      setFilteredUsers(enrichedData);
    } catch {
      alert("Error fetching users");
    }
  };

  // Delete user by ID
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure to delete this user?")) {
      try {
        await deleteUser(id);
        // Remove deleted user from state
        const updatedUsers = users.filter((u) => u.id !== id);
        setUsers(updatedUsers);
        setFilteredUsers(updatedUsers);
      } catch {
        alert("Error deleting user");
      }
    }
  };

  // Handle search input
  const handleSearch = (query) => {
    setSearchQuery(query);
    const filtered = users.filter((user) => {
      return (
        user.name.toLowerCase().includes(query.toLowerCase()) ||
        user.email.toLowerCase().includes(query.toLowerCase()) ||
        user.department.toLowerCase().includes(query.toLowerCase())
      );
    });
    setFilteredUsers(filtered);
  };

  // Apply filter from FilterPopup
  const handleFilter = (filters) => {
    const filtered = users.filter((user) => {
      return (
        (!filters.name || user.name.toLowerCase().includes(filters.name.toLowerCase())) &&
        (!filters.email || user.email.toLowerCase().includes(filters.email.toLowerCase())) &&
        (!filters.department || user.department.toLowerCase().includes(filters.department.toLowerCase()))
      );
    });
    setFilteredUsers(filtered || []);
    setShowFilter(false); // Close filter popup
  };

  // Clear filters and show all users
  const handleClearFilter = () => {
    setFilteredUsers(users);
  };

  // Handle sorting by column
  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") direction = "desc";
    setSortConfig({ key, direction });
  };

  // Sort users based on sortConfig
  const sortedUsers = [...filteredUsers].sort((a, b) => {
    const { key, direction } = sortConfig;
    let compareA = a[key];
    let compareB = b[key];
    if (key === "id") {
      compareA = Number(compareA);
      compareB = Number(compareB);
    } else {
      compareA = compareA.toLowerCase();
      compareB = compareB.toLowerCase();
    }
    if (compareA < compareB) return direction === "asc" ? -1 : 1;
    if (compareA > compareB) return direction === "asc" ? 1 : -1;
    return 0;
  });

  return (
    <Container className="mt-4">
      <Row className="mb-3">
        
        <Col className="text-end">
          {/* Button to navigate to Add User page */}
          <Button variant="primary" onClick={() => navigate("/add")}>Add User</Button>{" "}
          {/* Toggle filter popup */}
          <Button variant="secondary" onClick={() => setShowFilter(!showFilter)}>Filter</Button>{" "}
          {/* Clear applied filters */}
          <Button variant="outline-secondary" onClick={handleClearFilter}>Clear Filter</Button>
        </Col>
      </Row>

      {/* Show FilterPopup if toggled */}
      {showFilter && <FilterPopup onApply={handleFilter} onClose={() => setShowFilter(false)} />}

      
      {/* UserTable component to display users */}
  {sortedUsers.length === 0 ? (
  <div className="text-center p-3">
        <h4 className="text-center mb-4 text-danger">No users found</h4>

  </div>
) : (
  <UserTable
    users={sortedUsers}
    onDelete={handleDelete}
    onEdit={(id) => navigate(`/edit/${id}`)}
    onSearch={handleSearch}
    onSort={handleSort}
    sortConfig={sortConfig}
  />
)}

      {/* <UserTable
        users={sortedUsers}
        onDelete={handleDelete}
        onEdit={(id) => navigate(`/edit/${id}`)}
        onSearch={handleSearch}
        onSort={handleSort}
        sortConfig={sortConfig}
      /> */}
    
    </Container>
  );
};

export default UsersPage;
