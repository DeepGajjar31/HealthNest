import React, { useEffect, useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from './config'; // Adjust the import path as per your file structure

const AccountDetails = ({ user }) => {
  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="account-details">
      <h4>Name: {user.name}</h4>
      <p>Email: {user.email}</p>
      <p>Mobile: {user.number}</p>
      <p>Gender: {user.gender}</p>
      <p>Hospital: {user.hospital}</p>
      <p>Specialization: {user.specialization}</p>
      <p>Experience: {user.experience}</p>
      <p>Fees: {user.fees}</p>
    </div>
  );
};

const UpdateProfile = ({ user }) => {
  const [formData, setFormData] = useState({
    name: user.name || '',
    number: user.number || '',
    gender: user.gender || '',
    experience: user.experience || '',
    specialization: user.specialization || '',
    hospital: user.hospital || '',
    fees: user.fees || '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `${BASE_URL}/doctors/email/${user.email}`,
        formData
      );
      console.log('Update response:', response);
      alert('Profile updated successfully');
    } catch (error) {
      console.error('Failed to update profile:', error);
      alert(
        `Failed to update profile: ${error.message || error.response.status}`
      );
    }
  };

  return (
    <div className="update-profile">
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
        </label>
        <label>
          Email:
          <input type="text" name="email" value={user.email} readOnly />
        </label>
        <label>
          Mobile No:
          <input
            type="tel"
            name="number"
            value={formData.number}
            onChange={handleChange}
            required
            minLength="10"
            maxLength="10"
            pattern="[0-9]{10}"
          />
        </label>
        <label>
          Gender:
          <select name="gender" value={formData.gender} onChange={handleChange}>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Others">Others</option>
          </select>
        </label>
        <label>
          Experience:
          <input
            type="text"
            name="experience"
            value={formData.experience}
            onChange={handleChange}
          />
        </label>
        <label>
          Specialization:
          <input
            type="text"
            name="specialization"
            value={formData.specialization}
            onChange={handleChange}
          />
        </label>
        <label>
          Hospital:
          <input
            type="text"
            name="hospital"
            value={formData.hospital}
            onChange={handleChange}
          />
        </label>
        <label>
          Fees:
          <input
            type="text"
            name="fees"
            value={formData.fees}
            onChange={handleChange}
          />
        </label>
        <button type="submit">Update Profile</button>
      </form>
    </div>
  );
};

const DoctorsProfile = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));

    if (storedUser && storedUser.email) {
      const fetchUserDetails = async () => {
        try {
          setIsLoading(true);
          const response = await axios.get(
            `${BASE_URL}/doctors/email/${storedUser.email}`
          );
          setUser(response.data);
        } catch (error) {
          console.error('Error fetching user details:', error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchUserDetails();
    } else {
      setIsLoading(false);
    }
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>No user data available</div>;
  }

  return (
    <div className="user-profile">
      <nav>
        <ul>
          <li>
            <Link to="">Account Details</Link>
          </li>
          <li>
            <Link to="updateprofile">Update Profile</Link>
          </li>
        </ul>
      </nav>

      <div className="profile-content">
        <Routes>
          <Route path="/" element={<AccountDetails user={user} />} />
          <Route path="updateprofile" element={<UpdateProfile user={user} />} />
        </Routes>
      </div>
    </div>
  );
};

export default DoctorsProfile;
