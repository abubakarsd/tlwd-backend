const express = require('express');
const router = express.Router();
const {
    getApplications,
    getApplication,
    updateApplicationStatus,
    deleteApplication,
} = require('../../controllers/applicationController');
const { protect, admin } = require('../../middleware/auth');

router.use(protect, admin);

router.get('/', getApplications);
router.get('/:id', getApplication);
router.patch('/:id/status', updateApplicationStatus);
router.delete('/:id', deleteApplication);

module.exports = router;
