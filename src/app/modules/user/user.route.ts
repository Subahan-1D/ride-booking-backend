import { NextFunction, Request, Response, Router } from "express";
import { UserController } from "./user.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { createUserZodSchema } from "./user.validation";
import { JwtPayload } from "jsonwebtoken";
import AppError from "../../errorHelpers/AppError";
import { Role } from "./user.interface";
import { verifyToken } from "../../utils/jwt";
import { envVars } from "../../config/env";
const router = Router();

const checkAuth =
  (...authRoles: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const accessToken = req.headers.authorization;
      if (!accessToken) {
        throw new AppError(403, "You are not authorized");
      }
      const verifiedToken = verifyToken(accessToken, envVars.JWT_ACCESS_SECRET);

      // if (!verifiedToken) {
      //   console.log(verifiedToken);
      //   throw new AppError(403, `You are not authorized ${verifiedToken}`);
      // }

      if ((verifiedToken as JwtPayload).role !== Role.ADMIN) {
        throw new AppError(403, "You are not permitted to view this route");
      }

      console.log(verifiedToken);
      next();
    } catch (error) {
      next(error);
    }
  };

router.post(
  "/register",
  validateRequest(createUserZodSchema),
  UserController.createUser
);
router.get("/all-users", UserController.getAllUsers);

export const UserRoutes = router;
