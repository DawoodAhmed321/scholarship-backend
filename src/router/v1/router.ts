import express from "express";
import { superAdminAuthentication } from "../../middlewares/authenticate";
import { collectQueryData } from "../../middlewares/data-collection";

import * as User from "../../controllers/v1/user.controller";
import * as Offer from "../../controllers/v1/offer.controller";

const router = express.Router();

//======================================== User ==================================
router.get("/profile", superAdminAuthentication, User.getProfile);
router.get("/logout", User.logout);
router.post("/login", User.login);

//======================================== Offer ==================================

router.get("/offers", collectQueryData, Offer.getOffers);
router.post("/offers", superAdminAuthentication, Offer.addOffer);
router.put("/offers", superAdminAuthentication, Offer.updateOffer);
router.get(
  "/offers/:id",
  superAdminAuthentication,
  collectQueryData,
  Offer.getOfferDetail
);
router.delete(
  "/offers/:id",
  superAdminAuthentication,
  collectQueryData,
  Offer.deleteOffer
);

//======================================== Scholarships ==================================

router.get("/scholarships", collectQueryData, Offer.getOffers);
router.post("/scholarships", superAdminAuthentication, Offer.addOffer);
router.put("/scholarships", superAdminAuthentication, Offer.updateOffer);
router.get(
  "/scholarships/:id",
  superAdminAuthentication,
  collectQueryData,
  Offer.getOfferDetail
);
router.delete(
  "/scholarships/:id",
  superAdminAuthentication,
  collectQueryData,
  Offer.deleteOffer
);

export default router;
