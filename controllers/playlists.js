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
  res.send('playlist index route');
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

// ====================== ACTION ROUTES =================
// create a playlist
router.post('/', function(req, res){
  Playlist.create(req.body, function(err, createdPlaylist){
    res.redirect('/playlists/' + createdPlaylist.id + '/add-songs');
  });
});

// create the songs to push into the playlist
router.post('/:id', function(req, res){
  Song.create(req.body, function(err, createdSongs){
    Playlist.findById(req.params.id, function(err, foundPlaylist){
      foundPlaylist.songs = createdSongs;
      foundPlaylist.save(function(err, savedPlaylist){
        console.log(foundPlaylist);
        res.redirect('/');
      });
    });
  });
});

// ====================== EXPORT ========================
module.exports = router;
