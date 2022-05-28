const express = require('express');
const router = express.Router();

const isAuthenticated = require('../middlewares/authentication');
const isEabdb = require('../middlewares/isEabdb');
const eabdbController = require('../controllers/eabdb');


router.post('/approveForm', isAuthenticated, isEabdb, eabdbController.approveForm);

module.exports = router; 