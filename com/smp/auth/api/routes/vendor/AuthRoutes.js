const express = require('express');

const router = express.Router();

const authVendorController = require('../../controllers/VendorAuthController');
const authCustomerController = require('../../controllers/CustomerAuthController');

router.post('/vendor_signup', authVendorController.doSignUp);

router.post('/vendor_login', authVendorController.doLogIn);

router.post('/vendor_logout', authVendorController.doLogOut);

router.post('/customer_login', authCustomerController.doLogIn);

router.post('/customer_signup', authCustomerController.doSignUp);

router.post('/customer_logout', authCustomerController.doLogOut);

module.exports = router;