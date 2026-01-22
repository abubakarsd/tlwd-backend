const cloudinary = require('../config/cloudinary');
const { Readable } = require('stream');

/**
 * Upload image to Cloudinary
 */
const uploadImage = async (fileBuffer, folder = 'TLWDF') => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder,
                resource_type: 'auto',
            },
            (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve({
                        url: result.secure_url,
                        publicId: result.public_id,
                    });
                }
            }
        );

        const readableStream = new Readable();
        readableStream.push(fileBuffer);
        readableStream.push(null);
        readableStream.pipe(uploadStream);
    });
};

/**
 * Delete image from Cloudinary
 */
const deleteImage = async (publicId) => {
    try {
        const result = await cloudinary.uploader.destroy(publicId);
        return result;
    } catch (error) {
        throw error;
    }
};

/**
 * Upload multiple images
 */
const uploadMultipleImages = async (files, folder = 'TLWDF') => {
    const uploadPromises = files.map(file => uploadImage(file.buffer, folder));
    return Promise.all(uploadPromises);
};

module.exports = {
    uploadImage,
    deleteImage,
    uploadMultipleImages,
};
