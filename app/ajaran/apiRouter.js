var express = require('express');
var apiRouter = express.Router();
const { apiListAjaran } = require('./controller')

/* Router Api. */
apiRouter.get('/', apiListAjaran);

module.exports = apiRouter;
