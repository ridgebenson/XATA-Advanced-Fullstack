import { notFoundHandler, errorHandler } from './errorHandlers';
import { Request, Response } from 'express';
import httpMocks from 'node-mocks-http';

describe('Error Handlers', () => {
  describe('notFoundHandler', () => {
    it('should return 404 status and a message', () => {
      const req = httpMocks.createRequest();
      const res = httpMocks.createResponse();
      const nextFunction = jest.fn();

      notFoundHandler(req, res, nextFunction);

      expect(res.statusCode).toBe(404);
      expect(res._getData()).toEqual({ message: 'Resource not found' });
      expect(nextFunction).not.toBeCalled(); // Ensure next is not called
    });
  });

  describe('errorHandler', () => {
    it('should handle errors and return 500 status with a message', () => {
      const error = new Error('Fake error');
      const req = httpMocks.createRequest();
      const res = httpMocks.createResponse();
      const nextFunction = jest.fn();

      errorHandler(error, req, res, nextFunction);

      expect(res.statusCode).toBe(500);
      expect(res._getData()).toEqual({ message: 'Internal server error' });
      expect(console.error).toBeCalledWith(error.stack);
      expect(nextFunction).not.toBeCalled(); // Ensure next is not called
    });
  });
});
