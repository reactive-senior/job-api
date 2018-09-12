const express = require('express');
const router = express.Router();


const cloudSearchController = require('../controllers/cloudSearchController');
router.post('/getCategories', cloudSearchController.getCategories);


module.exports = router;