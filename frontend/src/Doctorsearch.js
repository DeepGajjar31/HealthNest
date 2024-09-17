import React, { useState, useEffect } from 'react';
import './doctorsearch.css';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { BASE_URL } from './config';

const Doctors = () => {
  const [filter, setFilter] = useState({
    name: '',
    specialization: '',
    fees: '',
    location: '',
  });
  const [doctors, setDoctors] = useState([]);
  const [minPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(5000);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/doctors`);
        setDoctors(response.data);
      } catch (error) {
        console.error('Failed to fetch doctors:', error);
      }
    };
    fetchDoctors();
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter({ ...filter, [name]: value });
  };

  const filteredDoctors = doctors.filter((doctor) => {
    const matchesName = doctor.name
      .toLowerCase()
      .includes(filter.name.toLowerCase());
    const matchesSpecialization =
      filter.specialization === 'all' ||
      doctor.specialization
        .toLowerCase()
        .includes(filter.specialization.toLowerCase());
    const matchesFees = filter.fees === '' || doctor.fees.includes(filter.fees);
    const matchesLocation =
      filter.location === 'all' ||
      doctor.hospital_loc.toLowerCase().includes(filter.location.toLowerCase());
    return (
      matchesName && matchesSpecialization && matchesFees && matchesLocation
    );
  });

  const handleMaxPriceChange = (event) => {
    const value = parseInt(event.target.value);
    if (value >= minPrice) {
      setMaxPrice(value);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log('Minimum Price:', minPrice);
    console.log('Maximum Price:', maxPrice);
  };

  const handleBookAppointment = (doctorId) => {
    if (doctorId) {
      localStorage.setItem('doctor_id', doctorId);
      navigate('/appointment');
    } else {
      console.error('Doctor ID is undefined');
    }
  };

  return (
    <div className="container-doctor">
      <div className="filters">
        <h2>Filters</h2>
        <input
          type="text"
          name="name"
          placeholder="Search by Name"
          value={filter.name}
          onChange={handleFilterChange}
          className="input"
        />
        <div>
          <select
            id="specialization"
            name="specialization"
            onChange={handleFilterChange}
            className="input"
          >
            <option value="all">Filter By Specialization</option>
            <option value="urology">Urology</option>
            <option value="neurology">Neurology</option>
            <option value="orthopedic">Orthopedic</option>
            <option value="cardiologist">Cardiologist</option>
            <option value="dentist">Dentist</option>
          </select>
        </div>
        <div className="price-range">
          <span className="price-label">
            Price: ₹{minPrice} - ₹{maxPrice}
          </span>
          <div className="price-inputs">
            <input
              type="range"
              value={maxPrice}
              min="0"
              max="5000"
              step="1"
              onChange={handleMaxPriceChange}
              className="input-range"
            />
            <button onClick={handleSubmit} className="price-go">
              Go
            </button>
          </div>
        </div>
        <div>
          <select
            id="location"
            name="location"
            onChange={handleFilterChange}
            className="input"
          >
            <option value="all">Filter by location</option>
            <option value="Ahmedabad">Ahmedabad</option>
            <option value="Gandhinagar">Gandhinagar</option>
            <option value="Chennai">Chennai</option>
            <option value="Mumbai">Mumbai</option>
            <option value="Benglore">Benglore</option>
            <option value="Delhi">Delhi</option>
            <option value="Kolkata">Kolkata</option>
            <option value="Lakhnow">Lakhnow</option>
          </select>
        </div>
      </div>
      <div className="doctorList">
        <h2>Doctor List</h2>
        <div className="cardContainer">
          {filteredDoctors.map((doctor, index) => (
            <div key={index} className="card">
              <Link
                to={`/details/${doctor.doctor_id}`}
                style={{ textDecoration: 'none', color: 'black' }}
              >
                {/* <img src={`data:image/jpeg;base64,${bufferToBase64(doctor.doc_pic)}`} alt={doctor.name} className="image" /> */}
                <h3>{doctor.name}</h3>
                <p>
                  <strong>Specialization:</strong> {doctor.specialization}
                </p>
                <p>
                  <strong>Fees:</strong> {doctor.fees}
                </p>
                <p>
                  <strong>Location:</strong> {doctor.hospital_loc}
                </p>
                <p>{doctor.description}</p>
              </Link>
              <button
                onClick={() => handleBookAppointment(doctor.doctor_id)}
                className="bookButton"
                style={{ textDecoration: 'none' }}
              >
                Book Appointment
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Doctors;
