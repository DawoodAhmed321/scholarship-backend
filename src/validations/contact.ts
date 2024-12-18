import Joi from "joi";
import { authSchema } from ".";

export const contactSchema = authSchema.keys({
  name: Joi.string().required().min(3),
  email: Joi.string().email().required(),
  message: Joi.string().required().min(10),
  subject: Joi.string().required().min(3),
});

export const joinTeamSchema = authSchema.keys({
  name: Joi.string().required().min(3),
  email: Joi.string().email().required(),
  message: Joi.string().required().min(10),
  subject: Joi.string().required().min(3),
  file: Joi.array()

    .required()
    .min(1)
    .max(1)
    .custom((value, helper) => {
      if (!value[0]?.mimetype || value[0].mimetype !== "application/pdf") {
        return helper.message({
          custom: "File should be of type pdf",
        });
      }
      return value;
    }),
});

export const exportSchema = authSchema
  .keys({
    start_date: Joi.date().required(),
    end_date: Joi.date().required(),
    type: Joi.string().required().valid("Contacts", "Team Joins"),
  })
  .custom((value, helpers) => {
    if (new Date(value.end_date) <= new Date(value.start_date)) {
      return helpers.message({
        custom: "End Date must be greater than Start Date",
      });
    }
    return value;
  });
