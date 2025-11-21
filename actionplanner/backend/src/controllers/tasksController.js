import { TasksService } from "../services/tasksService.js";
import { TaskLogService } from "../services/taskLogService.js";
import { TaskCommentService } from "../services/taskCommentService.js";

export const getAvailableActionPlans = async (req, res, next) => {
  try {
    const actionPlans = await TasksService.getAvailableActionPlans(
      req.user.clienteId
    );
    return res.status(200).json(actionPlans);
  } catch (error) {
    next(error);
  }
};

export const showTask = async (req, res, next) => {
  /*
  #swagger.tags = ["Tasks"]
  #swagger.security = [{"bearerAuth": []}]
  #swagger.responses[200] = {
    description: "Task encontrada",
    schema: { $ref: "#/components/schemas/Task" }
  }
  #swagger.responses[404] = {
    description: "Task não encontrada"
  }
]  #swagger.responses[403] = {
    description: "Acesso negado"
  }
  */
  try {
    const task = await TasksService.findById(
      req.params.id,
      req.user.id,
      req.user.onlyAttachedTasks
    );

    if (!task) {
      return res.status(404).json({ error: "Task não encontrada" });
    }

    // Verifica se a task pertence ao cliente atual do usuário
    if (task.clienteId !== req.user.clienteId) {
      return res.status(403).json({ error: "Acesso negado a esta tarefa" });
    }

    return res.status(200).json(task);
  } catch (error) {
    next(error);
  }
};

export const listTasks = async (req, res, next) => {
  /*
  #swagger.tags = ["Tasks"]
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
    description: 'Campo para ordenação (ex: title, -createdAt)',
    type: 'string'
  }
  #swagger.parameters['title'] = {
    in: 'query',
    description: 'Filtrar por título',
    type: 'string'
  }
  #swagger.parameters['status'] = {
    in: 'query',
    description: 'Filtrar por status',
    enum: ['PENDENTE', 'EM_ANDAMENTO', 'CONCLUIDA', 'CANCELADA']
  }
  #swagger.parameters['priority'] = {
    in: 'query',
    description: 'Filtrar por prioridade',
    enum: ['BAIXA', 'MEDIA', 'ALTA', 'URGENTE']
  }
  #swagger.parameters['dueDate'] = {
    in: 'query',
    description: 'Filtrar por data de vencimento',
    type: 'string',
    format: 'date'
  }
  #swagger.parameters['projectId'] = {
    in: 'query',
    description: 'Filtrar por ID do projeto',
    type: 'integer'
  }
  #swagger.parameters['clienteId'] = {
    in: 'query',
    description: 'Filtrar por ID do cliente',
    type: 'integer'
  }
  #swagger.parameters['sectorId'] = {
    in: 'query',
    description: 'Filtrar por ID do setor',
    type: 'integer'
  }
  #swagger.parameters['userResponsibleId'] = {
    in: 'query',
    description: 'Filtrar por ID do usuário responsável',
    type: 'integer'
  }
  #swagger.parameters['userCreatedId'] = {
    in: 'query',
    description: 'Filtrar por ID do usuário criador',
    type: 'integer'
  }
  #swagger.responses[200] = {
    description: "Lista de tasks",
    schema: {
      type: "object",
      properties: {
        tasks: {
          type: "array",
          items: { $ref: "#/components/schemas/Task" }
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
      _order,
    };

    const result = await TasksService.findMany(
      filters,
      pagination,
      req.user.id,
      req.user.onlyAttachedTasks,
      req.user.clienteId
    );
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const createTask = async (req, res, next) => {
  /*
  #swagger.tags = ["Tasks"]
  #swagger.security = [{"bearerAuth": []}]
  #swagger.requestBody = {
    required: true,
    content: {
      "application/json": {
        schema: { $ref: "#/components/schemas/CreateTask" }
      }
    }
  }
  #swagger.responses[201] = {
    description: "Task criada com sucesso",
    schema: { $ref: "#/components/schemas/Task" }
  }
  #swagger.responses[400] = {
    description: "Dados inválidos"
  }
  #swagger.responses[403] = {
    description: "Acesso negado ao cliente especificado"
  }
  */
  try {
    if (req.body.clienteId && req.body.clienteId !== req.user.clienteId) {
      return res.status(403).json({
        error:
          "Você só pode criar tarefas para o cliente do seu ambiente atual",
      });
    }

    req.body.clienteId = req.user.clienteId;

    const task = await TasksService.create(req.body, req.user.id);
    return res.status(201).json(task);
  } catch (error) {
    console.error("ERRO ao criar task:", error);
    next(error);
  }
};

export const editTask = async (req, res, next) => {
  /*
  #swagger.tags = ["Tasks"]
  #swagger.security = [{"bearerAuth": []}]
  #swagger.requestBody = {
    required: true,
    content: {
      "application/json": {
        schema: { $ref: "#/components/schemas/UpdateTask" }
      }
    }
  }
  #swagger.responses[200] = {
    description: "Task atualizada com sucesso",
    schema: { $ref: "#/components/schemas/Task" }
  }
  #swagger.responses[404] = {
    description: "Task não encontrada"
  }
  #swagger.responses[403] = {
    description: "Acesso negado"
  }
  */
  try {
    const existingTask = await TasksService.findById(
      req.params.id,
      req.user.id,
      req.user.onlyAttachedTasks
    );

    if (!existingTask) {
      return res.status(404).json({ error: "Task não encontrada" });
    }

    if (existingTask.clienteId !== req.user.clienteId) {
      return res.status(403).json({ error: "Acesso negado a esta tarefa" });
    }

    delete req.body.clienteId;
    delete req.body.userCreatedId;

    // Detectar mudanças e criar logs
    const changes = [];

    if (req.body.status && req.body.status !== existingTask.status) {
      changes.push({
        action: "STATUS_CHANGED",
        field: "status",
        oldValue: existingTask.status,
        newValue: req.body.status,
        description: `Status alterado de ${existingTask.status} para ${req.body.status}`,
      });
    }

    if (req.body.priority && req.body.priority !== existingTask.priority) {
      changes.push({
        action: "PRIORITY_CHANGED",
        field: "priority",
        oldValue: existingTask.priority,
        newValue: req.body.priority,
        description: `Prioridade alterada de ${existingTask.priority} para ${req.body.priority}`,
      });
    }

    if (
      req.body.userResponsibleId &&
      req.body.userResponsibleId !== existingTask.userResponsibleId
    ) {
      changes.push({
        action: "RESPONSIBLE_CHANGED",
        field: "userResponsibleId",
        oldValue: existingTask.userResponsibleId,
        newValue: req.body.userResponsibleId,
        description: "Responsável alterado",
      });
    }

    // ✅ CORRIGINDO O NOME DO MÉTODO AQUI
    const updatedTask = await TasksService.updateTask(
      req.params.id,
      req.body,
      req.user.id,
      req.user.onlyAttachedTasks
    );

    // Criar logs para cada mudança
    for (const change of changes) {
      await TaskLogService.createLog({
        taskId: req.params.id,
        userId: req.user.id,
        ...change,
      });
    }

    return res.status(200).json(updatedTask);
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Task não encontrada" });
    }
    if (
      error.message === "Você só pode editar tarefas das quais é responsável"
    ) {
      return res.status(403).json({ error: error.message });
    }
    next(error);
  }
};

export const deleteTask = async (req, res, next) => {
  /*
  #swagger.tags = ["Tasks"]
  #swagger.security = [{"bearerAuth": []}]
  #swagger.responses[204] = {
    description: "Task excluída com sucesso"
  }
  #swagger.responses[404] = {
    description: "Task não encontrada"
  }
  #swagger.responses[403] = {
    description: "Acesso negado"
  }
  */
  try {
    // Verifica se a task existe e se pertence ao cliente atual
    const existingTask = await TasksService.findById(
      req.params.id,
      req.user.id,
      req.user.onlyAttachedTasks
    );

    if (!existingTask) {
      return res.status(404).json({ error: "Task não encontrada" });
    }

    if (existingTask.clienteId !== req.user.clienteId) {
      return res.status(403).json({ error: "Acesso negado a esta tarefa" });
    }

    await TasksService.delete(
      req.params.id,
      req.user.id,
      req.user.onlyAttachedTasks,
      req.user.isAdmin
    );

    return res.status(204).send();
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Task não encontrada" });
    }
    if (
      error.message === "Você só pode deletar tarefas das quais é responsável"
    ) {
      return res.status(403).json({ error: error.message });
    }
    next(error);
  }
};

export const getAvailableResponsibles = async (req, res, next) => {
  /*
  #swagger.tags = ["Tasks"]
  #swagger.security = [{"bearerAuth": []}]
  #swagger.responses[200] = {
    description: "Lista de usuários disponíveis para serem responsáveis",
    schema: {
      type: "array",
      items: {
        type: "object",
        properties: {
          id: { type: "integer" },
          nome: { type: "string" },
          email: { type: "string" },
          accessLevel: { type: "string" }
        }
      }
    }
  }
  */
  try {
    const users = await TasksService.getAvailableResponsibles(
      req.user.clienteId
    );
    return res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

export const getTaskLogs = async (req, res, next) => {
  try {
    const task = await TasksService.findById(
      req.params.id,
      req.user.id,
      req.user.onlyAttachedTasks
    );

    if (!task || task.clienteId !== req.user.clienteId) {
      return res.status(404).json({ error: "Task não encontrada" });
    }

    const logs = await TaskLogService.getTaskLogs(req.params.id);
    return res.status(200).json(logs);
  } catch (error) {
    next(error);
  }
};

export const getTaskComments = async (req, res, next) => {
  try {
    const task = await TasksService.findById(
      req.params.id,
      req.user.id,
      req.user.onlyAttachedTasks
    );

    if (!task || task.clienteId !== req.user.clienteId) {
      return res.status(404).json({ error: "Task não encontrada" });
    }

    const comments = await TaskCommentService.getTaskComments(req.params.id);
    return res.status(200).json(comments);
  } catch (error) {
    next(error);
  }
};

export const createTaskComment = async (req, res, next) => {
  try {
    const task = await TasksService.findById(
      req.params.id,
      req.user.id,
      req.user.onlyAttachedTasks
    );

    if (!task || task.clienteId !== req.user.clienteId) {
      return res.status(404).json({ error: "Task não encontrada" });
    }

    const comment = await TaskCommentService.create(
      req.params.id,
      req.user.id,
      req.body.content
    );

    // Criar log
    // await TaskLogService.createLog({
    //   taskId: req.params.id,
    //   userId: req.user.id,
    //   action: "COMMENT_ADDED",
    //   description: "Comentário adicionado",
    // });

    return res.status(201).json(comment);
  } catch (error) {
    next(error);
  }
};

export const deleteTaskComment = async (req, res, next) => {
  try {
    await TaskCommentService.delete(
      req.params.commentId,
      req.user.id,
      req.user.isAdmin
    );

    return res.status(204).send();
  } catch (error) {
    if (error.message.includes("não encontrado")) {
      return res.status(404).json({ error: error.message });
    }
    if (error.message.includes("só pode deletar")) {
      return res.status(403).json({ error: error.message });
    }
    next(error);
  }
};

export const getTaskTimeline = async (req, res, next) => {
  try {
    const task = await TasksService.findById(
      req.params.id,
      req.user.id,
      req.user.onlyAttachedTasks
    );

    if (!task || task.clienteId !== req.user.clienteId) {
      return res.status(404).json({ error: "Task não encontrada" });
    }

    const [comments, logs] = await Promise.all([
      TaskCommentService.getTaskComments(req.params.id),
      TaskLogService.getTaskLogs(req.params.id),
    ]);

    // Combina e ordena por data
    const timeline = [
      ...comments.map((c) => ({ ...c, type: "COMMENT" })),
      ...logs.map((l) => ({ ...l, type: "LOG" })),
    ].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return res.status(200).json(timeline);
  } catch (error) {
    next(error);
  }
};
