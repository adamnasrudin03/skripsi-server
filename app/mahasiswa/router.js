var express = require('express');
var router = express.Router();
const { index, actionStatusReject, viewEdit } = require('./controller')

router.get('/', index);
router.put('/rejected/:id', actionStatusReject);
router.get('/edit/:id', viewEdit);

module.exports = router;
