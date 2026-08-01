import { S3Client } from '@aws-sdk/client-s3';
import dotenv from 'dotenv';

dotenv.config();

const region = process.env.AWS_REGION || 'us-east-1';
const accessKeyId = process.env.AWS_ACCESS_KEY_ID || 'mock_key';
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY || 'mock_secret';

export const s3Client = new S3Client({
  region,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});

export const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME || 'mock_profile_bucket';
