"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginSchema = exports.RegistrationSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const _1 = require(".");
exports.RegistrationSchema = _1.optionalAuth.keys({
    first_name: joi_1.default.string().required().min(3).max(30),
    last_name: joi_1.default.string().required().min(3).max(30),
    email: joi_1.default.string().email().required(),
    password: joi_1.default.string()
        .required()
        .min(6)
        .max(30)
        .regex(/^[a-zA-Z0-9]{3,30}$/, "password must be alphanumeric"),
    confirm_password: joi_1.default.string().required().valid(joi_1.default.ref("password")),
});
exports.LoginSchema = _1.optionalAuth.keys({
    email: joi_1.default.string().email().required(),
    password: joi_1.default.string().required(),
});
