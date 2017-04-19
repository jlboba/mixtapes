// ====================== REQUIRES ======================
var express = require('express');
var User = require('../models/user.js');
var bcrypt = require('bcrypt');
var router = express();

// ====================== GET ROUTES ====================
router.get('/new', function(req, res){
  res.render('sessions/sessions-new.ejs');
});

// ===================== ACTION ROUTES ==================
router.post('/', function(req, res){
  User.findOne({'username': req.body.username}, function(err, foundUser){
    if (foundUser !== null){
      if(bcrypt.compareSync(req.body.password, foundUser.password)){
        req.session.currentUser = foundUser;
        res.redirect('/');
      } else {
          res.send('wrong password');
      }
    } else {
        res.send('incorrect user!');
    }
  });
});

router.delete('/', function(req, res){
  req.session.destroy(function(){
    res.redirect('/');
  });
});

// ======================= EXPORT =======================
module.exports = router;
