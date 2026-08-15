const imageService = require('../services/image.service')

module.exports = {
    async uploadImage(req, res) {
        try {
            const {publicId} = req.body;

            // Cloudinary SDK can accept file path, URL, or buffer
            // Assuming middleware passed file info to req.file
            const result = await imageService.uploadImage(req.file.buffer, publicId);
            
            res.status(200).json({
                success: true,
                message: 'Image uploaded successfully',
                data: {
                    publicId: result.public_id,
                    url: result.secure_url,
                }
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Upload failed',
                error: error.message
            });
        }
    },

    async deleteImage(req, res) {
        try {
            const { publicId } = req.body;
            
            const result = await imageService.deleteImage(publicId);
            
            res.status(200).json({
                success: true,
                message: 'Image deleted successfully',
                data: result
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Delete failed',
                error: error.message
            });
        }
    },

    async getTransformedUrl(req, res) {
        try {
            const { publicId } = req.query;
            const transformations = {
                crop: 'auto',
                gravity: 'auto',
                width: 500,
                height: 500,
            };
            
            const url = imageService.generateUrl(publicId, transformations);
            
            res.status(200).json({
                success: true,
                url: url
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }
};