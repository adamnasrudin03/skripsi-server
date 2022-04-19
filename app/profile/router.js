var express = require('express');
var router = express.Router();
const {index, viewEdit} = require('./controller')

/* GET home page. */
router.get('/', index);
router.get('/edit', viewEdit);


module.exports = router;
