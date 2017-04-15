// ==================== DEPENDENCIES ====================
var express = require('express');
var User = require('../models/user.js');
var Playlist = require('../models/playlist.js');
var Song = require('../models/song.js');
var Comments = require('../models/comment.js');
var router = express();

// ====================== GET ROUTES ====================
router.get('/', function(req, res){
  res.send('user index route');
});

router.get('/new', function(req, res){
  res.render('users/users-new.ejs');
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
