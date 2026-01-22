const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Middleware
app.use(helmet());
// CORS configuration
const allowedOrigins = [
    process.env.FRONTEND_URL,
    process.env.ADMIN_URL,
    'https://admin-tlwd.vercel.app',
    'http://localhost:5173',
    'http://localhost:5174',
];

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);

        if (allowedOrigins.indexOf(origin) !== -1 || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
const createCRUDRoutes = require('./routes/admin/crudRoutes');
const createPublicRoutes = require('./routes/public/publicRoutes');
const {
    programController,
    teamController,
    partnerController,
    opportunityController,
    impactStoryController,
    resourceController,
} = require('./controllers/crudControllers');

// Auth routes
app.use('/api/auth', require('./routes/auth'));

// Admin routes
app.use('/api/admin/hero-slides', require('./routes/admin/heroSlides'));
app.use('/api/admin/programs', createCRUDRoutes(programController));
app.use('/api/admin/impact-stories', createCRUDRoutes(impactStoryController));
app.use('/api/admin/blog', require('./routes/admin/blog'));
app.use('/api/admin/team', createCRUDRoutes(teamController));
app.use('/api/admin/partners', createCRUDRoutes(partnerController));
app.use('/api/admin/opportunities', createCRUDRoutes(opportunityController));
app.use('/api/admin/applications', require('./routes/admin/applications'));
app.use('/api/admin/donations', require('./routes/admin/donations'));
app.use('/api/admin/resources', createCRUDRoutes(resourceController));
app.use('/api/admin/subscribers', require('./routes/admin/subscribers'));
app.use('/api/admin/dashboard', require('./routes/admin/dashboard'));

// Public routes
app.use('/api/hero-slides', require('./routes/public/heroSlides'));
app.use('/api/programs', createPublicRoutes(programController));
app.use('/api/impact-stories', createPublicRoutes(impactStoryController));
app.use('/api/blog', require('./routes/public/blog'));
app.use('/api/team', createPublicRoutes(teamController));
app.use('/api/partners', createPublicRoutes(partnerController));
app.use('/api/opportunities', require('./routes/public/opportunities'));
app.use('/api/resources', createPublicRoutes(resourceController));
app.use('/api/donations', require('./routes/public/donations'));
app.use('/api', require('./routes/public/newsletter'));
app.use('/api/contact', require('./routes/public/contact'));


// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'OK', message: 'Server is running' });
});

// Error handler (must be last)
app.use(errorHandler);

module.exports = app;
