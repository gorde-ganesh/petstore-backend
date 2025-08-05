import express from 'express';
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
} from '../controllers/users';
import { verifyToken } from '../middlewares/auth';

function registerRouters(app: express.Application) {
  app.get('/api/users', verifyToken, getUsers);
  app.post('/api/user', verifyToken, createUser);
  app.put('/api/user/:id', verifyToken, updateUser);
  app.delete('/api/user/:id', verifyToken, deleteUser);
}
export default registerRouters;
