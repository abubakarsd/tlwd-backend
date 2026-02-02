const express = require('express');
const { starBizzProgramController } = require('../../controllers/crudControllers');
const createCRUDRoutes = require('./crudRoutes');

// Since programs don't need image upload for now (using lucide icon names), we can use generic route or simple one.
// createCRUDRoutes handles 'image' upload by default. We can pass a dummy field or None if not needed, 
// OR just use it as is since it won't break if no file is sent. 
// However, StarBizzProgram model doesn't have an image field in the schema I defined (just icon string).
// So file upload is not needed. But createCRUDRoutes adds upload middleware.
// Let's use it for consistency, passing a field name that might be used later or just 'image'.
const router = createCRUDRoutes(starBizzProgramController, 'image');

module.exports = router;
