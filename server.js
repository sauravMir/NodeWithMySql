var express= require('express'),
    exphbs = require('express-handlebars');
var app=express();
var env = require('dotenv').load();


var passport   = require('passport');
var session    = require('express-session');
var bodyParser = require('body-parser');

var authRoute = require('./app/routes/auth.js')(app);

//For BodyParser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// For Passport
app.use(session({ secret: 'keyboard cat',resave: true, saveUninitialized:true})); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions

//For Handlebars
app.set('views', './app/views')
app.engine('hbs', exphbs({
    extname: '.hbs'
}));
app.set('view engine', '.hbs');



//database sync check
//Models
var models = require("./app/models");
//Sync Database
models.sequelize.sync().then(function() {
    console.log('Nice! Database looks fine')
}).catch(function(err) {
    console.log(err, "Something went wrong with the Database Update!")
});


//load passport strategies
require('./app/config/passport/passport.js')(passport, models.user);

app.get('/', function(req, res) {
 
    res.send('Welcome to Passport with Sequelize');
 
});

// the port and the Ip address
app.listen("1025", "0.0.0.0", function(){
  console.log("server done");
} );
