import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { notFoundResponse, unAuthorizedResponse } from "../utils/response";

const SECRET_KEY = process.env.JWT_SECRET || "XDAWOODSECRETKEY";

export const createToken = (data: any) => {
  const token = jwt.sign(data, SECRET_KEY);
  return token;
};

export const decodeToken = (token: string) => {
  return jwt.verify(token, SECRET_KEY) as any;
};

export const userAuthentication = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.headers.authorization) {
      unAuthorizedResponse(res);
      return;
    }

    const token = req.headers.authorization.split(" ")[1];
    const decoded = decodeToken(token);
    req.body.user_id = decoded.id;
    next();
  } catch (error) {
    console.log(
      "==================== ERROR IN AUTH  =================== : ",
      error
    );
    next();
  }
};

export const superAdminAuthentication = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.headers.authorization) {
      unAuthorizedResponse(res);
      return;
    }

    const token = req.headers.authorization.split(" ")[1];
    const decoded = decodeToken(token);
    req.body.user_id = decoded.id;
    if (decoded.role !== "ADMIN") {
      unAuthorizedResponse(
        res,
        "Sorry you are not permitted to perform this action"
      );
      return;
    }
    next();
  } catch (error) {
    console.log(
      "==================== ERROR IN ADMIN AUTH  =================== : ",
      error
    );
    next();
  }
};

export const generateUniqueToken = (req: Request, res: Response) => {
  const token = jwt.sign({ ip: req.ip }, SECRET_KEY);
  res.cookie("token", token, {
    // set the cookie to expire in 1 month
    maxAge: 1000 * 60 * 60 * 24 * 30,
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
    httpOnly: true,
  });
  return token;
};
