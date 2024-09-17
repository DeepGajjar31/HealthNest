import React, { useState, useEffect } from 'react';
import { Container, Grid, Paper, Typography, Divider, Button, Table, TableContainer, TableHead, TableBody, TableRow, TableCell } from '@mui/material';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import "./App.css";
import { BASE_URL } from './config';

const theme = createTheme({
  palette: {
    primary: {
      main: '#000080',
    },
    secondary: {
      main: '#4CAF50',
    },
  },
});

const DoctorsDashboard = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [allAppointments, setAllAppointments] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [totalAppointments, setTotalAppointments] = useState(0);
  const [todayAppointments, setTodayAppointments] = useState(0);
  const [upcomingAppointments, setUpcomingAppointments] = useState(0);
  const [pastAppointments, setPastAppointments] = useState(0);

  // Simulating doctor login with doctorId
  const doctorId = JSON.parse(localStorage.getItem('user')).doctor_id;

  useEffect(() => {
    const storedAppointments = JSON.parse(localStorage.getItem(`appointments_${doctorId}`));
    if (storedAppointments) {
      updatePastAppointmentsStatus(storedAppointments);
      setAllAppointments(storedAppointments);
      calculateAppointmentCounts(storedAppointments);
    } else {
      fetchAppointments();
    }
  }, [doctorId]);

  useEffect(() => {
    filterAppointmentsByDate(selectedDate);
  }, [selectedDate, allAppointments]);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchAppointments();
    }, 3000);
    
    // Clear interval on component unmount
    return () => clearInterval(interval);
  }, [doctorId]);

  const fetchAppointments = async () => {
    try {
      const response = await fetch(`${BASE_URL}/appointments/doctor/${doctorId}`);
      if (response.ok) {
        const data = await response.json();
        updatePastAppointmentsStatus(data);
        setAllAppointments(data);
        calculateAppointmentCounts(data);
        localStorage.setItem(`appointments_${doctorId}`, JSON.stringify(data));
      } else {
        console.error('Failed to fetch appointments');
        setAllAppointments([]);
      }
    } catch (error) {
      console.error('Error:', error);
      setAllAppointments([]);
    }
  };

  const updatePastAppointmentsStatus = async (appointments) => {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0); // Set to the start of today

    const updatedAppointments = appointments.map(appointment => {
      const appointmentDate = new Date(appointment.appointment_date);
      if (appointmentDate < todayStart && appointment.status !== 'Expired') {
        appointment.status = 'Expired';
        updateAppointmentStatusInBackend(appointment.appointment_id, 'Expired');
      }
      return appointment;
    });

    setAllAppointments(updatedAppointments);
    localStorage.setItem(`appointments_${doctorId}`, JSON.stringify(updatedAppointments));
  };

  const updateAppointmentStatusInBackend = async (appointmentId, status) => {
    try {
      const response = await fetch(`${BASE_URL}/appointments/${appointmentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });
      if (!response.ok) {
        console.error('Failed to update appointment status');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const calculateAppointmentCounts = (data) => {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0); // Set to the start of today
    const todayStr = todayStart.toDateString();

    let total = data.length;
    let todayCount = 0;
    let upcoming = 0;
    let past = 0;

    data.forEach(appointment => {
      const appointmentDate = new Date(appointment.appointment_date);
      if (appointmentDate.toDateString() === todayStr) {
        todayCount++;
      } else if (appointmentDate > todayStart && appointment.status !== 'Rejected') {
        upcoming++;
      } else {
        past++;
      }
    });

    setTotalAppointments(total);
    setTodayAppointments(todayCount);
    setUpcomingAppointments(upcoming);
    setPastAppointments(past);
  };

  const filterAppointmentsByDate = (date) => {
    const filteredAppointments = allAppointments.filter(appointment => {
      const appointmentDate = new Date(appointment.appointment_date).toDateString();
      return appointmentDate === date.toDateString();
    });
    setAppointments(filteredAppointments);
  };

  const handleDateClick = (value) => {
    setSelectedDate(value);
  };

  const updateAppointmentStatus = async (index, status) => {
    const appointment = appointments[index];
    try {
      const response = await fetch(`${BASE_URL}/appointments/${appointment.appointment_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });
      if (response.ok) {
        const updatedAppointments = [...appointments];
        updatedAppointments[index].status = status;
        setAppointments(updatedAppointments);

        // Update allAppointments state and save to localStorage for this doctor
        const updatedAllAppointments = allAppointments.map(appt =>
          appt.appointment_id === appointment.appointment_id ? { ...appt, status } : appt
        );
        setAllAppointments(updatedAllAppointments);
        localStorage.setItem(`appointments_${doctorId}`, JSON.stringify(updatedAllAppointments));

        // Recalculate counts
        calculateAppointmentCounts(updatedAllAppointments);
      } else {
        console.error('Failed to update appointment status');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const isPastDate = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to the start of today
    return date < today;
  };

  const isToday = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to the start of today
    return date.toDateString() === today.toDateString();
  };

  const changeMonth = (monthsToAdd) => {
    setSelectedDate(prevDate => {
      const newDate = new Date(prevDate);
      newDate.setMonth(newDate.getMonth() + monthsToAdd);
      return newDate;
    });
  };

  const dayClassName = ({ date, view }) => {
    if (isToday(date) && view === 'month') {
      return 'today';
    }
    return null;
  };

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="lg" className="container-dd">
        <Grid container spacing={3} className='dd-main-container'>
          <Grid item xs={12} sm={6} md={3}>
            <Paper className="grid-item">
              <Typography variant="h6" gutterBottom>Total Appointments</Typography>
              <Typography variant="body1">{totalAppointments}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper className="grid-item">
              <Typography variant="h6" gutterBottom>Today's Appointments</Typography>
              <Typography variant="body1">{todayAppointments}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper className="grid-item">
              <Typography variant="h6" gutterBottom>Upcoming Appointments</Typography>
              <Typography variant="body1">{upcomingAppointments}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper className="grid-item">
              <Typography variant="h6" gutterBottom>Past Appointments</Typography>
              <Typography variant="body1">{pastAppointments}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper className="calendar-container">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <Button onClick={() => changeMonth(-1)}>&lt;</Button>
                <Typography variant="h5">{selectedDate.toLocaleString('default', { month: 'long' })} {selectedDate.getFullYear()}</Typography>
                <Button onClick={() => changeMonth(1)}>&gt;</Button>
              </div>
              <Calendar
                value={selectedDate}
                onClickDay={handleDateClick}
                showNavigation={false}
                dayClassName={dayClassName}
              />
            </Paper>
          </Grid>
          <Grid item xs={12} md={8}>
            <Paper className="appointments-container">
              <Typography className='app-tyrography' variant="h6" gutterBottom>Appointments for {selectedDate.toDateString()}</Typography>
              <Divider style={{ margin: '1rem 0', borderWidth: '2px', backgroundColor: theme.palette.primary.main }} />
              {appointments.length > 0 ? (
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Time</TableCell>
                        <TableCell>Patient Name</TableCell>
                        <TableCell>Reason</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {appointments.map((appointment, index) => (
                        <TableRow key={index}>
                          <TableCell>{appointment.appointment_time}</TableCell>
                          <TableCell>{appointment.patient_name}</TableCell>
                          <TableCell>{appointment.notes}</TableCell>
                          <TableCell>{appointment.status}</TableCell>
                          <TableCell>
                            {appointment.status === 'pending' && (
                              <>
                                <Button
                                  variant="contained"
                                  color="secondary"
                                  style={{ color: 'white' }}
                                  onClick={() => updateAppointmentStatus(index, 'Approved')}
                                >
                                  Approve
                                </Button>
                                <Button
                                  variant="contained"
                                  color="primary"
                                  style={{ marginLeft: '8px' }}
                                  onClick={() => updateAppointmentStatus(index, 'Rejected')}
                                >
                                  Reject
                                </Button>
                              </>
                            )}
                            {appointment.status === 'Approved' && (
                              <>
                                <Button
                                  variant="contained"
                                  color="secondary"
                                  style={{ color: 'white' }}
                                  onClick={() => updateAppointmentStatus(index, 'Completed')}
                                >
                                  Complete
                                </Button>
                                <Button
                                  variant="contained"
                                  color="primary"
                                  onClick={() => updateAppointmentStatus(index, 'Canceled')}
                                  style={{ marginLeft: '8px' }}
                                >
                                  Cancel
                                </Button>
                              </>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Typography className='appt-tyrography' variant="body1">No appointments for this date</Typography>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </ThemeProvider>
  );
};

export default DoctorsDashboard;