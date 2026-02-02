const express = require('express');
const { starBizzProgramController } = require('../../controllers/crudControllers');

const router = express.Router();

router.get('/', starBizzProgramController.getPublic);
router.get('/:id', starBizzProgramController.getPublicById);

module.exports = router;
