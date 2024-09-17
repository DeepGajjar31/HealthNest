import React, { useEffect, useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { AiOutlineUser } from 'react-icons/ai';
import axios from 'axios';
import './App.css';
import { BASE_URL } from './config';

const AccountDetails = ({ user }) => {
  const [patient, setPatient] = useState(null);

  useEffect(() => {
    setPatient(user); // Assuming the user object has the same structure as the patient data
  }, [user]);

  if (!patient) {
    return <div>Loading...</div>;
  }

  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    return date.toLocaleDateString(); // Formats date to 'MM/DD/YYYY' by default
  };

  return (
    <div className="account-details">
      <AiOutlineUser className="user-icon" />
      <h4>Name: {patient.name}</h4>
      <p>Role: {patient.role}</p>
      <p>Email: {patient.email}</p>
      <p>Mobile: {patient.number}</p>
      <p>Adhar No: {patient.adhar_no}</p>
      <p>Date of Birth: {formatDate(patient.dob)}</p>
      <p>Age: {patient.age}</p>
      <p>Gender: {patient.gender}</p>
      <p>Insurance: {patient.insurance}</p>
      <p>Address: {patient.address}</p>
    </div>
  );
};

const MyAppointments = () => {
  const [Appointments] = useState([]);

  return (
    <div className="my-appointments">
      {/* <h4>My Orders</h4> */}
      {Appointments.length === 0 ? (
        <p>You have not make any appointments.</p>
      ) : (
        <ul>
          {Appointments.map((order) => (
            <li key={order.id}>
              <p>Appointments ID: {Appointments.id}</p>
              <p>Total: {Appointments.totalAmount}</p>
              <p>Items:</p>
              <ul>
                {order.cartItems.map((item) => (
                  <li key={item.id}>
                    <img
                      src={item.image}
                      alt={item.productName}
                      style={{ maxWidth: '100px' }}
                    />
                    <div>
                      <p>Appointment Id: {}</p>
                      <p>Doctor&apos;s name: {}</p>
                      <p>Price: {}</p>
                      <p>Quantity: {}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const UpdateProfile = ({ user }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    number: '',
    adhar_no: '',
    dob: '',
    gender: '',
    insurance: '',
    address: '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        number: user.number || '',
        adhar_no: user.adhar_no || '',
        dob: user.dob ? new Date(user.dob).toISOString().split('T')[0] : '',
        gender: user.gender || '',
        insurance: user.insurance || '',
        address: user.address || '',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const storedUser = JSON.parse(localStorage.getItem('user'));
      const response = await axios.put(
        `${BASE_URL}/patients/email/${storedUser.email}`,
        formData
      );
      console.log('Update response:', response);
      if (response.status === 200) {
        alert('Profile updated successfully');
      } else {
        console.error('Failed to update profile:', response.data);
        alert(
          `Failed to update profile: ${response.data.message || response.status}`
        );
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      if (error.response) {
        console.error('Error response data:', error.response.data);
        alert(
          `Failed to update profile: ${error.response.data.message || error.response.status}`
        );
      } else {
        alert('Failed to update profile: An unknown error occurred.');
      }
    }
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="update-profile">
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Name:
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
          </label>
        </div>
        <div>
          <label>
            Email Id:
            <p
              className="update-email"
              style={{ fontWeight: '400', padding: '8px' }}
            >
              {formData.email}
            </p>
          </label>
        </div>
        <div>
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
              onInput={(e) => {
                e.target.value = e.target.value.replace(/[^0-9]/g, '');
              }}
            />
          </label>
        </div>
        <div>
          <label>
            Aadhaar No:
            <input
              type="text"
              name="adhar_no"
              value={formData.adhar_no}
              onChange={handleChange}
              required
              minLength="12"
              maxLength="12"
              pattern="\d{12}"
            />
          </label>
        </div>
        <div>
          <label>
            Date of Birth:
            <input
              type="date"
              name="dob"
              value={formData.dob}
              max={today}
              onChange={handleChange}
            />
          </label>
        </div>
        <div className="gender">
          <label htmlFor="gender">Gender:</label>
          <select
            id="gender"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="input"
          >
            <option value=""></option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Others">Others</option>
          </select>
        </div>
        <div className="insurance">
          <label htmlFor="insurance">Insurance:</label>
          <select
            id="insurance"
            name="insurance"
            value={formData.insurance}
            onChange={handleChange}
            className="input"
          >
            <option value=""></option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>
        <div className="address-text">
          <label>
            Address:
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              rows={2}
              cols={60}
            />
          </label>
        </div>
        <button type="submit">Update Profile</button>
      </form>
    </div>
  );
};

const MyProfile = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));

    if (storedUser && storedUser.email) {
      const fetchUserDetails = async () => {
        try {
          setIsLoading(true);
          // Use the email to fetch the login_id and user details
          const response = await axios.get(
            `${BASE_URL}/patients/email/${storedUser.email}`
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
            <Link to="myappointments">My Appointments</Link>
          </li>
          <li>
            <Link to="updateprofile">Update Profile</Link>
          </li>
        </ul>
      </nav>

      <div className="profile-content">
        <Routes>
          <Route path="/" element={<AccountDetails user={user} />} />
          <Route
            path="myappointments"
            element={<MyAppointments user={user} />}
          />
          <Route path="updateprofile" element={<UpdateProfile user={user} />} />
        </Routes>
      </div>
    </div>
  );
};

export default MyProfile;
