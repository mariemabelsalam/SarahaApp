import { Router } from "express";
import { validation } from "../../middleware/validation.midlleware.js";
import * as userService from "./user.service.js";
import * as validators from "./user.validation.js";
import {
  authenticate,
  authorization,
} from "../../middleware/authenticate.middleware.js";
import { endPoint } from "./user.authorization.js";

const router = Router();

router.get("/getProfile", authenticate, userService.getProfile);
router.get(
  "/:userId",
  validation(validators.shareProfile),
  userService.shareProfile
);

router.patch(
  "/updatePassword",
  authenticate,
  validation(validators.updatePassword),
  userService.updatePassword
);
router.patch(
  "/updateBasicInfo",
  authenticate,
  validation(validators.updateBasicInfo),
  userService.updateBasicInfo
);

router.delete(
  "{/:userId}/freezeAccount",
  validation(validators.freezeAccount),
  authenticate,
  userService.freezeAccount
);

router.patch(
  "/:userId/restoreAccount",
  authenticate,
  authorization({ accessRoles: endPoint.restoreAccount }),
  validation(validators.restoreAccount),
  userService.restoreAccount
);


router.delete(
  "/:userId",
  authenticate,
  authorization({ accessRoles: endPoint.deleteAccount }),
  validation(validators.deleteAccount),
  userService.deleteAccount
);

export default router;
