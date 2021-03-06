// ==================== DEPENDENCIES ====================
var express = require('express');
var bcrypt = require('bcrypt');
var User = require('../models/user.js');
var Playlist = require('../models/playlist.js');
var Song = require('../models/song.js');
var Comments = require('../models/comment.js');
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
  if(!req.session.currentUser) {
    return res.render('users/users-new.ejs');
  } else {
      newPlaylistJoinFirst = false;
      notYourPlaylist = false;
      logInLike = false;
      wrongPass = false;
      wrongUser = false;
      notYourAccount = false;
      alreadyUser = true;
      return res.render('404.ejs', {
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

// show user page
router.get('/:id', function(req, res){
  User.findById(req.params.id, function(err, foundUser){
    res.render('users/users-show.ejs', {
      user: foundUser,
      currentUser: req.session.currentUser
    });
  });
});

// edit user page
router.get('/:id/edit', function(req, res){
  User.findById(req.params.id, function(err, foundUser){
    if(req.session.currentUser.username === foundUser.username){
      return res.render('users/users-edit.ejs', {
        user: foundUser
      });
    } else {
        newPlaylistJoinFirst = false;
        notYourPlaylist = false;
        logInLike = false;
        wrongPass = false;
        wrongUser = false;
        alreadyUser = false;
        notYourAccount = true;
        return res.render('404.ejs', {
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

// ====================== ACTION ROUTES =================
// create an account
router.post('/', function(req, res){
  if(req.body.password !== "") {
    req.body.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10)); // encrypt the password
  }
  if(req.body.icon === ""){ // if the user didn't put an icon
    req.body.icon = undefined; // set the value to undefined so that in the schema it will use the default value
  };
  if(req.body.displayName === ""){ // if the user didn't enter a display name
    req.body.displayName = req.body.username; // set it equal to their username
  };
  User.create(req.body, function(){
    res.redirect('/sessions/new');
  });
});

// edit an account
router.put('/:id', function(req, res){
  if(req.body.password !== "") {
    req.body.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10)); // encrypt the password
  }
  if(req.body.icon === ""){ // if the user didn't put an icon
    req.body.icon = 'http://imgur.com/yTksJch.png'; // set it to the default
  };
  User.findById(req.params.id, function(err, foundUser){
    if(req.body.displayName === ""){ // if the user didn't enter a display name
      req.body.displayName = foundUser.username; // set it equal to their username
    };
    User.findByIdAndUpdate(req.params.id, req.body, { new: true }, function(err, updatedUser){
      res.redirect('/users/' + req.params.id);
    });
  });
});

// delete an account
router.delete('/:id', function(req, res){
  User.findByIdAndRemove(req.params.id, function(err, deletedUser){
    var playlistIds = [];
    var songIds = [];
    for(var i = 0; i < deletedUser.playlists.length; i++){
      playlistIds.push(deletedUser.playlists[i]._id);
      songIds.push(deletedUser.playlists[i].songs._id);
    };
    Playlist.remove(
      {
        _id: {
          $in: playlistIds
        }
      },
      function(err, removedPlaylists){
        Song.remove({
          _id: {
            $in: songIds
          }
        },
        function(err, removedSongs){
          req.session.destroy(function(){
            res.redirect('/');
          });
        });
      }
    );
  });
});

// ====================== EXPORT ========================
module.exports = router;
