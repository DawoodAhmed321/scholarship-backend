import { prisma } from "../..";
import {
  notFoundResponse,
  successResponse,
  internalServerError,
  errorResponse,
} from "../../utils/response";
import { Request, Response } from "express";
import {
  addTestimonialSchema,
  editTestimonialSchema,
  homePageSchema,
} from "../../validations/home";
import { retriveImageUrl, saveImages } from "../../utils";
import { paginationSchema } from "../../validations";

const addHomePage = async (req: Request, res: Response) => {
  try {
    const { error, value } = homePageSchema.validate(req.body);
    if (error) {
      errorResponse(res, error.details[0].message);
      return;
    }
    const home = await prisma.home.upsert({
      where: {
        id: 1,
      },
      create: {
        title: value.title,
        facebook: value.facebook,
        instagram: value.instagram,
        twitter: value.twitter,
        address: value.address,
        email: value.email,
        mobile: value.mobile,
        start_time: value.start_time,
        end_time: value.end_time,
      },
      update: {
        title: value.title,
        facebook: value.facebook,
        instagram: value.instagram,
        twitter: value.twitter,
        address: value.address,
        email: value.email,
        mobile: value.mobile,
        start_time: value.start_time,
        end_time: value.end_time,
      },
    });
    if (!home) {
      notFoundResponse(res, "Home not found");
      return;
    }
    successResponse(res, "Home updated successfully", home);
    return;
  } catch (error) {
    internalServerError(res, error);
  }
};

const addTestimonial = async (req: Request, res: Response) => {
  try {
    const { error, value } = addTestimonialSchema.validate(req.body);
    if (error) {
      errorResponse(res, error.details[0].message);
      return;
    }

    const image = await saveImages(value.image, "testimonials");
    if (!image) {
      errorResponse(res, "Error in saving image");
      return;
    }

    const testimonial = await prisma.testimonials.create({
      data: {
        name: value.name,
        description: value.description,
        program: value.program,
        university: value.university,
        scholarshipProgram: value.scholarshipProgram,
        session: value.session,

        image: {
          create: image[0],
        },
      },
      include: {
        image: {
          select: {
            url: true,
          },
        },
      },
    });

    successResponse(
      res,
      "Testimonial added successfully",
      retriveImageUrl(testimonial, req)
    );
    return;
  } catch (error) {
    internalServerError(res, error);
  }
};

const deleteTestimonial = async (req: Request, res: Response) => {
  try {
    if (!req.body?.id) {
      errorResponse(res, "id is required");
      return;
    }
    if (isNaN(req.body.id)) {
      errorResponse(res, "id must be a number");
      return;
    }
    const testimonial = await prisma.testimonials.findUnique({
      where: {
        id: +req.body.id,
      },
    });
    if (!testimonial) {
      notFoundResponse(res, "Testimonial not found");
      return;
    }
    await prisma.testimonials.delete({
      where: {
        id: +req.body.id,
      },
    });
    successResponse(res, "Testimonial deleted successfully", null);
    return;
  } catch (error) {
    internalServerError(res, error);
  }
};

const editTestimonial = async (req: Request, res: Response) => {
  try {
    const { error, value } = editTestimonialSchema.validate(req.body);
    if (error) {
      errorResponse(res, error.details[0].message);
      return;
    }
    const testimonial = await prisma.testimonials.findUnique({
      where: {
        id: value.id,
      },
    });
    if (!testimonial) {
      notFoundResponse(res, "Testimonial not found");
      return;
    }
    const image = await saveImages(value.image, "testimonials");
    if (!image) {
      errorResponse(res, "Error in saving image");
      return;
    }

    const updatedTestimonial = await prisma.testimonials.update({
      where: {
        id: value.id,
      },
      data: {
        name: value.name,
        description: value.description,
        program: value.program,
        university: value.university,
        scholarshipProgram: value.scholarshipProgram,
        session: value.session,
        image: {
          update: {
            url: image[0].url,
          },
        },
      },
      include: {
        image: {
          select: {
            url: true,
            id: true,
          },
        },
      },
    });
    successResponse(
      res,
      "Testimonial updated successfully",
      retriveImageUrl(updatedTestimonial, req)
    );
    return;
  } catch (error) {
    internalServerError(res, error);
  }
};

const getHome = async (req: Request, res: Response) => {
  try {
    const home = await prisma.home.findUnique({
      where: {
        id: 1,
      },
    });
    const testimonials = await prisma.testimonials.findMany({
      skip: 0,
      take: 10,
      include: {
        image: {
          select: {
            id: true,
            url: true,
          },
        },
      },
    });

    const offers = await prisma.offer.findMany({
      where: {
        is_active: true,
      },
      skip: 0,
      take: 8,
      include: {
        image: {
          select: {
            id: true,
            url: true,
          },
        },
      },
    });

    if (!home) {
      notFoundResponse(res, "Home not found");
      return;
    }
    successResponse(res, "Home retrieved successfully", {
      ...home,
      start_time: home.start_time.toTimeString().slice(0, 5),
      end_time: home.end_time.toTimeString().slice(0, 5),
      offers: offers.map((item) => retriveImageUrl(item, req)),
      testimonials: testimonials.map((item) => retriveImageUrl(item, req)),
    });
    return;
  } catch (error) {
    internalServerError(res, error);
  }
};

const getTestimonials = async (req: Request, res: Response) => {
  try {
    const { error, value } = paginationSchema.validate(req.body);
    if (error) {
      errorResponse(res, error.details[0].message);
      return;
    }
    const testimonials = await prisma.testimonials.findMany({
      where: {
        name: {
          contains: value.q,
        },
        created_at: value.start_date &&
          value.end_date && {
            gte: new Date(value.start_date),
            lte: new Date(value.end_date),
          },
      },
      skip: (value.page - 1) * value.limit,
      take: value.limit,
      orderBy: {
        created_at: "desc",
      },
      include: {
        image: true,
      },
    });
    const count = await prisma.testimonials.count({
      where: {
        name: {
          contains: value.q,
        },
        created_at: value.start_date &&
          value.end_date && {
            gte: new Date(value.start_date),
            lte: new Date(value.end_date),
          },
      },
    });

    successResponse(
      res,
      "Testimonials fetched successfully",
      testimonials.map((item) => retriveImageUrl(item, req)),
      {
        current_page: value.page,
        last_page: Math.ceil(count / value.limit),
        per_page: value.limit,
        total: count,
      }
    );
  } catch (error) {
    internalServerError(res, error);
  }
};

const getTestimonialDetails = async (req: Request, res: Response) => {
  try {
    if (!req.body?.id) {
      errorResponse(res, "id is required");
      return;
    }
    if (isNaN(req.body.id)) {
      errorResponse(res, "id must be a number");
      return;
    }
    const testimonial = await prisma.testimonials.findUnique({
      where: {
        id: +req.body.id,
      },
      include: {
        image: {
          select: {
            id: true,
            url: true,
          },
        },
      },
    });
    if (!testimonial) {
      notFoundResponse(res, "Testimonial not found");
      return;
    }
    successResponse(
      res,
      "Testimonial details fetched successfully",
      retriveImageUrl(testimonial, req)
    );
    return;
  } catch (error) {
    internalServerError(res, error);
  }
};

export {
  addHomePage,
  addTestimonial,
  deleteTestimonial,
  editTestimonial,
  getHome,
  getTestimonials,
  getTestimonialDetails,
};
