import { ProjectService } from '../services/projectService.js';

export const showProject = async (req, res, next) => {
  /*
  #swagger.tags = ["Projects"]
  #swagger.security = [{"bearerAuth": []}]
  #swagger.responses[200] = {
    description: "Projeto encontrado",
    schema: { $ref: "#/components/schemas/Project" }
  }
  #swagger.responses[404] = {
    description: "Projeto não encontrado"
  }
  */
  try {
    const project = await ProjectService.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({ error: 'Projeto não encontrado' });
    }
    
    res.json(project);
  } catch (err) {
    next(err);
  }
};

export const listProjects = async (req, res, next) => {
  /*
  #swagger.tags = ["Projects"]
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
  #swagger.parameters['orderBy'] = {
    in: 'query',
    description: 'Campo para ordenação (ex: name, -name para desc)',
    type: 'string'
  }
  #swagger.parameters['name'] = {
    in: 'query',
    description: 'Filtrar por nome',
    type: 'string'
  }
  #swagger.parameters['description'] = {
    in: 'query',
    description: 'Filtrar por descrição',
    type: 'string'
  }
  #swagger.parameters['status'] = {
    in: 'query',
    description: 'Filtrar por status',
    enum: ['ATIVO', 'INATIVO']
  }
  #swagger.responses[200] = {
    description: "Lista de projetos",
    schema: {
      type: "object",
      properties: {
        projects: {
          type: "array",
          items: { $ref: "#/components/schemas/Project" }
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
    const { page, size, orderBy, ...filters } = req.query;
    const pagination = {
      page: parseInt(page) || 1,
      size: parseInt(size) || 10,
      orderBy: orderBy || 'name'
    };

    const result = await ProjectService.findMany(filters, pagination);

    res.json(result);
  } catch (err) {
    next(err);
  }
};

export const createProject = async (req, res, next) => {
  /*
  #swagger.tags = ["Projects"]
  #swagger.security = [{"bearerAuth": []}]
  #swagger.requestBody = {
    required: true,
    content: {
      "application/json": {
        schema: { $ref: "#/components/schemas/CreateProject" }
      }
    }
  }
  #swagger.responses[201] = {
    description: "Projeto criado com sucesso",
    schema: { $ref: "#/components/schemas/Project" }
  }
  #swagger.responses[400] = {
    description: "Dados inválidos"
  }
  #swagger.responses[409] = {
    description: "Nome já existe"
  }
  */
  try {
    const projectData = req.body;
    
    // Verificar duplicatas
    const nameExists = await ProjectService.existsByName(projectData.name);
    if (nameExists) {
      return res.status(409).json({ error: 'Já existe um projeto com este nome' });
    }
    
    const project = await ProjectService.create({
      name: projectData.name,
      description: projectData.description || null
    });
    
    res.status(201).json(project);
  } catch (err) {
    if (err.code === 'P2002') {
      return res.status(409).json({ error: 'Nome já existe' });
    }
    next(err);
  }
};

export const editProject = async (req, res, next) => {
  /*
  #swagger.tags = ["Projects"]
  #swagger.security = [{"bearerAuth": []}]
  #swagger.requestBody = {
    required: true,
    content: {
      "application/json": {
        schema: { $ref: "#/components/schemas/UpdateProject" }
      }
    }
  }
  #swagger.responses[200] = {
    description: "Projeto atualizado",
    schema: { $ref: "#/components/schemas/Project" }
  }
  #swagger.responses[400] = {
    description: "Dados inválidos"
  }
  #swagger.responses[404] = {
    description: "Projeto não encontrado"
  }
  #swagger.responses[409] = {
    description: "Nome já existe"
  }
  */
  try {
    const { id } = req.params;
    const projectData = req.body;
    
    // Verificar se projeto existe
    const existingProject = await ProjectService.findById(id);
    if (!existingProject) {
      return res.status(404).json({ error: 'Projeto não encontrado' });
    }
    
    // Verificar duplicatas (excluindo o próprio registro)
    if (projectData.name) {
      const nameExists = await ProjectService.existsByName(projectData.name, id);
      if (nameExists) {
        return res.status(409).json({ error: 'Já existe um projeto com este nome' });
      }
    }
    
    const updateData = {};
    if (projectData.name !== undefined) updateData.name = projectData.name;
    if (projectData.description !== undefined) updateData.description = projectData.description;
    if (projectData.status !== undefined) updateData.status = projectData.status;
    
    const project = await ProjectService.update(id, updateData);
    
    res.json(project);
  } catch (err) {
    if (err.code === 'P2025') {
      return res.status(404).json({ error: 'Projeto não encontrado' });
    }
    if (err.code === 'P2002') {
      return res.status(409).json({ error: 'Nome já existe' });
    }
    next(err);
  }
};

export const deleteProject = async (req, res, next) => {
  /*
  #swagger.tags = ["Projects"]
  #swagger.security = [{"bearerAuth": []}]
  #swagger.responses[200] = {
    description: "Projeto inativado com sucesso",
    schema: { $ref: "#/components/schemas/Project" }
  }
  #swagger.responses[404] = {
    description: "Projeto não encontrado"
  }
  #swagger.responses[400] = {
    description: "Não é possível excluir projeto com planos de ação associados"
  }
  */
  try {
    const project = await ProjectService.softDelete(req.params.id);
    res.json(project);
  } catch (err) {
    if (err.code === 'P2025') {
      return res.status(404).json({ error: 'Projeto não encontrado' });
    }
    next(err);
  }
};

export const getProjectStatistics = async (req, res, next) => {
  /*
  #swagger.tags = ["Projects"]
  #swagger.security = [{"bearerAuth": []}]
  #swagger.responses[200] = {
    description: "Estatísticas do projeto",
    schema: {
      type: "object",
      properties: {
        projectId: { type: "integer" },
        projectName: { type: "string" },
        totalActionPlans: { type: "integer" },
        totalTasks: { type: "integer" },
        activeTasks: { type: "integer" },
        completedTasks: { type: "integer" },
        canceledTasks: { type: "integer" },
        completionRate: { type: "string" }
      }
    }
  }
  #swagger.responses[404] = {
    description: "Projeto não encontrado"
  }
  */
  try {
    const { id } = req.params;
    
    const statistics = await ProjectService.getStatistics(id);
    
    if (!statistics) {
      return res.status(404).json({ error: 'Projeto não encontrado' });
    }
    
    res.json(statistics);
  } catch (err) {
    next(err);
  }
};