const jwt = require('jsonwebtoken');
const { errorResponse } = require('../utils/response');

/**
 * Protect routes - verify JWT token
 */
const protect = async (req, res, next) => {
    let token;

    // Check for token in Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return errorResponse(res, 'Not authorized to access this route', 401);
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Attach user to request
        req.user = decoded;

        next();
    } catch (error) {
        return errorResponse(res, 'Not authorized to access this route', 401);
    }
};

/**
 * Admin role check
 */
const admin = (req, res, next) => {
    if (req.user && (req.user.role === 'admin' || req.user.role === 'super-admin')) {
        next();
    } else {
        return errorResponse(res, 'Not authorized as admin', 403);
    }
};

module.exports = { protect, admin };
