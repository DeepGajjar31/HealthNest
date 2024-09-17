import React from 'react';
import './App.css';

const AboutPage = () => {
  return (
    <>
      <div className="about-page">
        <h2>Health Nest</h2>
        <h5 className="text-center">
          Welcome to our Doctor Appointment System!
        </h5>
        <p className="about-p">
          Welcome to Healthnest , where your health and well-being are our top
          priorities. We are dedicated to providing exceptional medical care
          through a seamless and user-friendly appointment system designed to
          meet the diverse needs of our patients.
        </p>
        <p className="about-p">
          What We Offer
          <p className="about-p lst">
            <b> Appointment Booking : </b> Easily schedule appointments with
            healthcare professionals through our intuitive booking system.
            Choose from a range of available time slots and get instant
            confirmation.Receive reminders for upcoming appointments and the
            option to reschedule or cancel with ease. Our platform ensures a
            hassle-free experience for both patients and providers.
          </p>
          <p className="about-p lst">
            <b> Recomandation : </b> Receive personalized recommendations for
            doctors and healthcare services based on your medical history,
            preferences, and location. Our advanced algorithms ensure you find
            the best match for your needs.Get suggestions for relevant
            specialists and healthcare facilities, enhancing your overall
            healthcare journey. Stay informed with tailored health tips and
            advice.
          </p>
          <p className="about-p lst">
            <b> Search Doctors : </b>Quickly find doctors by specialty,
            location, availability, and ratings. Our comprehensive database
            allows you to compare and select the right healthcare provider for
            you.Read detailed profiles, patient reviews, and see the
            doctor&apos;s credentials to make an informed decision. Our
            user-friendly search filters help you narrow down the best options
            effortlessly.
          </p>
          <p className="about-p lst">
            <b> DashBoard For Doctors : </b> A dedicated dashboard for doctors
            to manage their appointments, view patient records, and track their
            schedule. The dashboard provides real-time updates and notifications
            to keep everything organized.Doctors can also access analytics and
            insights on patient interactions, improving efficiency and patient
            care. Customizable features allow doctors to tailor the dashboard to
            their practice needs.
          </p>
          <p className="about-p lst">
            <b> Patient Management : </b>Efficiently manage patient information,
            medical records, and treatment plans. Our system ensures secure and
            easy access to patient data, enabling better healthcare delivery and
            coordination.Facilitate seamless communication between patients and
            healthcare providers through integrated messaging. Our platform also
            supports the tracking of patient progress and follow-ups, ensuring
            continuous care.
          </p>
        </p>
        <p className="about-last">
          Thank you for choosing Health Nest. We look forward to serving you and
          helping you achieve better health.
        </p>
      </div>
    </>
  );
};

export default AboutPage;
