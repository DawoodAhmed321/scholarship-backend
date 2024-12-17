import { NextFunction, Request, Response } from "express";
import { decodeToken } from "./authenticate";

export const collectData = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { formData, fileData } = req.body;
    delete req.body.formData;
    delete req.body.fileData;
    const data = {
      ...req.body,
      ...req.query,
      ...formData,
      ...fileData,
    };

    req.body = data;

    if (req.headers.authorization) {
      const token = req.headers.authorization.split(" ")[1];
      if (token && !token.includes("null") && !token.includes("undefined")) {
        const decoded = decodeToken(token);
        req.body.user_id = decoded.id;
      }
    }
    if (!req.headers.authorization && req.cookies?.token) {
      const token = req.cookies.token;
      req.body.token = token;
    }

    console.log(
      "==================== ",
      req.url,
      " : DATA : ================= \n",
      req.body
    );
    next();
  } catch (error) {
    console.log(
      "==================== ",
      req.url,
      " : ERROR : while collecting data ================= \n",
      error
    );
    next();
  }
};

export const collectQueryData = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    req.body = {
      ...req.body,
      ...req.params,
    };

    next();
  } catch (error) {
    console.log(
      "====================ERROR: while collecting QUERY DATA ================= \n"
    );
    next();
  }
};
