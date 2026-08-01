import { PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { s3Client, BUCKET_NAME } from '../config/s3.js';
import crypto from 'crypto';

/**
 * Generate S3 presigned URL for direct client upload
 */
export const generatePresignedUploadUrl = async ({ fileName, fileType }) => {
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/jpg', 'image/svg+xml'];
  
  if (fileType && !allowedMimeTypes.includes(fileType.toLowerCase())) {
    const error = new Error('Invalid file type. Only JPG, PNG, WEBP, GIF, and SVG images are allowed.');
    error.statusCode = 400;
    throw error;
  }

  // Generate unique file key to prevent collisions
  const fileExtension = fileName.split('.').pop() || 'jpg';
  const cleanBaseName = fileName
    .substring(0, fileName.lastIndexOf('.'))
    .replace(/[^a-zA-Z0-9_-]/g, '_')
    .slice(0, 30);
  
  const randomHash = crypto.randomBytes(8).toString('hex');
  const fileKey = `profiles/${Date.now()}_${randomHash}_${cleanBaseName}.${fileExtension}`;

  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: fileKey,
    ContentType: fileType || 'image/jpeg',
  });

  // Presigned URL valid for 5 minutes (300 seconds)
  const presignedUrl = await getSignedUrl(s3Client, command, { expiresIn: 300 });

  const region = process.env.AWS_REGION || 'us-east-1';
  const fileUrl = `https://${BUCKET_NAME}.s3.${region}.amazonaws.com/${fileKey}`;

  return {
    presignedUrl,
    fileUrl,
    fileKey,
    expiresIn: 300,
  };
};

/**
 * Delete object from S3 bucket
 */
export const deleteS3Object = async (fileKey) => {
  if (!fileKey) return;
  try {
    const command = new DeleteObjectCommand({
      Bucket: BUCKET_NAME,
      Key: fileKey,
    });
    await s3Client.send(command);
  } catch (error) {
    console.error('Error deleting object from S3:', error);
    // Non-blocking error for main workflow
  }
};
