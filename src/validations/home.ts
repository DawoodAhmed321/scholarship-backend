import Joi from "joi";
import { authSchema } from ".";
import formidable from "formidable";

export const homePageSchema = authSchema
  .keys({
    title: Joi.string().required().min(10),
    facebook: Joi.string().required().min(6),
    instagram: Joi.string().required().min(6),
    twitter: Joi.string().required().min(6),
    mobile: Joi.string().required().min(11).max(11),
    email: Joi.string().required().email(),
    address: Joi.string().required().min(10),

    bachelor: Joi.number().required().min(0),
    master: Joi.number().required().min(0),
    phd: Joi.number().required().min(0),
    internship: Joi.number().required().min(0),
    postdoc: Joi.number().required().min(0),

    start_time: Joi.date().required().default(new Date()),
    end_time: Joi.date().required().default(new Date()),
  })
  .custom((value, helpers) => {
    if (new Date(value.end_time) <= new Date(value.start_time)) {
      return helpers.message({
        custom: "End Time must be greater than Start Time",
      });
    }
    return value;
  });

export const addTestimonialSchema = authSchema.keys({
  name: Joi.string().required().min(3),
  description: Joi.string().required().min(10),
  image: Joi.array<formidable.File[]>().required().min(1).max(1),
  university: Joi.string().required().min(3),
  program: Joi.string().required().min(3),
  scholarshipProgram: Joi.string().required().min(3),
  session: Joi.string().required().min(3),
});

export const editTestimonialSchema = addTestimonialSchema.keys({
  id: Joi.number().required(),
  image: Joi.array<formidable.File | string>().required().min(1).max(1),
});
