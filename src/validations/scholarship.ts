import Joi from "joi";
import { authSchema } from ".";

export const addScholarshipSchema = authSchema.keys({
  title: Joi.string().required().min(3).max(30),
  description: Joi.string().required().min(3).max(1000),
  images: Joi.array().required().min(1).max(4),
  is_active: Joi.boolean().default(true),
  deadline: Joi.date().required(),
  link: Joi.string().required(),
});

export const editScholarshipSchema = addScholarshipSchema.keys({
  id: Joi.number().required(),
});
