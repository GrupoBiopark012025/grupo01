import { Router } from "express";
import { listActionPlans, showActionPlan, createActionPlan, updateActionPlan, inactiveActionPlan } from "../controllers/actionPlanController.js";
import { verify } from "../controllers/authController.js";

const router = Router();

router.get("/", verify, listActionPlans);
router.get("/:id", verify, showActionPlan);
router.post("/", verify, createActionPlan);
router.put("/:id", verify, updateActionPlan);
router.patch("/:id/inactive", verify, inactiveActionPlan);

export default router;