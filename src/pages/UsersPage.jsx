import React, { useEffect, useState } from "react";
import { Container, Row, Col, Button, Form } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import UserTable from "../components/UserTable";
import Pagination from "../components/Pagination";
import SearchBar from "../components/SearchBar";
import FilterPopup from "../components/FilterPopup";
import { getUsers, deleteUser } from "../services/api";

export default function UsersPage() {
  const [users, setUsers] = useState([]); // master list
  const [filteredUsers, setFilteredUsers] = useState([]); // after search/filter
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilter, setShowFilter] = useState(false);

  // sorting
  const [sortConfig, setSortConfig] = useState({ key: "id", direction: "asc" });

  // pagination
  const [pageLimit, setPageLimit] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const navigate = useNavigate();
  const location = useLocation();

  // fetch & enrich users
  useEffect(() => {
    fetchUsers();
  }, []);

  // handle incoming state from Add/Edit pages (so UI updates immediately)
  useEffect(() => {
    if (location.state) {
      const { addedUser, updatedUser } = location.state;
      if (addedUser) {
        const enriched = enrichSingleUser(addedUser);
        setUsers((prev) => [enriched, ...prev]);
        setFilteredUsers((prev) => [enriched, ...prev]);
        // clear navigation state
        navigate(location.pathname, { replace: true, state: null });
      } else if (updatedUser) {
        const enriched = enrichSingleUser(updatedUser);
        setUsers((prev) => prev.map((u) => (u.id === enriched.id ? enriched : u)));
        setFilteredUsers((prev) => prev.map((u) => (u.id === enriched.id ? enriched : u)));
        navigate(location.pathname, { replace: true, state: null });
      }
    }
  }, [location.state]); // eslint-disable-line

  const enrichSingleUser = (user) => {
    const [firstName, ...rest] = (user.name || "").split(" ");
    return {
      ...user,
      firstName,
      lastName: rest.join(" "),
      department: user.company?.name || user.department || "N/A",
    };
  };

  const fetchUsers = async () => {
    try {
      const data = await getUsers();
      // enrich each user with firstName, lastName, department
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
      alert("Error fetching users");
    }
  };

  // delete
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure to delete this user?")) return;
    try {
      await deleteUser(id); // JSONPlaceholder simulates deletion
      const updated = users.filter((u) => u.id !== id);
      setUsers(updated);
      setFilteredUsers(updated);
    } catch {
      alert("Error deleting user");
    }
  };

  // search
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
    setCurrentPage(1);
  };

  // filter
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
    setCurrentPage(1);
  };

  const handleClearFilter = () => {
    setFilteredUsers(users);
    setSearchQuery("");
    setCurrentPage(1);
  };

  // sorting
  const handleSort = (key) => {
    let dir = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") dir = "desc";
    setSortConfig({ key, direction: dir });
  };

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

  // Pagination controls
  const total = sortedUsers.length;
  const totalPages = Math.max(1, Math.ceil(total / pageLimit));
  const displayed = sortedUsers.slice((currentPage - 1) * pageLimit, currentPage * pageLimit);

  // When pageLimit changes, reset to page 1
  useEffect(() => setCurrentPage(1), [pageLimit]);

  return (
    <Container className="mt-3">
      <Row className="mb-2 align-items-center">
        <Col md={4}>
        </Col>

        <Col md={4}>
          <SearchBar value={searchQuery} onChange={handleSearch} />
        </Col>

        <Col md={4} className="text-end">
          <Button className="me-2" variant="success" onClick={() => navigate("/users/add")}>Add</Button>
          <Button className="me-2" variant="info" onClick={() => setShowFilter(true)}>Filter</Button>
          <Button variant="outline-secondary" onClick={handleClearFilter}>Clear</Button>
        </Col>
      </Row>

      {showFilter && <FilterPopup show={showFilter} handleClose={() => setShowFilter(false)} applyFilter={handleFilter} />}

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

      {displayed.length === 0 ? (
        <div className="text-center p-4">
          <h5 className="text-danger">No users found</h5>
        </div>
      ) : (
        <>
          <UserTable users={displayed} onEdit={(id) => navigate(`/users/edit/${id}`)} onDelete={handleDelete} onSort={handleSort} sortConfig={sortConfig} />
          <Pagination total={total} pageLimit={pageLimit} currentPage={currentPage} setCurrentPage={setCurrentPage} />
        </>
      )}
    </Container>
  );
}




//==========================

// import React, { useState, useEffect } from "react";
// import { Container, Row, Col, Button } from "react-bootstrap";
// import UserTable from "../components/UserTable";
// import { getUsers, deleteUser } from "../services/api";
// import { useNavigate } from "react-router-dom";
// import FilterPopup from "../components/FilterPopup";

// const UsersPage = () => {
//   // State to store all users fetched from API
//   const [users, setUsers] = useState([]);
//   // State to store filtered/search results
//   const [filteredUsers, setFilteredUsers] = useState([]);
//   // State for search input value
//   const [searchQuery, setSearchQuery] = useState("");
//   // State to toggle filter popup
//   const [showFilter, setShowFilter] = useState(false);
//   // State to track sorting key and direction
//   const [sortConfig, setSortConfig] = useState({ key: "id", direction: "asc" });

//   const navigate = useNavigate();

//   // Fetch users when component mounts
//   useEffect(() => {
//     fetchUsers();
//   }, []);

//   // Function to fetch users from API
//   const fetchUsers = async () => {
//     try {
//       const data = await getUsers();
//       // Enrich data: use company.name as department
//       const enrichedData = data.map((user) => ({
//         ...user,
//         department: user.company?.name || "N/A",
//       }));
//       setUsers(enrichedData);
//       setFilteredUsers(enrichedData);
//     } catch {
//       alert("Error fetching users");
//     }
//   };

//   // Delete user by ID
//   const handleDelete = async (id) => {
//     if (window.confirm("Are you sure to delete this user?")) {
//       try {
//         await deleteUser(id);
//         // Remove deleted user from state
//         const updatedUsers = users.filter((u) => u.id !== id);
//         setUsers(updatedUsers);
//         setFilteredUsers(updatedUsers);
//       } catch {
//         alert("Error deleting user");
//       }
//     }
//   };

//   // Handle search input
//   const handleSearch = (query) => {
//     setSearchQuery(query);
//     const filtered = users.filter((user) => {
//       return (
//         user.name.toLowerCase().includes(query.toLowerCase()) ||
//         user.email.toLowerCase().includes(query.toLowerCase()) ||
//         user.department.toLowerCase().includes(query.toLowerCase())
//       );
//     });
//     setFilteredUsers(filtered);
//   };

//   // Apply filter from FilterPopup
//   const handleFilter = (filters) => {
//     const filtered = users.filter((user) => {
//       return (
//         (!filters.name || user.name.toLowerCase().includes(filters.name.toLowerCase())) &&
//         (!filters.email || user.email.toLowerCase().includes(filters.email.toLowerCase())) &&
//         (!filters.department || user.department.toLowerCase().includes(filters.department.toLowerCase()))
//       );
//     });
//     setFilteredUsers(filtered || []);
//     setShowFilter(false); // Close filter popup
//   };

//   // Clear filters and show all users
//   const handleClearFilter = () => {
//     setFilteredUsers(users);
//   };

//   // Handle sorting by column
//   const handleSort = (key) => {
//     let direction = "asc";
//     if (sortConfig.key === key && sortConfig.direction === "asc") direction = "desc";
//     setSortConfig({ key, direction });
//   };

//   // Sort users based on sortConfig
//   const sortedUsers = [...filteredUsers].sort((a, b) => {
//     const { key, direction } = sortConfig;
//     let compareA = a[key];
//     let compareB = b[key];
//     if (key === "id") {
//       compareA = Number(compareA);
//       compareB = Number(compareB);
//     } else {
//       compareA = compareA.toLowerCase();
//       compareB = compareB.toLowerCase();
//     }
//     if (compareA < compareB) return direction === "asc" ? -1 : 1;
//     if (compareA > compareB) return direction === "asc" ? 1 : -1;
//     return 0;
//   });

//   return (
//     <Container className="mt-4">
//       <Row className="mb-3">
        
//         <Col className="text-end">
//           {/* Button to navigate to Add User page */}
//           <Button variant="primary" onClick={() => navigate("/add")}>Add User</Button>{" "}
//           {/* Toggle filter popup */}
//           <Button variant="secondary" onClick={() => setShowFilter(!showFilter)}>Filter</Button>{" "}
//           {/* Clear applied filters */}
//           <Button variant="outline-secondary" onClick={handleClearFilter}>Clear Filter</Button>
//         </Col>
//       </Row>

//       {/* Show FilterPopup if toggled */}
//       {showFilter && <FilterPopup onApply={handleFilter} onClose={() => setShowFilter(false)} />}

      
//       {/* UserTable component to display users */}
//   {sortedUsers.length === 0 ? (
//   <div className="text-center p-3">
//         <h4 className="text-center mb-4 text-danger">No users found</h4>

//   </div>
// ) : (
//   <UserTable
//     users={sortedUsers}
//     onDelete={handleDelete}
//     onEdit={(id) => navigate(`/edit/${id}`)}
//     onSearch={handleSearch}
//     onSort={handleSort}
//     sortConfig={sortConfig}
//   />
// )}

//       {/* <UserTable
//         users={sortedUsers}
//         onDelete={handleDelete}
//         onEdit={(id) => navigate(`/edit/${id}`)}
//         onSearch={handleSearch}
//         onSort={handleSort}
//         sortConfig={sortConfig}
//       /> */}
    
//     </Container>
//   );
// };

// export default UsersPage;
