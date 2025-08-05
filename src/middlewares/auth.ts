import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
const privateKey = process.env.PRIVATE_KEY;
const jwtSecret = process.env.JWT_SECRET;

if (!privateKey || !jwtSecret) {
  throw new Error(
    'Missing required environment variables: PRIVATE_KEY or JWT_SECRET'
  );
}

export const verifyToken = (req: Request, res: Response, next: any) => {
  console.log(req, 'verify');
  const authHeader = req.headers['authorization'];
  const token =
    authHeader && typeof authHeader === 'string'
      ? authHeader.split(' ')[1]
      : undefined; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({
      success: false,
      data: null,
      error: 'Unauthorized',
      message: 'Access token required',
    });
  }

  try {
    const decoded = jwt.verify(token, jwtSecret!) as any;
    (req as any).user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({
      success: false,
      data: null,
      error: 'Unauthorized',
      message: 'Invalid or expired token',
    });
  }
};
