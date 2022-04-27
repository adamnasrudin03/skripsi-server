var express = require('express');
var apiRouter = express.Router();
const { apiActionCreate, apiUploadProposal, apiUploadRekap } = require('./controller')
const multer = require('multer')
const os = require('os')

/* Router Api. */
apiRouter.post('/create', apiActionCreate);
apiRouter.post('/upload-proposal', 
    multer({ dest: os.tmpdir() }).single('file'),
    apiUploadProposal
);
apiRouter.post('/upload-rekap', 
    multer({ dest: os.tmpdir() }).single('file'),
    apiUploadRekap
);

module.exports = apiRouter;
