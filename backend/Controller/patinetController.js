// Controller/patientController.js
const { debugError } = require('../logger'); // Adjust the path as necessary
const db = require('../db');

// Get all patients
exports.getAllPatients = (req, res) => {
  const sql = 'SELECT * FROM patient';
  db.query(sql, (err, data) => {
    if (err) {
      debugError('Database error:', err); // Use debugError for logging errors
      return res.status(500).json({
        status: 'error',
        statusCode: 500,
        message: 'Database error',
      });
    }
    return res.status(200).json({
      status: 'success',
      statusCode: 200,
      data,
    });
  });
};
// Get patient by patient_id
exports.getPatientById = (req, res) => {
  const sql = 'SELECT * FROM patient WHERE patient_id = ?';
  db.query(sql, [req.params.id], (err, data) => {
    if (err) {
      debugError('Database error:', err); // Use debugError for logging errors
      return res.status(500).json({
        status: 'error',
        statusCode: 500,
        message: 'Database error',
      });
    }
    if (data.length > 0) {
      return res.status(200).json({
        status: 'success',
        statusCode: 200,
        data: data[0],
      });
    } else {
      return res.status(404).json({
        status: 'error',
        statusCode: 404,
        message: 'Patient not found',
      });
    }
  });
};

// Create new patient
exports.createPatient = (req, res) => {
  const sql = `
    INSERT INTO patient (
      email, password, role, age, gender, address, number, insurance, adhar_no, created_at, name, dob, patient_pic
    ) VALUES (?)
  `;
  const values = [
    req.body.email,
    req.body.password,
    req.body.role,
    req.body.age,
    req.body.gender,
    req.body.address,
    req.body.number,
    req.body.insurance,
    req.body.adhar_no,
    new Date(), // created_at, set to current date and time
    req.body.name,
    req.body.dob,
    req.body.patient_pic,
  ];

  db.query(sql, [values], (err) => {
    if (err) {
      debugError('Database error:', err); // Use debugError for logging errors
      return res.status(500).json('Error');
    }
    return res.json('Success');
  });
};

// Update patient by patient_id
exports.updatePatientById = (req, res) => {
  const sql = `
    UPDATE patient SET 
      email=?, password=?, role=?, age=?, gender=?, address=?, number=?, insurance=?, adhar_no=?, name=?, dob=?, patient_pic=?
    WHERE patient_id=?
  `;
  const values = [
    req.body.email,
    req.body.password,
    req.body.role,
    req.body.age,
    req.body.gender,
    req.body.address,
    req.body.number,
    req.body.insurance,
    req.body.adhar_no,
    req.body.name,
    req.body.dob,
    req.body.patient_pic,
    req.params.id,
  ];

  db.query(sql, values, (err, data) => {
    if (err) {
      debugError('Database error:', err); // Use debugError for error logging
      return res.status(500).json('Error');
    }
    if (data.affectedRows > 0) {
      return res.json('Success');
    } else {
      return res.status(404).json('Patient not found');
    }
  });
};

exports.updatePatient = (req, res) => {
  const { patient_id } = req.params;
  const { name, email, number, adhar_no, dob, gender, insurance, address } =
    req.body;

  const sql =
    'UPDATE patient SET name = ?, email = ?, number = ?, adhar_no = ?, dob = ?, gender = ?, insurance = ?, address = ? WHERE patient_id = ?';
  db.query(
    sql,
    [
      name,
      email,
      number,
      adhar_no,
      dob,
      gender,
      insurance,
      address,
      patient_id,
    ],
    (err) => {
      if (err) {
        debugError('Database error:', err); // Use debugError for error logging
        return res.status(500).json('Error');
      }
      return res.json('Patient updated successfully');
    }
  );
};

// Delete patient by patient_id
exports.deletePatientById = (req, res) => {
  const sql = 'DELETE FROM patient WHERE patient_id = ?';
  db.query(sql, [req.params.id], (err, data) => {
    if (err) {
      debugError('Database error:', err); // Use debugError for error logging
      return res.status(500).json('Error');
    }
    if (data.affectedRows > 0) {
      return res.json('Success');
    } else {
      return res.status(404).json('Patient not found');
    }
  });
};

exports.saveProfile = (req, res) => {
  const { mobile, gender, dob, aadhaar, insurance, address, email } = req.body;

  // Check if the user exists in the login table
  const checkUserSql =
    'SELECT login_id, name, email, password, role FROM login WHERE email = ?';
  db.query(checkUserSql, [email], (err, result) => {
    if (err) {
      debugError('Database error:', err); // Use debugError for error logging
      return res.status(500).json({ error: 'Failed to save profile' });
    }

    if (result.length === 0) {
      // User not found in the login table
      return res.status(404).json({ error: 'User not found' });
    }

    const { login_id } = result[0];

    // Check if the patient already exists
    const checkPatientSql = 'SELECT * FROM patient WHERE login_id = ?';
    db.query(checkPatientSql, [login_id], (err, existingPatient) => {
      if (err) {
        debugError('Database error:', err); // Use debugError for logging errors
        return res.status(500).json({ error: 'Failed to save profile' });
      }

      if (existingPatient.length > 0) {
        const patient = existingPatient[0];

        // Check if the required fields are empty
        const shouldUpdate =
          !patient.number ||
          !patient.adhar_no ||
          !patient.gender ||
          !patient.dob ||
          !patient.insurance ||
          !patient.address;

        if (shouldUpdate) {
          // Update the existing patient record
          const updateSql =
            'UPDATE patient SET number = ?, adhar_no = ?, gender = ?, dob = ?, insurance = ?, address = ? WHERE login_id = ?';
          const updateValues = [
            mobile,
            aadhaar,
            gender,
            dob,
            insurance,
            address,
            login_id,
          ];

          db.query(updateSql, updateValues, (err) => {
            if (err) {
              debugError('Error updating patient details:', err); // Use debugError for logging errors
              return res.status(500).json({ error: 'Internal Server Error' });
            }

            return res.json({
              message: 'Patient details updated successfully',
            });
          });
        } else {
          return res.json({ message: 'Patient details are already complete' });
        }
      } else {
        return res.status(404).json({ error: 'Patient not found' });
      }
    });
  });
};
