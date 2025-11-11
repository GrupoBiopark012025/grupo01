import { ImportActionPlanService } from "../services/importActionPlanService.js";

export const importActionPlan = async (req, res, next) => {
  /*
  #swagger.tags = ["Import Action Plan"]
  #swagger.security = [{"bearerAuth": []}]
  #swagger.requestBody = {
    required: true,
    content: {
      "multipart/form-data": {
        schema: {
          type: "object",
          required: ["file"],
          properties: {
            file: {
              type: "string",
              format: "binary",
              description: "Arquivo Excel (.xlsx) contendo o plano de ação na primeira linha e as tarefas nas demais linhas"
            }
          }
        }
      }
    }
  }
  #swagger.responses[201] = {
    description: "Plano de ação importado com sucesso",
    content: {
      "application/json": {
        schema: { $ref: "#/components/schemas/ImportActionPlanResponse" }
      }
    }
  }
  #swagger.responses[400] = {
    description: "Erro de validação ou arquivo inválido",
    content: {
      "application/json": {
        schema: { $ref: "#/components/schemas/ImportActionPlanError" }
      }
    }
  }
  #swagger.responses[401] = {
    description: "Não autenticado",
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            error: { 
              type: "string",
              example: "Usuário não autenticado. É necessário estar logado para importar planos de ação"
            }
          }
        }
      }
    }
  }
  */
  try {
    // Verificar se o arquivo foi enviado
    if (!req.file) {
      return res.status(400).json({ 
        error: "Arquivo Excel não fornecido. Envie o arquivo no campo 'file'" 
      });
    }

    // Verificar se é um arquivo Excel
    const allowedMimeTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
      'application/vnd.ms-excel', // .xls
      'application/octet-stream' // Alguns sistemas enviam assim
    ];

    if (!allowedMimeTypes.includes(req.file.mimetype) && 
        !req.file.originalname.match(/\.(xlsx|xls)$/i)) {
      return res.status(400).json({ 
        error: "Formato de arquivo inválido. Apenas arquivos Excel (.xlsx, .xls) são aceitos" 
      });
    }

    // Obter o ID do usuário que está criando (do token/localStorage)
    const userCreatedId = req.user?.id;
    
    if (!userCreatedId) {
      return res.status(401).json({ 
        error: "Usuário não autenticado. É necessário estar logado para importar planos de ação" 
      });
    }

    // Processar o arquivo Excel
    const fileBuffer = req.file.buffer;

    // Importar o plano de ação
    const actionPlan = await ImportActionPlanService.importFromExcel(fileBuffer, userCreatedId);

    return res.status(201).json({
      message: "Plano de ação importado com sucesso",
      data: actionPlan
    });
  } catch (error) {
    // Erros de validação retornam 400
    if (error.message.includes("obrigatório") || 
        error.message.includes("não encontrado") ||
        error.message.includes("inválid") ||
        error.message.includes("vazio") ||
        error.message.includes("validação")) {
      return res.status(400).json({ 
        error: error.message 
      });
    }

    // Outros erros vão para o middleware de erro
    next(error);
  }
};

