import { prisma } from "../..";
import { retriveImageUrl, saveImages } from "../../utils";
import {
  successResponse,
  internalServerError,
  errorResponse,
} from "../../utils/response";
import { Request, Response } from "express";
import { paginationSchema } from "../../validations";
import { addScholarshipSchema } from "../../validations/scholarship";

const addScholarship = async (req: Request, res: Response) => {
  try {
    const { error, value } = addScholarshipSchema.validate(req.body);
    if (error) {
      errorResponse(res, error.details[0].message);
      return;
    }
    const images = await saveImages(value.images, "scholarships");
    if (!images) {
      errorResponse(res, "Image upload failed");
      return;
    }

    const scholarship = await prisma.scholarship.create({
      data: {
        title: value.title,
        description: value.description,
        link: value.link,
        deadline: value.deadline,
        is_active: value.is_active,
        image: {
          create: images,
        },
      },
    });
    successResponse(
      res,
      "Scholarship created successfully",
      retriveImageUrl(scholarship, req)
    );
    return;
  } catch (error) {
    internalServerError(res, error);
  }
};

const getAllScholarships = async (req: Request, res: Response) => {
  try {
    const { error, value } = paginationSchema.validate(req.body);

    if (error) {
      errorResponse(res, error.details[0].message);
      return;
    }
    const scholarships = await prisma.scholarship.findMany({
      include: {
        image: true,
      },
      orderBy: {
        created_at: "desc",
      },
    });
    const count = await prisma.scholarship.count();

    successResponse(
      res,
      "Scholarships retrieved successfully",
      scholarships.map((item) => retriveImageUrl(item, req)),
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

export { getAllScholarships };
