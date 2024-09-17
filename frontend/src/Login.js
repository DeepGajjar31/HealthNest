import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Validation from './LoginValidation';
import axios from 'axios';
import { BASE_URL } from './config';

import { useUser } from './UserContext';
import { toast } from 'react-toastify';

function Login() {
  const [values, setValues] = useState({
    email: '',
    password: '',
    role: 'Doctor', // Default role
  });

  const [errors, setErrors] = useState({});
  const [availableRoles, setAvailableRoles] = useState([
    'Doctor',
    'Patient',
    'Receptionist',
  ]);
  const navigate = useNavigate();
  const { login } = useUser(); // Get login function from context

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
        .post(`${BASE_URL}/login`, values)
        .then((res) => {
          if (res.data.status === 'Success') {
            const { user } = res.data;
            login(res.data.user);

            // Store user details in localStorage
            localStorage.setItem('user', JSON.stringify(user));

            // Redirect based on role
            if (values.role === 'Admin') {
              navigate('/dashboard');
            } else if (values.role === 'Doctor') {
              navigate('/home');
            } else if (values.role === 'Receptionist') {
              navigate('/home');
            } else {
              navigate('/home');
            }

            // Show toast message
            toast.success('Successfully logged in');
          } else if (res.data.message === 'Password does not match') {
            toast.error('Password does not match');
          } else {
            toast.error('Invalid credentials');
          }
        })
        .catch((err) => console.log(err));
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="bg-white p-3 rounded w-25">
        <h2>Sign In</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              placeholder="Enter Email"
              name="email"
              onChange={handleInput}
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
              name="password"
              placeholder="Enter Password"
              onChange={handleInput}
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
            <strong>Log In</strong>
          </button>
          <p>You agree to TnC</p>
          <Link to="/signup" className="btn btn-default border w-100 bg-light">
            <strong>Create Account</strong>
          </Link>
          <br />
          <br />
          <Link
            to="/forgotpassword"
            className="btn btn-default border w-100 bg-light"
          >
            <strong>Forgot Password</strong>
          </Link>
        </form>
      </div>
    </div>
  );
}

export default Login;
