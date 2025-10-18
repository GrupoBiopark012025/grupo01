import { ActionPlanService } from "../services/actionPlanService.js";

export const listActionPlans = async (req, res, next) => {
  /*
  #swagger.tags = ["Action Plans"]
  #swagger.security = [{"bearerAuth": []}]
  #swagger.parameters['page'] = {
    in: 'query',
    description: 'Número da página',
    type: 'integer'
  }
  #swagger.parameters['size'] = {
    in: 'query',
    description: 'Tamanho da página',
    type: 'integer'
  }
  #swagger.parameters['_order'] = {
    in: 'query',
    description: 'Campo para ordenação (ex: numero, -inicio)',
    type: 'string'
  }
  #swagger.parameters['projectId'] = {
    in: 'query',
    description: 'Filtrar por ID do projeto',
    type: 'integer'
  }
  #swagger.parameters['numero'] = {
    in: 'query',
    description: 'Filtrar por número do plano (Nº)',
    type: 'string'
  }
  #swagger.parameters['oQue'] = {
    in: 'query',
    description: 'Filtrar por O QUE?',
    type: 'string'
  }
  #swagger.parameters['como'] = {
    in: 'query',
    description: 'Filtrar por COMO?',
    type: 'string'
  }
  #swagger.parameters['responsavel'] = {
    in: 'query',
    description: 'Filtrar por RESPONSÁVEL',
    type: 'string'
  }
  #swagger.parameters['status'] = {
    in: 'query',
    description: 'Filtrar por STATUS',
    type: 'string'
  }
  #swagger.parameters['inicio'] = {
    in: 'query',
    description: 'Filtrar por INÍCIO (maior ou igual)',
    type: 'string',
    format: 'date'
  }
  #swagger.parameters['fim'] = {
    in: 'query',
    description: 'Filtrar por FIM (menor ou igual)',
    type: 'string',
    format: 'date'
  }
  #swagger.responses[200] = {
    description: "Lista de planos de ação",
    schema: {
      type: "object",
      properties: {
        actionPlans: {
          type: "array",
          items: { $ref: "#/components/schemas/ActionPlan" }
        },
        totalData: { type: "integer" },
        totalPages: { type: "integer" },
        currentPage: { type: "integer" },
        size: { type: "integer" }
      }
    }
  }
  */
  try {
    const { page, size, _order, ...filters } = req.query;
    const pagination = {
      page: page ? parseInt(page) : 1,
      size: size ? parseInt(size) : 10,
      _order
    };

    const result = await ActionPlanService.findMany(filters, pagination);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const showActionPlan = async (req, res, next) => {
  /*
  #swagger.tags = ["Action Plans"]
  #swagger.security = [{"bearerAuth": []}]
  #swagger.responses[200] = {
    description: "Plano de ação encontrado",
    schema: { $ref: "#/components/schemas/ActionPlan" }
  }
  #swagger.responses[404] = {
    description: "Plano de ação não encontrado"
  }
  */
  try {
    const actionPlan = await ActionPlanService.findById(req.params.id);
    if (!actionPlan) {
      return res.status(404).json({ error: "Plano de ação não encontrado" });
    }
    return res.status(200).json(actionPlan);
  } catch (error) {
    next(error);
  }
};

export const createActionPlan = async (req, res, next) => {
  /*
  #swagger.tags = ["Action Plans"]
  #swagger.security = [{"bearerAuth": []}]
  #swagger.requestBody = {
    required: true,
    content: {
      "application/json": {
        schema: { $ref: "#/components/schemas/CreateActionPlan" }
      }
    }
  }
  #swagger.responses[201] = {
    description: "Plano de ação criado com sucesso",
    schema: { $ref: "#/components/schemas/ActionPlan" }
  }
  #swagger.responses[400] = {
    description: "Dados inválidos"
  }
  */
  try {
    const actionPlan = await ActionPlanService.create(req.body);
    return res.status(201).json(actionPlan);
  } catch (error) {
    next(error);
  }
};

export const updateActionPlan = async (req, res, next) => {
  /*
  #swagger.tags = ["Action Plans"]
  #swagger.security = [{"bearerAuth": []}]
  #swagger.requestBody = {
    required: true,
    content: {
      "application/json": {
        schema: { $ref: "#/components/schemas/UpdateActionPlan" }
      }
    }
  }
  #swagger.responses[200] = {
    description: "Plano de ação atualizado com sucesso",
    schema: { $ref: "#/components/schemas/ActionPlan" }
  }
  #swagger.responses[404] = {
    description: "Plano de ação não encontrado"
  }
  #swagger.responses[400] = {
    description: "Dados inválidos"
  }
  */
  try {
    const updatedActionPlan = await ActionPlanService.update(req.params.id, req.body);
    return res.status(200).json(updatedActionPlan);
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Plano de ação não encontrado' });
    }
    next(error);
  }
};

export const inactiveActionPlan = async (req, res, next) => {
  /*
  #swagger.tags = ["Action Plans"]
  #swagger.security = [{"bearerAuth": []}]
  #swagger.responses[200] = {
    description: "Plano de ação inativado com sucesso. Todas as tarefas relacionadas foram canceladas.",
    schema: { $ref: "#/components/schemas/ActionPlan" }
  }
  #swagger.responses[404] = {
    description: "Plano de ação não encontrado"
  }
  */
  try {
    const inactivatedActionPlan = await ActionPlanService.inactive(req.params.id);
    return res.status(200).json({
      message: "Plano de ação inativado com sucesso. Todas as tarefas relacionadas foram canceladas.",
      data: inactivatedActionPlan
    });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Plano de ação não encontrado' });
    }
    next(error);
  }
};
