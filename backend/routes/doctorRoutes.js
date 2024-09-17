// doctorRoutes.js

const express = require('express');
const router = express.Router();
const doctorController = require('../Controller/doctorController');

router.get('/', doctorController.getAllDoctors);
router.get('/:id', doctorController.getDoctorById);
router.post('/', doctorController.createDoctor);
router.put('/:id', doctorController.updateDoctorById);
router.delete('/:id', doctorController.deleteDoctorById);

module.exports = router;
