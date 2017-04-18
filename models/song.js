// ==================== DEPENDENCIES ====================
var mongoose = require('mongoose');

// ====================== SCHEMA ========================
var Schema = mongoose.Schema;
var songSchema = Schema({
  title: { type: Array, required: true },
  artist: { type: Array, required: true },
  link: { type: Array, required: true },
  description: { type: Array }
});

var Song = mongoose.model('Song', songSchema);

// ====================== EXPORT ========================
module.exports = Song;
