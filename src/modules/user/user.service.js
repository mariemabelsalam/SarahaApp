import { asyncHandler, successResponse } from "../../utils/response.js";
import {
  generateDecrypt,
  generateEncrypt,
} from "../../utils/security/encrypt.security.js";
import {
  compareHash,
  generateHash,
} from "../../utils/security/hash.security.js";
import * as DBService from "../../DB/service.db.js";
import userModel from "../../DB/models/User.model.js";

export const getProfile = asyncHandler(async (req, res, next) => {
  req.user.phone = generateDecrypt({ cipherText: req.user.phone });
  successResponse({ res, data: req.user });
});

export const updatePassword = asyncHandler(async (req, res, next) => {
  const { oldPassword, password } = req.body;
  const comparePass = compareHash({
    plainText: oldPassword,
    hashValue: req.user.password,
  });
  if (!comparePass) {
    return next(new Error("invalid old password", { cause: 400 }));
  }
  const hashPass = generateHash({ plainText: password });
  const user = await DBService.findOneAndUpdate({
    model: userModel,
    filter: { _id: req.user._id },
    data: { password: hashPass },
  });
  if (!user) {
    return next(new Error("invalid account", { cause: 404 }));
  }
  successResponse({ res, message: "password updated successfully" });
});

export const shareProfile = asyncHandler(async (req, res, next) => {
  const { userId } = req.params;
  const user = await DBService.findOne({
    model: userModel,
    filter: {
      _id: userId,
      confirmEmail: { $exists: true },
    },
  });
  if (!user) {
    return next(new Error("not found account", { cause: 404 }));
  }
  successResponse({ res, data: { user } });
});

export const updateBasicInfo = asyncHandler(async (req, res, next) => {
  if (req.body.phone) {
    req.body.phone = generateEncrypt({ plainText: req.body.phone });
  }
  const user = await DBService.findOneAndUpdate({
    model: userModel,
    filter: {
      _id: req.user._id,
    },
    data: req.body,
  });
  if (!user) {
    return next(new Error("invalid account", { cause: 404 }));
  }
  successResponse({ res, data: { user } });
});

export const freezeAccount = asyncHandler(async (req, res, next) => {
  const { userId } = req.params;
  if (userId && req.user.role !== "admin") {
    return next(new Error("not authorization account", { cause: 400 }));
  }
  const user = await DBService.findOneAndUpdate({
    model: userModel,
    filter: {
      _id: userId || req.user._id,
      deletedAt: { $exists: false },
    },
    data: {
      deletedAt: Date.now(),
      deletedBy: req.user._id,
      $unset: {
        restoredAt: 1,
        restoredBy: 1,
      },
    },
  });
  if (!user) {
    return next(new Error("invalid account", { cause: 404 }));
  }
  successResponse({ res, data: { user } });
});

export const restoreAccount = asyncHandler(async (req, res, next) => {
  const { userId } = req.params;
  const user = await DBService.findOneAndUpdate({
    model: userModel,
    filter: {
      _id: userId,
      deletedAt: { $exists: true },
      deletedBy: { $ne: userId },
    },
    data: {
      $unset: {
        deletedAt: 1,
        deletedBy: 1,
      },
    },
  });
  if (!user) {
    return next(new Error("invalid account", { cause: 404 }));
  }
  successResponse({ res, data: { user } });
});

export const deleteAccount = asyncHandler(async (req, res, next) => {
  const { userId } = req.params;
  const user = await DBService.deleteOne({
    model: userModel,
    filter: {
      _id: userId,
      deletedAt: { $exists: true },
    },
  });
  if (user.deletedCount) {
    successResponse({ res, data: { user } });
  }
  return next(new Error("invalid account", { cause: 404 }));
});
