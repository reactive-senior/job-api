const express = require('express');

const router = express.Router();

router.get('/isLoggedIn', (req, res) => {
	res.json({'isLoggedIn': req.session.isLoggedIn});
});

module.exports = router;