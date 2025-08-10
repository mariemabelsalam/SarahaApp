import { customAlphabet } from "nanoid";
import userModel, { providerEnum } from "../../DB/models/User.model.js";
import * as DBService from "../../DB/service.db.js";
import {
  decodeToken,
  signutureEnum,
  signutureLevelEnum,
} from "../../middleware/authenticate.middleware.js";
import { emailEvent } from "../../utils/events/email.event.js";
import { asyncHandler, successResponse } from "../../utils/response.js";
import { generateEncrypt } from "../../utils/security/encrypt.security.js";
import {
  compareHash,
  generateHash,
} from "../../utils/security/hash.security.js";
import {
  generateLogicCredentails,
  generateToken,
  getSignutures,
} from "../../utils/security/token.security.js";
import { OAuth2Client } from "google-auth-library";
import { error } from "node:console";

export const signup = asyncHandler(async (req, res, next) => {
  const { fullName, email, password, phone, age, role } = req.body;
  const checkEmailExist = await DBService.findOne({
    model: userModel,
    filter: { email },
  });
  if (checkEmailExist) {
    return next(new Error("email alredy exist", { cause: 409 }));
  }
  const hashPass = generateHash({ plainText: password });
  const encrptPhone = generateEncrypt({ plainText: phone });
  const otp = customAlphabet("0123456789", 6)();
  const otpExpire = Date.now() + 2 * 60 * 1000;
  // console.log(otpExpire);

  const hashOtp = generateHash({ plainText: otp });
  const user = await DBService.create({
    model: userModel,
    data: [
      {
        fullName,
        email,
        password: hashPass,
        phone: encrptPhone,
        role,
        age,
        confirmEmailOtp: hashOtp,
        confirmEmailOtpExpires: otpExpire,
      },
    ],
  });
  emailEvent.emit("confirmEmail", { to: email, otp: otp });

  successResponse({
    res,
    data: { user },
    message: "user added successfully",
    status: 201,
  });
});

export const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await DBService.findOne({
    model: userModel,
    filter: { email },
  });
  if (!user) {
    return next(new Error("ivalid email or password", { cause: 404 }));
  }
  if (!user.confirmEmail) {
    return next(new Error("please verify your account first", { cause: 400 }));
  }
  const comparePass = compareHash({
    plainText: password,
    hashValue: user.password,
  });
  if (!comparePass) {
    return next(new Error("invalid email or password"));
  }

  const cradetional = await generateLogicCredentails({ user });
  successResponse({
    res,
    data: { cradetional },
  });
});

export const confirmEmail = asyncHandler(async (req, res, next) => {
  const { email, otp } = req.body;
  const user = await DBService.findOne({
    model: userModel,
    filter: { email, confirmEmail: null, confirmEmailOtp: { $ne: null } },
  });
  if (!user) {
    return next(new Error("user not found", { cause: 404 }));
  }
  if (user.confirmEmailOtpBan && Date.now() < user.confirmEmailOtpBan) {
    return next(new Error("try again later", { cause: 400 }));
  }
  if (user.confirmEmailOtpBan && Date.now() >= user.confirmEmailOtpBan) {
    user.confirmEmailOtpBan = null;
    user.confirmEmailOtpAttempts = 0;
    await user.save();
  }
  if (user.confirmEmailOtpExpires && Date.now() > user.confirmEmailOtpExpires) {
    return next(new Error("otp has expired"), { cause: 400 });
  }

  const compareOtp = compareHash({
    plainText: otp,
    hashValue: user.confirmEmailOtp,
  });

  if (!compareOtp) {
    user.confirmEmailOtpAttempts = (user.confirmEmailOtpAttempts || 0) + 1;
    if (user.confirmEmailOtpAttempts >= 5) {
      user.confirmEmailOtpBan = Date.now() + 5 * 60 * 1000;
    }
    await user.save();
    return next(new Error("invalid otp", { cause: 400 }));
  }
  const updateUser = await DBService.updateOne({
    model: userModel,
    filter: { email },
    data: {
      confirmEmail: Date.now(),
      $unset: {
        confirmEmailOtp: true,
        confirmEmailOtpAttempts: "",
        confirmEmailOtpBan: "",
      },
      $inc: { __v: 1 },
    },
  });

  if (updateUser.matchedCount) {
    return successResponse({ res });
  }

  return next(new Error("fail to confirm user email", { cause: 400 }));
});

export const refreshToken = asyncHandler(async (req, res, next) => {
  const { authorization } = req.headers;
  const user = await decodeToken({
    token: authorization,
    typeSignuture: signutureEnum.refresh,
  });

  const signutures = await getSignutures({
    signtureLeve: user.role === signutureLevelEnum.user ? "user" : "admin",
  });
  let access_token = generateToken({
    payLoad: { _id: user._id },
    privateKeyKey: signutures.accessSignuture,
  });

  return successResponse({ res, data: { access_token } });
});

async function verifyGoogleAccount({ idToken } = {}) {
  const client = new OAuth2Client();
  const ticket = await client.verifyIdToken({
    idToken,
    audience: process.env.WEB_CLIENT_ID.split(","),
  });
  const payload = ticket.getPayload();
  return payload;
}
export const signupWithGmail = asyncHandler(async (req, res, next) => {
  const { idToken } = req.body;
  const { email, email_verified, name, picture } = await verifyGoogleAccount({
    idToken: idToken,
  });
  if (!email_verified) {
    return next(new Error("not verified acount", { cause: 400 }));
  }
  const user = await DBService.findOne({ model: userModel, filter: { email } });
  if (user) {
    return next(new Error("email already exist", { cause: 409 }));
  }
  const newUser = await DBService.create({
    model: userModel,
    data: [
      {
        fullName: name,
        confirmEmail: Date.now(),
        picture,
        email,
        provider: providerEnum.google,
      },
    ],
  });
  return successResponse({ res, data: newUser, status: 201 });
});
