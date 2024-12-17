import { prisma } from "../..";
import {
  getCurrentWeeksMonday,
  getPreviousWeeksMonday,
  retriveFile,
  saveFile,
} from "../../utils";
import {
  errorResponse,
  internalServerError,
  successResponse,
} from "../../utils/response";
import { paginationSchema } from "../../validations";
import { contactSchema, joinTeamSchema } from "../../validations/contact";
import { Request, Response } from "express";

const addContact = async (req: Request, res: Response) => {
  try {
    const { error, value } = contactSchema.validate(req.body);
    if (error) {
      errorResponse(res, error.details[0].message);
      return;
    }
    const contact = await prisma.contact.create({
      data: {
        name: value.name,
        email: value.email,
        message: value.message,
        subject: value.subject,
        type: "INQUIRY",
      },
      select: {
        id: true,
        name: true,
        email: true,
        message: true,
        subject: true,
        type: true,
        created_at: true,
      },
    });
    successResponse(res, "Contact created successfully", contact);
  } catch (error) {
    internalServerError(res, error);
  }
};

const getDashboard = async (req: Request, res: Response) => {
  try {
    let lastWeekCountByDaySet: number[] = [];
    let currentWeekCountByDaySet: number[] = [];

    const lastMonday = getPreviousWeeksMonday();
    const currentMonday = getCurrentWeeksMonday();
    for (let i = 0; i < 7; i++) {
      //   last week push
      const startDate = new Date(lastMonday);
      startDate.setDate(startDate.getDate() + i);
      const endDate = new Date(startDate);
      endDate.setUTCHours(23, 59, 59, 999);

      const contact = await prisma.contact.count({
        where: {
          type: "INQUIRY",
          created_at: {
            gte: startDate,
            lte: endDate,
          },
        },
      });

      lastWeekCountByDaySet.push(contact);

      //   current week push
      const currentStartDate = new Date(currentMonday);
      currentStartDate.setDate(currentStartDate.getDate() + i);
      const currentEndDate = new Date(currentStartDate);
      currentEndDate.setUTCHours(23, 59, 59, 999);

      const currentContact = await prisma.contact.count({
        where: {
          type: "INQUIRY",
          created_at: {
            gte: currentStartDate,
            lte: currentEndDate,
          },
        },
      });
      currentWeekCountByDaySet.push(currentContact);
    }

    const data = {
      labels: ["Mon", "Tues", "Wed", "Thur", "Fri", "Sat", "Sun"],
      datasets: [
        {
          label: "This Week",
          data: currentWeekCountByDaySet,
          backgroundColor: ["#145790"],
          borderColor: ["#145790"],
          borderWidth: 1,
        },
        {
          label: "Last Week",
          data: lastWeekCountByDaySet,
          backgroundColor: ["#e0e0e1"],
          borderColor: ["#00000050"],
          borderWidth: 1,
        },
      ],
    };

    const contacts = await prisma.contact.findMany({
      skip: 0,
      take: 10,
      where: {
        type: "INQUIRY",
      },
      orderBy: {
        created_at: "desc",
      },
      select: {
        id: true,
        name: true,
        email: true,
        message: true,
        subject: true,
        type: true,
        created_at: true,
      },
    });
    const join_team = await prisma.contact.findMany({
      skip: 0,
      take: 10,
      where: {
        type: "JOIN_TEAM",
      },
      orderBy: {
        created_at: "desc",
      },
      select: {
        id: true,
        name: true,
        email: true,
        message: true,
        subject: true,
        type: true,
        created_at: true,
      },
    });

    successResponse(res, "Contacts retrieved successfully", {
      line_data: data,
      contacts,
      join_team,
    });
  } catch (error) {
    internalServerError(res, error);
  }
};

const getAllContact = async (req: Request, res: Response) => {
  try {
    const { error, value } = paginationSchema.validate(req.body);

    if (error) {
      errorResponse(res, error.details[0].message);
      return;
    }
    const contacts = await prisma.contact.findMany({
      where: {
        type: "INQUIRY",
      },
      skip: (value.page - 1) * value.limit,
      take: value.limit,
      orderBy: {
        created_at: "desc",
      },
      select: {
        id: true,
        name: true,
        email: true,
        message: true,
        subject: true,
        type: true,
        created_at: true,
      },
    });
    const count = await prisma.contact.count({
      where: {
        type: "INQUIRY",
      },
    });

    successResponse(res, "Contacts retrieved successfully", contacts, {
      current_page: value.page,
      last_page: Math.ceil(count / value.limit),
      per_page: value.limit,
      total: count,
    });
  } catch (error) {
    internalServerError(res, error);
  }
};

const getAllJoinTeam = async (req: Request, res: Response) => {
  try {
    const { error, value } = paginationSchema.validate(req.body);

    if (error) {
      errorResponse(res, error.details[0].message);
      return;
    }
    const contacts = await prisma.contact.findMany({
      where: {
        type: "JOIN_TEAM",
      },
      skip: (value.page - 1) * value.limit,
      take: value.limit,
      orderBy: {
        created_at: "desc",
      },
      select: {
        id: true,
        name: true,
        email: true,
        message: true,
        subject: true,
        type: true,
        created_at: true,
        file: true,
      },
    });
    const count = await prisma.contact.count({
      where: {
        type: "JOIN_TEAM",
      },
    });

    successResponse(
      res,
      "Contacts retrieved successfully",
      contacts.map((contact) => retriveFile(contact, req)),
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

const joinTeam = async (req: Request, res: Response) => {
  try {
    const { error, value } = joinTeamSchema.validate(req.body);
    if (error) {
      errorResponse(res, error.details[0].message);
      return;
    }

    const file = await saveFile(value.file[0], "contact");
    if (!file) {
      errorResponse(res, "Error in saving file");
      return;
    }

    const contact = await prisma.contact.create({
      data: {
        name: value.name,
        email: value.email,
        message: value.message,
        subject: "Join Team",
        type: "JOIN_TEAM",
        file: file.url,
      },
    });
    successResponse(
      res,
      "Contact created successfully",
      retriveFile(contact, req)
    );
  } catch (error) {
    internalServerError(res, error);
  }
};

export { addContact, getAllContact, getAllJoinTeam, getDashboard, joinTeam };
