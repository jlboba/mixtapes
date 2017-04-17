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

// edit playlist page
router.get('/:id/edit', function(req, res){
  Playlist.findById(req.params.id, function(err, foundPlaylist){
    res.render('playlists/playlists-edit.ejs', {
      playlist: foundPlaylist
    });
  });
});

// edit playlist songs page
router.get('/edit-songs/:id', function(req, res){
  Playlist.findById(req.params.id, function(err, foundPlaylist){
    res.render('songs/songs-edit.ejs', {
      playlist: foundPlaylist
    });
  });
});

// show playlist page
router.get('/:id', function(req, res){
  Playlist.findById(req.params.id, function(err, foundPlaylist){
    User.findOne({ 'username': foundPlaylist.creator }, function(err, foundUser){
      res.render('playlists/playlists-show.ejs', {
        playlist: foundPlaylist,
        user: foundUser
      });
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

// delete playlist
router.delete('/:id', function(req, res){
  Playlist.findByIdAndRemove(req.params.id, function(err, deletedPlaylist){
    User.findOne({ 'username': deletedPlaylist.creator}, function(err, foundUser){
      foundUser.playlists.id(req.params.id).remove();
      foundUser.save(function(err, savedUser){
        Song.findByIdAndRemove(deletedPlaylist.songs._id, function(err, foundSongs){
          res.redirect('/playlists');
        });
      });
    });
  });
});

// edit playlist info
router.put('/:id', function(req, res){
  Playlist.findByIdAndUpdate(req.params.id, req.body, { new: true }, function(err, updatedPlaylist){
      User.findOne({ 'username': updatedPlaylist.creator }, function(err, foundUser){
        foundUser.playlists.id(req.params.id).remove();
        foundUser.playlists.push(updatedPlaylist);
        foundUser.save(function(err, savedUser){
          res.redirect('/playlists');
        });
      });
  });
});

// edit playlist songs
router.put('/edit-songs/:id', function(req, res){
  Playlist.findById(req.params.id, function(err, foundPlaylist){
    console.log(foundPlaylist);
  });
});

// ==================== SEEDS ===========================
var ghibliSeed = {
  title: ['One Summer\'s Day', 'My Neighbor Totoro', 'A Town With an Ocean View', 'Ponyo on the Cliff', 'Howl\'s Moving Castle Theme'],
  artist: ['Joe Hisaishi', 'Joe Hisaishi', 'Joe Hisaishi', 'Joe Hisaishi', 'Joe Hisaishi'],
  link: ['https://www.youtube.com/watch?v=BEtJxfhxRh8', 'https://www.youtube.com/watch?v=I1RhMA5NpsM', 'https://www.youtube.com/watch?v=vD1yAEWpzeQ', 'https://www.youtube.com/watch?v=jH1QrYzMeIw', 'https://www.youtube.com/watch?v=31nOaXSeqSo'],
  description: ['From: Spirited Away', 'From: Totoro', 'From: Kikis Delivery Service', 'From: Ponyo', 'From: Howl\'s Moving Castle'],
};

// seed ghibli songs route
router.get('/:id/seed-ghibli', function(req, res){
  Song.create(ghibliSeed, function(err, seededSongs){
    Playlist.findById(req.params.id, function(err, foundPlaylist){
      foundPlaylist.songs = seededSongs;
      foundPlaylist.save(function(err, savedPlaylist){
        User.findOne({'username': savedPlaylist.creator}, function(err, foundUser){
          foundUser.playlists.push(savedPlaylist);
          foundUser.save(function(err, savedUser){
            res.redirect('/playlists/' + req.params.id);
          });
        });
      });
    });
  });
});

// ====================== EXPORT ========================
module.exports = router;
