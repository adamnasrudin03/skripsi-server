var express = require('express');
var router = express.Router();
const {index, viewEdit, viewChangePassword, actionEdit} = require('./controller');
const multer = require('multer');
const os = require('os');

const { isLoginAdmin } = require('../middleware/auth')

router.use(isLoginAdmin);
router.get('/', index);
router.get('/edit', viewEdit);
router.put('/edit/:id', 
    multer({ dest: os.tmpdir() }).single('image'),
    actionEdit
);
router.get('/change-password', viewChangePassword);


module.exports = router;
