import { describe, test, expect, jest, beforeEach } from '@jest/globals';
import { authRequired, authOptional } from '../../../src/middleware/validate-token.middleware.js';
import jwt from 'jsonwebtoken';

jest.mock('jsonwebtoken');

describe('Middleware - Auth', () => {
  let req, res, next;

  beforeEach(() => {
    req = { headers: {} };
    res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    next = jest.fn();
  });

  const mockToken = 'valid.token.jwt';
  const decodedUser = { id: 'user123', role: 'admin' };

  describe('authRequired', () => {
    test('Debe permitir el acceso si el token es válido', () => {
      req.headers.authorization = `Bearer ${mockToken}`;
      jwt.verify.mockImplementation((token, secret, callback) => callback(null, decodedUser));

      authRequired(req, res, next);

      expect(req.user).toEqual(decodedUser);
      expect(next).toHaveBeenCalled();
    });

    test('Debe rechazar el acceso si no hay token', () => {
      authRequired(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: 'Authentication token is missing' });
      expect(next).not.toHaveBeenCalled();
    });

    test('Debe rechazar el acceso si el token es inválido o expirado', () => {
      req.headers.authorization = `Bearer ${mockToken}`;
      jwt.verify.mockImplementation((token, secret, callback) => callback(new Error('Token inválido'), null));

      authRequired(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ message: 'Authentication token is invalid or expired' });
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe('authOptional', () => {
    test('Debe permitir el acceso sin token y establecer req.user como undefined', () => {
      authOptional(req, res, next);

      expect(req.user).toBeUndefined();
      expect(next).toHaveBeenCalled();
    });

    test('Debe permitir el acceso con token válido y asignar req.user', () => {
      req.headers.authorization = `Bearer ${mockToken}`;
      jwt.verify.mockImplementation((token, secret, callback) => callback(null, decodedUser));

      authOptional(req, res, next);

      expect(req.user).toEqual(decodedUser);
      expect(next).toHaveBeenCalled();
    });

    test('Debe permitir el acceso con token inválido, pero sin bloquear (req.user = undefined)', () => {
      req.headers.authorization = `Bearer ${mockToken}`;
      jwt.verify.mockImplementation((token, secret, callback) => callback(new Error('Token inválido'), null));

      authOptional(req, res, next);

      expect(req.user).toBeUndefined();
      expect(next).toHaveBeenCalled();
    });
  });
});
