var express = require('express');
var router = express.Router();
const { index, actionStatusReject } = require('./controller')

router.get('/', index);
router.put('/rejected/:id', actionStatusReject);

module.exports = router;
