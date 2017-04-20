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
  User.find({}, function(err, foundUsers){
    Playlist.find({}, function(err, foundPlaylists){
      res.render('playlists/playlists-index.ejs', {
        playlists: foundPlaylists,
        users: foundUsers
      });
    });
  });
});

// create new playlist page
router.get('/new', function(req, res){
  if(req.session.currentUser){
    User.find({}, function(err, foundUsers){
      res.render('playlists/playlists-new.ejs', {
        users: foundUsers
      });
    });
  } else {
      res.send('only members can create playlists, come join us!');
  }
});

// add songs to playlist page
router.get('/:id/add-songs', function(req, res){
  Playlist.findById(req.params.id, function(err, foundPlaylist){
    res.render('songs/songs-new.ejs', {
      playlistId: req.params.id,
      playlist: foundPlaylist
    });
  });
});

// edit playlist page
router.get('/:id/edit', function(req, res){
  Playlist.findById(req.params.id, function(err, foundPlaylist){
    if(req.session.currentUser.username === foundPlaylist.creator) {
      res.render('playlists/playlists-edit.ejs', {
        playlist: foundPlaylist
      });
    } else {
        res.send('this isn\'t your playlist!');
    }
  });
});

// edit playlist songs page
router.get('/edit-songs/:id', function(req, res){
  Song.findById(req.params.id, function(err, foundSongs){
    res.render('songs/songs-edit.ejs', {
      songs: foundSongs
    });
  });
});

// show playlist page
router.get('/:id', function(req, res){
  Playlist.findById(req.params.id, function(err, foundPlaylist){
    User.findOne({ 'username': foundPlaylist.creator }, function(err, foundUser){
      res.render('playlists/playlists-show.ejs', {
        playlist: foundPlaylist,
        user: foundUser,
        currentUser: req.session.currentUser
      });
    });
  });
});


// ====================== ACTION ROUTES =================
// create a playlist
router.post('/', function(req, res){
  req.body.creator = req.session.currentUser.username;
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
          res.redirect('/playlists/edit-songs/' + updatedPlaylist.songs.id);
        });
      });
  });
});

// edit playlist songs
router.put('/edit-songs/:id', function(req, res){
  Song.findByIdAndUpdate(req.params.id, req.body, { new: true }, function(err, updatedSongs){
    Playlist.findOne({ 'songs._id': req.params.id }, function(err, foundPlaylist){
      foundPlaylist.songs.remove();
      foundPlaylist.songs = updatedSongs;
      foundPlaylist.save(function(err, savedPlaylist){
        User.findOne({'username': savedPlaylist.creator}, function(err, foundUser){
          foundUser.playlists.id(savedPlaylist.id).remove();
          foundUser.playlists.push(savedPlaylist);
          foundUser.save(function(err, savedUser){
            res.redirect('/playlists/' + savedPlaylist.id);
          });
        });
      });
    });
  });
});

// liking a playlist
router.put('/like/:id', function(req, res){
  if(req.session.currentUser){
    Playlist.findByIdAndUpdate(req.params.id, { $inc: { 'likes': +1 } }, { new: true }, function(err, updatedPlaylist){
      User.findOne({ 'username': req.session.currentUser.username }, function(err, foundUser){
        foundUser.likedPlaylists.push(updatedPlaylist);
        foundUser.save(function(err, savedUser){
          return res.redirect('/playlists/' + updatedPlaylist.id);
        })
      });
    });
  } else {
      return res.send('you need to log in to like a playlist!');
  }
});

// commenting on a playlist
router.post('/comment/:id', function(req, res){
  if(req.session.currentUser){
    req.body.author = req.session.currentUser.displayName;
  };
  Comments.create(req.body, function(err, createdComment){
    Playlist.findById(req.params.id, function(err, foundPlaylist){
      foundPlaylist.comments.push(createdComment);
      foundPlaylist.save(function(err, savedPlaylist){
        if(req.session.currentUser){
          User.findOne({ 'username': req.session.currentUser.username }, function(err, foundUser){
            foundUser.comments.push(createdComment);
            foundUser.save(function(err, savedUser){
              return res.redirect('/playlists/' + req.params.id);
            });
          });
        } else {
          res.redirect('/playlists/' + req.params.id);
        }
      });
    });
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
