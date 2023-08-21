import { Request, Response } from 'express';
import { UserService } from './users.service';

const createUser = async (req: Request, res: Response) => {
  try {
    const user = req.body;

    const result = await UserService.createUser(user);
    res.status(200).json({
      success: true,
      messgae: 'user created dsuccesfully',
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      messgae: 'Failed to create User',
    });
  }
};

export const UserController = {
  createUser,
};
