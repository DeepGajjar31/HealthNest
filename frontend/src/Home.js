import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaCheckDouble, FaClock, FaHeadset, FaHouseUser } from 'react-icons/fa';
import axios from 'axios';
import img1 from './images/specialities-01.png';
import img2 from './images/specialities-02.png';
import img3 from './images/specialities-03.png';
import img4 from './images/specialities-04.png';
import img5 from './images/specialities-05.png';
import { BASE_URL } from './config';

function Home() {
  const user = JSON.parse(localStorage.getItem('user'));
  const userRole = user ? user.role : '';

  const [filter] = useState({
    name: '',
    specialization: '',
    fees: '',
    location: '',
  });
  const [doctors, setDoctors] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [mobile, setMobile] = useState('');
  const [aadhaar, setAadhaar] = useState('');
  const [gender, setGender] = useState('');
  const [dob, setDob] = useState('');
  const [age, setAge] = useState(null);
  const [maxBirthDate, setMaxBirthDate] = useState('');
  const [address, setAddress] = useState('');
  const [insurance, setInsurance] = useState('');

  const [specialization, setSpecialization] = useState('');
  const [experience, setExperience] = useState('');
  const [education, setEducation] = useState('');
  const [fees, setFees] = useState('');
  const [hospital, setHospital] = useState('');
  const [hospital_loc, setHospital_loc] = useState('');

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

  const filteredDoctors = doctors.filter(
    (doctor) =>
      doctor.name.toLowerCase().includes(filter.name.toLowerCase()) &&
      doctor.specialization
        .toLowerCase()
        .includes(filter.specialization.toLowerCase()) &&
      (filter.fees === '' || doctor.fees.includes(filter.fees)) &&
      (filter.location === '' ||
        doctor.location.toLowerCase().includes(filter.location.toLowerCase()))
  );

  useEffect(() => {
    const maxDate = new Date();
    maxDate.setFullYear(maxDate.getFullYear() - 18);
    setMaxBirthDate(maxDate.toISOString().split('T')[0]);

    const fetchUserProfile = async () => {
      try {
        const userString = localStorage.getItem('user');
        if (!userString) {
          console.error('User not found in localStorage');
          return;
        }
        const { email } = JSON.parse(userString);

        if (userRole === 'Patient') {
          const response = await axios.get(
            `${BASE_URL}/patients/email/${email}`
          );
          const { number, adhar_no, gender, dob, address, insurance } =
            response.data;
          setMobile(number || '');
          setAadhaar(adhar_no || '');
          setGender(gender || '');
          setDob(dob || '');
          setAddress(address || '');
          setInsurance(insurance || '');
          if (
            !number ||
            !adhar_no ||
            !gender ||
            !dob ||
            !address ||
            !insurance
          ) {
            const popupShown = sessionStorage.getItem('popupShown');
            if (!popupShown) {
              setShowPopup(true);
              sessionStorage.setItem('popupShown', 'true');
            }
          }
        } else if (userRole === 'Doctor') {
          const response = await axios.get(
            `${BASE_URL}/doctors/email/${email}`
          );
          const {
            number,
            gender,
            dob,
            hospital_loc,
            education,
            experience,
            fees,
            hospital,
            specialization,
          } = response.data;
          setMobile(number || '');
          setGender(gender || '');
          setDob(dob || '');
          setHospital(hospital_loc || '');
          setEducation(education || '');
          setExperience(experience || '');
          setFees(fees || '');
          setHospital_loc(hospital || '');
          setSpecialization(specialization || '');
          if (
            !number ||
            !gender ||
            !dob ||
            !hospital_loc ||
            !education ||
            !experience ||
            !fees ||
            !hospital ||
            !specialization
          ) {
            const popupShown = sessionStorage.getItem('popupShown');
            if (!popupShown) {
              setShowPopup(true);
              sessionStorage.setItem('popupShown', 'true');
            }
          }
        }
      } catch (error) {
        console.error('Failed to fetch user profile:', error);
      }
    };
    fetchUserProfile();
  }, [userRole]);

  const bufferToBase64 = (buffer) => {
    let binary = '';
    const bytes = new Uint8Array(buffer.data);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userString = localStorage.getItem('user');
      if (!userString) {
        console.error('User not found in localStorage');
        return;
      }

      const { email } = JSON.parse(userString);

      let postData = {
        mobile,
        gender,
        dob,
        email,
      };

      if (userRole === 'Patient') {
        postData = {
          ...postData,
          aadhaar,
          address,
          insurance,
        };
      } else if (userRole === 'Doctor') {
        postData = {
          ...postData,
          education,
          experience,
          fees,
          hospital,
          hospital_loc,
          specialization,
        };
      }

      const response = await axios.post(
        `${BASE_URL}/${userRole === 'Patient' ? 'patients' : 'doctors'}/saveProfile`,
        postData
      );

      console.log(response.data);
      setShowPopup(false);
      sessionStorage.setItem('popupShown', 'true');
    } catch (error) {
      console.error(
        `Failed to submit ${userRole === 'Patient' ? 'patient' : 'doctor'} details:`,
        error
      );
    }
  };

  const handleMobileChange = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value) && value.length <= 10) {
      setMobile(value);
    }
  };
  const handleAadhaarChange = (e) => {
    const value = e.target.value.replace(/\s/g, '');
    if (/^\d*$/.test(value) && value.length <= 12) {
      setAadhaar(value);
    }
  };
  const handleGenderChange = (e) => {
    setGender(e.target.value);
  };
  const handleDobChange = (e) => {
    const value = e.target.value;
    setDob(value);
    calculateAge(value);
  };
  const handleInsuranceChange = (e) => {
    setInsurance(e.target.value);
  };
  const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const today = new Date();
    if (birthDate > today) {
      setAge(null);
    } else {
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDifference = today.getMonth() - birthDate.getMonth();
      if (
        monthDifference < 0 ||
        (monthDifference === 0 && today.getDate() < birthDate.getDate())
      ) {
        age--;
      }
      setAge(Math.min(age, 110));
    }
  };

  const handleAddressChange = (e) => {
    setAddress(e.target.value);
  };
  const handleEducationChange = (e) => {
    setEducation(e.target.value);
  };
  const handleSpecializationChange = (e) => {
    setSpecialization(e.target.value);
  };
  const handleHospitalNameChange = (e) => {
    setHospital(e.target.value);
  };
  const handleHospitalAddressChange = (e) => {
    setHospital_loc(e.target.value);
  };
  const handleFeesChange = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value) && value.length <= 4) {
      setFees(value);
    }
  };
  const handleExperienceChange = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value) && value.length <= 2) {
      setExperience(value);
    }
  };

  return (
    <>
      {showPopup && (
        <div className="popup">
          <div className="popup-content">
            <button
              className="close-popup"
              onClick={() => setShowPopup(false)}
              aria-label="Close"
            >
              &times;
            </button>
            <h2>Complete Your Profile</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                {(userRole === 'Patient' || userRole === 'Doctor') && (
                  <>
                    <label htmlFor="mobile">Mobile No:</label>
                    <input
                      type="tel"
                      className="form-control"
                      id="mobile"
                      placeholder="Enter Your Mobile Number"
                      value={mobile}
                      onChange={handleMobileChange}
                      required
                    />
                    {mobile.length > 0 && mobile.length < 10 && (
                      <small className="text-danger">
                        Mobile number must be exactly 10 digits long
                      </small>
                    )}
                  </>
                )}
                {userRole === 'Doctor' && (
                  <>
                    <label htmlFor="specialization">Specialization:</label>
                    <select
                      className="form-control"
                      id="specialization"
                      value={specialization}
                      onChange={handleSpecializationChange}
                      required
                    >
                      <option value="">Select Specialization</option>
                      <option value="Orthopedic">Orthopedic</option>
                      <option value="Cardiologist">Cardiologist</option>
                      <option value="Dentists">Dentists</option>
                      <option value="Pediatrician">Pediatrician</option>
                      <option value="Gynecologist">Gynecologist</option>
                      <option value="Psychiatrist">Psychiatrist</option>
                      <option value="Neurologist">Neurologist</option>
                    </select>
                  </>
                )}
                {userRole === 'Doctor' && (
                  <>
                    <label htmlFor="experience">Experience:</label>
                    <input
                      type="text"
                      className="form-control"
                      id="experience"
                      placeholder="Enter Your Experience (In Year)"
                      value={experience}
                      onChange={handleExperienceChange}
                      required
                      maxLength={2}
                    />
                  </>
                )}
                {userRole === 'Doctor' && (
                  <>
                    <label htmlFor="education">Education:</label>
                    <input
                      type="text"
                      className="form-control"
                      id="education"
                      placeholder="Enter Your Education"
                      value={education}
                      onChange={handleEducationChange}
                      required
                    />
                  </>
                )}
                {(userRole === 'Patient' || userRole === 'Doctor') && (
                  <>
                    <label htmlFor="gender">Gender:</label>
                    <select
                      className="form-control"
                      id="gender"
                      value={gender}
                      onChange={handleGenderChange}
                      required
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </>
                )}
                {(userRole === 'Patient' || userRole === 'Doctor') && (
                  <>
                    <label htmlFor="dob">Date of Birth:</label>
                    <input
                      type="date"
                      className="form-control"
                      id="dob"
                      value={dob}
                      onChange={handleDobChange}
                      max={maxBirthDate}
                      required
                    />
                    {age !== null && <p>Age: {age} years</p>}
                  </>
                )}
                {userRole === 'Patient' && (
                  <>
                    <label htmlFor="aadhaar">Aadhaar Card No:</label>
                    <input
                      type="text"
                      className="form-control"
                      id="aadhaar"
                      placeholder="Enter Your Aadhaar Number"
                      value={aadhaar}
                      onChange={handleAadhaarChange}
                      required
                    />
                    {aadhaar.replace(/\s/g, '').length > 0 &&
                      aadhaar.replace(/\s/g, '').length < 12 && (
                        <small className="text-danger">
                          Aadhaar number must be exactly 12 digits long
                        </small>
                      )}
                  </>
                )}
                {userRole === 'Patient' && (
                  <>
                    <label htmlFor="insurance">Insurance:</label>
                    <select
                      className="form-control"
                      id="insurance"
                      value={insurance}
                      onChange={handleInsuranceChange}
                      required
                    >
                      <option value="">Select Insurance</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </>
                )}
                {userRole === 'Patient' && (
                  <>
                    <label htmlFor="address">Address:</label>
                    <input
                      type="text"
                      className="form-control"
                      id="address"
                      placeholder="Enter Your Address"
                      value={address}
                      onChange={handleAddressChange}
                      required
                    />
                  </>
                )}
                {userRole === 'Doctor' && (
                  <>
                    <label htmlFor="hospital-name">Hospital Name:</label>
                    <input
                      type="text"
                      className="form-control"
                      id="hospital-name"
                      placeholder="Enter Your Hospital Name"
                      value={hospital}
                      onChange={handleHospitalNameChange}
                      required
                    />
                  </>
                )}
                {userRole === 'Doctor' && (
                  <>
                    <label htmlFor="hospital-address">Hospital Address:</label>
                    <input
                      type="text"
                      className="form-control"
                      id="hospital-address"
                      placeholder="Enter Your Hospital Address"
                      value={hospital_loc}
                      onChange={handleHospitalAddressChange}
                      required
                    />
                  </>
                )}
                {userRole === 'Doctor' && (
                  <>
                    <label htmlFor="fees">Fees:</label>
                    <input
                      type="text"
                      className="form-control"
                      id="fees"
                      placeholder="Enter Your Fees"
                      value={fees}
                      onChange={handleFeesChange}
                      required
                      maxLength={4}
                    />
                  </>
                )}
              </div>
              <button type="submit" className="pop-up-btn">
                Submit
              </button>
            </form>
          </div>
        </div>
      )}
      <section id="hero" className="d-flex align-items-center">
        <div className="container">
          <div>
            <p>TOTAL HEALTH CARE SOLUTION</p>
            <h1>
              Your Most Trusted <br />
              Health Partner
            </h1>
            <p className="hero-p">
              A repudiandae ipsam labore ipsa voluptatum quidem quae laudantium
              quisquam aperiam maiores sunt fugit,
            </p>
            <p className="hero-p">deserunt rem suscipit placeat.</p>
          </div>
        </div>
      </section>
      <section className="why-us mt-5 mt-md-0">
        <div className="container">
          <div className="row">
            <div className="col-lg-4 d-flex align-items-stretch">
              <div className="content">
                <h3>Why Choose Us?</h3>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Duis aute irure dolor in reprehenderit Asperiores dolores sed
                  et. Tenetur quia eos. Autem tempore quibusdam vel
                  necessitatibus optio ad corporis.
                </p>
                <div className="text-center">
                  <Link
                    style={{ textDecoration: 'none' }}
                    to={'/about'}
                    className="more-btn"
                  >
                    Learn More <i className="bx bx-chevron-right"></i>
                  </Link>
                </div>
              </div>
            </div>
            <div className="col-lg-8 d-flex align-items-stretch">
              <div className="icon-boxes d-flex flex-column justify-content-center">
                <div className="row">
                  <div className="col-xl-4 d-flex align-items-stretch">
                    <div className="icon-box mt-4 mt-xl-0">
                      <FaHouseUser className="icon" />
                      <h4>Appointment</h4>
                      <small className="text-secondary">24 Hours Service</small>
                      <p>
                        Consequuntur sunt aut quasi enim aliquam quae harum
                        pariatur laboris nisi ut aliquip
                      </p>
                    </div>
                  </div>
                  <div className="col-xl-4 d-flex align-items-stretch">
                    <div className="icon-box mt-4 mt-xl-0">
                      <FaHeadset className="icon" />
                      <h4>Emergency Cases</h4>
                      <h6 className="text-secondary">+88 01751 040425</h6>
                      <p>
                        Lorem ipsum dolor, sit amet consectetur adipisicing
                        elit. Qui facilis perferendis quia maxime. Laborum
                        excepturi pariatur laboriosam nihil, dolor molestias.
                      </p>
                    </div>
                  </div>
                  <div className="col-xl-4 d-flex align-items-stretch">
                    <div className="icon-box mt-4 mt-xl-0">
                      <FaClock className="icon" />
                      <h4>Working Hours</h4>
                      <small className="text-secondary">Timing schedule</small>
                      <ul className="list-group list-group-flush">
                        <li className="list-group-item d-flex justify-content-between text-nowrap">
                          <p>Sun - Wed : </p> <p>8:00 - 17: 00</p>
                        </li>
                        <li className="list-group-item d-flex justify-content-between text-nowrap">
                          <p>Thus - Fri : </p> <p>9:00 - 17: 00</p>
                        </li>
                        <li className="list-group-item d-flex justify-content-between text-nowrap">
                          <p>Sat - Sun : </p> <p>10:00 - 17: 00</p>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="reco-doc">
        <div className="container-fluid">
          {(!user || userRole === 'Patient' || userRole === 'Admin') && (
            <div className="mb-5 mt-100 section-title text-center reco-doc-card">
              <h2>Recommended Doctors</h2>
              <div className="cardContainer">
                {filteredDoctors.slice(0, 5).map((doctor, index) => (
                  <div key={index} className="card">
                    <img
                      src={`data:image/jpeg;base64,${bufferToBase64(doctor.doc_pic)}`}
                      alt={doctor.name}
                      className="image"
                    />
                    <h3>{doctor.name}</h3>
                    <p>
                      <strong>Specialization:</strong> {doctor.specialization}
                    </p>
                    <p>
                      <strong>Fees:</strong> {doctor.fees}
                    </p>
                    <p>
                      <strong>Location:</strong> {doctor.location}
                    </p>
                    <p>{doctor.description}</p>
                    {/* {userRole === 'Admin' && }
                                        <Link to="/doctors" className="bookButton" style={{ textDecoration: 'none' }}>Book Appointment</Link> */}
                    {userRole !== 'Admin' ? (
                      <Link
                        to="/doctors"
                        className="bookButton"
                        style={{ textDecoration: 'none' }}
                      >
                        Book Appointment
                      </Link>
                    ) : (
                      <p className="bookButton">
                        Admins cannot book appointments
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="section section-specialities position-relative">
        <div className="container-fluid">
          <div className="mb-5 section-title text-center spec-header">
            <h2>Clinic and Specialities</h2>
            <p className="m-0">
              Lorem ipsum dolor sit amet consectetur adipisicing.
            </p>
          </div>

          <div className="row justify-content-center">
            <div className="col-md-9">
              <div className="specialities-slider d-flex justify-content-center align-items-center gap-5">
                <div className="speicality-item text-center">
                  <div className="speicality-img">
                    <img src={img1} className="img-fluid" alt="" />
                    <span>
                      <i>
                        <FaCheckDouble />
                      </i>
                    </span>
                  </div>
                  <p>Urology</p>
                </div>
                <div className="speicality-item text-center">
                  <div className="speicality-img">
                    <img src={img2} className="img-fluid" alt="" />
                    <span>
                      <i>
                        <FaCheckDouble />
                      </i>
                    </span>
                  </div>
                  <p>Neurology</p>
                </div>
                <div className="speicality-item text-center">
                  <div className="speicality-img">
                    <img src={img3} className="img-fluid" alt="" />
                    <span>
                      <i>
                        <FaCheckDouble />
                      </i>
                    </span>
                  </div>
                  <p>Orthopedic</p>
                </div>
                <div className="speicality-item text-center">
                  <div className="speicality-img">
                    <img src={img4} className="img-fluid" alt="" />
                    <span>
                      <i>
                        <FaCheckDouble />
                      </i>
                    </span>
                  </div>
                  <p>Cardiologist</p>
                </div>
                <div className="speicality-item text-center">
                  <div className="speicality-img">
                    <img src={img5} className="img-fluid" alt="" />
                    <span>
                      <i>
                        <FaCheckDouble />
                      </i>
                    </span>
                  </div>
                  <p>Dentist</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Home;
