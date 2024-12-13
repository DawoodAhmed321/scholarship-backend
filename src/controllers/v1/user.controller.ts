import { Request, Response } from "express";
import { LoginSchema } from "../../validations/user";
import bcrypt from "bcrypt";
import { createToken } from "../../middlewares/authenticate";
import {
  errorResponse,
  internalServerError,
  successResponse,
  unProcessableEntityResponse,
} from "../../utils/response";
import { prisma } from "../..";

const getProfile = async (req: Request, res: Response) => {
  try {
    const id = req.body.user_id;
    if (!id) {
      errorResponse(res, "User id is required");
      return;
    }
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    });
    if (!user) {
      errorResponse(res, "User not found");
      return;
    }
    delete user.password;
    successResponse(res, "User profile retrieved successfully", user);
  } catch (error) {
    internalServerError(res, error);
  }
};

const login = async (req: Request, res: Response) => {
  try {
    const { error, value } = LoginSchema.validate(req.body);

    if (error) {
      errorResponse(res, error.details[0].message);
    } else {
      const user = await prisma.user.findUnique({
        where: {
          email: value.email,
          role: "ADMIN",
        },
      });

      if (!user || !(await bcrypt.compare(value.password, user.password))) {
        unProcessableEntityResponse(res, "Invalid credentials");
        return;
      }

      delete user.password;

      const token = createToken(user);
      res.cookie("user_token", token, {
        // set the cookie to expire in 1 month
        maxAge: 1000 * 60 * 60 * 24 * 30,
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
        httpOnly: true,
        sameSite: "lax",
        secure: false,
        priority: "high",
        path: "/",
      });
      successResponse(res, "User logged in successfully", {
        ...user,
        token,
      });
    }
  } catch (error) {
    internalServerError(res, error);
  }
};

const logout = async (req: Request, res: Response) => {
  res.status(200).send({
    message: "User logged out successfully",
    data: null,
    pagination: null,
    code: 1,
  });
};

export { getProfile, login, logout };
