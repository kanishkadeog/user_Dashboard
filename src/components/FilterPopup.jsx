import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";

// FilterPopup component to filter users based on multiple fields
// Props:
// - show: boolean to control modal visibility
// - handleClose: function to close modal
// - applyFilter: function to apply filter with current input values
export default function FilterPopup({ show, handleClose, applyFilter }) {
  // State to hold filter input values
  const [filters, setFilters] = useState({
    firstName: "",
    lastName: "",
    email: "",
    department: "",
  });

  // Reset filters when modal is closed
  useEffect(() => {
    if (!show) {
      setFilters({ firstName: "", lastName: "", email: "", department: "" });
    }
  }, [show]);

  // Handle input changes
  const onChange = (e) => setFilters({ ...filters, [e.target.name]: e.target.value });

  // Apply current filters
  const onApply = () => {
    applyFilter(filters);
  };

  // Clear filters and close modal
  const onClear = () => {
    setFilters({ firstName: "", lastName: "", email: "", department: "" });
    applyFilter({ firstName: "", lastName: "", email: "", department: "" });
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Filter Users</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          {/* Input fields for filters */}
          <Form.Group className="mb-2">
            <Form.Label>First Name</Form.Label>
            <Form.Control name="firstName" value={filters.firstName} onChange={onChange} />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Last Name</Form.Label>
            <Form.Control name="lastName" value={filters.lastName} onChange={onChange} />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Email</Form.Label>
            <Form.Control name="email" value={filters.email} onChange={onChange} />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Department</Form.Label>
            <Form.Control name="department" value={filters.department} onChange={onChange} />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        {/* Buttons to clear filters or apply them */}
        <Button variant="secondary" onClick={onClear}> Clear </Button>
        <Button variant="primary" onClick={() => { onApply(); handleClose(); }}> Apply </Button>
      </Modal.Footer>
    </Modal>
  );
}
