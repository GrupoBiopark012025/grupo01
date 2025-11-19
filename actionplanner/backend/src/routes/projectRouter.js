import { Router } from "express";
import {
  listProjects,
  showProject,
  createProject,
  editProject,
  deleteProject,
  getProjectStatistics
} from "../controllers/projectController.js";
import { verify, requireAdmin } from "../controllers/authController.js";
import validator from "../middlewares/validator.js";
import {
  createProjectValidator,
  updateProjectValidator
} from "../validators/projectValidator.js";

const router = Router();

router.use(verify);

router.get("/", requireAdmin, listProjects);
router.get("/:id/statistics", requireAdmin, getProjectStatistics);
router.get("/:id", requireAdmin, showProject);
router.post("/", requireAdmin, validator(createProjectValidator), createProject);
router.put("/:id", requireAdmin, validator(updateProjectValidator), editProject);
router.delete("/:id", requireAdmin, deleteProject);

export default router;
