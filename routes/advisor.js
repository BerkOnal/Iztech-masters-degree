const express = require('express');
const router = express.Router();

const advisorController = require('../controllers/advisor');
const isAuthenticated = require('../middlewares/authentication');
const isAdvisor = require('../middlewares/isAdvisor');

router.get('/getFormTJ', isAuthenticated, isAdvisor, advisorController.getFormTJ);
router.post('/approveForm', isAuthenticated, isAdvisor, advisorController.approveForm);
router.post('/createFormTJ', isAuthenticated, isAdvisor, advisorController.createFormTJ);

module.exports = router;