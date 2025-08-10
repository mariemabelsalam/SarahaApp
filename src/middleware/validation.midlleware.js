import Joi from "joi";
import { asyncHandler } from "../utils/response.js";
import { Types } from "mongoose";

export const generalFeilds = {
  email: Joi.string().email(),
  fullName: Joi.string().min(2).max(20),
  password: Joi.string().min(6),
  phone: Joi.string().pattern(/^01[0125][0-9]{8}$/),
  otp: Joi.string().max(6),
  confirmPassword: Joi.string().valid(Joi.ref("password")),
  id: Joi.string().custom((value, helper) => {
    return Types.ObjectId.isValid(value) || helper.message("invalid object id");
  }),
};

export const validation = (schema) => {
  return asyncHandler(async (req, res, next) => {
    const errors = [];
    for (const key of Object.keys(schema)) {
      const validationResult = schema[key].validate(req[key], {
        abortEarly: false,
      });
      if (validationResult.error) {
        errors.push({ key, details: validationResult.error.details });
      }
    }
    if (errors.length) {
      return res
        .status(400)
        .json({ message: "validationError", error: errors });
    }

    next();
  });
};
