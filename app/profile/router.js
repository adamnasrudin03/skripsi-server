var express = require('express');
var router = express.Router();
const {index, viewEdit, viewChangePassword} = require('./controller')

router.get('/', index);
router.get('/edit', viewEdit);
router.get('/change-password', viewChangePassword);


module.exports = router;
