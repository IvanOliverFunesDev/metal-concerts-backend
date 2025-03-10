import { describe, expect, jest, beforeEach, it } from '@jest/globals';
import { verifyTokenController, loginController, registerUserController, registerBandController } from '../../../src/controllers/auth/auth.controller.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { generateAccessToken } from '../../../src/services/jwt.js';
import { errorResponse, successResponse } from '../../../src/utils/responseHelper.js';

jest.mock('../../../src/models/user.model.js', () => ({
    __esModule: true,
    default: {
      findOne: jest.fn(),
      prototype: {
        save: jest.fn(),
      },
    },
  }));

jest.mock('../../../src/models/band.model.js', () => ({
  __esModule: true,
  default: {
    findById: jest.fn(),
    findOne: jest.fn()
  },
}));

jest.mock('jsonwebtoken');
jest.mock('../../../src/utils/responseHelper.js');
jest.mock('bcryptjs')
jest.mock('../../../src/services/jwt.js');

import User from '../../../src/models/user.model.js';
import Band from '../../../src/models/band.model.js';

describe('verifyTokenController', () => {
  let req, res;

  beforeEach(() => {
    req = { headers: { authorization: 'Bearer valid_token' } };
    res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    jest.clearAllMocks();

    // ✅ Asegurar que `findById` existe antes de cada test
    User.findById = jest.fn();
    Band.findById = jest.fn();
  });

  it('debe devolver error si falta el token', async () => {
    req.headers.authorization = undefined;

    await verifyTokenController(req, res);

    expect(errorResponse).toHaveBeenCalledWith(res, 401, 'Authentication token is missing');
  });

  it('debe devolver error si el token es inválido o ha expirado', async () => {
    jwt.verify.mockImplementation((token, secret, callback) => callback(new Error('Token inválido')));

    await verifyTokenController(req, res);

    expect(errorResponse).toHaveBeenCalledWith(res, 403, 'Authentication token is invalid or expired');
  });

  it('debe devolver error si el usuario no existe', async () => {
    jwt.verify.mockImplementation((token, secret, callback) =>
      callback(null, { id: '123', role: 'user' })
    );

    User.findById.mockResolvedValue(null);

    await verifyTokenController(req, res);

    expect(errorResponse).toHaveBeenCalledWith(res, 404, 'User not found');
  });

  it('debe devolver error si la banda no existe', async () => {
    jwt.verify.mockImplementation((token, secret, callback) =>
      callback(null, { id: '123', role: 'band' })
    );

    Band.findById.mockResolvedValue(null);

    await verifyTokenController(req, res);

    expect(errorResponse).toHaveBeenCalledWith(res, 404, 'Band not found');
  });

  it('debe devolver éxito si el usuario existe', async () => {
    jwt.verify.mockImplementation((token, secret, callback) =>
      callback(null, { id: '123', role: 'user' })
    );

    User.findById.mockResolvedValue({ _id: '123', username: 'testuser', email: 'test@example.com' });

    await verifyTokenController(req, res);

    expect(successResponse).toHaveBeenCalledWith(res, 'Verificado', {
      id: '123',
      username: 'testuser',
      email: 'test@example.com',
      role: 'user',
      status: 'N/A',
    });
  });

  it('debe devolver éxito si la banda está aprobada', async () => {
    jwt.verify.mockImplementation((token, secret, callback) =>
      callback(null, { id: '123', role: 'band' })
    );

    Band.findById.mockResolvedValue({
      _id: '123',
      bandName: 'Metallica',
      email: 'band@example.com',
      status: 'approved',
    });

    await verifyTokenController(req, res);

    expect(successResponse).toHaveBeenCalledWith(res, 'Verificado', {
      id: '123',
      username: 'Metallica',
      email: 'band@example.com',
      role: 'band',
      status: 'approved',
    });
  });

  it('debe devolver éxito si el admin existe', async () => {
    jwt.verify.mockImplementation((token, secret, callback) =>
      callback(null, { id: '123', role: 'admin' })
    );

    User.findById.mockResolvedValue({
      _id: '123',
      username: 'adminuser',
      email: 'admin@example.com',
      role: 'admin',
    });

    await verifyTokenController(req, res);

    expect(successResponse).toHaveBeenCalledWith(res, 'Verificado', {
      id: '123',
      username: 'adminuser',
      email: 'admin@example.com',
      role: 'admin',
      status: 'N/A',
    });
  });
});

describe('loginController', () => {
    let req, res;

    beforeEach(()=>{
        req = {body:{}};

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        jest.clearAllMocks();
    });

    it('debe devolver error si falta email o password', async () => {
        // 🔹 Simulamos una petición donde falta `password`
        req.body = { email: 'test@example.com' };
  
        // 🔹 Llamamos al controlador
        await loginController(req, res);
  
        // 🔹 Verificamos que se llamó `errorResponse` con código 400 y mensaje esperado
        expect(errorResponse).toHaveBeenCalledWith(res, 400, 'User or Band not found');
    });

    it('debe devolver error si el email no existe en User ni en Band', async () =>{
        req.body = { email:'notfound@example.com', password: 'password123'};

        User.findOne.mockResolvedValue(null);
        Band.findOne.mockResolvedValue(null);

        await loginController(req, res);

        expect(errorResponse).toHaveBeenCalledWith(res, 400, 'User or Band not found');
    })

    it('debe devolver error si es banda pero no esta aprovada', async ()=>{
        req.body = { email:'bandsinaprovar@gmail.com', email: 'password123'};

        User.findOne.mockResolvedValue(null);
        Band.findOne.mockResolvedValue({
            _id: 'band123',
            email: 'bandsinaprovar@gmail.com',
            status: 'pending', // ❌ NO está aprobada
            password: 'hashedpassword',
          });
          await loginController(req,res);

          expect(errorResponse).toHaveBeenCalledWith(res, 403, 'Your band has not been approved by an admin yet');
    })

    it('debe devolver error si la contraseña es incorrecta', async () => {
        req.body = { email: 'test@example.com', password: 'wrongpassword' };
      
        User.findOne.mockResolvedValue({
          _id: 'user123',
          email: 'test@example.com',
          role: 'user',
          password: 'hashedpassword', 
        });
      
        bcrypt.compare.mockResolvedValue(false);
      
        await loginController(req, res);
      
        expect(errorResponse).toHaveBeenCalledWith(res, 400, 'Incorrect Password');
      });

    it('debe devolver éxito si el usuario y la contraseña son correctos', async () => {

        req.body = { email: 'test@example.com', password: 'correctpassword' };
      
        User.findOne.mockResolvedValue({
          _id: 'user123',
          email: 'test@example.com',
          role: 'user',
          username: 'testuser',
          password: 'hashedpassword', 
        });
      
        bcrypt.compare.mockResolvedValue(true);
      
        generateAccessToken.mockResolvedValue('mocked-jwt-token');
      
        await loginController(req, res);
      
        expect(successResponse).toHaveBeenCalledWith(res, 'Login successful', {
          id: 'user123',
          role: 'user',
          status: 'N/A',
          username: 'testuser',
          email: 'test@example.com',
          token: 'mocked-jwt-token',
        });
      });
      
});

describe('registerUserController', ()=>{
let req,res
beforeEach(()=>{
    req = {body:{}};

    res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
    };
    jest.clearAllMocks();

    errorResponse.mockClear();
    successResponse.mockClear();
});

it('debe devolver error si el username ya está en uso', async () => {
    req.body = { email: 'newemail@example.com', password: 'password123', username: 'existinguser' };
  
    User.findOne.mockResolvedValueOnce(null);
  
    Band.findOne.mockResolvedValueOnce(null);
  
    User.findOne.mockResolvedValueOnce({ _id: 'user123', username: 'existinguser' });
  
    await registerUserController(req, res);
  
    expect(errorResponse).toHaveBeenCalledTimes(1);
    expect(errorResponse).toHaveBeenCalledWith(res, 400, 'The username is already in use');
  });
  
it('debe devolver error si el email ya está en uso', async () => {
    req.body = { email: 'existingemail@example.com', password: 'password123', username: 'newuser' };
  
    User.findOne.mockResolvedValue({
      _id: 'user123',
      email: 'existingemail@example.com',
      username: 'existinguser'
    });
  
    await registerUserController(req, res);

    expect(errorResponse).toHaveBeenCalledTimes(1);
    expect(errorResponse).toHaveBeenCalledWith(res, 400, 'The email is already in use');
  });

})

