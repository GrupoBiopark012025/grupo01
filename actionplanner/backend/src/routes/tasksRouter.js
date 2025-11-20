import { Router } from "express";
import {
    listTasks,
    showTask,
    createTask,
    editTask,
    deleteTask,
    getAvailableResponsibles
} from "../controllers/tasksController.js";
import { verify } from "../controllers/authController.js";
import validator from "../middlewares/validator.js";
import { createTaskValidator, updateTaskValidator } from "../validators/tasksValidator.js";

const router = Router();

// Rotas específicas primeiro (antes das rotas com parâmetros)
router.get("/available-responsibles", verify, getAvailableResponsibles);

// Rotas com parâmetros depois
router.get("/", verify, listTasks);
router.get("/:id", verify, showTask);
router.post("/", verify, validator(createTaskValidator), createTask);
router.put("/:id", verify, validator(updateTaskValidator), editTask);
router.delete("/:id", verify, deleteTask);

export default router;