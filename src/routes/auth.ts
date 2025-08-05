import express from 'express';
import { loginUser } from '../controllers/auth';

function registerRouters(app: express.Application) {
  app.post('/api/login', loginUser);
}
export default registerRouters;
