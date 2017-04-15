// ==================== DEPENDENCIES ====================
var mongoose = require('mongoose');
var Song = require('./song.js');
var Comments = require('./comment.js');

// ====================== SCHEMA ========================
var Schema = mongoose.Schema;
var playlistSchema = Schema({
  title: { type: String, required: true },
  creator: { type: String, required: true },
  coverImage: { type: String, default: 'http://placehold.it/500x500.png' },
  description: { type: String },
  songs: Song.schema,
  likes: { type: Number },
  comments: Comments.schema,
  privOrPub: Boolean
});

var Playlist = mongoose.model('Playlist', playlistSchema);

// ====================== EXPORT ========================
module.exports = Playlist;
