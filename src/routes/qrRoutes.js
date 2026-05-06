const express = require('express');
const router = express.Router();
const qrController = require('../controllers/qrController');

router.get('/generate', qrController.generateQR);
router.post('/validate', qrController.validateQR);

module.exports = router;
