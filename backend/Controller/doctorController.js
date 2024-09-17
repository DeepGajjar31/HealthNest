const db = require('../db');
const { debugError } = require('../logger');
// Get all doctors
exports.getAllDoctors = (req, res) => {
  const sql = 'SELECT * FROM doctor';
  db.query(sql, (err, data) => {
    if (err) {
      debugError('Database error:', err); // Replace console.error with debugError
      return res.status(500).json('Error');
    }
    return res.json(data);
  });
};

// Get doctor by doctor_id
exports.getDoctorById = (req, res) => {
  const sql = 'SELECT * FROM doctor WHERE doctor_id = ?';
  db.query(sql, [req.params.id], (err, data) => {
    if (err) {
      debugError('Database error:', err); // Use debugError instead of console.error
      return res.status(500).json('Error');
    }
    if (data.length > 0) {
      return res.json(data[0]);
    } else {
      return res.status(404).json('Doctor not found');
    }
  });
};

// Create new doctor
exports.createDoctor = (req, res) => {
  const sql = `
    INSERT INTO doctor (
      name, email, password, role, age, gender, hospital, number, specialization, experience, doc_pic, dob, hospital_loc
    ) VALUES (?)
  `;
  const values = [
    req.body.name,
    req.body.email,
    req.body.password,
    req.body.role,
    req.body.age,
    req.body.gender,
    req.body.hospital,
    req.body.number,
    req.body.specialization,
    req.body.experience,
    req.body.doc_pic,
    req.body.dob, // added dob
    req.body.hospital_loc, // added hospital_loc
  ];

  db.query(sql, [values], (err) => {
    if (err) {
      debugError('Database error:', err); // Use debugError for logging errors
      return res.status(500).json('Error');
    }
    return res.json('Success');
  });
};

// Update doctor by doctor_id
exports.updateDoctorById = (req, res) => {
  const sql = `
    UPDATE doctor SET 
      name=?, email=?, password=?, role=?, age=?, gender=?, hospital=?, hospital_loc=?, fees=?, education=?, number=?, specialization=?, experience=?, doc_pic=?, dob=?
    WHERE doctor_id=?
  `;
  const values = [
    req.body.name,
    req.body.email,
    req.body.password,
    req.body.role,
    req.body.age,
    req.body.gender,
    req.body.hospital,
    req.body.hospital_loc,
    req.body.number,
    req.body.specialization,
    req.body.experience,
    req.body.education,
    req.body.doc_pic,
    req.body.dob, // added dob
    req.params.id,
  ];

  db.query(sql, values, (err, data) => {
    if (err) {
      debugError('Database error:', err); // Use debugError for logging errors
      return res.status(500).json('Error');
    }
    if (data.affectedRows > 0) {
      return res.json('Success');
    } else {
      return res.status(404).json('Doctor not found');
    }
  });
};

// Delete doctor by doctor_id
exports.deleteDoctorById = (req, res) => {
  const sql = 'DELETE FROM doctor WHERE doctor_id = ?';
  db.query(sql, [req.params.id], (err, data) => {
    if (err) {
      debugError('Database error:', err); // Use debugError for logging errors
      return res.status(500).json('Error');
    }
    if (data.affectedRows > 0) {
      return res.json('Success');
    } else {
      return res.status(404).json('Doctor not found');
    }
  });
};

exports.saveDoctorProfile = (req, res) => {
  const {
    mobile,
    gender,
    experience,
    specialization,
    fees,
    hospital,
    hospital_loc,
    education,
    email,
    dob,
  } = req.body;

  // Check if the user exists in the login table
  const checkUserSql =
    'SELECT login_id, name, email, password, role FROM login WHERE email = ?';
  db.query(checkUserSql, [email], (err, result) => {
    if (err) {
      debugError('Database error:', err); // Use debugError for logging errors
      return res.status(500).json({ error: 'Failed to save profile' });
    }

    if (result.length === 0) {
      // User not found in the login table
      return res.status(404).json({ error: 'User not found' });
    }

    const { login_id } = result[0];

    // Check if the doctor already exists
    const checkDoctorSql = 'SELECT * FROM doctor WHERE login_id = ?';
    db.query(checkDoctorSql, [login_id], (err, existingDoctor) => {
      if (err) {
        debugError('Database error:', err); // Use debugError for logging errors
        return res.status(500).json({ error: 'Failed to save profile' });
      }

      if (existingDoctor.length > 0) {
        // Update the existing doctor record
        const updateSql =
          'UPDATE doctor SET number = ?, gender = ?, experience = ?, education = ?, specialization = ?, fees = ?, hospital = ?, hospital_loc = ?, dob = ? WHERE login_id = ?';
        const updateValues = [
          mobile,
          gender,
          experience,
          education,
          specialization,
          fees,
          hospital,
          hospital_loc,
          dob,
          login_id,
        ];

        db.query(updateSql, updateValues, (err) => {
          if (err) {
            debugError('Error updating doctor details:', err); // Use debugError for logging errors
            return res.status(500).json({ error: 'Internal Server Error' });
          }

          return res.json({ message: 'Doctor details updated successfully' });
        });
      } else {
        // Insert new doctor record if not found (optional based on your application logic)
        const insertSql =
          'INSERT INTO doctor (login_id, number, gender, experience, education, specialization, fees, hospital, hospital_loc, dob) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
        const insertValues = [
          login_id,
          mobile,
          gender,
          experience,
          education,
          specialization,
          fees,
          hospital,
          hospital_loc,
          dob,
        ];

        db.query(insertSql, insertValues, (err) => {
          if (err) {
            debugError('Error inserting new doctor:', err); // Use debugError for logging errors
            return res.status(500).json({ error: 'Internal Server Error' });
          }

          return res.json({ message: 'Doctor profile created successfully' });
        });
      }
    });
  });
};
