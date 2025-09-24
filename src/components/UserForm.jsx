import React, { useState, useEffect } from "react";
import { isRequired, isEmailValid } from "../utils/validation";

export default function UserForm({ initialData = null, onSubmit, submitLabel = "Submit" }) {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    department: "",
  });
  const [errors, setErrors] = useState({});

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

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const validate = () => {
    const errs = {};
    if (!isRequired(form.firstName)) errs.firstName = "First name required";
    if (!isRequired(form.lastName)) errs.lastName = "Last name required";
    if (!isRequired(form.email)) errs.email = "Email required";
    else if (!isEmailValid(form.email)) errs.email = "Invalid email";
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    // Prepare object shape compatible with API & our UI
    const payload = {
      name: `${form.firstName} ${form.lastName}`.trim(),
      email: form.email,
      company: { name: form.department },
    };

    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-2">
        <label>First Name</label>
        <input name="firstName" value={form.firstName} onChange={handleChange} className={`form-control ${errors.firstName ? "is-invalid" : ""}`} />
        <div className="invalid-feedback">{errors.firstName}</div>
      </div>

      <div className="mb-2">
        <label>Last Name</label>
        <input name="lastName" value={form.lastName} onChange={handleChange} className={`form-control ${errors.lastName ? "is-invalid" : ""}`} />
        <div className="invalid-feedback">{errors.lastName}</div>
      </div>

      <div className="mb-2">
        <label>Email</label>
        <input name="email" value={form.email} onChange={handleChange} className={`form-control ${errors.email ? "is-invalid" : ""}`} />
        <div className="invalid-feedback">{errors.email}</div>
      </div>

      <div className="mb-2">
        <label>Department</label>
        <input name="department" value={form.department} onChange={handleChange} className="form-control" />
      </div>

      <button type="submit" className="btn btn-success mt-2">{submitLabel}</button>
    </form>
  );
}
