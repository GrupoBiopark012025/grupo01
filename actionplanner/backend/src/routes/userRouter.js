import { Router } from "express";
import {
  listUsers,
  showUser,
  createUser,
  editUser,
  deleteUser,
  getUserProfile, getUserClients
} from "../controllers/userController.js";
import { 
  verify, 
  requireAdmin 
} from "../controllers/authController.js";
import validator from "../middlewares/validator.js";
import { 
  createUserValidator, 
  updateUserValidator 
} from "../validators/userValidator.js";

const router = Router();

// rota para criar um usuário sem precisar estar logado
router.post("/init", validator(createUserValidator), createUser);

router.use(verify);

router.get("/profile", getUserProfile);
router.get("/", requireAdmin, listUsers);
router.get("/:id", requireAdmin, showUser);
router.post("/", requireAdmin, validator(createUserValidator), createUser);
router.put("/:id", requireAdmin, validator(updateUserValidator), editUser);
router.delete("/:id", requireAdmin, deleteUser);
router.get("/:id/clients", getUserClients);

export default router;