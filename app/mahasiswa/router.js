var express = require('express');
var router = express.Router();
const { index, actionStatusReject, viewDetail, actionStatusAccepted } = require('./controller')

router.get('/', index);
router.put('/rejected/:id', actionStatusReject);
router.get('/detail/:id', viewDetail);
router.put('/accepted/:id', actionStatusAccepted);

module.exports = router;
