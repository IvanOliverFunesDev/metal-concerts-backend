import { successResponse, errorResponse } from '../../../src/utils/responseHelper';
import { jest, describe, beforeEach, test, expect } from '@jest/globals';

describe('responseHelper', () => {
  let res;

  beforeEach(() => {
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
  });

  test('successResponse should return a 200 status with success message and data', () => {
    const message = 'Operation successful';
    const data = { key: 'value' };

    successResponse(res, message, data);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message,
      data
    });
  });

  test('errorResponse should return the given status code with error message and errors', () => {
    const statusCode = 400;
    const message = 'Operation failed';
    const errors = ['error1', 'error2'];

    errorResponse(res, statusCode, message, errors);

    expect(res.status).toHaveBeenCalledWith(statusCode);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message,
      errors
    });
  });
});
