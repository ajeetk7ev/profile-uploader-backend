import { Router } from 'express';
import { getPresignedUrl } from '../controllers/s3Controller.js';
import { validate, presignedUrlSchema } from '../middlewares/validateRequest.js';

const router = Router();

router.post('/presigned-url', validate(presignedUrlSchema), getPresignedUrl);

export default router;
