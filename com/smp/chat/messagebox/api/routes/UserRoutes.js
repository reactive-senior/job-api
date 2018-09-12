const express = require('express');
const router = express.Router();

const userController = require('../controllers/UserController');

router.get('/getVendors', userController.getVendors);
router.get('/getBuyers', userController.getBuyers);

module.exports = router;