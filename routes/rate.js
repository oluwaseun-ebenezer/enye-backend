// The router handling currency conversion rates.

const express = require('express');

const rateController = require('../controllers/rate');

const router = express.Router();

router.get('/rates', rateController.getRates);

module.exports = router;
