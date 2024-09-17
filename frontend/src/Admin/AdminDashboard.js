import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'reactstrap';
import './Admin.css';
import { BASE_URL } from '../config';

const AdminDashboard = () => {
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalDoctors, setTotalDoctors] = useState(0);
  const [totalPatients, setTotalPatients] = useState(0);
  const [totalAppointments, setTotalAppointments] = useState(0);

  useEffect(() => {
    const fetchTotalUsers = async () => {
      try {
        const response = await fetch(`${BASE_URL}/users`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        // Assuming the API returns an array of users and you want the total count
        setTotalUsers(data.length); // Update with the actual logic to get total users count
      } catch (error) {
        console.error('Error fetching total users:', error);
        // Handle error if needed
      }
    };
    fetchTotalUsers();

    const fetchTotalDoctors = async () => {
      try {
        const response = await fetch(`${BASE_URL}/doctors`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setTotalDoctors(data.length); // Assuming the API returns an array of doctors and you want the total count
      } catch (error) {
        console.error('Error fetching total doctors:', error);
        // Handle error if needed
      }
    };
    fetchTotalDoctors();

    const fetchTotalPatients = async () => {
      try {
        const response = await fetch(`${BASE_URL}/patients/`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setTotalPatients(data.data.length); // Assuming the API returns an array of patients and you want the total count
      } catch (error) {
        console.error('Error fetching total patients:', error);
        // Handle error if needed
      }
    };

    fetchTotalPatients();
  }, []);

  const fetchTotalAppointments = async () => {
    try {
      const response = await fetch(`${BASE_URL}/appointments`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setTotalAppointments(data.length);
    } catch (error) {
      console.error('Error fetching total appointments:', error);
    }
  };
  fetchTotalAppointments();

  return (
    <section>
      <Container>
        <Row>
          <Col className="lg-3">
            <div className="revenue_box">
              <h5>Total Users</h5>
              <span>{totalUsers}</span>
            </div>
          </Col>
          <Col className="lg-3">
            <div className="doctors_box">
              <h5>Total Doctors</h5>
              <span>{totalDoctors}</span>
            </div>
          </Col>
          <Col className="lg-3">
            <div className="orders_box">
              <h5>Total Patients</h5>
              <span>{totalPatients}</span>
            </div>
          </Col>
          <Col className="lg-3">
            <div className="products_box">
              <h5>Total Appointments</h5>
              <span>{totalAppointments}</span>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default AdminDashboard;
