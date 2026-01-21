const express = require('express');
const router = express.Router();
const {
    getDashboardStats,
    getDonationTrends,
} = require('../../controllers/dashboardController');
const { protect, admin } = require('../../middleware/auth');

router.use(protect, admin);

router.get('/stats', getDashboardStats);
router.get('/donation-trends', getDonationTrends);

module.exports = router;
