var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');
var cors = require('cors');

var dashboardRouter = require('./app/dashboard/router');
var ajaranRouter = require('./app/ajaran/router');
var profileRouter = require('./app/profile/router');
var dosenRouter = require('./app/dosen/router');
var mahasiswaRouter = require('./app/mahasiswa/router');
var authRouter = require('./app/auth/router');
var userRouter = require('./app/user/router');

var apiAjaranRouter = require('./app/ajaran/apiRouter');
var apiMahasiswaRouter = require('./app/mahasiswa/apiRouter');
var apiAuthRouter = require('./app/auth/apiRouter');

var app = express();
const URL = `/api/v1`;
app.use(cors())

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

app.use('/', authRouter);
app.use('/profile', profileRouter);
app.use('/dashboard', dashboardRouter);
app.use('/ajaran', ajaranRouter);
app.use('/dosen', dosenRouter);
app.use('/mahasiswa', mahasiswaRouter);
app.use('/user', userRouter);

// api
app.use(`${URL}/ajaran-years`, apiAjaranRouter);
app.use(`${URL}/pengajuan-skripsi`, apiMahasiswaRouter);
app.use(`${URL}/auth`, apiAuthRouter);

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
    admin: {
      id: req?.session?.user?.id ?? '',
      email: req?.session?.user?.email ?? '',
      status: req?.session?.user?.status ?? '',
      name: req?.session?.user?.name ?? '',
      gender: req?.session?.user?.gender ?? '',
      role: req?.session?.user?.role ?? '',
      phoneNumber: req?.session?.user?.phoneNumber ?? '',
      avatar: req?.session?.user?.avatar ?? '' },
    title: err.status + " | " + err.message,
    message: err.message

  })
});

module.exports = app;
