import { PrismaClient, User } from '../../generated/prisma/client';
import { Request, Response } from 'express';
import { ApiResponse } from '../models/global.model';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

interface LoginRequestBody {
  username: string;
}

export const getUsers = async (
  req: Request<{}, {}, LoginRequestBody>,
  res: Response<ApiResponse<User[]>>
) => {
  try {
    const users = await prisma.user.findMany();
    if (users.length > 0)
      res.status(200).json({
        statusCode: 200,
        success: true,
        data: users,
        error: null,
        message: 'Users found',
      });
    else
      res.status(200).json({
        statusCode: 200,
        success: true,
        data: users,
        error: null,
        message: 'Users not found',
      });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      statusCode: 500,
      success: false,
      data: null,
      error: null,
      message: 'Users not found',
    });
  }
};

export const createUser = async (
  req: Request<{}, {}, User>,
  res: Response<ApiResponse<User>>
) => {
  try {
    const { id, name, email, password, createdAt, updatedAt } = req.body;
    const encryptedPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
      data: {
        id,
        name,
        email,
        password: encryptedPassword,
        createdAt,
        updatedAt,
      },
    });

    res.status(201).json({
      statusCode: 201,
      data: newUser,
      error: null,
      success: true,
      message: 'User created successfully',
    });
  } catch (err: any) {
    res.status(500).json({
      statusCode: 500,
      data: null,
      error: err.message,
      success: false,
      message: 'Failed to create user',
    });
  }
};

export const updateUser = async (
  req: Request<{ id: string }, {}, Partial<User>>,
  res: Response<ApiResponse<User>>
) => {
  try {
    const userId = parseInt(req.params.id, 10);

    if (isNaN(userId)) {
      return res.status(400).json({
        statusCode: 400,
        data: null,
        error: 'Invalid user ID',
        success: false,
        message: 'User ID must be a number',
      });
    }

    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!existingUser) {
      return res.status(404).json({
        statusCode: 404,
        data: null,
        error: 'User not found',
        success: false,
        message: 'No user found with given ID',
      });
    }

    if (req.body.password) {
      return res.status(404).json({
        statusCode: 404,
        data: null,
        error: 'Password cannot be updated',
        success: false,
        message: 'Password cannot be updated',
      });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: req.body,
    });

    return res.status(200).json({
      statusCode: 200,
      data: updatedUser,
      error: null,
      success: true,
      message: 'User updated successfully',
    });
  } catch (err: any) {
    res.status(500).json({
      statusCode: 500,
      data: null,
      error: err.message,
      success: false,
      message: 'Failed to update user',
    });
  }
};

export const deleteUser = async (
  req: Request<{ id: string }, {}, Partial<User>>,
  res: Response<ApiResponse<null>>
) => {
  try {
    const userId = parseInt(req.params.id, 10);

    if (isNaN(userId)) {
      return res.status(400).json({
        statusCode: 400,
        data: null,
        error: 'Invalid user ID',
        success: false,
        message: 'User ID must be a number',
      });
    }
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    const deleteUser = await prisma.user.delete({
      where: { id: userId },
    });

    return res.status(200).json({
      statusCode: 200,
      data: null,
      error: null,
      success: true,
      message: 'User deleted successfully',
    });
  } catch (error: any) {
    res.status(500).json({
      statusCode: 500,
      data: null,
      error: error.message,
      success: false,
      message: 'Failed to delete user',
    });
  }
};
