import formidable from "formidable";
import Joi from "joi";
import { authSchema } from ".";

export const addOfferSchema = authSchema.keys({
  title: Joi.string().required().min(3).max(30),
  description: Joi.string().required().min(3).max(1000),
  image: Joi.array<formidable.File>().required().min(1).max(1),
  is_active: Joi.boolean().default(true),
});

export const updateOfferSchema = addOfferSchema.keys({
  id: Joi.number().required(),
});
