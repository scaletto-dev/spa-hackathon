import { Router } from 'express';
import { uploadImage } from '../controllers/upload.controller';
import { upload } from '../middleware/upload';
import { uploadImageRateLimiter } from '../config/rateLimits';

const router = Router();

/**
 * POST /api/v1/upload/image
 * Upload an image to Supabase Storage
 * Rate limit: 10 uploads per hour per IP
 * Query params:
 * - folder: blog | branches | profile | service (default: service)
 */
router.post('/image', uploadImageRateLimiter, upload.single('image'), uploadImage);

export default router;
