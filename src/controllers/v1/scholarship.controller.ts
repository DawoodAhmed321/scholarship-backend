import { prisma } from "../..";
import { retriveImagesUrl, saveImages } from "../../utils";
import {
  successResponse,
  internalServerError,
  errorResponse,
  notFoundResponse,
} from "../../utils/response";
import { Request, Response } from "express";
import { paginationSchema } from "../../validations";
import {
  addScholarshipSchema,
  editScholarshipSchema,
} from "../../validations/scholarship";

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
        images: {
          create: images,
        },
      },
      include: {
        images: {
          select: {
            id: true,
            url: true,
          },
        },
      },
    });
    successResponse(res, "Scholarship created successfully", {
      ...scholarship,
      images: retriveImagesUrl(scholarship, req),
    });
    return;
  } catch (error) {
    internalServerError(res, error);
  }
};

const deleteScholarship = async (req: Request, res: Response) => {
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
    const data = await prisma.scholarship.findUnique({
      where: {
        id: +id,
      },
    });
    if (!data) {
      notFoundResponse(res, "Scholarship not found");
      return;
    }
    await prisma.scholarship.delete({
      where: {
        id: +id,
      },
    });
    successResponse(res, "Scholarship deleted successfully", null);
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
      skip: (value.page - 1) * value.limit,
      take: value.limit,
      orderBy: {
        created_at: "desc",
      },
      where: value.user_id
        ? {
            title: {
              contains: value.q,
            },
            created_at: value.start_date &&
              value.end_date && {
                gte: new Date(value.start_date),
                lte: new Date(value.end_date),
              },
          }
        : {
            is_active: true,
          },
      include: {
        images: {
          select: {
            url: true,
            id: true,
          },
        },
      },
    });
    const count = await prisma.scholarship.count({
      where: value.user_id
        ? {
            title: {
              contains: value.q,
            },
            created_at: value.start_date &&
              value.end_date && {
                gte: new Date(value.start_date),
                lte: new Date(value.end_date),
              },
          }
        : {
            is_active: true,
          },
    });

    successResponse(
      res,
      "Scholarships retrieved successfully",
      scholarships.map((item) => ({
        ...item,
        images: retriveImagesUrl(item, req),
      })),
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

const getCaseCounter = async (req: Request, res: Response) => {
  try {
    const caseCount = await prisma.caseCount.findFirst();
    if (!caseCount) {
      successResponse(res, "Case count retrieved successfully", {
        bachelor: 0,
        master: 0,
        phd: 0,
        internship: 0,
        postdoc: 0,
      });
      return;
    }
    successResponse(res, "Case count retrieved successfully", caseCount);
    return;
  } catch (error) {
    internalServerError(res, error);
  }
};

const getScholarShipDetail = async (req: Request, res: Response) => {
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
    const data = await prisma.scholarship.findUnique({
      where: {
        id: Number(id),
      },
      include: {
        images: {
          select: {
            id: true,
            url: true,
          },
        },
      },
    });
    if (!data) {
      notFoundResponse(res, "Scholarship not found");
      return;
    }

    successResponse(res, "Scholarship details retrieved successfully", {
      ...data,
      images: retriveImagesUrl(data, req),
    });
    return;
  } catch (error) {
    internalServerError(res, error);
  }
};

const updateScholarship = async (req: Request, res: Response) => {
  try {
    const { error, value } = editScholarshipSchema.validate(req.body);
    if (error) {
      errorResponse(res, error.details[0].message);
      return;
    }
    const images = await saveImages(value.images, "scholarships");
    if (!images) {
      errorResponse(res, "Image upload failed");
      return;
    }

    const data = await prisma.scholarship.findUnique({
      where: {
        id: value.id,
      },
    });

    if (!data) {
      notFoundResponse(res, "Scholarship not found");
      return;
    }

    const scholarship = await prisma.scholarship.update({
      where: {
        id: value.id,
      },
      data: {
        title: value.title,
        description: value.description,
        link: value.link,
        deadline: value.deadline,
        is_active: value.is_active,
        images: {
          deleteMany: {},
          create: images,
        },
      },
      include: {
        images: {
          select: {
            id: true,
            url: true,
          },
        },
      },
    });
    successResponse(res, "Scholarship updated successfully", {
      ...scholarship,
      images: retriveImagesUrl(scholarship, req),
    });
    return;
  } catch (error) {
    internalServerError(res, error);
  }
};

export {
  addScholarship,
  deleteScholarship,
  getAllScholarships,
  getCaseCounter,
  getScholarShipDetail,
  updateScholarship,
};
