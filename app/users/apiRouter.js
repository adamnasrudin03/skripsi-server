var express = require('express');
var apiRouter = express.Router();
const { apiRegister } = require('./controller');

/* Router Api. */
apiRouter.post('/signup', apiRegister);

module.exports = apiRouter;
