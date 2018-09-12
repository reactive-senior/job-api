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
    	if(req.route.path == '/doUpload/chat')
      		cb(null, 'chat/' + uuidv4() + '.' + file.originalname.split('.').pop());
      	else if(req.route.path == '/doUpload/vendor')
      		cb(null, 'vendor/' + uuidv4() + '.' + file.originalname.split('.').pop());
    }
  })
});

const vendorProfileController = require('../controllers/vendorProfileController');
const customerProfileController = require('../controllers/customerProfileController');
const infoController = require('../controllers/infoController');



router.get('/vendor_profile/:partyId', vendorProfileController.getVendorProfile);

router.get('/customer_profile/:partyId', customerProfileController.getCustomerProfile);

router.get('/address_profile/:partyId', infoController.getAddressInfo);

router.get('/phone_profile/:partyId', infoController.getPhoneInfo);

router.get('/email_profile/:partyId', infoController.getEmailInfo);


router.post('/vendor_profile/:partyId', vendorProfileController.postVendorProfile);

router.post('/customer_profile/:partyId', customerProfileController.postCustomerProfile);

router.post('/address_profile/:partyId', infoController.postAddressInfo);

router.post('/address_profile', infoController.updateAddressInfo);

router.post('/phone_profile/:partyId', infoController.postPhoneInfo);

router.post('/email_profile/:partyId', infoController.postEmailInfo);

router.delete('/address_profile/:addressId', infoController.deleteAddressInfo);

router.delete('/phone_profile/:id', infoController.deletePhoneInfo);

router.delete('/email_profile/:id', infoController.deleteEmailInfo);

router.post('/doUpload/vendor', upload.array("uploads[]", 12), vendorProfileController.doUpload);

module.exports = router;