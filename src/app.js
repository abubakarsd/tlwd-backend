const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Middleware
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// CORS configuration
const allowedOrigins = [
    'https://life-we-deserve-site.vercel.app',
    'https://admin-tlwd.vercel.app',
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:3000',
    'http://localhost:8080',
];

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin
        if (!origin) return callback(null, true);

        // Normalize origin
        const normalizedOrigin = origin.trim().replace(/\/$/, "");

        const isVercel = normalizedOrigin.endsWith('.vercel.app');
        const isLocal = normalizedOrigin.includes('localhost') || normalizedOrigin.includes('127.0.0.1');
        const isExplicitlyAllowed = allowedOrigins.includes(normalizedOrigin) ||
            (process.env.FRONTEND_URL && normalizedOrigin === process.env.FRONTEND_URL.trim().replace(/\/$/, "")) ||
            (process.env.ADMIN_URL && normalizedOrigin === process.env.ADMIN_URL.trim().replace(/\/$/, ""));

        if (isVercel || isLocal || isExplicitlyAllowed) {
            callback(null, true);
        } else {
            console.warn(`CORS REJECTED: ${origin}`);
            callback(null, false);
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
    maxAge: 86400
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
const createCRUDRoutes = require('./routes/admin/crudRoutes');
const createPublicRoutes = require('./routes/public/publicRoutes');
const {
    impactCountController,
    teamController,
    partnerController,
    opportunityController,
    impactStoryController,
    resourceController,
    priorityController,
    valueController,
    testimonialController,
} = require('./controllers/crudControllers');

// Auth routes
app.use('/api/auth', require('./routes/auth'));

// Admin routes
app.use('/api/admin/hero-slides', require('./routes/admin/heroSlides'));
app.use('/api/admin/impact-counts', createCRUDRoutes(impactCountController));
app.use('/api/admin/priorities', createCRUDRoutes(priorityController)); // Add this
app.use('/api/admin/values', createCRUDRoutes(valueController));
app.use('/api/admin/testimonials', createCRUDRoutes(testimonialController));
app.use('/api/admin/impact-stories', createCRUDRoutes(impactStoryController));
app.use('/api/admin/blog', require('./routes/admin/blog'));
app.use('/api/admin/team', createCRUDRoutes(teamController));
app.use('/api/admin/partners', createCRUDRoutes(partnerController, 'logo'));
app.use('/api/admin/opportunities', createCRUDRoutes(opportunityController));
app.use('/api/admin/applications', require('./routes/admin/applications'));
app.use('/api/admin/donations', require('./routes/admin/donations'));
app.use('/api/admin/resources', createCRUDRoutes(resourceController, 'file'));
app.use('/api/admin/subscribers', require('./routes/admin/subscribers'));
app.use('/api/admin/dashboard', require('./routes/admin/dashboard'));
app.use('/api/admin/media', require('./routes/admin/media'));
app.use('/api/admin/settings', require('./routes/admin/settings'));

// Public routes
app.use('/api/hero-slides', require('./routes/public/heroSlides'));
app.use('/api/settings', require('./routes/public/settings'));
app.use('/api/impact-counts', createPublicRoutes(impactCountController));
app.use('/api/priorities', createPublicRoutes(priorityController)); // Add this
app.use('/api/values', createPublicRoutes(valueController));
app.use('/api/testimonials', createPublicRoutes(testimonialController));
app.use('/api/impact-stories', createPublicRoutes(impactStoryController));
app.use('/api/blog', require('./routes/public/blog'));
app.use('/api/team', createPublicRoutes(teamController));
app.use('/api/partners', createPublicRoutes(partnerController));
app.use('/api/opportunities', require('./routes/public/opportunities'));
app.use('/api/resources', createPublicRoutes(resourceController));
app.use('/api/donations', require('./routes/public/donations'));
app.use('/api/newsletter', require('./routes/public/newsletter'));
app.use('/api/contact', require('./routes/public/contact'));
app.use('/api/media', require('./routes/public/media'));


// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'OK', message: 'Server is running' });
});

// Error handler (must be last)
app.use(errorHandler);

module.exports = app;
