const express = require('express');
const uuidv4 = require('uuid/v4');
var aws = require('aws-sdk');
var multer = require('multer');
var multerS3 = require('multer-s3');

const s3Config = require('../../../../../../s3config.js');

var s3 = new aws.S3({
	accessKeyId: s3Config.accessKeyId,
	secretAccessKey: s3Config.secretAccessKey,
	Bucket: s3Config.Bucket
});

var upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: s3Config.Bucket,
    acl: 'public-read',
    metadata: function (req, file, cb) {
      cb(null, {fieldName: file.originalname});
    },
    key: function (req, file, cb) {
    	if(req.route.path == '/doUpload/chat')
      		cb(null, 'chat/' + uuidv4() + '.' + file.originalname.split('.').pop());
      	else if(req.route.path == '/doUpload/vendorProfile')
      		cb(null, 'vendor/' + uuidv4() + '.' + file.originalname.split('.').pop());
    }
  })
})

const router = express.Router();


const messageController = require('../controllers/MessageController');

router.get('/getMessages/:userId/:myId', messageController.getMessages);
router.delete('/deleteMessage/:messageId', messageController.deleteMessage);
router.post('/newMessage', messageController.newMessage);

//upload a new attatchment
router.post('/doUpload/chat', upload.array("uploads[]", 12), messageController.doUpload);

module.exports = router;