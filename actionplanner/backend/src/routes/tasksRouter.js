import { Router } from "express";
import {
    listTasks,
    showTask,
    createTask,
    editTask,
    deleteTask
} from "../controllers/tasksController.js";
import { verify } from "../controllers/authController.js";
import validator from "../middlewares/validator.js";

const router = Router();

router.get("/", verify, listTasks);
router.get("/:id", verify, showTask);
router.post("/", verify, createTask);
router.put("/:id", verify, editTask);
router.delete("/:id", verify, deleteTask);

export default router;