import Joi, { custom } from "joi";

export const paginationSchema = Joi.object({
  q: Joi.string().optional().min(0).default(""),
  start_date: Joi.date().optional(),
  end_date: Joi.date().optional(),
  page: Joi.number().default(1),
  limit: Joi.number().default(10).max(20).min(1),
  user_id: Joi.number().optional(),
  token: Joi.string().optional().min(0),
}).custom((value, helpers) => {
  if (!value.start_date) {
    return value;
  }
  if (new Date(value.end_date) <= new Date(value.start_date)) {
    return helpers.message({
      custom: "End Date must be greater than Start Date",
    });
  }
  return value;
});

export const authSchema = Joi.object({
  user_id: Joi.number().optional(),
  token: Joi.string().optional().min(0),
})
  .xor("user_id", "token")
  .messages({
    "object.missing": "You must provide authentication or token to continue",
    "object.xor": "You must provide either authentication or token",
  });

export const optionalAuth = Joi.object({
  token: Joi.string().optional().min(0),
  user_id: Joi.number().optional(),
});
