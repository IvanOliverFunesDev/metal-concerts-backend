import { z } from 'zod';

export const concertSchema = z.object({
  title: z
    .string().min(3, 'Title must be at least 3 characters long'),
  description: z
    .string().min(10, 'Description must be at least 10 characters long'),
  date: z
    .string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)'),
  location: z
    .string().min(3, 'Location must be at least 3 characters long'),
});

export const concertUpdateSchema = concertSchema.partial();
