var express = require('express');
var router = express.Router();
const { index, actionStatusReject, viewDetail, actionStatusAccepted, actionUpdateDosen, viewPesan, actionCreatePesan } = require('./controller')

const { isLoginAdmin } = require('../middleware/auth')

router.use(isLoginAdmin);
router.get('/', index);
router.put('/rejected/:id', actionStatusReject);
router.get('/detail/:id', viewDetail);
router.put('/edit-dosen/:id', actionUpdateDosen);
router.put('/accepted/:id', actionStatusAccepted);
router.get('/detail/:id/message', viewPesan);
router.post('/detail/:id/message', actionCreatePesan);

module.exports = router;
