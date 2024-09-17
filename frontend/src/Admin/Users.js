import React, { useEffect, useState } from 'react';
import { Container, Row, Col } from 'reactstrap';
import { toast } from 'react-toastify';
import axios from 'axios';
import { BASE_URL } from '../config';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    setFilteredUsers(users); // Initialize filteredUsers with all users on load
  }, [users]);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/users`);
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Error fetching users');
    }
  };

  const deleteUser = async (loginId) => {
    try {
      await axios.delete(`${BASE_URL}/users/${loginId}`);
      setUsers(users.filter((user) => user.login_id !== loginId));
      setFilteredUsers(
        filteredUsers.filter((user) => user.login_id !== loginId)
      ); // Update filteredUsers after deletion
      toast.success('User deleted!');
    } catch (error) {
      console.error(
        'Error deleting user:',
        error.response?.data || error.message
      );
      toast.error(
        `Error deleting user: ${error.response?.data?.details || error.message}`
      );
    }
  };

  const filterUsersByRole = (role) => {
    if (role === 'all') {
      setFilteredUsers(users); // Show all users
    } else {
      const filtered = users.filter((user) => user.role === role);
      console.log(filtered); // Add this line to log the filtered array
      setFilteredUsers(filtered);
    }
  };

  return (
    <section>
      <Container>
        <Row>
          <Col lg="12" className="text-center">
            <button
              className="user-btn"
              onClick={() => filterUsersByRole('all')}
            >
              All Users
            </button>
            <button
              className="user-btn"
              onClick={() => filterUsersByRole('Doctor')}
            >
              Doctors
            </button>
            <button
              className="user-btn"
              onClick={() => filterUsersByRole('Patient')}
            >
              Patients
            </button>
          </Col>
          <Col lg="12" className="pt-3">
            <table className="table">
              <thead>
                <tr>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.login_id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.role}</td>
                    <td>
                      <button
                        className="btn-deluser btn-danger"
                        onClick={() => deleteUser(user.login_id)}
                      >
                        Delete
                      </button>
                    </td>
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

export default Users;
