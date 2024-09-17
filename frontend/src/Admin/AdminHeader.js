import React, { useRef, useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import '../App.css';
import { Container, Row } from 'reactstrap';
import Logo from '../images/Logo.jpg';
import userIcon from '../images/userIcon.jpg';
import { useUser } from '../UserContext';
import { toast } from 'react-toastify';

const Header = () => {
  const menuRef = useRef(null);
  const profileActionRef = useRef(null);
  const [profileActionsVisible, setProfileActionsVisible] = useState(false);
  const { user, logout } = useUser();
  const navigate = useNavigate();

  const menuToggle = () => menuRef.current.classList.toggle('active-menu');
  const toggleProfileActions = () =>
    setProfileActionsVisible(!profileActionsVisible);
  const closeProfileActions = () => setProfileActionsVisible(false);

  const handleLogout = () => {
    logout();
    toast.success('Logged out');
    closeProfileActions(); // Close profile actions after logout
    navigate('/');
  };

  let nav_links = [
    { display: 'Dashboard', path: '/dashboard' },
    { display: 'Users', path: '/dashboard/users' },
    { display: 'All Appointments', path: '/dashboard/all-appointments' },
  ];

  return (
    <header className="header sticky-header">
      <Container>
        <Row>
          <div className="nav__wrapper">
            <div className="logo">
              <img src={Logo} alt="Logo" width={230} />
            </div>
            <div className="navigation" ref={menuRef}>
              <ul className="menu">
                {nav_links.map((item, index) => (
                  <li className="nav_item nav_link" key={index}>
                    <NavLink
                      to={item.path}
                      className={(navClass) =>
                        navClass.isActive ? 'nav_active' : ''
                      }
                      style={{
                        textDecoration: 'none',
                        color: 'var(--primary-color)',
                      }}
                    >
                      {item.display}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
            <div className="nav_icons">
              {user && (
                <div className="user_info">
                  <span>{user.name}</span>
                  <span> | {user.role}</span>
                </div>
              )}
              <button
                className="user_icon"
                onBlur={closeProfileActions}
                onClick={toggleProfileActions}
                aria-label="User profile"
                style={{
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  margin: 0,
                }}
              >
                <img src={userIcon} alt="User Icon" />
              </button>
              <div
                className={`profile-actions ${
                  profileActionsVisible ? 'show_profileActions' : ''
                }`}
                ref={profileActionRef}
              >
                <div className="profile_link">
                  {user ? (
                    <Link
                      className="myprofile"
                      to="/myprofile"
                      style={{
                        textDecoration: 'none',
                        color: 'var(--primary-color)',
                      }}
                      onClick={closeProfileActions}
                    >
                      My Profile
                    </Link>
                  ) : (
                    <>
                      <Link
                        to="/signup"
                        style={{
                          textDecoration: 'none',
                          color: 'var(--primary-color)',
                        }}
                        onClick={closeProfileActions}
                      >
                        SignUp
                      </Link>
                      <Link
                        to="/login"
                        style={{
                          textDecoration: 'none',
                          color: 'var(--primary-color)',
                        }}
                        onClick={closeProfileActions}
                      >
                        Login
                      </Link>
                    </>
                  )}
                  {user && (
                    <button
                      onClick={handleLogout}
                      style={{
                        textDecoration: 'none',
                        color: 'var(--primary-color)',
                        background: 'none',
                        border: 'none',
                        padding: 0,
                        margin: 0,
                      }}
                    >
                      Logout
                    </button>
                  )}
                </div>
              </div>
              <button
                className="mobile_menu"
                onClick={menuToggle}
                aria-label="Toggle Menu"
              >
                <span className="menu_icon">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M3.75 7.375H20.25"
                      stroke="#515151"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></path>
                    <path
                      d="M3.75 13H15.75"
                      stroke="#515151"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></path>
                    <path
                      d="M3.75061 18H20.25"
                      stroke="#515151"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></path>
                  </svg>
                </span>
              </button>
            </div>
          </div>
        </Row>
      </Container>
    </header>
  );
};

export default Header;
