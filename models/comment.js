// ==================== DEPENDENCIES ====================
var mongoose = require('mongoose');

// ====================== SCHEMA ========================
var Schema = mongoose.Schema;
var commentSchema = Schema({
  author: { type: String, default: 'Anonymous' },
  body: { type: String, required: true }
});

var Comments = mongoose.model('Comment', commentSchema);

// ====================== EXPORT ========================
module.exports = Comments;
