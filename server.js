// ==================== DEPENDENCIES ====================
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var expressSession = require('express-session');
var methodOverride = require('method-override');
var app = express();

// ===================== MIDDLEWARE =====================
app.use(expressSession({
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

// sessions

// ====================== GET ROUTES ====================
// main index route
app.get('/', function(req, res){
  res.send('main index route working');
});

// ================ MONGOOSE CONNECTION =================
mongoose.connect('mongodb://localhost:27017/mixtapes');
var db = mongoose.connection;

db.once('open', function(){
  console.log('connected to mongo!');
});

// ====================== LISTENER ======================
app.listen(3000, function(){
  console.log('listening!');
});
