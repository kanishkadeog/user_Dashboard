import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";

export default function FilterPopup({ show, handleClose, applyFilter }) {
  const [filters, setFilters] = useState({
    firstName: "",
    lastName: "",
    email: "",
    department: "",
  });

  useEffect(() => {
    if (!show) {
      setFilters({ firstName: "", lastName: "", email: "", department: "" });
    }
  }, [show]);

  const onChange = (e) => setFilters({ ...filters, [e.target.name]: e.target.value });

  const onApply = () => {
    applyFilter(filters);
  };

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
        <Button variant="secondary" onClick={onClear}> Clear </Button>
        <Button variant="primary" onClick={() => { onApply(); handleClose(); }}> Apply </Button>
      </Modal.Footer>
    </Modal>
  );
}
