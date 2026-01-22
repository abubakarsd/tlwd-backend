const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { successResponse, errorResponse } = require('../utils/response');

/**
 * Generate JWT token
 */
const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE,
    });
};

/**
 * @route   POST /api/auth/login
 * @desc    Login admin user
 * @access  Public
 */
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return errorResponse(res, 'Please provide email and password', 400);
        }

        // Check if user exists
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return errorResponse(res, 'Invalid credentials', 401);
        }

        // Check password
        const isPasswordMatch = await user.comparePassword(password);

        if (!isPasswordMatch) {
            return errorResponse(res, 'Invalid credentials', 401);
        }

        // Generate token
        const token = generateToken(user._id, user.role);

        successResponse(res, {
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        }, 'Login successful');
    } catch (error) {
        errorResponse(res, error.message, 500);
    }
};

/**
 * @route   GET /api/auth/me
 * @desc    Get current logged in user
 * @access  Private
 */
exports.getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return errorResponse(res, 'User not found', 404);
        }

        successResponse(res, user);
    } catch (error) {
        errorResponse(res, error.message, 500);
    }
};

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user
 * @access  Private
 */
exports.logout = async (req, res) => {
    successResponse(res, null, 'Logout successful');
};

/**
 * @route   POST /api/auth/refresh
 * @desc    Refresh token
 * @access  Private
 */
exports.refreshToken = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return errorResponse(res, 'User not found', 404);
        }

        const token = generateToken(user._id, user.role);

        successResponse(res, { token }, 'Token refreshed');
    } catch (error) {
        errorResponse(res, error.message, 500);
    }
};

/**
 * @route   PUT /api/auth/password
 * @desc    Update password
 * @access  Private
 */
exports.updatePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        const user = await User.findById(req.user.id).select('+password');

        if (!user) {
            return errorResponse(res, 'User not found', 404);
        }

        // Check current password
        const isMatch = await user.comparePassword(currentPassword);

        if (!isMatch) {
            return errorResponse(res, 'Invalid current password', 401);
        }

        user.password = newPassword;
        await user.save();

        successResponse(res, null, 'Password updated successfully');
    } catch (error) {
        errorResponse(res, error.message, 500);
    }
};
