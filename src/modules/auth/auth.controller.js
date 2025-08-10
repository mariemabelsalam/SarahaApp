import { Router } from "express";
import { validation } from "../../middleware/validation.midlleware.js";
import * as authService from "./auth.service.js";
import * as validators from "./auth.validation.js";

const router = Router();

router.post("/signup", validation(validators.signup), authService.signup);
router.post("/login", validation(validators.login), authService.login);
router.post("/refresh", authService.refreshToken);
router.patch(
  "/confirmEmail",
  validation(validators.confirmEmail),
  authService.confirmEmail
);
router.post("/signup/gmail", authService.signupWithGmail);

export default router;
