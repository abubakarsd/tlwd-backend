const multer = require('multer');
const path = require('path');

// Configure multer for memory storage (we'll upload to Cloudinary)
const storage = multer.memoryStorage();

// File filter
const fileFilter = (req, file, cb) => {
    // Allowed file types (Images, Docs, Spreadsheets)
    const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx|csv|xls|xlsx/;

    // Check extension
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());

    // Check mime type
    // Note: CSV/Excel mime types can be tricky/varied, so we rely heavily on extension for them,
    // but we can add common mime types if needed. 
    // For simplicity and robustness with various CSV generators, we'll trust the extension + generic mime validation.
    const mimetype = allowedTypes.test(file.mimetype) ||
        file.mimetype.includes('spreadsheet') ||
        file.mimetype.includes('excel') ||
        file.mimetype.includes('csv') ||
        file.mimetype === 'text/csv' ||
        file.mimetype === 'application/vnd.ms-excel' ||
        file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        console.error(`File Upload Rejected: ${file.originalname}, MimeType: ${file.mimetype}`);
        cb(new Error('Invalid file type. Allowed: JPEG, PNG, GIF, PDF, DOC, DOCX, CSV, XLS, XLSX'));
    }
};

// Upload middleware
const upload = multer({
    storage,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB limit
    },
    fileFilter,
});

module.exports = upload;
