const express = require('express');
const router = express.Router();
const {
    initializeDonation,
    verifyDonation,
} = require('../../controllers/donationController');

router.post('/initialize', initializeDonation);
router.get('/verify/:reference', verifyDonation);

module.exports = router;
