var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var schemaGen = require('./config/formGenerator');
var hbs = require('hbs');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var semestersRouter = require('./routes/sems');
var coursesRouter = require('./routes/cors');
var lecturesRouter = require('./routes/lecs');
var assignmentsRouter = require('./routes/asss');
var schsimRouter = require('./routes/schsim');
var app = express();

// view engine setup
var mongoose = require('mongoose');
mongoose.connect("mongodb://localhost/schoolorganizer");

hbs.registerHelper('schemaForm', function (model,set,url) {
  console.log("model: "+ model + " set: "+set);
  var str = new hbs.SafeString(schemaGen.buildForm(model,set,url));
  return str;
});


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/semesters', semestersRouter);
app.use('/courses', coursesRouter);
app.use('/lectures', lecturesRouter);
app.use('/assignments', assignmentsRouter);
app.use('/schsim', schsimRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
