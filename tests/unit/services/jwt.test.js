import { describe, test, expect, jest } from '@jest/globals';
import jwt from 'jsonwebtoken';
import { generateAccessToken } from '../../../src/services/jwt.js';

// 🛠️ Mockeamos jwt.sign para no generar tokens reales
jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(),
}));

describe('Auth Service - generateAccessToken', () => {
  const mockPayload = { id: 'user123' }; // 🔹 Datos de prueba
  const mockToken = 'mocked.jwt.token'; // 🔹 Token falso para simular la firma

  test('Debe generar un token cuando recibe un payload válido', async () => {
    jwt.sign.mockImplementation((payload, secret, options, callback) => {
      callback(null, mockToken); // 🔹 Simulamos que jwt.sign devuelve un token sin errores
    });

    const token = await generateAccessToken(mockPayload);

    expect(token).toBe(mockToken); // 🔥 Verificamos que devuelve el token correcto
    expect(jwt.sign).toHaveBeenCalledWith(
      mockPayload,
      expect.any(String), // 🔹 No comprobamos la clave secreta porque es privada
      { expiresIn: '1d' },
      expect.any(Function) // 🔹 La función de callback
    );
  });

  test('Debe rechazar la promesa si jwt.sign da error', async () => {
    jwt.sign.mockImplementation((payload, secret, options, callback) => {
      callback(new Error('Token generation failed'), null); // 🔹 Simulamos que jwt.sign da error
    });

    await expect(generateAccessToken(mockPayload)).rejects.toThrow('Token generation failed'); // 🔥 Verificamos que rechaza con el error correcto
  });
});
