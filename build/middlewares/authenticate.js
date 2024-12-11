"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateUniqueToken = exports.superAdminAuthentication = exports.userAuthentication = exports.decodeToken = exports.createToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const response_1 = require("../utils/response");
const SECRET_KEY = process.env.JWT_SECRET || "XDAWOODSECRETKEY";
const createToken = (data) => {
    const token = jsonwebtoken_1.default.sign(data, SECRET_KEY);
    return token;
};
exports.createToken = createToken;
const decodeToken = (token) => {
    return jsonwebtoken_1.default.verify(token, SECRET_KEY);
};
exports.decodeToken = decodeToken;
const userAuthentication = (req, res, next) => {
    try {
        if (!req.headers.authorization) {
            (0, response_1.unAuthorizedResponse)(res);
            return;
        }
        const token = req.headers.authorization.split(" ")[1];
        const decoded = (0, exports.decodeToken)(token);
        req.body.user_id = decoded.id;
        next();
    }
    catch (error) {
        console.log("==================== ERROR IN AUTH  =================== : ", error);
        next();
    }
};
exports.userAuthentication = userAuthentication;
const superAdminAuthentication = (req, res, next) => {
    try {
        if (!req.headers.authorization) {
            (0, response_1.unAuthorizedResponse)(res);
            return;
        }
        const token = req.headers.authorization.split(" ")[1];
        const decoded = (0, exports.decodeToken)(token);
        req.body.user_id = decoded.id;
        if (decoded.role !== "ADMIN") {
            (0, response_1.unAuthorizedResponse)(res, "Sorry you are not permitted to perform this action");
            return;
        }
        next();
    }
    catch (error) {
        console.log("==================== ERROR IN ADMIN AUTH  =================== : ", error);
        next();
    }
};
exports.superAdminAuthentication = superAdminAuthentication;
const generateUniqueToken = (req, res) => {
    const token = jsonwebtoken_1.default.sign({ ip: req.ip }, SECRET_KEY);
    res.cookie("token", token, {
        // set the cookie to expire in 1 month
        maxAge: 1000 * 60 * 60 * 24 * 30,
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
        httpOnly: true,
    });
    return token;
};
exports.generateUniqueToken = generateUniqueToken;
