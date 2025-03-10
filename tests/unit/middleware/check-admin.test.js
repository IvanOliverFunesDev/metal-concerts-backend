import { describe, test, expect, jest, beforeEach } from '@jest/globals';
import { checkAdmin } from '../../../src/middleware/check-admin.middleware.js';

describe('Middleware - checkAdmin', () => {
  let req, res, next;

  beforeEach(() => {
    req = {}; // 🛠️ Simulamos el request vacío
    res = {
      status: jest.fn().mockReturnThis(), // 🛠️ Mockeamos `.status()` para que encadene métodos
      json: jest.fn(), // 🛠️ Mockeamos `.json()`
    };
    next = jest.fn(); // 🛠️ Mockeamos `next()`
  });

  test('Debe permitir el acceso si el usuario es admin', () => {
    req.user = { role: 'admin' }; // 🟢 Simulamos un usuario administrador

    checkAdmin(req, res, next);

    expect(next).toHaveBeenCalledTimes(1); // ✅ Debe llamar a next()
    expect(res.status).not.toHaveBeenCalled(); // 🚫 No debe llamar a res.status()
  });

  test('Debe denegar el acceso si el usuario no es admin', () => {
    req.user = { role: 'user' }; // 🔴 Usuario normal, no admin

    checkAdmin(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403); // ✅ Debe responder con 403
    expect(res.json).toHaveBeenCalledWith({ message: 'Access denied: Admins only' });
    expect(next).not.toHaveBeenCalled(); // 🚫 No debe llamar a next()
  });

  test('Debe denegar el acceso si no hay usuario en la petición', () => {
    req.user = undefined; // 🔴 Usuario no autenticado

    checkAdmin(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403); // ✅ Debe responder con 403
    expect(res.json).toHaveBeenCalledWith({ message: 'Access denied: Admins only' });
    expect(next).not.toHaveBeenCalled(); // 🚫 No debe llamar a next()
  });
});
