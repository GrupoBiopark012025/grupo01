import { Router } from "express";
import multer from "multer";
import { importActionPlan } from "../controllers/importActionPlanController.js";
import { verify } from "../controllers/authController.js";

const router = Router();

// Configurar multer para receber arquivos em memória
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB
  },
  fileFilter: (req, file, cb) => {
    // Aceitar apenas arquivos Excel
    const allowedExtensions = ['.xlsx', '.xls'];
    const fileExtension = file.originalname.toLowerCase().substring(file.originalname.lastIndexOf('.'));
    
    if (allowedExtensions.includes(fileExtension)) {
      cb(null, true);
    } else {
      cb(new Error('Apenas arquivos Excel (.xlsx, .xls) são permitidos'), false);
    }
  }
});

// Rota de importação de plano de ação
router.post("/actionPlan", verify, upload.single("file"), importActionPlan);

export default router;

