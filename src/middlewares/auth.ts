import jwt from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';
const privateKey = process.env.PRIVATE_KEY;
const jwtSecret = process.env.JWT_SECRET;
import { PrismaClient } from '../../generated/prisma/client';

const prisma = new PrismaClient();

if (!privateKey || !jwtSecret) {
  throw new Error(
    'Missing required environment variables: PRIVATE_KEY or JWT_SECRET'
  );
}

export const verifyToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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
    const payload = jwt.verify(token, jwtSecret!) as { id: string };
    const user = await prisma.user.findUnique({
      where: { id: req.body.id },
    });

    if (!user) {
      return res.status(401).json({
        statusCode: 401,
        success: false,
        message: 'Unauthorized: User not found',
        data: null,
        error: null,
      });
    }
    (req as any).user = user;
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

export const verifyPermission = (allowedRoles: any[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    console.log(req);
    const user = (req as any).user;

    if (!user || !allowedRoles.includes(user.role)) {
      return res.status(403).json({
        statusCode: 403,
        success: false,
        data: null,
        error: null,
        message:
          'Forbidden: You do not have permission to access this resource',
      });
    }

    next();
  };
};
