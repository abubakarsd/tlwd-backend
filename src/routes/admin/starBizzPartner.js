const { starBizzPartnerController } = require('../../controllers/crudControllers');
const createCRUDRoutes = require('./crudRoutes');

module.exports = createCRUDRoutes(starBizzPartnerController, 'logo');
