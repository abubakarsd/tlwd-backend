// Generic admin routes for CRUD models
const express = require('express');
const { protect, admin } = require('../../middleware/auth');
const upload = require('../../middleware/upload');

const createCRUDRoutes = (controller) => {
    const router = express.Router();
    router.use(protect, admin);

    router.route('/')
        .get(controller.getAll)
        .post(upload.single('image'), controller.create);

    router.route('/:id')
        .put(upload.single('image'), controller.update)
        .delete(controller.delete);

    return router;
};

module.exports = createCRUDRoutes;
