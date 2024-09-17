import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ForgotPasswordValidation from './ForgotPasswordValidation';
import { BASE_URL } from './config';

function ForgotPassword() {
  const [values, setValues] = useState({
    email: '',
    newPassword: '',
    confirmPassword: '',
    role: 'Doctor', // Default role for password reset
  });

  const [errors, setErrors] = useState({});
  const [isVerified, setIsVerified] = useState(false);
  const navigate = useNavigate();

  const handleInput = (event) => {
    setValues((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleVerification = (event) => {
    event.preventDefault();
    const { email, role } = values;

    if (!email || !role) {
      setErrors({ email: 'Email is required', role: 'Role is required' });
      return;
    }

    // Replace with your existing verification logic
    axios
      .post(`${BASE_URL}/forgotpassword`, { email, role })
      .then((res) => {
        console.log('Verification response:', res.data); // Log server response
        if (res.data.status === 'Success') {
          setIsVerified(true);
          setErrors({});
        } else {
          alert(res.data.message || 'Verification failed');
        }
      })
      .catch((err) => {
        console.error('Error in Axios request:', err);
        alert('Error verifying email and role');
      });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const validationErrors = ForgotPasswordValidation(values);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      axios
        .post(`${BASE_URL}/forgotpassword`, {
          email: values.email,
          password: values.newPassword,
          role: values.role,
        })
        .then((res) => {
          if (res.data.status === 'Success') {
            alert('Password updated successfully');
            navigate('/login');
          } else {
            alert(res.data.message || 'Error updating password');
          }
        })
        .catch((err) => {
          console.error('Error in Axios request:', err);
          alert('Error updating password');
        });
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="bg-white p-3 rounded w-25">
        <h2>Forgot Password</h2>
        <form onSubmit={isVerified ? handleSubmit : handleVerification}>
          {!isVerified && (
            <>
              <div className="mb-3">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  placeholder="Enter Email"
                  name="email"
                  value={values.email}
                  onChange={handleInput}
                  className="form-control rounded-0"
                />
                {errors.email && (
                  <span className="text-danger">{errors.email}</span>
                )}
              </div>
              <div className="mb-3">
                <label htmlFor="role">Role</label>
                <select
                  name="role"
                  value={values.role}
                  onChange={handleInput}
                  className="form-control rounded-0"
                >
                  <option value="Doctor">Doctor</option>
                  <option value="Patient">Patient</option>
                  <option value="Receptionist">Receptionist</option>
                </select>
                {errors.role && (
                  <span className="text-danger">{errors.role}</span>
                )}
              </div>
            </>
          )}
          {isVerified && (
            <>
              <div className="mb-3">
                <label htmlFor="newPassword">New Password</label>
                <input
                  type="password"
                  name="newPassword"
                  placeholder="Enter New Password"
                  onChange={handleInput}
                  className="form-control rounded-0"
                />
                {errors.newPassword && (
                  <span className="text-danger">{errors.newPassword}</span>
                )}
              </div>
              <div className="mb-3">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm New Password"
                  onChange={handleInput}
                  className="form-control rounded-0"
                />
                {errors.confirmPassword && (
                  <span className="text-danger">{errors.confirmPassword}</span>
                )}
              </div>
            </>
          )}
          <button type="submit" className="btn btn-success w-100">
            <strong>{isVerified ? 'Update Password' : 'Verify'}</strong>
          </button>
          <br />
          <br />
          <Link to="/login" className="btn btn-default border w-100 bg-light">
            <strong>Back to Login</strong>
          </Link>
        </form>
      </div>
    </div>
  );
}

export default ForgotPassword;
