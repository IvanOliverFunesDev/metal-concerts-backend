import { describe, test, expect, jest, beforeEach } from '@jest/globals';
import { checkUserRole, checkBandStatus } from '../../../src/middleware/check-role.middleware.js';

describe('Middleware - checkUserRole', () => {
  let req, res, next;

  beforeEach(() => {
    req = {}; // 🛠️ Simulamos el request vacío
    res = {
      status: jest.fn().mockReturnThis(), // Mockeamos `.status()`
      json: jest.fn(), // Mockeamos `.json()`
    };
    next = jest.fn(); // Mockeamos `next()`
  });

  test('Debe permitir el acceso si el usuario tiene el rol correcto', () => {
    req.user = { role: 'admin' }; // 🟢 Simulamos un usuario con rol admin
    const middleware = checkUserRole('admin'); // Middleware para admin

    middleware(req, res, next);

    expect(next).toHaveBeenCalledTimes(1); // ✅ Debe llamar a next()
    expect(res.status).not.toHaveBeenCalled(); // 🚫 No debe devolver un error
  });

  test('Debe denegar el acceso si el usuario no tiene el rol requerido', () => {
    req.user = { role: 'user' }; // 🔴 Usuario sin permisos
    const middleware = checkUserRole('admin');

    middleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403); // ✅ Debe responder con 403
    expect(res.json).toHaveBeenCalledWith({ message: 'Access denied: insufficient permissions' });
    expect(next).not.toHaveBeenCalled(); // 🚫 No debe llamar a next()
  });

  test('Debe denegar el acceso si no hay usuario en la petición', () => {
    req.user = undefined; // 🔴 Sin autenticación
    const middleware = checkUserRole('admin');

    middleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ message: 'Access denied: insufficient permissions' });
    expect(next).not.toHaveBeenCalled();
  });
});

describe('Middleware - checkBandStatus', () => {
  let req, res, next;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  test('Debe permitir el acceso si el usuario es banda y tiene el estado requerido', () => {
    req.user = { role: 'band', status: 'approved' }; // 🟢 Simulamos una banda aprobada
    const middleware = checkBandStatus('approved');

    middleware(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(res.status).not.toHaveBeenCalled();
  });

  test('Debe denegar el acceso si el usuario no es una banda', () => {
    req.user = { role: 'user', status: 'approved' }; // 🔴 Usuario normal
    const middleware = checkBandStatus('approved');

    middleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ message: 'Access denied: Only bands can perform this action' });
    expect(next).not.toHaveBeenCalled();
  });

  test('Debe denegar el acceso si el estado de la banda no es el requerido', () => {
    req.user = { role: 'band', status: 'pending' }; // 🔴 Banda en estado pendiente
    const middleware = checkBandStatus('approved');

    middleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ message: "Access denied: Your band status must be 'approved'" });
    expect(next).not.toHaveBeenCalled();
  });
});
