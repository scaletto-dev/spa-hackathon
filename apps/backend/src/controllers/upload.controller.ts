import { Request, Response } from 'express';
import { uploadService, ImageFolder } from '../services/upload.service';

/**
 * Upload an image to Supabase Storage
 * POST /api/v1/upload/image
 * Query params:
 * - folder: blog | branches | profile | service (default: service)
 */
export const uploadImage = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({
        success: false,
        error: 'No file provided',
        message: 'Please upload an image file',
      });
      return;
    }

    // Get folder from query params, default to 'service'
    const folderParam = (req.query.folder as string) || 'service';
    const folder = folderParam as ImageFolder;

    // Validate folder
    if (!Object.values(ImageFolder).includes(folder)) {
      res.status(400).json({
        success: false,
        error: 'Invalid folder',
        message: `Folder must be one of: ${Object.values(ImageFolder).join(', ')}`,
      });
      return;
    }

    const url = await uploadService.uploadImage(req.file, folder);

    res.status(201).json({
      success: true,
      data: {
        url,
        folder,
      },
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({
        success: false,
        error: 'Upload failed',
        message: error.message,
      });
    } else {
      res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: 'Failed to upload image',
      });
    }
  }
};
