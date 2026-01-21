const express = require('express');
const router = express.Router();
const {
    getDonations,
    exportDonations,
} = require('../../controllers/donationController');
const { protect, admin } = require('../../middleware/auth');

router.use(protect, admin);

router.get('/', getDonations);
router.get('/export', exportDonations);

module.exports = router;
