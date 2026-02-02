const { starBizzPartnerController } = require('../../controllers/crudControllers');
const createPublicRoutes = require('./publicRoutes');

module.exports = createPublicRoutes(starBizzPartnerController);
