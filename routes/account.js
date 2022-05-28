const express = require('express');
const router = express.Router();

const isAuthenticated = require('../middlewares/authentication');
const accountController = require('../controllers/account');

router.get('/login',accountController.getLogin);
router.post('/login',accountController.postLogin);

router.get('/logout',accountController.getLogout);

module.exports = router;