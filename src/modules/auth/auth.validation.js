import Joi from "joi";
import { generalFeilds } from "../../middleware/validation.midlleware.js";

export const signup = {
  body: Joi.object()
    .keys({
      fullName: Joi.string().min(2).max(20).required(),
      email: generalFeilds.email.required(),
      password: generalFeilds.password.required(),
      phone: generalFeilds.phone.required(),
      age: Joi.number().min(18),
      role: Joi.string().valid("user", "admin"),
    })
    .required()
    .options({ allowUnknown: false }),
};

export const login = {
  body: Joi.object()
    .keys({
      email: generalFeilds.email.required(),
      password: generalFeilds.password.required(),
    })
    .required()
    .options({ allowUnknown: false }),
};

export const confirmEmail = {
  body: Joi.object()
    .keys({
      email: generalFeilds.email.required(),
      otp: generalFeilds.otp.required(),
    })
    .required()
    .options({ allowUnknown: false }),
};
