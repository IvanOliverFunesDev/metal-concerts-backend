import { z } from 'zod';

export const reviewSchema = z.object({
  rating: z
    .number()
    .min(1, 'Rating must be at least 1')
    .max(5, 'Rating must be at most 5'),
  comment: z
    .string()
    .max(500, 'Comment cannot exceed 500 characters')
    .optional()
});
