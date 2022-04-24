var express = require('express');
var router = express.Router();
const { index, viewCreate, actionCreate, actionStatus} = require('./controller')

router.get('/', index);
router.get('/create', viewCreate);
router.post('/create', actionCreate);
router.put('/status/:id', actionStatus);


module.exports = router;
