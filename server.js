// ==================== DEPENDENCIES ====================
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var session = require('express-session');
var methodOverride = require('method-override');
var app = express();

// =================== ENVIRONMENT ======================
var port = process.env.PORT || 3000;
var mongoDBURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mixtapes';

// ===================== MIDDLEWARE =====================
app.use(session({
  secret: "aprilone",
  resave: false,
  saveUninitialized: false // if nothing's been saved, don't save it
}));
app.use(bodyParser.urlencoded({extended:false}));
app.use(methodOverride('_method'));

// ==================== CONTROLLERS =====================
// user
var userController = require('./controllers/users.js');
app.use('/users', userController);

// playlist
var playlistController = require('./controllers/playlists.js');
app.use('/playlists', playlistController);

// session
var sessionsController = require('./controllers/sessions.js');
app.use('/sessions', sessionsController);

// ====================== GET ROUTES ====================
// main index route
app.get('/', function(req, res){
  res.render('index.ejs', {
    currentUser: req.session.currentUser
  });
});

// 404 - if page cannot be found, render the 404 page
app.use(function(req, res){
  res.status(404);
  res.render('404.ejs');
});

// ================ MONGOOSE CONNECTION =================
mongoose.connect(mongoDBURI);
var db = mongoose.connection;

db.once('open', function(){
  console.log('connected to mongo!');
});

// ====================== LISTENER ======================
app.listen(port, function(){
  console.log('listening on port ' + port);
});
