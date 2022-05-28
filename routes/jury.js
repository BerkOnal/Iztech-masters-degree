const express = require('express');
const router = express.Router();

const juryController = require('../controllers/jury');
const isAuthenticated = require('../middlewares/authentication');
const isJury = require('../middlewares/isJury');


router.get('/getFormTSB', isAuthenticated, isJury, juryController.getFormTSB);
router.post('/createFormTSB', isAuthenticated, isJury, juryController.createFormTSB);

module.exports = router; 