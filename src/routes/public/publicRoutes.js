// Generic public routes for CRUD models
const express = require('express');

const createPublicRoutes = (controller) => {
    const router = express.Router();

    router.get('/', controller.getPublic);
    router.get('/:id', controller.getPublicById);

    return router;
};

module.exports = createPublicRoutes;
