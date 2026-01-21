const express = require('express');
const router = express.Router();
const { submitApplication } = require('../../controllers/applicationController');
const upload = require('../../middleware/upload');

router.post('/:id/apply', upload.single('cv'), submitApplication);

module.exports = router;
