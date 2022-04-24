var express = require('express');
var apiRouter = express.Router();
const { apiActionCreate } = require('./controller')

/* Router Api. */
apiRouter.post('/create', apiActionCreate);

module.exports = apiRouter;
