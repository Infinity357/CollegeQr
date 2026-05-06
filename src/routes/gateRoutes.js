const express = require('express');
const router = express.Router();
const gateController = require('../controllers/gateController');

router.post('/log', gateController.logGate);
router.get('/logs', gateController.getLogsByStudent);

module.exports = router;
