var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');

var dashboardRouter = require('./app/dashboard/router');
var ajaranRouter = require('./app/ajaran/router');
var profileRouter = require('./app/profile/router');
var dosenRouter = require('./app/dosen/router');

var apiAjaranRouter = require('./app/ajaran/apiRouter');

var app = express();
const URL = `/api/v1`

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: {}
}))
app.use(flash());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// override with POST having ?_method=DELETE
app.use(methodOverride('_method'));
app.use('/adminlte', express.static(path.join(__dirname, '/node_modules/admin-lte/')));

app.use('/', dashboardRouter);
app.use('/profile', profileRouter);
app.use('/dashboard', dashboardRouter);
app.use('/ajaran', ajaranRouter);
app.use('/dosen', dosenRouter);

// api
app.use(`${URL}/ajaran-years`, apiAjaranRouter);

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
  res.render('error', {
    title: err.status + " | " + err.message,
    message: err.message

  })
});

module.exports = app;
