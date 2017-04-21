// ==================== DEPENDENCIES ====================
var express = require('express');
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
      return res.render('playlists/playlists-new.ejs', {
        users: foundUsers
      });
    });
  } else {
        notYourPlaylist = false;
        logInLike = false;
        wrongPass = false;
        wrongUser = false;
        alreadyUser = false;
        notYourAccount = false;
        newPlaylistJoinFirst = true;
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
    if(req.session.currentUser){
      if(req.session.currentUser.username === foundPlaylist.creator) {
        return res.render('playlists/playlists-edit.ejs', {
          playlist: foundPlaylist
        });
      } else {
          newPlaylistJoinFirst = false;
          logInLike = false;
          wrongPass = false;
          wrongUser = false;
          alreadyUser = false;
          notYourAccount = false;
          notYourPlaylist = true;
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
    } else {
        newPlaylistJoinFirst = false;
        logInLike = false;
        wrongPass = false;
        wrongUser = false;
        alreadyUser = false;
        notYourAccount = false;
        notYourPlaylist = true;
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

// edit playlist songs page
router.get('/:playlistId/edit-songs/:songsId', function(req, res){
  Playlist.findById(req.params.playlistId, function(err, foundPlaylist){
    Song.findById(req.params.songsId, function(err, foundSongs){
      res.render('songs/songs-edit.ejs', {
        songs: foundSongs,
        playlist: foundPlaylist
      });
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
          res.redirect('/playlists/' + updatedPlaylist.id + '/edit-songs/' + updatedPlaylist.songs.id);
        });
      });
  });
});

// edit playlist songs
router.put('/:playlistId/edit-songs/:songId', function(req, res){
  Song.findByIdAndUpdate(req.params.songId, req.body, { new: true }, function(err, updatedSongs){
    Playlist.findOne({ 'songs._id': req.params.songId }, function(err, foundPlaylist){
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
      lnewPlaylistJoinFirst = false;
      notYourPlaylist = false;
      logInLike = true;
      wrongPass = false;
      wrongUser = false;
      alreadyUser = false;
      notYourAccount = false;
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

var pixarSeed = {
  title: ['Married Life', 'You\'ve Got a Friend in Me', 'If I Didn\'t Have You', 'Life is a Highway', 'Touch The Sky'],
  artist: ['Michael Giacchino', 'Randy Newman', 'Billy Crystal & John Goodman', 'Rascal Flatts', 'Julie Fowlis'],
  link: ['https://www.youtube.com/watch?v=7WW2I0S1e0M', 'https://www.youtube.com/watch?v=McooXVFA1BM', 'https://www.youtube.com/watch?v=fEqrt6nZTS4', 'https://www.youtube.com/watch?v=gn19U2lMNnw', 'https://www.youtube.com/watch?v=PAD_E1kaYuY'],
  description: ['The soundtrack from perhaps the most iconic, incredibly depressing scene in Up', '' , 'From: Monster\'s Inc. We could all use a Sulley to our Mike', 'All together now: LIFE IS A HIIIIGHWAY', 'From: Brave'],
};

// seed pixar songs route
router.get('/:id/seed-pixar', function(req, res){
  Song.create(pixarSeed, function(err, seededSongs){
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

var disneySeed = {
  title: ['When Will My Life Begin', 'I\'ll Make a Man Out of You', 'Hawaiian Roller Coaster Ride', 'Circle of Life', 'Kiss the Girl'],
  artist: ['Mandy Moore', 'Donny Osmond', 'M. Keali\'i Ho\' Omalu', 'Carmen Twillie & Lebo M', 'Samuel Wright'],
  link: ['https://www.youtube.com/watch?v=RMyriShiofs', 'https://www.youtube.com/watch?v=2It7rctaQE4', 'https://www.youtube.com/watch?v=p09oZj7G0gg', 'https://www.youtube.com/watch?v=p0eeL74BSpk', 'https://www.youtube.com/watch?v=TrRbB-qUJfY'],
  description: ['An upbeat opening song in which I wish I, too, could finish chores by 7:15 AM', 'LET\'S GET DOWN TO BUSINESS... to defeat the bugs', 'From: My childhood, ah the nostalgia', 'One of the most iconic opening songs from any Disney movie', 'Shalalalalalala'],
};

// seed disney songs route
router.get('/:id/seed-disney', function(req, res){
  Song.create(disneySeed, function(err, seededSongs){
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

var gameSeed = {
  title: ['Mother I\'m Here', 'Undertale', 'Home', 'Die Anywhere Else', 'We Move Together'],
  artist: ['Darren Korb', 'Toby Fox', 'Toby Fox', 'Carmen Twillie & Lebo M', '"Lucio"'],
  link: ['https://www.youtube.com/watch?v=YlfUcnSbKDA', 'https://www.youtube.com/watch?v=tz82xbLvK_k', 'https://www.youtube.com/watch?v=5_E_y1AWAfc', 'https://www.youtube.com/watch?v=EQw9uvGElx4', 'https://www.youtube.com/watch?v=cLM4yxrazK8'],
  description: ['', 'Just try and tell me this isn\'t one of the best boss fight tracks', 'Couln\'t help myself from adding a second, Undertale\'s soundtrack is full of gems', 'The flagship song of one of my favorite games this year, Night in the Woods', '[Lucio Voice] Movin\' with the payload!'],
};

// seed game songs route
router.get('/:id/seed-game', function(req, res){
  Song.create(gameSeed, function(err, seededSongs){
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
