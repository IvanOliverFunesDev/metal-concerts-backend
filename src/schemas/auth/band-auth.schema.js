import { z } from 'zod';
import { GENRES } from '../../constants/genres.js';

export const registerBandSchema = z.object({
  bandName: z
    .string().min(3, { message: 'El nombre de la banda debe tener al menos 3 caracteres' }).max(50),
  email: z
    .string().email({ message: 'El email no es válido' }),
  password: z
    .string().min(6, { message: 'La contraseña debe tener al menos 6 caracteres' }),
  description: z
    .string().min(10, { message: 'La descripción debe tener al menos 10 caracteres' }).max(500),
  genre: z
    .enum([...GENRES], { message: 'Debe seleccionar un género válido' }),
});
