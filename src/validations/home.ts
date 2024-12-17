import Joi from "joi";
import { authSchema } from ".";
import formidable from "formidable";

export const homePageSchema = authSchema.keys({
  title: Joi.string().required().min(10),
});

export const addTestimonialSchema = authSchema.keys({
  name: Joi.string().required().min(3),
  description: Joi.string().required().min(10),
  image: Joi.array<formidable.File[]>().required().min(1).max(1),
});

export const editTestimonialSchema = addTestimonialSchema.keys({
  id: Joi.number().required(),
  image: Joi.array<formidable.File | string>().required().min(1).max(1),
});
