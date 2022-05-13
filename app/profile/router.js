var express = require('express');
var router = express.Router();
const {index, viewEdit, viewChangePassword, actionEdit, actionChangePassword} = require('./controller');
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
router.put('/change-password/:id', actionChangePassword);


module.exports = router;
