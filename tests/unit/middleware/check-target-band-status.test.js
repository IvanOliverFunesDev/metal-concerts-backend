import { describe, test, expect, jest, beforeEach } from '@jest/globals';
import { checkTargetBandStatus } from '../../../src/middleware/check-target-band-status.middleware.js';
import Band from '../../../src/models/band.model.js';
import { errorResponse } from '../../../src/utils/responseHelper.js';

jest.mock('../../../src/models/band.model.js'); // 🔥 Mockeamos el modelo para evitar llamadas reales a la BD
jest.mock('../../../src/utils/responseHelper.js'); // 🔥 Mockeamos la función de respuestas de error

describe('Middleware - checkTargetBandStatus', () => {
  let req, res, next;

  beforeEach(() => {
    req = { params: { bandId: 'band123' } };
    res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    next = jest.fn();
    Band.findById.mockReset();
    errorResponse.mockReset();
  });

  test('Debe permitir continuar si la banda existe y está aprobada', async () => {
    Band.findById.mockResolvedValue({ _id: 'band123', status: 'approved' }); // ✅ Banda aprobada

    await checkTargetBandStatus(req, res, next);

    expect(next).toHaveBeenCalled(); // ✅ next() debe ejecutarse
  });

  test('Debe devolver 404 si la banda no existe', async () => {
    Band.findById.mockResolvedValue(null); // 🚫 Banda no encontrada

    await checkTargetBandStatus(req, res, next);

    expect(errorResponse).toHaveBeenCalledWith(res, 404, 'Band not found');
  });

  test('Debe devolver 403 si la banda NO está aprobada', async () => {
    Band.findById.mockResolvedValue({ _id: 'band123', status: 'pending' }); // 🚫 Banda en estado "pending"

    await checkTargetBandStatus(req, res, next);

    expect(errorResponse).toHaveBeenCalledWith(res, 403, 'You cannot subscribe to a band that is not approved');
  });

  test('Debe manejar errores internos con un status 500', async () => {
    Band.findById.mockRejectedValue(new Error('DB Error')); // ❌ Simulamos un fallo en la BD

    await checkTargetBandStatus(req, res, next);

    expect(errorResponse).toHaveBeenCalledWith(res, 500, 'Internal Server Error', [{ message: 'DB Error' }]);
  });
});
