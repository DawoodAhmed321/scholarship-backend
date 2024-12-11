"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unProcessableEntityResponse = exports.unauthorizedResponse = exports.successResponse = exports.unAuthorizedResponse = exports.notFoundResponse = exports.internalServerError = exports.errorResponse = void 0;
const library_1 = require("@prisma/client/runtime/library");
const errorResponse = (res, message) => {
    return res.status(400).send({
        message: message.replace(/"/g, ""),
        data: null,
        pagination: null,
        code: 0,
    });
};
exports.errorResponse = errorResponse;
const internalServerError = (res, error, errorMessage) => {
    if (error instanceof library_1.PrismaClientKnownRequestError && error.meta) {
        console.log("==================== ERROR =================== : ", error);
        let message = errorMessage || String(error.meta["cause"]) || error.message;
        return (0, exports.errorResponse)(res, message);
    }
    console.log("==================== ERROR =================== : ", error);
    return res.status(500).send({
        message: "Internal server error",
        data: error,
        pagination: null,
        code: 0,
    });
};
exports.internalServerError = internalServerError;
const notFoundResponse = (res, message) => {
    return res.status(404).send({
        message: message || "Not found",
        data: null,
        pagination: null,
        code: 0,
    });
};
exports.notFoundResponse = notFoundResponse;
const unAuthorizedResponse = (res, message) => {
    return res.status(401).send({
        message: message || "Unauthorized Please Login",
        data: null,
        pagination: null,
        code: 0,
    });
};
exports.unAuthorizedResponse = unAuthorizedResponse;
const successResponse = (res, message, data, pagination) => {
    return res.status(200).send({
        message,
        data,
        pagination,
        code: 1,
    });
};
exports.successResponse = successResponse;
const unauthorizedResponse = (res) => {
    return res.status(401).send({
        message: " Unauthorized Please Login",
        data: null,
        pagination: null,
        code: 0,
    });
};
exports.unauthorizedResponse = unauthorizedResponse;
const unProcessableEntityResponse = (res, message) => {
    return res.status(422).send({
        message,
        data: null,
        pagination: null,
        code: 0,
    });
};
exports.unProcessableEntityResponse = unProcessableEntityResponse;
