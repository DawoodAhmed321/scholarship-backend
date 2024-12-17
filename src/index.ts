import express from "express";
import helmet from "helmet";
import cors from "cors";
import { collectData } from "./middlewares/data-collection";
import { PrismaClient } from "@prisma/client";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import router from "./router/v1/router";
import formidable from "formidable";
import { isJSONParseable } from "./utils";

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://students.scholarshipfolder.com",
      "https://scholarshipfolder.com",
    ],
    credentials: true,
  })
);
app.use(bodyParser.json());
app.use(cookieParser());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use((req, res, next) => {
  if (req.headers["content-type"]?.includes("multipart/form-data")) {
    formidable({
      multiples: true,
    }).parse(req, (err, form, files) => {
      if (err) {
        console.log(err);
        return;
      }
      for (const key in form) {
        if (form.hasOwnProperty(key)) {
          try {
            //@ts-ignore
            form[key] = JSON.parse(form[key]);
          } catch (e) {
            //@ts-ignore
            form[key] = form[key][0] || form[key];
          }
        }
      }

      for (const key in files) {
        console.log(key, files[key], form[key]);
        if (form[key]) {
          //@ts-ignore
          files[key] = [...files[key], ...form[key]];
        }
      }

      req.body.formData = form;
      req.body.fileData = files;
      next();
    });
  } else {
    req.body.formData = {};
    req.body.fileData = {};
    next();
  }
});

app.use(collectData);
app.use("/api/v1", router);
// set public folder
app.use(express.static("public"));

export const prisma = new PrismaClient();

const PORT = process.env.PORT || 9000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
