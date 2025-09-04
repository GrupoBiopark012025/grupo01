import { Router } from "express";
import validator from "../middlewares/validator.js";
import { loginValidator } from "../validators/authValidator.js";
import { 
  login, 
  refreshToken, 
  logout, 
  validateToken,
  verify 
} from "../controllers/authController.js";

const router = Router();

router.post("/login", validator(loginValidator), login);
router.post("/refresh", verify, refreshToken);
router.post("/logout", verify, logout);
router.get("/validate", verify, validateToken);

export default router;