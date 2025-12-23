/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";

import { UserService } from "./user.service";
import { catchAsync } from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";

// import AppError from "../../errorHelpers/AppError";

// const createUser =  async (req: Request, res: Response, next: NextFunction) => {

//     // throw new AppError(httpStatus.BAD_REQUEST, "fake error for testing ");
//     const user = await UserService.createUser(req.body);
//     res.status(httpStatus.CREATED).json({
//       message: "User created successfully",
//       data: user,
//     });
// };

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const createUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await UserService.createUser(req.body);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "User created successfully",
      data: user,
    });
  }
);

const getAllUsers = catchAsync(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async (req: Request, res: Response, next: NextFunction) => {
    const users = await UserService.getAllUsers();
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "All Users retrieved successfully",
      data: users,
    });
  }
);

export const UserController = {
  createUser,
  getAllUsers,
};
