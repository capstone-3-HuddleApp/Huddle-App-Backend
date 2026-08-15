const express = require( 'express');
const uploadController = require('../controllers/image.controller')
const multer = require('multer')

const router = express.Router();

// Middleware to handle file uploads
const upload = multer({ storage: multer.memoryStorage() });

// POST - Upload image
router.post('/upload', upload.single('file'), uploadController.uploadImage);

// DELETE - Delete image
router.delete('/delete', uploadController.deleteImage);

// GET - Get transformed URL
router.get('/transform', uploadController.getTransformedUrl);

module.exports = router