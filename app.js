const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const expressValidator = require('express-validator');
const mongojs = require('mongojs');
const db = mongojs('schoolapp', ['users']);
const ObjectId = mongojs.ObjectId;

const app = express();

// View Engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

// Body Parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// Set Static Path
app.use(express.static(path.join(__dirname, 'public')))

// Global Consts
app.use(function(req, res, next){
	res.locals.errors = null;
	next();
})

// Express Validator Middleware
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      const namespace = param.split('.')
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
	req.checkBody('address', 'Address is Required').notEmpty();
	req.checkBody('phone_number', 'Phone number is Required').notEmpty();
    req.checkBody('courses_offered', 'Courses offered is Required').notEmpty();
	
	const errors = req.validationErrors();
     db.users.find(function (err, users) {
	if(errors){
        res.render('index', {
		title: 'students',
		users: users,
		errors: errors
	});
	} else {
	const newUser = {
		first_name: req.body.first_name,
		last_name: req.body.last_name,
		matric_number: req.body.matric_number,
		level: req.body.level,
		email: req.body.email,
		address: req.body.address,
		phone_number: req.body.phone_number,
		courses_offered: req.body.courses_offered
	}

db.users.insert(newUser, function(err, result){
	if(err){
		console.log(err);
			}
			res.redirect('/');

});
}
});
});

app.put('/users/update/:id', function(req, res){
	db.users.update({_id: ObjectId(req.params.id)}, function(err, result){
		if(err){
			console.log(err);
		}
		res.redirect('/');
	});
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
