import express from "express";
import { superAdminAuthentication } from "../../middlewares/authenticate";
import { collectQueryData } from "../../middlewares/data-collection";

import * as User from "../../controllers/v1/user.controller";

const router = express.Router();

//======================================== User ==================================
router.get("/profile", superAdminAuthentication, User.getProfile);
router.get("/logout", User.logout);
router.post("/login", User.login);

export default router;
