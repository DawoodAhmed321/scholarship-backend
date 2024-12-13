import express from "express";
import helmet from "helmet";
import cors from "cors";
import { collectData } from "./middlewares/data-collection";
import { PrismaClient } from "@prisma/client";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import router from "./router/v1/router";

const app = express();

app.use(helmet());
app.use(
  cors({
    credentials: true,
    origin: "*",
  })
);
app.use(bodyParser.json());
app.use(cookieParser());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(collectData);
app.use("/api/v1", router);
// set public folder
app.use(express.static("public"));

export const prisma = new PrismaClient();

const PORT = process.env.PORT || 80;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
