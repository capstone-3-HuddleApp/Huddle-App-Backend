import express from 'express';
import { uploadController } from '../controllers/uploadController.js';
import multer from 'multer';

const router = express.Router();

// Middleware to handle file uploads
const upload = multer({ storage: multer.memoryStorage() });

// POST - Upload image
router.post('/upload', upload.single('file'), uploadController.uploadImage);

// DELETE - Delete image
router.delete('/upload', uploadController.deleteImage);

// GET - Get transformed URL
router.get('/upload/transform', uploadController.getTransformedUrl);

export default router;