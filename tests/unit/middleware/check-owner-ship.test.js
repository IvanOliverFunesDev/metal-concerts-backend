import { describe, test, expect, jest, beforeEach } from '@jest/globals';
import { checkOwnerShip } from '../../../src/middleware/check-owner-ship.middleware.js';
import Concert from '../../../src/models/concerts.model.js';

jest.mock('../../../src/models/concerts.model.js'); // 🔥 Mockeamos el modelo para evitar llamadas reales a la BD

describe('Middleware - checkOwnerShip', () => {
  let req, res, next;

  beforeEach(() => {
    req = { params: { id: 'concert123' }, user: { id: 'band456' } };
    res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    next = jest.fn();
    Concert.findById.mockReset(); // Reiniciamos el mock antes de cada test
  });

  test('Debe permitir continuar si el usuario es el dueño del concierto', async () => {
    Concert.findById.mockResolvedValue({ _id: 'concert123', band: 'band456' }); // 🎸 Es el dueño

    await checkOwnerShip(req, res, next);

    expect(next).toHaveBeenCalled(); // ✅ next() debe ejecutarse
  });

  test('Debe devolver 404 si el concierto no existe', async () => {
    Concert.findById.mockResolvedValue(null); // 🎭 Concierto no encontrado

    await checkOwnerShip(req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Concert not found' });
  });

  test('Debe devolver 403 si el usuario NO es el dueño del concierto', async () => {
    Concert.findById.mockResolvedValue({ _id: 'concert123', band: 'band789' }); // 🚫 No es el dueño

    await checkOwnerShip(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ message: 'You are not the owner of this concert' });
  });

  test('Debe manejar errores internos con un status 500', async () => {
    Concert.findById.mockRejectedValue(new Error('DB Error')); // ❌ Simulamos un fallo en la BD

    await checkOwnerShip(req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'DB Error' });
  });
});
