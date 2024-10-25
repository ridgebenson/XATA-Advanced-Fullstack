import request from 'supertest';
import express from 'express';
import router from './commentsRoutes';

// Mocking the controllers and middleware
jest.mock('../controllers/commentController', () => ({
  addComment: (req, res) => res.status(201).send("Comment added"),
  getCommentsByTask: (req, res) => res.send(`Comments for task ${req.params.taskId}`),
  getCommentsByUser: (req, res) => res.send("User comments"),
  getAllComments: (req, res) => res.send("All comments"),
}));

jest.mock('../middlewares/AuthMiddleware', () => ({
  protect: (req, res, next) => next(),
  adminOnly: (req, res, next) => req.user && req.user.isAdmin ? next() : res.status(403).send("Admins only"),
}));

describe('Comments Routes', () => {
  const app = express();
  app.use(express.json());
  app.use('/comments', router);

  it('POST /comments/add should add a comment', async () => {
    const res = await request(app)
      .post('/comments/add')
      .send({ text: "Test comment", userId: "user1", taskId: "task1" });
    expect(res.statusCode).toEqual(201);
    expect(res.text).toContain("Comment added");
  });

  it('GET /comments/:taskId should return comments for a task', async () => {
    const res = await request(app)
      .get('/comments/task123')
      .send();
    expect(res.statusCode).toEqual(200);
    expect(res.text).toContain("Comments for task task123");
  });

  it('GET /comments should retrieve user comments', async () => {
    const res = await request(app)
      .get('/comments')
      .send();
    expect(res.statusCode).toEqual(200);
    expect(res.text).toContain("User comments");
  });

  it('GET /comments/all should require admin access', async () => {
    const res = await request(app)
      .get('/comments/all')
      .send();
    expect(res.statusCode).toEqual(403);
    expect(res.text).toContain("Admins only");
  });
});
