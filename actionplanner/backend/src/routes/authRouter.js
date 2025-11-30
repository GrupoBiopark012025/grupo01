import { Router } from "express";
import validator from "../middlewares/validator.js";
import { loginValidator } from "../validators/authValidator.js";
import {
  login,
  refreshToken,
  logout,
  validateToken,
  verify,
  changeEnvironment
} from "../controllers/authController.js";
import {
  requestPasswordReset,
  validateResetToken,
  resetPassword
} from "../controllers/passwordResetController.js";

const router = Router();

router.post("/login", validator(loginValidator), login);
router.post("/refresh", verify, refreshToken);
router.post("/logout", verify, logout);
router.get("/validate", verify, validateToken);
router.post("/change-environment", verify, changeEnvironment);

// Rotas de recuperação de senha
router.post("/request-password-reset", requestPasswordReset);
router.get("/validate-reset-token", validateResetToken);
router.post("/reset-password", resetPassword);

export default router;