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
exports.collectQueryData = exports.collectData = void 0;
const formidable_1 = __importDefault(require("formidable"));
const authenticate_1 = require("./authenticate");
const utils_1 = require("../utils");
const collectData = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        let formData = {};
        let fileData = {};
        if ((_a = req.headers["content-type"]) === null || _a === void 0 ? void 0 : _a.includes("multipart/form-data")) {
            let [form, files] = yield (0, formidable_1.default)({
                multiples: true,
            }).parse(req);
            console.log("====================files: ================= \n", files);
            // save images to public folder
            if (Object.keys(files).length > 0) {
                fileData = Object.fromEntries(Object.entries(files).map(([key, value]) => {
                    return [
                        key,
                        value.map((file) => {
                            return file;
                        }),
                    ];
                }));
            }
            formData = Object.fromEntries(Object.entries(form).map(([key, value]) => {
                if ((0, utils_1.isJSONParseable)(value[0])) {
                    return [key, JSON.parse(value[0]) || value];
                }
                return [key, value[0] || value];
            }));
        }
        const data = Object.assign(Object.assign(Object.assign(Object.assign({}, req.body), req.query), formData), fileData);
        req.body = data;
        if (req.headers.authorization) {
            const token = req.headers.authorization.split(" ")[1];
            if (!token.includes("null") && !token.includes("undefined")) {
                const decoded = (0, authenticate_1.decodeToken)(token);
                req.body.user_id = decoded.id;
            }
        }
        if (!req.headers.authorization && ((_b = req.cookies) === null || _b === void 0 ? void 0 : _b.token)) {
            const token = req.cookies.token;
            req.body.token = token;
        }
        console.log("==================== ", req.url, " : DATA : ================= \n", req.body);
        next();
    }
    catch (error) {
        console.log("==================== ", req.url, " : ERROR : while collecting data ================= \n", error);
        next();
    }
});
exports.collectData = collectData;
const collectQueryData = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        req.body = Object.assign(Object.assign({}, req.body), req.params);
        next();
    }
    catch (error) {
        console.log("====================ERROR: while collecting QUERY DATA ================= \n");
        next();
    }
});
exports.collectQueryData = collectQueryData;
