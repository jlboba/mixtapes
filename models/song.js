// ==================== DEPENDENCIES ====================
var mongoose = require('mongoose');

// ====================== SCHEMA ========================
var Schema = mongoose.Schema;
var songSchema = Schema({
  title: { type: String, required: true },
  artist: { type: String, required: true },
  link: { type: String, required: true },
  description: { type: String },
  likes: { type: Number }
});

var Song = mongoose.model('Song', songSchema);

// ====================== EXPORT ========================
module.exports = Song;
