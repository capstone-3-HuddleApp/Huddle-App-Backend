const cloudinary = require('../cloudinary.config')

module.exports = {
    async uploadImage(file, publicId) {
        const result = await cloudinary.uploader.upload(file, {
            public_id: publicId
        });
        return result;
    },

    async deleteImage(publicId) {
        const result = await cloudinary.uploader.destroy(publicId);
        return result;
    },

    generateUrl(publicId, transformations) {
        return cloudinary.url(publicId, transformations);
    }
};