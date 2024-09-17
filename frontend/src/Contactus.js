import React, { useState } from 'react';
import { Container, Row, Col } from 'reactstrap';
import { FaMapLocationDot } from 'react-icons/fa6';
import { FaPhone } from 'react-icons/fa';
import { IoMail } from 'react-icons/io5';
import './App.css';

const Contact = () => {
  const [mobile, setMobile] = useState('');
  const [formData, setFormData] = useState({
    subject: '',
    message: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  return (
    <>
      <section>
        <Container>
          <Row>
            <Col className="contact-info">
              <div className="contact-item">
                <i>
                  <IoMail />
                </i>
                <h5>Mail</h5>
                <a href="mailto:healthnest@gmail.com">healthnest@gmail.com</a>
              </div>
              <div className="contact-item">
                <i>
                  <FaMapLocationDot />
                </i>
                <h5>Address</h5>
                <a
                  href="https://www.google.com/maps/place/Ahmedabad,Gujrat"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Ahmedabad, Gujarat
                </a>
              </div>
              <div className="contact-item">
                <i>
                  <FaPhone />
                </i>
                <h5>Phone</h5>
                <span>356-245-2940</span>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
      <section>
        <Container>
          <Row>
            <Col>
              <form className="contact-form">
                <p>
                  <input
                    type="tel"
                    placeholder="Enter your mobile number"
                    className="w-100"
                    maxLength="10"
                    value={mobile}
                    onChange={(e) =>
                      setMobile(e.target.value.replace(/\D/g, ''))
                    }
                  />
                  <input
                    type="text"
                    name="subject"
                    placeholder="Subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                  />
                  <textarea
                    name="message"
                    placeholder="Message"
                    rows="4"
                    value={formData.message}
                    onChange={handleChange}
                    required
                  ></textarea>
                  <button type="submit">Send Feedback</button>
                </p>
              </form>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
};

export default Contact;
