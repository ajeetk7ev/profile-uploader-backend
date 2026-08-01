import { z } from 'zod';

export const userCreateSchema = z.object({
  first_name: z.string().min(1, 'First name is required').max(100),
  last_name: z.string().min(1, 'Last name is required').max(100),
  email: z.string().email('Invalid email address'),
  age: z.coerce.number().int().min(1, 'Age must be at least 1').max(149, 'Age must be less than 150'),
  profile_image_url: z.string().url('Invalid profile image URL').optional().nullable(),
});

export const userUpdateSchema = z.object({
  first_name: z.string().min(1, 'First name is required').max(100),
  last_name: z.string().min(1, 'Last name is required').max(100),
  email: z.string().email('Invalid email address'),
  age: z.coerce.number().int().min(1, 'Age must be at least 1').max(149, 'Age must be less than 150'),
  profile_image_url: z.string().url('Invalid profile image URL').optional().nullable(),
});

export const presignedUrlSchema = z.object({
  fileName: z.string().min(1, 'File name is required'),
  fileType: z.string().min(1, 'File type is required'),
});

export const validate = (schema) => (req, res, next) => {
  try {
    req.body = schema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      const formattedErrors = error.errors.map((err) => ({
        field: err.path.join('.'),
        message: err.message,
      }));
      return res.status(400).json({
        success: false,
        error: {
          message: 'Validation failed',
          details: formattedErrors,
        },
      });
    }
    next(error);
  }
};
