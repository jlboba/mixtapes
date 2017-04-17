// ==================== DEPENDENCIES ====================
var express = require('express');
var User = require('../models/user.js');
var Playlist = require('../models/playlist.js');
var Song = require('../models/song.js');
var Comments = require('../models/comment.js');
var router = express();

// ====================== GET ROUTES ====================
// users index page
router.get('/', function(req, res){
  User.find({}, function(err, foundUsers){
    res.render('users/users-index.ejs', {
      users: foundUsers
    });
  });
});

// create new user page
router.get('/new', function(req, res){
  res.render('users/users-new.ejs');
});

// show user page
router.get('/:id', function(req, res){
  User.findById(req.params.id, function(err, foundUser){
    res.render('users/users-show.ejs', {
      user: foundUser
    });
  });
});

// edit user page
router.get('/:id/edit', function(req, res){
  User.findById(req.params.id, function(err, foundUser){
    res.render('users/users-edit.ejs', {
      user: foundUser
    });
  });
});
// ====================== ACTION ROUTES =================
router.post('/', function(req, res){
  if(req.body.icon === ""){ // if the user didn't put an icon
    req.body.icon = undefined; // set the value to undefined so that in the schema it will use the default value
  };
  if(req.body.displayName === ""){ // if the user didn't enter a display name
    req.body.displayName = req.body.username; // set it equal to their username
  };
  User.create(req.body, function(){
    res.redirect('/users');
  });
});

// ====================== EXPORT ========================
module.exports = router;
