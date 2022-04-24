var express = require('express');
var router = express.Router();
const { index, viewCreate, actionCreate, actionStatus, viewEdit, actionEdit} = require('./controller')

router.get('/', index);
router.get('/create', viewCreate);
router.post('/create', actionCreate);
router.put('/status/:id', actionStatus);
router.get('/edit/:id', viewEdit);
router.put('/edit/:id', actionEdit);



module.exports = router;
