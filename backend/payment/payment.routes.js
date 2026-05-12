const express = require('express');
const router = express.Router();
const ctrl = require('./payment.controller');

// FINES
router.post('/fines', ctrl.addFine);
router.get('/fines/:studentId', ctrl.getFines);
router.put('/fines/:id', ctrl.updateFine);

// FEES
router.post('/fees', ctrl.addFee);
router.get('/fees', ctrl.getFees);

// PAYMENT
router.post('/payment', ctrl.payFine);
router.put('/payment/confirm/:id', ctrl.confirmPayment);

module.exports = router;
