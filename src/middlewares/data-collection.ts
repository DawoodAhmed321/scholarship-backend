import { NextFunction, Request, Response } from "express";
import formidable from "formidable";
import { decodeToken } from "./authenticate";
import { isJSONParseable } from "../utils";

export const collectData = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let formData = {};
    let fileData = {};

    if (req.headers["content-type"]?.includes("multipart/form-data")) {
      let [form, files] = await formidable({
        multiples: true,
      }).parse(req);

      console.log("====================files: ================= \n", files);
      // save images to public folder
      if (Object.keys(files).length > 0) {
        fileData = Object.fromEntries(
          Object.entries(files).map(([key, value]) => {
            return [
              key,
              value.map((file) => {
                return file;
              }),
            ];
          })
        );
      }

      formData = Object.fromEntries(
        Object.entries(form).map(([key, value]) => {
          if (isJSONParseable(value[0])) {
            return [key, JSON.parse(value[0]) || value];
          }
          return [key, value[0] || value];
        })
      );
    }

    const data = {
      ...req.body,
      ...req.query,
      ...formData,
      ...fileData,
    };

    req.body = data;

    if (req.headers.authorization) {
      const token = req.headers.authorization.split(" ")[1];
      if (!token.includes("null") && !token.includes("undefined")) {
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
