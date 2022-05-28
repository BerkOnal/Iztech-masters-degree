var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('login/login', { title: 'Welcome'});
});

router.get('/dashboard', function(req, res, next) {

  res.render('dashboard/dashboard', { title: 'Welcome', user: req.user ,message : req.message});
});





module.exports = router;
