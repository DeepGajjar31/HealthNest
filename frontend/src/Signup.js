import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Validation from './SignupValidation';
import axios from 'axios';
import { toast } from 'react-toastify';
import { BASE_URL } from './config';

export default function Signup() {
  const [values, setValues] = useState({
    name: '',
    email: '',
    password: '',
    role: 'Doctor', // Default role
  });

  const [availableRoles, setAvailableRoles] = useState([
    'Doctor',
    'Patient',
    'Receptionist',
  ]);
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});

  const handleInput = (event) => {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));

    if (name === 'email') {
      // Check if the email is the admin email and update roles accordingly
      if (value === 'admin.healthnest@gmail.com') {
        setAvailableRoles(['Doctor', 'Patient', 'Receptionist', 'Admin']);
      } else {
        setAvailableRoles(['Doctor', 'Patient', 'Receptionist']);
      }
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const validationErrors = Validation(values);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      axios
        .post(`${BASE_URL}/signup`, values)
        .then(() => {
          toast.success('Account created');
          navigate('/login');
        })
        .catch((err) => console.log(err));
    } else {
      toast.error('Signup failed. Please check your inputs.');
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="bg-white p-3 rounded w-25">
        <h2>Sign Up</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              placeholder="Enter Name"
              onChange={handleInput}
              name="name"
              className="form-control rounded-0"
            />
            {errors.name && <span className="text-danger">{errors.name}</span>}
          </div>
          <div className="mb-3">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              placeholder="Enter Email"
              onChange={handleInput}
              name="email"
              className="form-control rounded-0"
            />
            {errors.email && (
              <span className="text-danger">{errors.email}</span>
            )}
          </div>
          <div className="mb-3">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              placeholder="Enter Password"
              onChange={handleInput}
              name="password"
              className="form-control rounded-0"
            />
            {errors.password && (
              <span className="text-danger">{errors.password}</span>
            )}
          </div>
          <div className="mb-3">
            <label htmlFor="role">Role</label>
            <select
              name="role"
              onChange={handleInput}
              className="form-control rounded-0"
            >
              {availableRoles.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </div>
          <button type="submit" className="btn btn-success w-100">
            <strong>Signup</strong>
          </button>
          <p>You agree to TnC</p>
          <Link to="/Login" className="btn btn-default border w-100 bg-light">
            <strong>Login</strong>
          </Link>
        </form>
      </div>
    </div>
  );
}
