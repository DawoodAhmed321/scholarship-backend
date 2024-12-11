import { Response } from "express";
import { Pagination } from "../interface";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

export const errorResponse = (res: Response, message: string) => {
  return res.status(400).send({
    message: message.replace(/"/g, ""),
    data: null,
    pagination: null,
    code: 0,
  });
};

export const internalServerError = (
  res: Response,
  error?: any,
  errorMessage?: string
) => {
  if (error instanceof PrismaClientKnownRequestError && error.meta) {
    console.log("==================== ERROR =================== : ", error);
    let message: string =
      errorMessage || String(error.meta["cause"]) || error.message;

    return errorResponse(res, message);
  }
  console.log("==================== ERROR =================== : ", error);

  return res.status(500).send({
    message: "Internal server error",
    data: error,
    pagination: null,
    code: 0,
  });
};

export const notFoundResponse = (res: Response, message?: string) => {
  return res.status(404).send({
    message: message || "Not found",
    data: null,
    pagination: null,
    code: 0,
  });
};

export const unAuthorizedResponse = (res: Response, message?: string) => {
  return res.status(401).send({
    message: message || "Unauthorized Please Login",
    data: null,
    pagination: null,
    code: 0,
  });
};

export const successResponse = (
  res: Response,
  message: string,
  data: any,
  pagination?: Pagination
) => {
  return res.status(200).send({
    message,
    data,
    pagination,
    code: 1,
  });
};

export const unauthorizedResponse = (res: Response) => {
  return res.status(401).send({
    message: " Unauthorized Please Login",
    data: null,
    pagination: null,
    code: 0,
  });
};

export const unProcessableEntityResponse = (res: Response, message: string) => {
  return res.status(422).send({
    message,
    data: null,
    pagination: null,
    code: 0,
  });
};
