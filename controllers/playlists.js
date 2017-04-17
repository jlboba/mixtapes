// ==================== DEPENDENCIES ====================
var express = require('express');
var User = require('../models/user.js');
var Playlist = require('../models/playlist.js');
var Song = require('../models/song.js');
var Comments = require('../models/comment.js');
var router = express();

// ====================== GET ROUTES ====================
// index page
router.get('/', function(req, res){
  Playlist.find({}, function(err, foundPlaylists){
    res.render('playlists/playlists-index.ejs', {
      playlists: foundPlaylists
    });
  });
});

// create new playlist page
router.get('/new', function(req, res){
  User.find({}, function(err, foundUsers){
    res.render('playlists/playlists-new.ejs', {
      users: foundUsers
    });
  });
});

// add songs to playlist page
router.get('/:id/add-songs', function(req, res){
  res.render('songs/songs-new.ejs', {
    playlistId: req.params.id
  });
});

// show playlist page
router.get('/:id', function(req, res){
  Playlist.findById(req.params.id, function(err, foundPlaylist){
    res.render('playlists/playlists-show.ejs', {
      playlist: foundPlaylist
    });
  });
});

// ====================== ACTION ROUTES =================
// create a playlist
router.post('/', function(req, res){
  Playlist.create(req.body, function(err, createdPlaylist){
    res.redirect('/playlists/' + createdPlaylist.id + '/add-songs');
  });
});

// create the songs to push into the playlist and push the completed playlist into the creator's playlist array
router.post('/:id', function(req, res){
  Song.create(req.body, function(err, createdSongs){
    Playlist.findById(req.params.id, function(err, foundPlaylist){
      foundPlaylist.songs = createdSongs;
      foundPlaylist.save(function(err, savedPlaylist){
        User.findOne({'username': savedPlaylist.creator}, function(err, foundUser){
          foundUser.playlists.push(savedPlaylist);
          foundUser.save(function(err, savedUser){
            res.redirect('/playlists');
          });
        });
      });
    });
  });
});

// delete
router.delete('/:id', function(req, res){
  Playlist.findByIdAndRemove(req.params.id, function(err, deletedPlaylist){
    User.findOne({ 'username': deletedPlaylist.creator}, function(err, foundUser){
      foundUser.playlists.id(req.params.id).remove();
      foundUser.save(function(err, savedUser){
        res.redirect('/playlists');
      });
    });
  });
});

// ====================== EXPORT ========================
module.exports = router;
