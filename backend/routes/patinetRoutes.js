// routes/patientRoutes.js

const express = require('express');
const router = express.Router();
const patientController = require('../Controller/patinetController');

router.get('/', patientController.getAllPatients);
router.get('/:id', patientController.getPatientById);
router.post('/', patientController.createPatient);
router.put('/:id', patientController.updatePatientById);
router.delete('/:id', patientController.deletePatientById);
router.post('/saveProfile', patientController.saveProfile);

module.exports = router;
