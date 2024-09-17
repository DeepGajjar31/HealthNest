import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'reactstrap';
import './Admin.css';
import { BASE_URL } from '../config';

const AllAppointments = () => {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${BASE_URL}/appointments`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setAppointments(data); // Assuming data is an array of appointments
      } catch (error) {
        console.error('Error fetching data:', error);
        // Handle error if needed
      }
    };

    fetchData();
  }, []); // Empty dependency array means this effect runs once after the initial render

  return (
    <section>
      <Container>
        <Row>
          {/* <Col lg="12">
            <h4>All Appointments</h4>
          </Col> */}
          <Col lg="12" className="pt-5">
            <table className="table">
              <thead>
                <tr>
                  <th>Appointment Id</th>
                  <th>Doctor Id</th>
                  <th>Patient Id</th>
                  <th>Notes</th>
                  <th>Appointment Date</th>
                  <th>Appopintment Time</th>
                  <th>Patient Name</th>
                  <th>Patient Email</th>
                  <th>Patient Number</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((appointment) => (
                  <tr key={appointment.appointment_id}>
                    <td>{appointment.appointment_id}</td>
                    <td>{appointment.doctor_id}</td>
                    <td>{appointment.patient_id}</td>
                    <td>{appointment.notes}</td>
                    <td>{appointment.appointment_date}</td>
                    <td>{appointment.appointment_time}</td>
                    <td>{appointment.patient_name}</td>
                    <td>{appointment.patient_email}</td>
                    <td>{appointment.patient_number}</td>
                    <td>{appointment.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default AllAppointments;
