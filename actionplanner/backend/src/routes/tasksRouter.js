import { Router } from "express";
import {
    listTasks,
    showTask,
    createTask,
    editTask,
    deleteTask,
    getAvailableResponsibles,
    getAvailableActionPlans,
    getTaskComments,
    getTaskLogs,
    createTaskComment,
    deleteTaskComment,
    getTaskTimeline
} from "../controllers/tasksController.js";
import { verify } from "../controllers/authController.js";
import validator from "../middlewares/validator.js";
import { createTaskValidator, updateTaskValidator } from "../validators/tasksValidator.js";
import { createTaskCommentValidator } from "../validators/taskCommentValidator.js";

const router = Router();

// Rotas específicas primeiro (antes das rotas com parâmetros)
router.get("/available-responsibles", verify, getAvailableResponsibles);
router.get("/available-action-plans", verify, getAvailableActionPlans);

// Logs de tarefas e comentários
router.get("/:id/logs", verify, getTaskLogs);
router.get("/:id/comments", verify, getTaskComments);
router.get("/:id/timeline", verify, getTaskTimeline);
router.post("/:id/comments", verify, validator(createTaskCommentValidator), createTaskComment);
router.delete("/:id/comments/:commentId", verify, deleteTaskComment);

// Rotas com parâmetros depois
router.get("/", verify, listTasks);
router.get("/:id", verify, showTask);
router.post("/", verify, validator(createTaskValidator), createTask);
router.put("/:id", verify, validator(updateTaskValidator), editTask);
router.delete("/:id", verify, deleteTask);

export default router;