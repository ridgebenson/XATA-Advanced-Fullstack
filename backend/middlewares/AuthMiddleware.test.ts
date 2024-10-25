import { protect } from './AuthMiddleware';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import httpMocks from 'node-mocks-http';

jest.mock('jsonwebtoken');
jest.mock('../src/xata', () => ({
  getXataClient: jest.fn().mockReturnValue({
    db: {
      Users: {
        filter: jest.fn().mockReturnThis(),
        getFirst: jest.fn().mockResolvedValue({ id: 'user1', role: 'admin' }),
      }
    }
  })
}));

describe('AuthMiddleware', () => {
  const nextFunction = jest.fn();
  const mockedJwt = jwt as jest.Mocked<typeof jwt>;

  beforeEach(() => {
    nextFunction.mockClear();
  });

  it('should return 401 if no token is provided', async () => {
    const req = httpMocks.createRequest();
    const res = httpMocks.createResponse();
    await protect(req, res, nextFunction);
    expect(res.statusCode).toBe(401);
    expect(res._getData()).toEqual({ message: 'No token provided, authorization denied' });
  });

  it('should proceed if token is valid and user is admin', async () => {
    const req = httpMocks.createRequest({
      headers: {
        authorization: 'Bearer validtoken'
      }
    });
    const res = httpMocks.createResponse();

    mockedJwt.verify.mockImplementation(() => ({ id: 'user1', role: 'admin' }));

    await protect(req, res, nextFunction);
    expect(nextFunction).toBeCalled();
  });

  it('should return 401 if token is not valid', async () => {
    const req = httpMocks.createRequest({
      headers: {
        authorization: 'Bearer invalidtoken'
      }
    });
    const res = httpMocks.createResponse();

    mockedJwt.verify.mockImplementation(() => {
      throw new Error('Token is not valid');
    });

    await protect(req, res, nextFunction);
    expect(res.statusCode).toBe(401);
    expect(res._getData()).toEqual({ message: 'Token is not valid' });
  });
});
