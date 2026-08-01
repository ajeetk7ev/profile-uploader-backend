import { generatePresignedUploadUrl } from '../services/s3Service.js';

/**
 * Controller to get S3 Presigned Upload URL
 * POST /api/s3/presigned-url
 */
export const getPresignedUrl = async (req, res, next) => {
  try {
    const { fileName, fileType } = req.body;
    const result = await generatePresignedUploadUrl({ fileName, fileType });

    res.status(200).json({
      success: true,
      message: 'Presigned upload URL generated successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
