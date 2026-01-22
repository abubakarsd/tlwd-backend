const express = require('express');
const router = express.Router();
const { getMedia, createMedia, deleteMedia } = require('../../controllers/mediaController');
const { protect, admin } = require('../../middleware/auth');
const upload = require('../../middleware/upload');

router.use(protect, admin);

router.get('/', getMedia);
router.post('/', upload.single('file'), createMedia);
router.delete('/:id', deleteMedia);

module.exports = router;
