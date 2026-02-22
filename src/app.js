const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const axios = require('axios');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// CORS configuration
const allowedOrigins = [
    'https://life-we-deserve-site.vercel.app',
    'https://admin-tlwd.vercel.app',
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:3000',
    'http://localhost:8080',
    'https://www.tlwdfoundation.org',
    'https://tlwdfoundation.org',
];

// Middleware
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    contentSecurityPolicy: {
        directives: {
            ...helmet.contentSecurityPolicy.getDefaultDirectives(),
            "frame-ancestors": ["'self'", ...allowedOrigins],
        },
    },
    frameguard: false, // Allow iframes for PDF viewing
}));

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
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

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
app.use('/api/admin/impact-stories', require('./routes/admin/impactStories'));
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
const starBizzImpactRoutes = require('./routes/admin/starBizzImpact');
const starBizzProgramRoutes = require('./routes/admin/starBizzProgram');
app.use('/api/admin/star-bizz-impact', starBizzImpactRoutes);
app.use('/api/admin/star-bizz-program', starBizzProgramRoutes);
app.use('/api/admin/star-bizz-partner', require('./routes/admin/starBizzPartner'));
app.use('/api/admin/settings', require('./routes/admin/settings'));

// Public routes
app.use('/api/hero-slides', require('./routes/public/heroSlides'));
app.use('/api/settings', require('./routes/public/settings'));
app.use('/api/impact-counts', createPublicRoutes(impactCountController));
app.use('/api/priorities', createPublicRoutes(priorityController)); // Add this
app.use('/api/values', createPublicRoutes(valueController));
app.use('/api/testimonials', createPublicRoutes(testimonialController));
app.use('/api/impact-stories', require('./routes/public/impactStories'));
app.use('/api/blog', require('./routes/public/blog'));
app.use('/api/team', createPublicRoutes(teamController));
app.use('/api/partners', createPublicRoutes(partnerController));
app.use('/api/opportunities', require('./routes/public/opportunities'));
app.use('/api/resources', createPublicRoutes(resourceController));
app.use('/api/donations', require('./routes/public/donations'));
app.use('/api/newsletter', require('./routes/public/newsletter'));
const publicStarBizzImpactRoutes = require('./routes/public/starBizzImpact');
const publicStarBizzProgramRoutes = require('./routes/public/starBizzProgram');
app.use('/api/star-bizz-impact', publicStarBizzImpactRoutes);
app.use('/api/star-bizz-program', publicStarBizzProgramRoutes);
app.use('/api/star-bizz-partner', require('./routes/public/starBizzPartner'));
app.use('/api/contact', require('./routes/public/contact'));
app.use('/api/media', require('./routes/public/media'));


// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'OK', message: 'Server is running' });
});

// PDF Proxy to bypass Cloudinary 401 errors for raw files
app.get('/api/proxy/pdf', async (req, res) => {
    const { url } = req.query;

    if (!url) {
        return res.status(400).json({ error: 'URL is required' });
    }

    if (!url.includes('cloudinary.com')) {
        return res.status(400).json({ error: 'Only Cloudinary URLs are allowed' });
    }

    try {
        const response = await axios({
            method: 'get',
            url: url,
            responseType: 'stream'
        });

        // Set correct content type
        res.setHeader('Content-Type', 'application/pdf');

        // Explicitly remove X-Frame-Options to allow iframe embedding
        res.removeHeader('X-Frame-Options');

        // Pass through from Cloudinary
        response.data.pipe(res);
    } catch (error) {
        console.error('PDF Proxy Error:', error.message);
        res.status(error.response?.status || 500).json({ error: 'Failed to fetch PDF from source' });
    }
});

// Error handler (must be last)
app.use(errorHandler);

module.exports = app;
