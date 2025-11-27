import { Router } from "express";
import { getDashboard } from "../controllers/dashboardController.js";
import { AuthService } from "../services/authService.js";

const router = Router();

router.get("/", AuthService.verifyAuth, getDashboard);

export default router;
