/**
 * Standardized API response helper
 */

const successResponse = (res, data, message = 'Success', statusCode = 200) => {
    return res.status(statusCode).json({
        success: true,
        message,
        data,
    });
};

const errorResponse = (res, message = 'Error', statusCode = 500, error = null) => {
    return res.status(statusCode).json({
        success: false,
        message,
        error,
    });
};

const paginatedResponse = (res, data, pagination, message = 'Success') => {
    return res.status(200).json({
        success: true,
        message,
        data,
        pagination,
    });
};

module.exports = {
    successResponse,
    errorResponse,
    paginatedResponse,
};
