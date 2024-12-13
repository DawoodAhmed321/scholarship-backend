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
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateOffer = exports.getOfferDetail = exports.getOffers = exports.deleteOffer = exports.addOffer = void 0;
const index_1 = require("../../index");
const response_1 = require("../../utils/response");
const validations_1 = require("../../validations");
const utils_1 = require("../../utils");
const offer_1 = require("../../validations/offer");
const addOffer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { error, value } = offer_1.addOfferSchema.validate(req.body);
        if (error) {
            (0, response_1.errorResponse)(res, error.details[0].message);
            return;
        }
        const image = yield (0, utils_1.saveImage)(value.image[0], "offers");
        if (!image) {
            (0, response_1.errorResponse)(res, "Image upload failed");
            return;
        }
        const offer = yield index_1.prisma.offer.create({
            data: {
                title: value.title,
                description: value.description,
                is_active: value.is_active,
                image: {
                    create: image,
                },
            },
            include: {
                image: true,
            },
        });
        (0, response_1.successResponse)(res, "Offer created successfully", (0, utils_1.retriveImageUrl)(offer, req));
        return;
    }
    catch (error) {
        (0, response_1.internalServerError)(res, error);
    }
});
exports.addOffer = addOffer;
const deleteOffer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        if (!((_a = req.body) === null || _a === void 0 ? void 0 : _a.id)) {
            (0, response_1.errorResponse)(res, "id is required");
            return;
        }
        if (isNaN(req.body.id)) {
            (0, response_1.errorResponse)(res, "id must be a number");
            return;
        }
        const { id } = req.body;
        const offer = yield index_1.prisma.offer.findUnique({
            where: {
                id,
            },
        });
        if (!offer) {
            (0, response_1.notFoundResponse)(res, "Offer not found");
            return;
        }
        yield index_1.prisma.offer.delete({
            where: {
                id,
            },
        });
        (0, response_1.successResponse)(res, "Offer deleted successfully", null);
        return;
    }
    catch (error) {
        (0, response_1.internalServerError)(res, error);
    }
});
exports.deleteOffer = deleteOffer;
const getOffers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { error, value } = validations_1.paginationSchema.validate(req.body);
        if (error) {
            (0, response_1.errorResponse)(res, error.details[0].message);
            return;
        }
        const offers = yield index_1.prisma.offer.findMany({
            skip: (value.page - 1) * value.limit,
            take: value.limit,
            orderBy: {
                created_at: "desc",
            },
            include: {
                image: true,
            },
        });
        const count = yield index_1.prisma.offer.count();
        (0, response_1.successResponse)(res, "Offers retrieved successfully", offers.map((item) => (0, utils_1.retriveImageUrl)(item, req)), {
            current_page: value.page,
            per_page: value.limit,
            total: count,
            last_page: Math.ceil(count / value.limit),
        });
        return;
    }
    catch (error) {
        (0, response_1.internalServerError)(res, error);
    }
});
exports.getOffers = getOffers;
const getOfferDetail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        if (!((_a = req.body) === null || _a === void 0 ? void 0 : _a.id)) {
            (0, response_1.errorResponse)(res, "id is required");
            return;
        }
        if (isNaN(req.body.id)) {
            (0, response_1.errorResponse)(res, "id must be a number");
            return;
        }
        const { id } = req.body;
        const offer = yield index_1.prisma.offer.findUnique({
            where: {
                id: +id,
            },
            include: {
                image: true,
            },
        });
        if (!offer) {
            (0, response_1.notFoundResponse)(res, "Offer not found");
            return;
        }
        (0, response_1.successResponse)(res, "Offer details retrieved successfully", (0, utils_1.retriveImageUrl)(offer, req));
        return;
    }
    catch (error) {
        (0, response_1.internalServerError)(res, error);
    }
});
exports.getOfferDetail = getOfferDetail;
const updateOffer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { error, value } = offer_1.updateOfferSchema.validate(req.body);
        if (error) {
            (0, response_1.errorResponse)(res, error.details[0].message);
            return;
        }
        const image = yield (0, utils_1.saveImage)(value.image[0], "offers");
        if (!image) {
            (0, response_1.errorResponse)(res, "Image upload failed");
            return;
        }
        const data = yield index_1.prisma.offer.findUnique({
            where: {
                id: value.id,
            },
        });
        if (!data) {
            (0, response_1.notFoundResponse)(res, "Offer not found");
            return;
        }
        const offer = yield index_1.prisma.offer.update({
            where: {
                id: value.id,
            },
            data: {
                title: value.title,
                description: value.description,
                is_active: value.is_active,
                image: {
                    update: image,
                },
            },
            include: {
                image: true,
            },
        });
        (0, response_1.successResponse)(res, "Offer updated successfully", (0, utils_1.retriveImageUrl)(offer, req));
        return;
    }
    catch (error) {
        (0, response_1.internalServerError)(res, error);
    }
});
exports.updateOffer = updateOffer;
