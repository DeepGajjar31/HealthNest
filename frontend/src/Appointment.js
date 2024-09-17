import React, { useState, useEffect, useRef } from 'react';
import { Steps } from 'antd';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import chip from './images/chip.png';
import './App.css';
import { BASE_URL } from './config';

import { IoMdCheckmarkCircleOutline } from 'react-icons/io';
import { Row, Col } from 'reactstrap';
import { Link } from 'react-router-dom';

const { Step } = Steps;

const AppointmentScheduler = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const navigate = useNavigate();
  const [formValues, setFormValues] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    reasonForVisit: '',
    description: '',
    address: '',
  });

  const handleDateClick = (date) => {
    setSelectedDate(date);
  };

  const handleTimeClick = (time) => {
    setSelectedTime(time);
  };

  const getNext8Days = () => {
    const dates = [];
    for (let i = 0; i < 8; i++) {
      const currentDate = new Date();
      currentDate.setDate(currentDate.getDate() + i);
      const formattedDate = currentDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
      dates.push(formattedDate);
    }
    return dates;
  };

  const generateMorningSlots = () => {
    return ['09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '01:00 PM'];
  };
  const generateEveningSlots = () => {
    return ['03:00 PM', '04:00 PM', '05:00 PM', '06:00 PM', '07:00 PM'];
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  const handleNext = () => {
    setCurrentStep(currentStep + 1);

    if (!selectedDate || !selectedTime) {
      alert('Please select both a date and a time before proceeding.');
      return;
    }
  };

  const handlePrev = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleBack = () => {
    navigate('/doctors');
  };

  const handleSubmit = async () => {
    if (!cardNumber || cardNumber.length < 19) {
      // cardNumber should be 16 digits, which translates to 19 characters including spaces
      alert('Please enter a valid card number.');
      return;
    }
    if (!cardName) {
      alert("Please enter the card holder's name.");
      return;
    }
    if (!cardMonth) {
      alert('Please select the card expiration month.');
      return;
    }
    if (!cardYear) {
      alert('Please select the card expiration year.');
      return;
    }
    if (!cardCvv || cardCvv.length < 3) {
      // CVV should be 3 digits
      alert('Please enter a valid CVV.');
      return;
    }

    // Retrieve patient data from localStorage
    const user = JSON.parse(localStorage.getItem('user'));
    const patientId = user?.login_id;
    const name = user?.name;
    const email = user?.email;

    // Retrieve doctor_id from localStorage
    const selectedDoctorId = localStorage.getItem('doctor_id');

    if (!patientId) {
      console.error('Patient ID not found.');
      // Handle the case where patient ID is not available
      return;
    }

    if (!selectedDoctorId) {
      console.error('Doctor ID not found.');
      // Handle the case where doctor ID is not available
      return;
    }

    if (!selectedDate || !selectedTime) {
      alert('Please select both a date and a time before proceeding.');
      return;
    }

    try {
      // Send form values along with selected date, time, doctor ID, and patient ID to the backend
      await axios.post(`${BASE_URL}/appointments`, {
        doctor_id: selectedDoctorId,
        receptionist_id: 12,
        patient_id: patientId,
        status: 'pending',
        notes: formValues.reasonForVisit,
        fees: 10,
        appointment_date: selectedDate,
        appointment_time: selectedTime,
        time_period: '30 minutes',
        patient_name: name,
        patient_email: email,
      });
      setSubmitted(true);
      // setCurrentStep(currentStep + 1);
    } catch (error) {
      console.error('Error creating appointment:', error);
      // Handle error here
    }
  };

  // Payment Function
  const [currentCardBackground] = useState(Math.floor(Math.random() * 25 + 1));
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardMonth, setCardMonth] = useState('');
  const [cardYear, setCardYear] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [isCardFlipped, setIsCardFlipped] = useState(false);
  const [focusElementStyle, setFocusElementStyle] = useState(null);

  const cardNumberInput = useRef(null);
  const cardNameInput = useRef(null);
  const cardMonthInput = useRef(null);
  const cardYearInput = useRef(null);

  useEffect(() => {
    if (cardNumberInput.current) {
      setFocusElementStyle(cardNumberInput.current.getBoundingClientRect());
    }
  }, []);

  const minCardYear = new Date().getFullYear();

  const handleCardNumberChange = (e) => {
    let { value } = e.target;
    value = value.replace(/\D/g, '').substring(0, 16);
    value = value.replace(/(.{4})/g, '$1 ').trim();
    setCardNumber(value);
  };

  const handleCardNameChange = (e) => {
    const { value } = e.target;
    setCardName(value);
  };

  const handleCardMonthChange = (e) => {
    setCardMonth(e.target.value);
  };

  const handleCardYearChange = (e) => {
    setCardYear(e.target.value);
  };

  const handleCardCvvChange = (e) => {
    let { value } = e.target;
    value = value.substring(0, 3);
    setCardCvv(value);
  };

  const flipCard = (status) => {
    setIsCardFlipped(status);
  };

  const handleFocus = (position) => {
    setFocusElementStyle(position);
  };

  const handleBlur = () => {
    setFocusElementStyle(null);
  };

  return (
    <div
      className="container"
      style={{ marginBottom: '5rem', marginTop: '2rem' }}
    >
      <Steps current={currentStep}>
        <Step title="Select Appointment Date & Time" />
        <Step title="Patient Information" />
        <Step title="Payment" />
      </Steps>

      {currentStep === 0 && (
        <>
          <div className="appointment-schedule">
            <div className="container-ap">
              <div className="info-part">
                <p className="info-head">
                  {' '}
                  Would you like to schedule an Interview? Pick a Date & Time{' '}
                </p>
                <div className="info-box">
                  <div className="info-item">
                    <svg
                      stroke="currentColor"
                      fill="currentColor"
                      strokeWidth="0"
                      viewBox="0 0 512 512"
                      className="icon"
                      height="1em"
                      width="1em"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M320 336c0 8.84-7.16 16-16 16h-96c-8.84 0-16-7.16-16-16v-48H0v144c0 25.6 22.4 48 48 48h416c25.6 0 48-22.4 48-48V288H320v48zm144-208h-80V80c0-25.6-22.4-48-48-48H176c-25.6 0-48 22.4-48 48v48H48c-25.6 0-48 22.4-48 48v80h512v-80c0-25.6-22.4-48-48-48zm-144 0H192V96h128v32z"></path>
                    </svg>
                    <p>With {localStorage.getItem('doctor_id')}</p>
                  </div>
                  <div className="info-item">
                    <svg
                      stroke="currentColor"
                      fill="currentColor"
                      strokeWidth="0"
                      viewBox="0 0 512 512"
                      className="icon"
                      height="1em"
                      width="1em"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M444.52 3.52L28.74 195.42c-47.97 22.39-31.98 92.75 19.19 92.75h175.91v175.91c0 51.17 70.36 67.17 92.75 19.19l191.9-415.78c15.99-38.39-25.59-79.97-63.97-63.97z"></path>
                    </svg>
                    <p>
                      Sylhet, Bangladesh
                      <br />
                      <span className="form-text">
                        1020BD, Amertam, NorthEast, Srimongol
                      </span>
                    </p>
                  </div>
                  <div className="info-item">
                    <svg
                      stroke="currentColor"
                      fill="currentColor"
                      strokeWidth="0"
                      viewBox="0 0 448 512"
                      className="icon"
                      height="1em"
                      width="1em"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M0 464c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V192H0v272zm320-196c0-6.6 5.4-12 12-12h40c6.6 0 12 5.4 12 12v40c0 6.6-5.4 12-12 12h-40c-6.6 0-12-5.4-12-12v-40zm0 128c0-6.6 5.4-12 12-12h40c6.6 0 12 5.4 12 12v40c0 6.6-5.4 12-12 12h-40c-6.6 0-12-5.4-12-12v-40zM192 268c0-6.6 5.4-12 12-12h40c6.6 0 12 5.4 12 12v40c0 6.6-5.4 12-12 12h-40c-6.6 0-12-5.4-12-12v-40zm0 128c0-6.6 5.4-12 12-12h40c6.6 0 12 5.4 12 12v40c0 6.6-5.4 12-12 12h-40c-6.6 0-12-5.4-12-12v-40zM64 268c0-6.6 5.4-12 12-12h40c6.6 0 12 5.4 12 12v40c0 6.6-5.4 12-12 12H76c-6.6 0-12-5.4-12-12v-40zm0 128c0-6.6 5.4-12 12-12h40c6.6 0 12 5.4 12 12v40c0 6.6-5.4 12-12 12H76c-6.6 0-12-5.4-12-12v-40zM400 64h-48V16c0-8.8-7.2-16-16-16h-32c-8.8 0-16 7.2-16 16v48H160V16c0-8.8-7.2-16-16-16h-32c-8.8 0-16 7.2-16 16v48H48C21.5 64 0 85.5 0 112v48h448v-48c0-26.5-21.5-48-48-48z"></path>
                    </svg>
                    <p>
                      {selectedDate
                        ? `Selected Date - ${selectedDate}`
                        : 'Date'}
                      ,{' '}
                      {selectedTime
                        ? `Selected Time - ${selectedTime}`
                        : 'Time'}
                    </p>
                  </div>
                </div>
              </div>
              <div className="calender-div">
                <div className="calender-date">
                  <p className="calender-p">
                    {selectedDate
                      ? `Selected Date - ${selectedDate}`
                      : 'Select Appointment Date'}
                  </p>
                  <div className="date-picker">
                    {getNext8Days().map((date) => (
                      <button
                        key={date}
                        className={`btn date-btn ${selectedDate === date ? 'active' : ''}`}
                        onClick={() => handleDateClick(date)}
                      >
                        {date}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="calender-time">
                  <p className="calender-p">
                    {selectedTime
                      ? `Selected Time - ${selectedTime}`
                      : 'Select Appointment Time'}
                  </p>
                  <div className="date-picker">
                    <div>
                      <p>Morning Time</p>
                      {generateMorningSlots().map((time) => (
                        <button
                          key={time}
                          className={`btn time-btn ${selectedTime === time ? 'active' : ''}`}
                          onClick={() => handleTimeClick(time)}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                    <div>
                      <p>Evening Time</p>
                      {generateEveningSlots().map((time) => (
                        <button
                          key={time}
                          className={`btn time-btn ${selectedTime === time ? 'active' : ''}`}
                          onClick={() => handleTimeClick(time)}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="appointment-btn">
            <button onClick={handleBack}>Back</button>
            <button
              type="primary"
              onClick={handleNext}
              disabled={!selectedDate || !selectedTime}
              className="next"
            >
              Next
            </button>
          </div>
        </>
      )}

      {currentStep === 1 && (
        <>
          <div className="appointment-schedule">
            <div className="container-ap">
              <div className="appointment-form">
                <form className="ap-form">
                  {/* {appointments.map(appointment => (
                    <div key={appointment.appointment_id}>
                      <label>Name: </label>
                      <p>{appointment.patient_name}</p>
                      <label>Email: </label>
                      <p>{appointment.patient_email}</p>
                      <label>Number: </label>
                      <p>{appointment.patient_number}</p>
                    </div>
                  ))} */}
                  <label htmlFor="reason">Reason for Visit</label>
                  <input
                    id="reason"
                    className="ap-form-input"
                    name="reasonForVisit"
                    value={formValues.reasonForVisit}
                    onChange={(event) => {
                      const inputValue = event.target.value;
                      const regex = /^[A-Za-z ]*$/; // Updated regex to allow spaces
                      if (regex.test(inputValue)) {
                        handleInputChange(event);
                      }
                    }}
                    required
                  />
                </form>
              </div>
            </div>
            <div className="appointment-btn">
              <button onClick={handlePrev}>Previous</button>
              {/* <button type="primary" onClick={handleNext} className="next">Next</button> */}
              <button
                type="button"
                onClick={handleNext}
                className="next"
                disabled={!formValues.reasonForVisit.trim()} // Disable if input is empty or only whitespace
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}
      {currentStep === 2 && (
        <>
          {submitted ? (
            <Row>
              <Col>
                {/* <h2>Order Successful</h2> */}
                <div className="os-maincon">
                  <div style={{ textAlign: 'center' }} className="right-icon">
                    <IoMdCheckmarkCircleOutline />
                  </div>
                  <div className="bg-white p-6  md:mx-auto ">
                    <div className="text-center">
                      <h2 className="md:text-2xl text-base text-gray-900 font-semibold text-center">
                        Payment Done!
                      </h2>
                      <p className="text-gray-600 my-2">
                        Thank you for completing your secure online payment.
                      </p>
                      <p> Have a great day! </p>
                      <div className="link-btn">
                        <Link
                          to="/"
                          className="home-link-btn"
                          style={{ textDecoration: 'none' }}
                        >
                          GO BACK
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          ) : (
            <div className="main-div-payment">
              <div className="wrapper">
                <div className="card-form">
                  <div className="card-list">
                    <div
                      className={`card-item ${isCardFlipped ? '-active' : ''}`}
                    >
                      <div className="card-item__side -front">
                        <div
                          className={`card-item__focus ${focusElementStyle ? '-active' : ''}`}
                          style={focusElementStyle}
                        ></div>
                        <div className="card-item__cover">
                          <img
                            src={`https://raw.githubusercontent.com/muhammederdem/credit-card-form/master/src/assets/images/${currentCardBackground}.jpeg`}
                            className="card-item__bg"
                            alt="Card Background"
                          />
                        </div>
                        <div className="card-item__wrapper">
                          <div className="card-item__top">
                            <img
                              src={chip}
                              alt="Card Chip"
                              className="card-item__chip"
                            />
                            <div className="card-item__type"></div>
                          </div>
                          <label className="card-item__number">
                            {cardNumber || '#### #### #### ####'}
                          </label>
                          <div className="card-item__content">
                            <label className="card-item__info">
                              <div className="card-item__holder">
                                Card Holder
                              </div>
                              <div className="card-item__name">
                                {cardName || 'FULL NAME'}
                              </div>
                            </label>
                            <div className="card-item__date">
                              <span className="card-item__dateTitle">
                                Expires
                              </span>
                              <span className="card-item__dateItem">
                                {cardMonth || 'MM'}/{cardYear || 'YY'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="card-item__side -back">
                        <div className="card-item__cover">
                          <img
                            src={`https://raw.githubusercontent.com/muhammederdem/credit-card-form/master/src/assets/images/${currentCardBackground}.jpeg`}
                            className="card-item__bg"
                            alt="Card Background"
                          />
                        </div>
                        <div className="card-item__band"></div>
                        <div className="card-item__cvv">
                          <div className="card-item__cvvTitle">CVV</div>
                          <div className="card-item__cvvBand">{cardCvv}</div>
                          <div className="card-item__type"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="">
                    <div className="card-form__inner">
                      <div className="card-input">
                        <label
                          htmlFor="cardNumber"
                          className="card-input__label"
                        >
                          Card Number
                        </label>
                        <input
                          type="text"
                          id="cardNumber"
                          className="card-input__input"
                          ref={cardNumberInput}
                          value={cardNumber}
                          onChange={handleCardNumberChange}
                          onFocus={() =>
                            setFocusElementStyle(
                              cardNumberInput.current.getBoundingClientRect()
                            )
                          }
                          onBlur={handleBlur}
                          autoComplete="off"
                          required
                        />
                      </div>
                      <div className="card-input">
                        <label htmlFor="cardName" className="card-input__label">
                          Card Holder
                        </label>
                        <input
                          type="text"
                          id="cardName"
                          className="card-input__input"
                          ref={cardNameInput}
                          value={cardName}
                          onChange={(event) => {
                            const inputValue = event.target.value;
                            const regex = /^[A-Za-z\s]*$/;
                            if (regex.test(inputValue)) {
                              handleCardNameChange(event);
                            }
                          }}
                          onFocus={() =>
                            handleFocus(
                              cardNameInput.current.getBoundingClientRect()
                            )
                          }
                          onBlur={handleBlur}
                          autoComplete="off"
                          required
                        />
                      </div>
                      <div className="card-form__row">
                        <div className="card-form__col">
                          <div className="card-form__group">
                            <label
                              htmlFor="cardMonth"
                              className="card-input__label"
                            >
                              Expiration Date
                            </label>
                            <select
                              className="card-input__input -select"
                              id="cardMonth"
                              ref={cardMonthInput}
                              value={cardMonth}
                              onChange={handleCardMonthChange}
                              onFocus={() =>
                                handleFocus(
                                  cardMonthInput.current.getBoundingClientRect()
                                )
                              }
                              onBlur={handleBlur}
                              required
                            >
                              <option value="" disabled>
                                Month
                              </option>
                              {[...Array(12).keys()].map((n) => (
                                <option
                                  key={n + 1}
                                  value={n + 1 < 10 ? '0' + (n + 1) : n + 1}
                                >
                                  {n + 1 < 10 ? '0' + (n + 1) : n + 1}
                                </option>
                              ))}
                            </select>
                            <select
                              className="card-input__input -select"
                              id="cardYear"
                              ref={cardYearInput}
                              value={cardYear}
                              onChange={handleCardYearChange}
                              onFocus={() =>
                                handleFocus(
                                  cardYearInput.current.getBoundingClientRect()
                                )
                              }
                              onBlur={handleBlur}
                              required
                            >
                              <option value="" disabled>
                                Year
                              </option>
                              {[...Array(12).keys()].map((n) => (
                                <option
                                  key={minCardYear + n}
                                  value={minCardYear + n}
                                >
                                  {minCardYear + n}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                        <div className="card-form__col -cvv">
                          <div className="card-input">
                            <label
                              htmlFor="cardCvv"
                              className="card-input__label"
                            >
                              CVV
                            </label>
                            <input
                              type="text"
                              className="card-input__input"
                              id="cardCvv"
                              value={cardCvv}
                              onChange={(event) => {
                                const inputValue = event.target.value;
                                // Regular expression to match only numbers
                                const regex = /^[0-9]*$/;
                                if (regex.test(inputValue)) {
                                  handleCardCvvChange(event);
                                }
                              }}
                              onFocus={() => flipCard(true)}
                              onBlur={() => flipCard(false)}
                              autoComplete="off"
                              required
                            />
                          </div>
                        </div>
                      </div>
                      <button
                        className="card-form__button"
                        onClick={handleSubmit}
                      >
                        Submit
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="appointment-schedule">
                <div className="container-ap">
                  <div className="appointment-payment">
                    <div className="ap-booking-details">
                      <div className="booking-item">
                        <ul className="booking-date">
                          <li>
                            Date <span>{selectedDate}</span>
                          </li>
                          <li>
                            Time <span>{selectedTime}</span>
                          </li>
                        </ul>
                        <ul className="booking-fee">
                          <li>
                            Consulting Fee <span>$60</span>
                          </li>
                          <li>
                            Booking Fee <span>$10</span>
                          </li>
                          <li>
                            Vat (Including 15%) <span>$9</span>
                          </li>
                        </ul>
                        <ul className="booking-total">
                          <li className="booking-total-li">
                            <span>Total</span>
                            <span className="total-cost"> $79</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AppointmentScheduler;
