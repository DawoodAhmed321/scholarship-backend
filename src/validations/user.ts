import Joi from "joi";
import { optionalAuth } from ".";

export const RegistrationSchema = optionalAuth.keys({
  first_name: Joi.string().required().min(3).max(30),
  last_name: Joi.string().required().min(3).max(30),
  email: Joi.string().email().required(),
  password: Joi.string()
    .required()
    .min(6)
    .max(30)
    .regex(/^[a-zA-Z0-9]{3,30}$/, "password must be alphanumeric"),
  confirm_password: Joi.string().required().valid(Joi.ref("password")),
});

export const LoginSchema = optionalAuth.keys({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});
