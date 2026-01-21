/**
 * Pagination helper utility
 */

const getPagination = (page = 1, limit = 10) => {
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);

    const skip = (pageNum - 1) * limitNum;

    return {
        page: pageNum,
        limit: limitNum,
        skip,
    };
};

const getPaginationData = (total, page, limit) => {
    const totalPages = Math.ceil(total / limit);

    return {
        page,
        limit,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
    };
};

module.exports = {
    getPagination,
    getPaginationData,
};
