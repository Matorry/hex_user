import Joi from "joi";

export const UserCreateSchema = Joi.object({
  userName: Joi.string().min(3).required(),
  email: Joi.string().email().required(),
  pswd: Joi.string().min(6).required()
});

export const UserUpdateSchema = Joi.object({
  userName: Joi.string().min(3),
  email: Joi.string().email(),
  pswd: Joi.string().min(6)
});
