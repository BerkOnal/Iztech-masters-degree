var express = require('express');
var router = express.Router();

const requestController = require('../controllers/request');
const isAuthenticated = require('../middlewares/authentication');  

router.get('/:formID', isAuthenticated,requestController.getForm);


 
module.exports = router;