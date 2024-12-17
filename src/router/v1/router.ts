import express from "express";
import { superAdminAuthentication } from "../../middlewares/authenticate";
import { collectQueryData } from "../../middlewares/data-collection";

import * as Home from "../../controllers/v1/home.controller";
import * as User from "../../controllers/v1/user.controller";
import * as Offer from "../../controllers/v1/offer.controller";
import * as Contact from "../../controllers/v1/contact.controller";
import * as Scholarship from "../../controllers/v1/scholarship.controller";

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
  collectQueryData,
  superAdminAuthentication,
  Offer.deleteOffer
);

//======================================== Scholarships ==================================

router.get("/scholarships", collectQueryData, Scholarship.getAllScholarships);
router.post(
  "/scholarships",
  superAdminAuthentication,
  Scholarship.addScholarship
);
router.put(
  "/scholarships",
  superAdminAuthentication,
  Scholarship.updateScholarship
);
router.get(
  "/scholarships/:id",
  collectQueryData,
  superAdminAuthentication,
  Scholarship.updateScholarship
);
router.delete(
  "/scholarships/:id",
  collectQueryData,
  superAdminAuthentication,
  Scholarship.deleteScholarship
);

//======================================== Home Page ==================================

router.get("/home", Home.getHome);
router.get("/testimonials", Home.getTestimonials);
router.post("/home", superAdminAuthentication, Home.addHomePage);
router.get("/testimonials/:id", collectQueryData, Home.getTestimonialDetails);
router.post("/testimonials", superAdminAuthentication, Home.addTestimonial);
router.put("/testimonials", superAdminAuthentication, Home.editTestimonial);
router.delete(
  "/testimonials/:id",
  collectQueryData,
  superAdminAuthentication,
  Home.deleteTestimonial
);

//======================================== Contact ==================================
router.post("/contacts", Contact.addContact);
router.post("/join-teams", Contact.joinTeam);
router.get(
  "/contacts",
  collectQueryData,
  superAdminAuthentication,
  Contact.getAllContact
);
router.get(
  "/join-teams",
  collectQueryData,
  superAdminAuthentication,
  Contact.getAllJoinTeam
);

//======================================== Dashboard ==================================

router.get("/dashboard", superAdminAuthentication, Contact.getDashboard);

export default router;
