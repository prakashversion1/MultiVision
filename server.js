var express = require('express');
var path = require('path');
var stylus = require('stylus');
var logger = require('morgan');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var favicon = require('serve-favicon');
var mongoose = require('mongoose');

var env = process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var app = express();

function compile(str,path){
	return stylus(str).set('filename',path);
}


app.set('views', path.join(__dirname, '/server/views'));
app.set('view engine', 'jade');

app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(stylus.middleware(
	{
      src: __dirname + '/public',
      compile: compile
    }
));
//server static contents from the public directory
app.use(express.static(path.join(__dirname, 'public')));

if(env === 'development'){
    mongoose.connect('mongodb://localhost/multivision');
} else {
    mongoose.connect('mongodb://root:root@ds031962.mongolab.com:31962/multivision');
}

var db = mongoose.connection;
db.on('error',console.error.bind(console,'connection error .........'));
db.once('open',function callback(){
	console.log('multivision db opened');
});

app.get('/partials/*',function(req,res){
    var partialPath = req.path
    while(partialPath.charAt(0) === '/')
        partialPath = partialPath.substr(1);
    partialPath = '../../public/app/'+partialPath
    partialPath = partialPath.replace('partials/','')
    console.log('redirecting to new partials :======> ' + partialPath)
	res.render(partialPath);
});

app.get('*',function(req,res){
	res.render('index');
});


var port = process.env.PORT || 3030;
app.listen(port);
console.log("Application starting on port : " + port);