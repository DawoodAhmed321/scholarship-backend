"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.login = exports.getProfile = void 0;
const user_1 = require("../../validations/user");
const bcrypt_1 = __importDefault(require("bcrypt"));
const authenticate_1 = require("../../middlewares/authenticate");
const response_1 = require("../../utils/response");
const __1 = require("../..");
const getProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.body.user_id;
        if (!id) {
            (0, response_1.errorResponse)(res, "User id is required");
            return;
        }
        const user = yield __1.prisma.user.findUnique({
            where: {
                id,
            },
        });
        if (!user) {
            (0, response_1.errorResponse)(res, "User not found");
            return;
        }
        delete user.password;
        (0, response_1.successResponse)(res, "User profile retrieved successfully", user);
    }
    catch (error) {
        (0, response_1.internalServerError)(res, error);
    }
});
exports.getProfile = getProfile;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { error, value } = user_1.LoginSchema.validate(req.body);
        if (error) {
            (0, response_1.errorResponse)(res, error.details[0].message);
        }
        else {
            const user = yield __1.prisma.user.findUnique({
                where: {
                    email: value.email,
                    role: "ADMIN",
                },
            });
            if (!user || !(yield bcrypt_1.default.compare(value.password, user.password))) {
                (0, response_1.unProcessableEntityResponse)(res, "Invalid credentials");
                return;
            }
            delete user.password;
            const token = (0, authenticate_1.createToken)(user);
            res.cookie("user_token", token, {
                // set the cookie to expire in 1 month
                maxAge: 1000 * 60 * 60 * 24 * 30,
                expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
                httpOnly: true,
                sameSite: "lax",
                secure: false,
                priority: "high",
                path: "/",
            });
            (0, response_1.successResponse)(res, "User logged in successfully", Object.assign(Object.assign({}, user), { token }));
        }
    }
    catch (error) {
        (0, response_1.internalServerError)(res, error);
    }
});
exports.login = login;
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.status(200).send({
        message: "User logged out successfully",
        data: null,
        pagination: null,
        code: 1,
    });
});
exports.logout = logout;
