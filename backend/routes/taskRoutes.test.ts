import request from 'supertest';
import express from 'express';
import bodyParser from 'body-parser';
import taskRoutes from './taskRoutes'; // Adjust the import path as needed.

// Mocking the auth middleware to always authorize the user
jest.mock('../middlewares/AuthMiddleware', () => ({
  protect: jest.fn((req, res, next) => next()),
  adminOnly: jest.fn((req, res, next) => next())
}));

const app = express();
app.use(bodyParser.json());
app.use('/tasks', taskRoutes);

describe('Task Routes', () => {
  describe('Task management operations', () => {
    const sampleTask = {
      title: "Complete integration testing",
      description: "Ensure all tests cover core functionalities",
      status: "pending",
      assignedTo: "user123"
    };

    it('should create a task', () => {
      return request(app)
        .post('/tasks/create')
        .send(sampleTask)
        .then(response => {
          expect(response.statusCode).toBe(200);
          expect(response.body).toHaveProperty('id');
        });
    });

    it('should retrieve all tasks', () => {
      return request(app)
        .get('/tasks/')
        .then(response => {
          expect(response.statusCode).toBe(200);
          expect(response.body).toBeInstanceOf(Array);
        });
    });

    it('should retrieve a task by ID', () => {
      return request(app)
        .get('/tasks/1') // Assuming '1' is a valid task ID
        .then(response => {
          expect(response.statusCode).toBe(200);
          expect(response.body).toHaveProperty('id', '1');
        });
    });

    it('should update a task', () => {
      const updates = { title: "Complete unit testing" };
      return request(app)
        .put('/tasks/update/1')
        .send(updates)
        .then(response => {
          expect(response.statusCode).toBe(200);
          expect(response.body).toHaveProperty('message', 'Task updated successfully');
        });
    });

    it('should delete a task', () => {
      return request(app)
        .delete('/tasks/delete/1')
        .then(response => {
          expect(response.statusCode).toBe(200);
          expect(response.body).toHaveProperty('message', 'Task deleted successfully');
        });
    });

    it('should assign a task to a user', () => {
      return request(app)
        .put('/tasks/assign/1')
        .send({ userId: "user456" })
        .then(response => {
          expect(response.statusCode).toBe(200);
          expect(response.body).toHaveProperty('message', 'Task assigned successfully');
        });
    });

    it('should update task status', () => {
      return request(app)
        .put('/tasks/status/1')
        .send({ status: "completed" })
        .then(response => {
          expect(response.statusCode).toBe(200);
          expect(response.body).toHaveProperty('message', 'Task status updated successfully');
        });
    });

    // Add additional tests for each filtering route
    it('should filter tasks by status', () => {
      return request(app)
        .get('/tasks/filter/status/ongoing')
        .then(response => {
          expect(response.statusCode).toBe(200);
          expect(response.body).toBeInstanceOf(Array);
        });
    });

    it('should filter tasks by member', () => {
      return request(app)
        .get('/tasks/filter/member/user123')
        .then(response => {
          expect(response.statusCode).toBe(200);
          expect(response.body).toBeInstanceOf(Array);
        });
    });

    it('should filter tasks by member and status', () => {
      return request(app)
        .get('/tasks/filter/member/user123/status/ongoing')
        .then(response => {
          expect(response.statusCode).toBe(200);
          expect(response.body).toBeInstanceOf(Array);
        });
    });

    it('should filter tasks by project', () => {
      return request(app)
        .get('/tasks/filter/project/ProjectX')
        .then(response => {
          expect(response.statusCode).toBe(200);
          expect(response.body).toBeInstanceOf(Array);
        });
    });

    it('should filter tasks by project and status', () => {
      return request(app)
        .get('/tasks/filter/project/ProjectX/status/ongoing')
        .then(response => {
          expect(response.statusCode).toBe(200);
          expect(response.body).toBeInstanceOf(Array);
        });
    });
  });
});
