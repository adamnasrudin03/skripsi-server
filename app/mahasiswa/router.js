var express = require('express');
var router = express.Router();
const { index, actionStatusReject, viewEdit, viewDetail } = require('./controller')

router.get('/', index);
router.put('/rejected/:id', actionStatusReject);
router.get('/edit/:id', viewEdit);
router.get('/detail/:id', viewDetail);

module.exports = router;
