import React, { useState, useEffect } from "react";
import { isRequired, isEmailValid } from "../utils/validation"; // Import validation helpers

export default function UserForm({ initialData = null, onSubmit, submitLabel = "Submit" }) {
  // Form state to hold input values
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    department: "",
  });
  // State to hold validation errors
  const [errors, setErrors] = useState({});

  // Populate form with initialData if provided (for edit scenario)
  useEffect(() => {
    if (initialData) {
      setForm({
        firstName: initialData.firstName || (initialData.name ? initialData.name.split(" ")[0] : ""),
        lastName: initialData.lastName || (initialData.name ? initialData.name.split(" ").slice(1).join(" ") : ""),
        email: initialData.email || "",
        department: initialData.department || initialData.company?.name || "",
      });
    }
  }, [initialData]);

  // Handle input changes and update form state
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  // Validate form fields
  const validate = () => {
    const errs = {};
    if (!isRequired(form.firstName)) errs.firstName = "First name required";
    if (!isRequired(form.lastName)) errs.lastName = "Last name required";
    if (!isRequired(form.email)) errs.email = "Email required";
    else if (!isEmailValid(form.email)) errs.email = "Invalid email";
    return errs;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate(); // Perform validation
    setErrors(errs); // Update errors state
    if (Object.keys(errs).length > 0) return; // Stop submission if errors exist

    // Prepare payload in shape compatible with API & UI
    const payload = {
      name: `${form.firstName} ${form.lastName}`.trim(), // Concatenate first and last name
      email: form.email,
      company: { name: form.department }, // Wrap department in company object
    };

    onSubmit(payload); // Call onSubmit prop with prepared data
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* First Name Field */}
      <div className="mb-2">
        <label>First Name</label>
        <input
          name="firstName"
          value={form.firstName}
          onChange={handleChange}
          className={`form-control ${errors.firstName ? "is-invalid" : ""}`} // Show invalid style if error
        />
        <div className="invalid-feedback">{errors.firstName}</div>
      </div>

      {/* Last Name Field */}
      <div className="mb-2">
        <label>Last Name</label>
        <input
          name="lastName"
          value={form.lastName}
          onChange={handleChange}
          className={`form-control ${errors.lastName ? "is-invalid" : ""}`}
        />
        <div className="invalid-feedback">{errors.lastName}</div>
      </div>

      {/* Email Field */}
      <div className="mb-2">
        <label>Email</label>
        <input
          name="email"
          value={form.email}
          onChange={handleChange}
          className={`form-control ${errors.email ? "is-invalid" : ""}`}
        />
        <div className="invalid-feedback">{errors.email}</div>
      </div>

      {/* Department Field */}
      <div className="mb-2">
        <label>Department</label>
        <input
          name="department"
          value={form.department}
          onChange={handleChange}
          className="form-control"
        />
      </div>

      {/* Submit Button */}
      <button type="submit" className="btn btn-success mt-2">{submitLabel}</button>
    </form>
  );
}
