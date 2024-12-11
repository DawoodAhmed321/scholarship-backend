import Joi from "joi";

export const paginationSchema = Joi.object({
  page: Joi.number().default(1),
  limit: Joi.number().default(10).max(20).min(1),
  user_id: Joi.number().optional(),
  token: Joi.string().optional().min(0),
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
