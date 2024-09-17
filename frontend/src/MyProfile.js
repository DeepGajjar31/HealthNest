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
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const userData = localStorage.getItem('user');
        if (!userData) {
          console.error('No user data found in localStorage');
          return;
        }
        const user = JSON.parse(userData);
        const patientId = user.login_id;

        const response = await fetch(`${BASE_URL}/appointments/${patientId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch appointments');
        }
        const data = await response.json();
        setAppointments(data);
      } catch (error) {
        console.error('Error fetching appointments:', error);
      }
    };

    fetchAppointments();
  }, []); // Empty dependency array to run effect only once on component mount
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };
  const formatTime = (timeString) => {
    return timeString.substring(11, 16); // Extracts 'HH:mm' from '2024-06-14T09:12:05.000Z'
  };

  return (
    <div className="my-appointments">
      {appointments.length === 0 ? (
        <p>You have not made any appointments.</p>
      ) : (
        <table className="table-ap">
          <thead>
            <tr>
              <th>Appointment ID</th>
              <th>Doctor Name</th>
              <th>Appointment Date</th>
              <th>Appointment Time</th>
              <th>Appointment Created (Date)</th>
              <th>Appointment Created (Time)</th>
              <th>Reason</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appointment) => (
              <tr key={appointment.login_id}>
                <td>{appointment.appointment_id}</td>
                <td>{appointment.doctor_name}</td>
                <td>{appointment.appointment_date}</td>
                <td>{appointment.appointment_time}</td>
                <td>{formatDate(appointment.created_at)}</td>
                <td>{formatTime(appointment.created_at)}</td>
                {/* <td>{(appointment.created_at)}</td> */}
                <td>{appointment.notes}</td>
                <td>{appointment.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
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
          'Failed to update profile:'`${response.data.message || response.status}`
        );
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      if (error.response) {
        console.error('Error response data:', error.response.data);
        alert(
          'Failed to update profile:'`${error.response.data.message || error.response.status}`
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
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
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
