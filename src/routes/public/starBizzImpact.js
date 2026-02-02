const express = require('express');
const router = express.Router();
const { starBizzImpactController } = require('../../controllers/crudControllers');

router.get('/', starBizzImpactController.getPublic);
router.get('/:id', starBizzImpactController.getPublicById);

module.exports = router;
