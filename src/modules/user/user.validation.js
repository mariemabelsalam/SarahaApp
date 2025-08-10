import Joi from "joi";
import { generalFeilds } from "../../middleware/validation.midlleware.js";
import { Types } from "mongoose";

export const updatePassword = {
  body: Joi.object().keys({
    oldPassword: generalFeilds.password.required(),
    password: generalFeilds.password.not(Joi.ref("oldPassword")).required(),
    confirmPassword: generalFeilds.confirmPassword.required(),
  }),
};

export const shareProfile = {
  params: Joi.object()
    .keys({
      userId: generalFeilds.id.required(),
    })
    .required(),
};

export const updateBasicInfo = {
  body: Joi.object().keys({
    fullName: generalFeilds.fullName,
    phone: generalFeilds.phone,
  }),
};

export const freezeAccount = {
  params: Joi.object().keys({
    userId: generalFeilds.id,
  }),
};


export const restoreAccount= {
  params: Joi.object().keys({
    userId: generalFeilds.id,
  }),
};



export const deleteAccount= {
  params: Joi.object().keys({
    userId: generalFeilds.id,
  }),
};
