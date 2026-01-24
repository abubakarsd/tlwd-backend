const express = require('express');
const router = express.Router();
const { getPublicImpactStory, submitProjectComment } = require('../../controllers/impactStoryController');
const { impactStoryController } = require('../../controllers/crudControllers');

router.get('/', impactStoryController.getPublic);
router.get('/:id', getPublicImpactStory);
router.post('/:id/comments', submitProjectComment);

module.exports = router;
