const express = require('express');
const router = express.Router();

const studentController = require('../controllers/student');
const isAuthenticated = require('../middlewares/authentication');
const isStudent = require('../middlewares/isStudent');

router.get('/getFormDA', isAuthenticated, isStudent, studentController.getFormDA);

router.post('/updateFormDA', isAuthenticated, isStudent, studentController.updateFormDA);

router.post('/createFormDA', isAuthenticated, isStudent, studentController.createFormDA);


router.get('/getFormTD', isAuthenticated, isStudent, studentController.getFormTD);

router.post('/updateFormTD', isAuthenticated, isStudent, studentController.updateFormTD);

router.post('/createFormTD', isAuthenticated, isStudent, studentController.createFormTD);


router.get('/getFormPPF', isAuthenticated, isStudent, studentController.getFormPPF);

router.post('/createFormPPF', isAuthenticated, isStudent, studentController.createFormPPF);


module.exports = router;