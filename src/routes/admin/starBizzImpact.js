const { starBizzImpactController } = require('../../controllers/crudControllers');
const createCRUDRoutes = require('./crudRoutes');

module.exports = createCRUDRoutes(starBizzImpactController);
