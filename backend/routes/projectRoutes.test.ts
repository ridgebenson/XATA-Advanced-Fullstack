// projectRoutes.test.ts

import request from 'supertest';
import express from 'express';
import projectRoutes from './projectRoutes';
import bodyParser from 'body-parser';

// Create an instance of the express app to be used in tests
const app = express();
app.use(bodyParser.json()); // Necessary to parse JSON request bodies
app.use('/projects', projectRoutes); // Mount the router under test at /projects endpoint

describe('Project Routes', () => {
  // Mock data
  const mockProject = {
    title: 'New Project',
    description: 'Project description',
    budget: 5000
  };

  describe('POST /projects/add', () => {
    it('should create a new project', async () => {
      const response = await request(app)
        .post('/projects/add')
        .send(mockProject);
      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual(expect.objectContaining({
        message: 'Project created successfully'
      }));
    });
  });

  describe('GET /projects/getAll', () => {
    it('should return all projects', async () => {
      const response = await request(app)
        .get('/projects/getAll');
      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual(expect.arrayContaining([]));
    });
  });

  describe('GET /projects/:id', () => {
    it('should return a project by id', async () => {
      const response = await request(app)
        .get('/projects/1'); // Assuming '1' is a valid project ID
      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('id');
    });
  });

  describe('PUT /projects/update/:id', () => {
    it('should update a project by id', async () => {
      const response = await request(app)
        .put('/projects/update/1')
        .send({ title: 'Updated Title' });
      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual(expect.objectContaining({
        message: 'Project updated successfully'
      }));
    });
  });

  describe('DELETE /projects/delete/:id', () => {
    it('should delete a project by id', async () => {
      const response = await request(app)
        .delete('/projects/delete/1');
      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual(expect.objectContaining({
        message: 'Project deleted successfully'
      }));
    });
  });
});
