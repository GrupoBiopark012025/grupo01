import { Router } from "express";
import validator from "../middlewares/validator.js";
import * as sectorController from "../controllers/sectorController.js";

const router = Router();

// Listar setores
router.get('/', sectorController.listSectors);

// Criar novo setor
router.post('/', sectorController.createSector);

// Obter estatísticas do setor
router.get('/:id/statistics', sectorController.getSectorStatistics);

// Buscar setor por ID
router.get('/:id', sectorController.showSector);

// Atualizar setor 
router.patch('/:id', sectorController.editSector);

export default router;