"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.optionalAuth = exports.authSchema = exports.paginationSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.paginationSchema = joi_1.default.object({
    page: joi_1.default.number().default(1),
    limit: joi_1.default.number().default(10).max(20).min(1),
    user_id: joi_1.default.number().optional(),
    token: joi_1.default.string().optional().min(0),
});
exports.authSchema = joi_1.default.object({
    user_id: joi_1.default.number().optional(),
    token: joi_1.default.string().optional().min(0),
})
    .xor("user_id", "token")
    .messages({
    "object.missing": "You must provide authentication or token to continue",
    "object.xor": "You must provide either authentication or token",
});
exports.optionalAuth = joi_1.default.object({
    token: joi_1.default.string().optional().min(0),
    user_id: joi_1.default.number().optional(),
});
