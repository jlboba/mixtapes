// ==================== DEPENDENCIES ====================
var mongoose = require('mongoose');
var Playlist = require('./playlist.js');
var Song = require('./song.js');
var Comments = require('./comment.js');

// ====================== SCHEMA ========================
var Schema = mongoose.Schema;
var userSchema = Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  displayName: { type: String },
  icon: { type: String, default: 'http://placehold.it/100x100.png'},
  description: { type: String },
  playlists: [Playlist.schema],
  likedPlaylists: [Playlist.schema],
  comments: [Comments.schema]
});

var User = mongoose.model('User', userSchema);

// ====================== EXPORT ========================
module.exports = User;
