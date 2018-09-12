const express = require('express');
const router = express.Router();


const elasticSearchController = require('../controllers/elasticSearchController');
router.post('/getCategories', elasticSearchController.getCategories);
router.post('/updateCategories', elasticSearchController.updateCategories);


module.exports = router;