import Joi from "joi";
import formidable from "formidable";
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
