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
exports.saveImage = exports.saveImages = exports.retriveImageUrl = exports.retriveImagesUrl = exports.isJSONParseable = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const isJSONParseable = (str) => {
    try {
        if (str.includes("{") ||
            (str.includes("[") && str.length > 0 && JSON.parse(str))) {
            return true;
        }
        return false;
    }
    catch (error) {
        return false;
    }
};
exports.isJSONParseable = isJSONParseable;
const retriveImagesUrl = (item, req) => {
    return item.images.map((image) => {
        return Object.assign(Object.assign({}, image), { image_url: `${req.protocol}://${req.get("host")}${image.url}` });
    });
};
exports.retriveImagesUrl = retriveImagesUrl;
const retriveImageUrl = (item, req) => {
    return Object.assign(Object.assign({}, item), { image: Object.assign(Object.assign({}, item.image), { url: `${req.protocol}://${req.get("host")}${item.image.url}` }) });
};
exports.retriveImageUrl = retriveImageUrl;
const saveImages = (files, type) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let filePaths = [];
        for (const file of files) {
            const fileName = `${type}-${Date.now()}-${file.originalFilename}`;
            const filePath = path_1.default.join(__dirname, "../../public/images", fileName);
            fs_1.default.renameSync(file.filepath, filePath);
            filePaths.push({
                url: `/images/${fileName}`,
            });
        }
        return filePaths;
    }
    catch (error) {
        console.log("==================== ERROR IN SAVING IMAGES =================== : ", error);
        return false;
    }
});
exports.saveImages = saveImages;
const saveImage = (file, type) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const fileName = `${type}-${Date.now()}-${file.originalFilename}`;
        const filePath = path_1.default.join(__dirname, "../../public/images/" + type, fileName);
        fs_1.default.renameSync(file.filepath, filePath);
        return {
            url: `/images/${fileName}`,
        };
    }
    catch (error) {
        console.log("==================== ERROR IN SAVING IMAGE =================== : ", error);
        return false;
    }
});
exports.saveImage = saveImage;
