const express = require('express');
const router = express.Router();
const { submitApplication } = require('../../controllers/applicationController');
const upload = require('../../middleware/upload');

const { opportunityController } = require('../../controllers/crudControllers');

router.get('/', (req, res) => {
    // Manually handle public listing for now or export getPublic from factory
    opportunityController.getPublic(req, res);
});

router.get('/:id', (req, res) => {
    opportunityController.getPublicById(req, res);
});

router.post('/:id/apply', upload.single('cv'), submitApplication);

module.exports = router;
