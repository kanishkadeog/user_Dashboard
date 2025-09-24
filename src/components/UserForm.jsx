import React, { useState, useEffect } from "react";
import { isRequired, isEmailValid } from "../utils/validation";

const UserForm = ({ initialData, onSubmit }) => {
  // State for form fields
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    department: "",
  });

  // State for validation errors
  const [errors, setErrors] = useState({});

  // Populate form if initialData is provided (for editing a user)
  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Validate form fields
  const validate = () => {
    const errs = {};
    if (!isRequired(formData.firstName)) errs.firstName = "First Name is required";
    if (!isRequired(formData.lastName)) errs.lastName = "Last Name is required";
    if (!isRequired(formData.email)) errs.email = "Email is required";
    else if (!isEmailValid(formData.email)) errs.email = "Invalid email format";
    return errs;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent default form submit
    const errs = validate(); // Run validation
    if (Object.keys(errs).length > 0) {
      setErrors(errs); // Show errors if any
      return;
    }
    onSubmit(formData); // Call parent submit handler
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* First Name Input */}
      <div className="mb-2">
        <label>First Name</label>
        <input
          type="text"
          className={`form-control ${errors.firstName ? "is-invalid" : ""}`} // Add Bootstrap invalid class
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
        />
        <div className="invalid-feedback">{errors.firstName}</div>
      </div>

      {/* Last Name Input */}
      <div className="mb-2">
        <label>Last Name</label>
        <input
          type="text"
          className={`form-control ${errors.lastName ? "is-invalid" : ""}`}
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
        />
        <div className="invalid-feedback">{errors.lastName}</div>
      </div>

      {/* Email Input */}
      <div className="mb-2">
        <label>Email</label>
        <input
          type="email"
          className={`form-control ${errors.email ? "is-invalid" : ""}`}
          name="email"
          value={formData.email}
          onChange={handleChange}
        />
        <div className="invalid-feedback">{errors.email}</div>
      </div>

      {/* Department Input */}
      <div className="mb-2">
        <label>Department</label>
        <input
          type="text"
          className="form-control"
          name="department"
          value={formData.department}
          onChange={handleChange}
        />
      </div>

      {/* Submit Button */}
      <button type="submit" className="btn btn-success mt-2">
        Submit
      </button>
    </form>
  );
};

export default UserForm;
