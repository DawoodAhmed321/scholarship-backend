"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authenticate_1 = require("../../middlewares/authenticate");
const data_collection_1 = require("../../middlewares/data-collection");
const User = __importStar(require("../../controllers/v1/user.controller"));
const Offer = __importStar(require("../../controllers/v1/offer.controller"));
const Scholarship = __importStar(require("../../controllers/v1/scholarship.controller"));
const router = express_1.default.Router();
//======================================== User ==================================
router.get("/profile", authenticate_1.superAdminAuthentication, User.getProfile);
router.get("/logout", User.logout);
router.post("/login", User.login);
//======================================== Offer ==================================
router.get("/offers", data_collection_1.collectQueryData, Offer.getOffers);
router.post("/offers", authenticate_1.superAdminAuthentication, Offer.addOffer);
router.put("/offers", authenticate_1.superAdminAuthentication, Offer.updateOffer);
router.get("/offers/:id", authenticate_1.superAdminAuthentication, data_collection_1.collectQueryData, Offer.getOfferDetail);
router.delete("/offers/:id", authenticate_1.superAdminAuthentication, data_collection_1.collectQueryData, Offer.deleteOffer);
//======================================== Scholarships ==================================
router.get("/scholarships", data_collection_1.collectQueryData, Scholarship.getAllScholarships);
router.post("/scholarships", authenticate_1.superAdminAuthentication, Scholarship.addScholarship);
router.put("/scholarships", authenticate_1.superAdminAuthentication, Scholarship.updateScholarship);
router.get("/scholarships/:id", authenticate_1.superAdminAuthentication, data_collection_1.collectQueryData, Scholarship.updateScholarship);
router.delete("/scholarships/:id", authenticate_1.superAdminAuthentication, data_collection_1.collectQueryData, Scholarship.deleteScholarship);
exports.default = router;
