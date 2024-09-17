import React from 'react';
import './App.css';
import { Link } from 'react-router-dom';
import Logo from './images/Logo.jpg';
import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube } from 'react-icons/fa';
import { FaEnvelope, FaMapMarkerAlt, FaPhoneAlt } from 'react-icons/fa';

const Footer = () => {
  return (
    <section className="footer">
      <div className="container-footer">
        <div className="row">
          <div className="col-lg-3 col-md-6">
            <img src={Logo} alt="" width={230} className="footer-image" />
            <div className="footer-o-text d-block mt-3 mb-3">
              &quot;Your partner in optimal health. Connect with top doctors,
              manage appointments, and access personalized healthcare solutions
              seamlessly.&quot;
            </div>
            <div className="social-icons">
              <a
                href="https://www.facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
              >
                <FaFacebookF />
              </a>
              <a
                href="https://www.twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
              >
                <FaTwitter />
              </a>
              <a
                href="https://www.instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
              >
                <FaInstagram />
              </a>
              <a
                href="https://www.youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
              >
                <FaYoutube />
              </a>
            </div>
          </div>
          <div className="col-lg-3 col-md-6">
            <p className="footer-title">For Patient</p>
            <ul className="footer-ul">
              <Link
                to="/doctors"
                style={{ textDecoration: 'none', color: 'black' }}
              >
                {' '}
                <li>Search for Doctors</li>{' '}
              </Link>
              <Link
                to="/Login"
                style={{ textDecoration: 'none', color: 'black' }}
              >
                <li>Login</li>{' '}
              </Link>
              <Link
                to="/signup"
                style={{ textDecoration: 'none', color: 'black' }}
              >
                <li>Signup</li>
              </Link>
              <Link to="/" style={{ textDecoration: 'none', color: 'black' }}>
                <li>Book Appointment</li>
              </Link>
              <Link
                to="myprofile/*"
                style={{ textDecoration: 'none', color: 'black' }}
              >
                <li>My Profile</li>
              </Link>
            </ul>
          </div>
          <div className="col-lg-3 col-md-6">
            <p className="footer-title">For Doctors</p>
            <ul className="footer-ul">
              <Link
                to="myprofile/*"
                style={{ textDecoration: 'none', color: 'black' }}
              >
                <li>My Profile</li>
              </Link>
              <Link
                to="/Login"
                style={{ textDecoration: 'none', color: 'black' }}
              >
                <li>Login</li>{' '}
              </Link>
              <Link
                to="/signup"
                style={{ textDecoration: 'none', color: 'black' }}
              >
                <li>Signup</li>
              </Link>
              <Link
                to="/doctorsdashboard"
                style={{ textDecoration: 'none', color: 'black' }}
              >
                <li>Doctor Dashboard</li>
              </Link>
            </ul>
          </div>
          <div className="col-lg-3 col-md-6">
            <p className="footer-title">Contact Us</p>
            <ul className="footer-ul">
              <li className="d-flex">
                <div className="footer-info-i">
                  <FaMapMarkerAlt />
                </div>
                <span>
                  {' '}
                  907 , Enblitz Technologies <br /> Gujarat, Ahmedabad - 382480{' '}
                </span>
              </li>
              <li className="d-flex">
                <div className="footer-info-i">
                  <FaPhoneAlt />
                </div>
                <span>1234567890</span>
              </li>
              <li className="d-flex">
                <div className="footer-info-i">
                  <FaEnvelope />
                </div>
                <span>info@healthnest.com</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Footer;
