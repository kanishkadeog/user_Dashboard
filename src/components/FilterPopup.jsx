import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";

// FilterPopup component to filter users by name, email, and department
const FilterPopup = ({ onApply, onClose }) => {
  // Local state for each filter input
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [department, setDepartment] = useState("");

  // Handle form submission and pass filter values to parent
  const handleSubmit = (e) => {
    e.preventDefault();
    onApply({ name, email, department });
  };

  return (
    <Modal show onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Filter Users</Modal.Title>
      </Modal.Header>

      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          {/* Filter by Name */}
          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Form.Group>

          {/* Filter by Email */}
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>

          {/* Filter by Department */}
          <Form.Group className="mb-3">
            <Form.Label>Department</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter department"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
            />
          </Form.Group>
        </Modal.Body>

        <Modal.Footer>
          {/* Close button */}
          <Button variant="secondary" onClick={onClose}>Close</Button>
          {/* Apply filter button */}
          <Button variant="primary" type="submit">Apply</Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default FilterPopup;

