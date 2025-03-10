import { describe, test, expect, jest, beforeEach } from '@jest/globals';
import { validateSchema } from '../../../src/middleware/validator-schema.middleware.js';
import { z } from 'zod';

describe('Middleware - validateSchema', () => {
  let req, res, next;
  const mockSchema = z.object({
    username: z.string().min(3, 'El nombre de usuario debe tener al menos 3 caracteres'),
    email: z.string().email('El email no es válido'),
  });

  beforeEach(() => {
    req = { body: {} }; // Se inicializa vacío y lo modificamos en cada test
    res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    next = jest.fn();
  });

  test('Debe permitir continuar si la validación es exitosa', () => {
    req.body = { username: 'David', email: 'test@example.com' }; // ✅ Datos válidos

    validateSchema(mockSchema)(req, res, next);

    expect(next).toHaveBeenCalled(); // ✅ Se llama a next()
    expect(res.status).not.toHaveBeenCalled(); // ❌ No debe llamar res.status()
  });

  test('Debe devolver 400 si los datos no cumplen con el esquema', () => {
    req.body = { username: 'D', email: 'invalid-email' }; // 🚫 Datos inválidos

    validateSchema(mockSchema)(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400); // 🔴 Debe devolver 400
    expect(res.json).toHaveBeenCalledWith({
      message: 'Error en la validación de datos',
      errors: [
        { field: 'username', message: 'El nombre de usuario debe tener al menos 3 caracteres' },
        { field: 'email', message: 'El email no es válido' }
      ],
    });
    expect(next).not.toHaveBeenCalled(); // ❌ No debe llamar a next()
  });
});
