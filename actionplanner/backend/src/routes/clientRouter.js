import { Router } from "express";
import {
  listClients,
  showClient,
  createClient,
  editClient,
  deleteClient
} from "../controllers/clientController.js";
import { verify, requireAdmin } from "../controllers/authController.js";
import validator from "../middlewares/validator.js";
import {
  createClientValidator,
  updateClientValidator
} from "../validators/clientValidator.js";

const router = Router();

router.use(verify);

router.get("/", requireAdmin, listClients);
router.get("/:id", requireAdmin, showClient);
router.post("/", requireAdmin, validator(createClientValidator), createClient);
router.put("/:id", requireAdmin, validator(updateClientValidator), editClient);
router.delete("/:id", requireAdmin, deleteClient);

export default router;
