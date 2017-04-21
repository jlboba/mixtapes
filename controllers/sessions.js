// ====================== REQUIRES ======================
var express = require('express');
var User = require('../models/user.js');
var bcrypt = require('bcrypt');
var router = express();

// ================== STATUS VARIABLES ==================
var newPlaylistJoinFirst = false;
var notYourPlaylist = false;
var logInLike = false;
var wrongPass = false;
var wrongUser = false;
var alreadyUser = false;
var notYourAccount = false;

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
          newPlaylistJoinFirst = false;
          notYourPlaylist = false;
          logInLike = false;
          wrongUser = false;
          alreadyUser = false;
          notYourAccount = false;
          wrongPass = true;
          res.render('404.ejs', {
            newPlaylistJoinFirst: newPlaylistJoinFirst,
            notYourPlaylist: notYourPlaylist,
            logInLike: logInLike,
            wrongPass: wrongPass,
            wrongUser: wrongUser,
            alreadyUser: alreadyUser,
            notYourAccount: notYourAccount
          });
      }
    } else {
        newPlaylistJoinFirst = false;
        notYourPlaylist = false;
        logInLike = false;
        wrongPass = false;
        alreadyUser = false;
        notYourAccount = false;
        wrongUser = true;
        res.render('404.ejs', {
          newPlaylistJoinFirst: newPlaylistJoinFirst,
          notYourPlaylist: notYourPlaylist,
          logInLike: logInLike,
          wrongPass: wrongPass,
          wrongUser: wrongUser,
          alreadyUser: alreadyUser,
          notYourAccount: notYourAccount
        });
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
