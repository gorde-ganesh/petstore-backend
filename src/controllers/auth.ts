import { PrismaClient, User } from '../../generated/prisma/client';
import { Request, Response } from 'express';
import { LoginRequestBody } from '../models/auth.model';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { ApiResponse } from '../models/global.model';

const prisma = new PrismaClient();

// Get private key from environment variables
const privateKey = process.env.PRIVATE_KEY;
const jwtSecret = process.env.JWT_SECRET;

if (!privateKey || !jwtSecret) {
  throw new Error(
    'Missing required environment variables: PRIVATE_KEY or JWT_SECRET'
  );
}

interface LoginResponse {
  token?: string;
  user?: Omit<User, 'password'>;
  message?: string;
}

export const loginUser = async (
  req: Request<{}, {}, LoginRequestBody>,
  res: Response<ApiResponse<LoginResponse>>
) => {
  try {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
      return res.status(400).json({
        statusCode: 400,
        success: false,
        data: null,
        error: null,
        message: 'Username and password are required',
      });
    }

    const user = await prisma.user.findUnique({
      where: {
        email: username,
      },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        data: null,
        error: null,
        statusCode: 401,
        message: 'Invalid credentials',
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        statusCode: 401,
        success: false,
        error: null,
        data: null,
        message: 'Invalid credentials',
      });
    }

    const tokenPayload = {
      userId: user.id,
      username: user.name,
    };

    const token = jwt.sign(tokenPayload, jwtSecret, {
      expiresIn: '24h',
      algorithm: 'HS256',
    });

    const { password: _, ...userWithoutPassword } = user;
    return res.status(200).json({
      statusCode: 401,
      success: true,
      error: null,
      data: {
        ...userWithoutPassword,
        token,
      },
      message: 'Login successful',
    });
  } catch (error: any) {
    return res.status(500).json({
      statusCode: 401,
      success: true,
      error: error,
      data: null,
      message: 'Internal server error',
    });
  }
};
