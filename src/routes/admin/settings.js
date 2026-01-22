const express = require('express');
const router = express.Router();
const { getSettings, updateSettings } = require('../../controllers/settingsController');
const { protect, admin } = require('../../middleware/auth');

router.use(protect, admin);

router.get('/', getSettings);
router.put('/', updateSettings);

module.exports = router;
