var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var expressValidator = require('express-validator');
var mongojs = require('mongojs');
var db = mongojs('schoolapp', ['users']);
var ObjectId = mongojs.ObjectId;

var app = express();

/*
var logger = function(req, res, next){
	console.log('logging...');
	next();
}

app.use(logger);*/


// View Engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

// Body Parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// Set Static Path
app.use(express.static(path.join(__dirname, 'public')))

// Global Vars
app.use(function(req, res, next){
	res.locals.errors = null;
	next();
})

// Express Validator Middleware
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
   }
}));

var users = [{
	first_name:'Jeff',
    last_name:'Aro',
    matric_number:'130813030',
    level:'200',
    email:'jeffaro@gmail.com'
    }, 
    {
	first_name:'Taiwo',
    last_name:'Giwa',
    matric_number:'130813031',
    level:'200',
    email:'taiwogiwa@gmail.com'
    },
    {
	first_name:'Emeka',
    last_name:'Uzor',
    matric_number:'120813032',
    level:'300',
    email:'emekauzor@gmail.com'
    }     
 ]


app.get('/', function(req, res){
db.users.find(function (err, docs){
	   res.render('index', {
		title: 'students',
		users: docs
	});
})

	
});

app.post('/users/add', function(req, res){

	req.checkBody('first_name', 'First Name is Required').notEmpty();
	req.checkBody('last_name', 'Last Name is Required').notEmpty();
	req.checkBody('matric_number', 'Matric Number is Required').notEmpty();
	req.checkBody('level', 'Level is Required').notEmpty();
	req.checkBody('email', 'Email is Required').notEmpty();

	var errors = req.validationErrors();

	if(errors){
        res.render('index', {
		title: 'students',
		users: users,
		errors: errors
	});
	} else {
	var newUser = {
		first_name: req.body.first_name,
		last_name: req.body.last_name,
		matric_number: req.body.matric_number,
		level: req.body.level,
		email: req.body.email
	}

db.users.insert(newUser, function(err, reult){
	if(err){
		console.log(err);
			}
			res.redirect('/');

});
}
});
app.delete('/users/delete/:id', function(req, res){
	db.users.remove({_id: ObjectId(req.params.id)}, function(err, result){
		if(err){
			console.log(err);
		}
		res.redirect('/');
	});
});


app.listen(3001, function(){
	console.log('server started on port 3001...');
})