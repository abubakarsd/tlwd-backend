const express = require('express');
const router = express.Router();
const {
    getSubscribers,
    deleteSubscriber,
    exportSubscribers,
} = require('../../controllers/subscriberController');
const { protect, admin } = require('../../middleware/auth');

router.use(protect, admin);

router.get('/', getSubscribers);
router.get('/export', exportSubscribers);
router.delete('/:id', deleteSubscriber);

module.exports = router;
