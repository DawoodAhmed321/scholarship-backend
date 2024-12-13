import { prisma } from "../../index";
import { Request, Response } from "express";
import {
  errorResponse,
  internalServerError,
  notFoundResponse,
  successResponse,
} from "../../utils/response";
import { paginationSchema } from "../../validations";
import { retriveImageUrl, saveImage } from "../../utils";
import { addOfferSchema, updateOfferSchema } from "../../validations/offer";

const addOffer = async (req: Request, res: Response) => {
  try {
    const { error, value } = addOfferSchema.validate(req.body);
    if (error) {
      errorResponse(res, error.details[0].message);
      return;
    }

    const image = await saveImage(value.image[0], "offers");
    if (!image) {
      errorResponse(res, "Image upload failed");
      return;
    }

    const offer = await prisma.offer.create({
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
    successResponse(
      res,
      "Offer created successfully",
      retriveImageUrl(offer, req)
    );
    return;
  } catch (error) {
    internalServerError(res, error);
  }
};
const deleteOffer = async (req: Request, res: Response) => {
  try {
    if (!req.body?.id) {
      errorResponse(res, "id is required");
      return;
    }
    if (isNaN(req.body.id)) {
      errorResponse(res, "id must be a number");
      return;
    }

    const { id } = req.body;

    const offer = await prisma.offer.findUnique({
      where: {
        id,
      },
    });
    if (!offer) {
      notFoundResponse(res, "Offer not found");
      return;
    }

    await prisma.offer.delete({
      where: {
        id,
      },
    });

    successResponse(res, "Offer deleted successfully", null);
    return;
  } catch (error) {
    internalServerError(res, error);
  }
};
const getOffers = async (req: Request, res: Response) => {
  try {
    const { error, value } = paginationSchema.validate(req.body);
    if (error) {
      errorResponse(res, error.details[0].message);
      return;
    }

    const offers = await prisma.offer.findMany({
      skip: (value.page - 1) * value.limit,
      take: value.limit,
      orderBy: {
        created_at: "desc",
      },
      include: {
        image: true,
      },
    });

    const count = await prisma.offer.count();

    successResponse(
      res,
      "Offers retrieved successfully",
      offers.map((item) => retriveImageUrl(item, req)),
      {
        current_page: value.page,
        per_page: value.limit,
        total: count,
        last_page: Math.ceil(count / value.limit),
      }
    );
    return;
  } catch (error) {
    internalServerError(res, error);
  }
};
const getOfferDetail = async (req: Request, res: Response) => {
  try {
    if (!req.body?.id) {
      errorResponse(res, "id is required");
      return;
    }
    if (isNaN(req.body.id)) {
      errorResponse(res, "id must be a number");
      return;
    }

    const { id } = req.body;
    const offer = await prisma.offer.findUnique({
      where: {
        id: +id,
      },
      include: {
        image: true,
      },
    });
    if (!offer) {
      notFoundResponse(res, "Offer not found");
      return;
    }
    successResponse(
      res,
      "Offer details retrieved successfully",
      retriveImageUrl(offer, req)
    );
    return;
  } catch (error) {
    internalServerError(res, error);
  }
};

const updateOffer = async (req: Request, res: Response) => {
  try {
    const { error, value } = updateOfferSchema.validate(req.body);
    if (error) {
      errorResponse(res, error.details[0].message);
      return;
    }
    const image = await saveImage(value.image[0], "offers");
    if (!image) {
      errorResponse(res, "Image upload failed");
      return;
    }

    const data = await prisma.offer.findUnique({
      where: {
        id: value.id,
      },
    });
    if (!data) {
      notFoundResponse(res, "Offer not found");
      return;
    }

    const offer = await prisma.offer.update({
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

    successResponse(
      res,
      "Offer updated successfully",
      retriveImageUrl(offer, req)
    );
    return;
  } catch (error) {
    internalServerError(res, error);
  }
};

export { addOffer, deleteOffer, getOffers, getOfferDetail, updateOffer };
