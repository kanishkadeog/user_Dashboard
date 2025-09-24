import React, { useEffect, useState } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import UserTable from "../components/UserTable";
import Pagination from "../components/Pagination";
import SearchBar from "../components/SearchBar";
import FilterPopup from "../components/FilterPopup";
import { getUsers, deleteUser } from "../services/api";

export default function UsersPage() {
  // State to hold the master list of users
  const [users, setUsers] = useState([]);
  // State to hold users after search/filter applied
  const [filteredUsers, setFilteredUsers] = useState([]);
  // State for search query
  const [searchQuery, setSearchQuery] = useState("");
  // State to control filter popup visibility
  const [showFilter, setShowFilter] = useState(false);

  // State to store current sorting configuration
  const [sortConfig, setSortConfig] = useState({ key: "id", direction: "asc" });

  // Pagination states
  const [pageLimit, setPageLimit] = useState(10); // rows per page
  const [currentPage, setCurrentPage] = useState(1);

  const navigate = useNavigate();
  const location = useLocation();

  // Fetch users when component mounts
  useEffect(() => {
    fetchUsers();
  }, []);

  // Update UI if coming from Add/Edit pages with state
  useEffect(() => {
    if (location.state) {
      const { addedUser, updatedUser } = location.state;
      if (addedUser) {
        const enriched = enrichSingleUser(addedUser);
        setUsers((prev) => [enriched, ...prev]);
        setFilteredUsers((prev) => [enriched, ...prev]);
        // Clear navigation state after processing
        navigate(location.pathname, { replace: true, state: null });
      } else if (updatedUser) {
        const enriched = enrichSingleUser(updatedUser);
        // Update user in master and filtered lists
        setUsers((prev) => prev.map((u) => (u.id === enriched.id ? enriched : u)));
        setFilteredUsers((prev) => prev.map((u) => (u.id === enriched.id ? enriched : u)));
        navigate(location.pathname, { replace: true, state: null });
      }
    }
  }, [location.state]); // eslint-disable-line

  // Helper to enrich user object with firstName, lastName, department
  const enrichSingleUser = (user) => {
    const [firstName, ...rest] = (user.name || "").split(" ");
    return {
      ...user,
      firstName,
      lastName: rest.join(" "),
      department: user.company?.name || user.department || "N/A",
    };
  };

  // Fetch users from API and enrich data
  const fetchUsers = async () => {
    try {
      const data = await getUsers();
      const enriched = data.map((user) => {
        const [firstName, ...rest] = (user.name || "").split(" ");
        return {
          ...user,
          firstName,
          lastName: rest.join(" "),
          department: user.company?.name || "N/A",
        };
      });
      setUsers(enriched);
      setFilteredUsers(enriched);
    } catch (err) {
      alert("Error fetching users"); // show error alert if fetch fails
    }
  };

  // Delete a user
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure to delete this user?")) return; // confirm before deletion
    try {
      await deleteUser(id); // call API to delete
      const updated = users.filter((u) => u.id !== id); // remove from state
      setUsers(updated);
      setFilteredUsers(updated);
    } catch {
      alert("Error deleting user");
    }
  };

  // Handle search input
  const handleSearch = (query) => {
    setSearchQuery(query);
    const q = query.trim().toLowerCase();
    if (!q) {
      setFilteredUsers(users);
      setCurrentPage(1);
      return;
    }
    const filtered = users.filter((u) => {
      return (
        (u.firstName || "").toLowerCase().includes(q) ||
        (u.lastName || "").toLowerCase().includes(q) ||
        (u.email || "").toLowerCase().includes(q) ||
        (u.department || "").toLowerCase().includes(q)
      );
    });
    setFilteredUsers(filtered);
    setCurrentPage(1); // reset to first page after search
  };

  // Apply advanced filters from FilterPopup
  const handleFilter = (filters) => {
    const filtered = users.filter((u) => {
      return (
        (!filters.firstName || (u.firstName || "").toLowerCase().includes(filters.firstName.toLowerCase())) &&
        (!filters.lastName || (u.lastName || "").toLowerCase().includes(filters.lastName.toLowerCase())) &&
        (!filters.email || (u.email || "").toLowerCase().includes(filters.email.toLowerCase())) &&
        (!filters.department || (u.department || "").toLowerCase().includes(filters.department.toLowerCase()))
      );
    });
    setFilteredUsers(filtered);
    setCurrentPage(1); // reset to first page after filtering
  };

  // Clear search and filter
  const handleClearFilter = () => {
    setFilteredUsers(users);
    setSearchQuery("");
    setCurrentPage(1);
  };

  // Handle sorting when column header clicked
  const handleSort = (key) => {
    let dir = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") dir = "desc";
    setSortConfig({ key, direction: dir });
  };

  // Sort filtered users based on sortConfig
  const sortedUsers = [...filteredUsers].sort((a, b) => {
    const { key, direction } = sortConfig;
    let A = (key === "firstName" || key === "lastName") ? (a[key] || "") : (key === "id" ? Number(a[key]) : (a[key] || ""));
    let B = (key === "firstName" || key === "lastName") ? (b[key] || "") : (key === "id" ? Number(b[key]) : (b[key] || ""));

    if (key !== "id") {
      A = String(A).toLowerCase();
      B = String(B).toLowerCase();
    }

    if (A < B) return direction === "asc" ? -1 : 1;
    if (A > B) return direction === "asc" ? 1 : -1;
    return 0;
  });

  // Pagination calculations
  const total = sortedUsers.length;
  const totalPages = Math.max(1, Math.ceil(total / pageLimit));
  const displayed = sortedUsers.slice((currentPage - 1) * pageLimit, currentPage * pageLimit);

  // Reset to first page if pageLimit changes
  useEffect(() => setCurrentPage(1), [pageLimit]);

  return (
    <Container className="mt-3">
      {/* Top controls: search, add, filter, clear */}
      <Row className="mb-2 align-items-center">
        <Col md={4}></Col>
        <Col md={4}>
          <SearchBar value={searchQuery} onChange={handleSearch} />
        </Col>
        <Col md={4} className="text-end">
          <Button className="me-2" variant="success" onClick={() => navigate("/users/add")}>Add</Button>
          <Button className="me-2" variant="info" onClick={() => setShowFilter(true)}>Filter</Button>
          <Button variant="outline-secondary" onClick={handleClearFilter}>Clear</Button>
        </Col>
      </Row>

      {/* Show filter popup if active */}
      {showFilter && <FilterPopup show={showFilter} handleClose={() => setShowFilter(false)} applyFilter={handleFilter} />}

     
      {/* Show table or empty message */}
      {displayed.length === 0 ? (
        <div className="text-center p-4">
          <h5 className="text-danger">No users found</h5>
        </div>
      ) : (
        <>
          <UserTable 
            users={displayed} 
            onEdit={(id) => navigate(`/users/edit/${id}`)} 
            onDelete={handleDelete} 
            onSort={handleSort} 
            sortConfig={sortConfig} 
          />
          <Pagination 
            total={total} 
            pageLimit={pageLimit} 
            currentPage={currentPage} 
            setCurrentPage={setCurrentPage} 
          />
        </>
      )}

       {/* Pagination controls and info */}
      <Row className="mb-2">
        <Col md={6}>
          <div>
            Showing <strong>{displayed.length}</strong> of <strong>{total}</strong> users
          </div>
        </Col>
        <Col md={6} className="text-end">
          <label className="me-2">Rows:</label>
          <select value={pageLimit} onChange={(e) => setPageLimit(Number(e.target.value))} className="form-select d-inline-block w-auto">
            {[10,25,50,100].map(n => <option key={n} value={n}>{n}</option>)}
          </select>
        </Col>
      </Row>


    </Container>
  );
}
