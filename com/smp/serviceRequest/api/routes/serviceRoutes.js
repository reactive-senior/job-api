const express = require('express');
const router = express.Router();

const uuidv4 = require('uuid/v4');
var aws = require('aws-sdk');
var multer = require('multer');
var multerS3 = require('multer-s3');

const s3Config = require('../../../../../s3config.js');

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
    	if(req.route.path == '/doUpload/serviceCustomer')
      		cb(null, 'customer/' + uuidv4() + '.' + file.originalname.split('.').pop());
    }
  })
});


const serviceController = require('../controllers/serviceController');
router.post('/saveServiceRequest', serviceController.saveServiceRequest);
router.post('/getServiceRequest', serviceController.getServiceRequest);
router.post('/getServiceById', serviceController.getServiceByCustomerId);
router.post('/updateServiceInfo', serviceController.updateServiceInfo);

router.post('/doUpload/serviceCustomer', upload.array("uploads[]", 12), serviceController.doUpload);


module.exports = router;