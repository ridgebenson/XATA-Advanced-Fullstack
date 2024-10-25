import { NextFunction, Request, Response } from 'express';
import httpMocks from 'node-mocks-http';
import { body, validationResult, ValidationChain } from 'express-validator';
import { registerValidator, updateUserValidator } from './validator';

describe('Validator Middleware', () => {
  const getMockReqRes = () => {
    const req = httpMocks.createRequest();
    const res = httpMocks.createResponse();
    const next = jest.fn() as NextFunction;
    return { req, res, next };
  };

  const runValidator = async (validator: (req: Request, res: Response, next: NextFunction) => Promise<void>, req: Request, res: Response, next: NextFunction) => {
    await validator(req, res, next);
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      next();
    } else {
      res.status(400).json({ errors: errors.array() });
    }
  };

  describe('registerValidator', () => {
    it('should validate registration fields correctly', async () => {
      const { req, res, next } = getMockReqRes();
      req.body = {
        email: 'test@example.com',
        password: '123456',
        name: 'John Doe',
        age: 20,
        city: 'New York'
      };
      
      await runValidator(registerValidator, req, res, next);
      
      expect(next).toHaveBeenCalled();
      expect(res.statusCode).not.toBe(400);
    });

    it('should return errors for invalid registration fields', async () => {
      const { req, res, next } = getMockReqRes();
      req.body = {
        email: 'not-an-email',
        password: '123',
        name: '',
        age: 16,
        city: ''
      };
      
      await runValidator(registerValidator, req, res, next);
      
      expect(next).not.toHaveBeenCalled();
      expect(res.statusCode).toBe(400);
      expect(res._getData()).toHaveProperty('errors');
      expect(res._getData().errors.length).toBeGreaterThan(0);
    });
  });

  describe('updateUserValidator', () => {
    it('should validate optional update fields correctly when provided', async () => {
      const { req, res, next } = getMockReqRes();
      req.body = {
        email: 'update@example.com',
        name: 'Jane Doe',
        age: 19,
        city: 'Boston'
      };
      
      await runValidator(updateUserValidator, req, res, next);
      
      expect(next).toHaveBeenCalled();
      expect(res.statusCode).not.toBe(400);
    });

    it('should not throw errors when optional fields are not provided', async () => {
      const { req, res, next } = getMockReqRes();
      req.body = {};
      
      await runValidator(updateUserValidator, req, res, next);
      
      expect(next).toHaveBeenCalled();
      expect(res.statusCode).not.toBe(400);
    });
  });
});
