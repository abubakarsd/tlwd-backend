const express = require('express');
const router = express.Router();
const {
    getSubscribers,
    deleteSubscriber,
    exportSubscribers,
    importSubscribers,
    broadcastNewsletter,
} = require('../../controllers/subscriberController');
const { protect, admin } = require('../../middleware/auth');

const upload = require('../../middleware/upload');

router.use(protect, admin);

router.get('/', getSubscribers);
router.get('/export', exportSubscribers);
router.post('/import', upload.single('file'), importSubscribers);
router.post('/broadcast', broadcastNewsletter);
router.delete('/:id', deleteSubscriber);

module.exports = router;
