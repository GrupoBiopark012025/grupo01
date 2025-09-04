import { UserService } from '../services/userService.js';

export const showUser = async (req, res, next) => {
  /*
  #swagger.tags = ["Users"]
  #swagger.security = [{"bearerAuth": []}]
  #swagger.responses[200] = {
    description: "Usuário encontrado",
    schema: { $ref: "#/components/schemas/User" }
  }
  #swagger.responses[404] = {
    description: "Usuário não encontrado"
  }
  */
  try {
    const user = await UserService.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    const { password, ...userWithoutPassword } = user;
    
    res.hateoas_item(userWithoutPassword);
  } catch (err) {
    next(err);
  }
};

export const listUsers = async (req, res, next) => {
  /*
  #swagger.tags = ["Users"]
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
    description: 'Campo para ordenação',
    type: 'string'
  }
  #swagger.parameters['nome'] = {
    in: 'query',
    description: 'Filtrar por nome',
    type: 'string'
  }
  #swagger.parameters['email'] = {
    in: 'query',
    description: 'Filtrar por email',
    type: 'string'
  }
  #swagger.parameters['status'] = {
    in: 'query',
    description: 'Filtrar por status',
    enum: ['ATIVO', 'INATIVO']
  }
  #swagger.parameters['accessLevel'] = {
    in: 'query',
    description: 'Filtrar por nível de acesso',
    enum: ['ADMIN', 'CONSULTOR', 'GESTOR_CLIENTE', 'COLABORADOR_CLIENTE']
  }
  #swagger.responses[200] = {
    description: "Lista de usuários",
    schema: {
      type: "object",
      properties: {
        users: {
          type: "array",
          items: { $ref: "#/components/schemas/User" }
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
    const { _page, _size, _order, ...filters } = req.query;
    const pagination = {
      page: parseInt(_page) || 1,
      size: parseInt(_size) || 10,
      _order
    };

    const result = await UserService.findMany(filters, pagination);
    
    const usersWithoutPassword = result.users.map(user => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });

    res.hateoas_list(usersWithoutPassword, result.totalPages, {
      totalData: result.totalData,
      currentPage: result.currentPage,
      size: result.size
    });
  } catch (err) {
    next(err);
  }
};

export const createUser = async (req, res, next) => {
  /*
  #swagger.tags = ["Users"]
  #swagger.security = [{"bearerAuth": []}]
  #swagger.requestBody = {
    required: true,
    content: {
      "application/json": {
        schema: { $ref: "#/components/schemas/CreateUser" }
      }
    }
  }
  #swagger.responses[201] = {
    description: "Usuário criado com sucesso",
    schema: { $ref: "#/components/schemas/User" }
  }
  #swagger.responses[400] = {
    description: "Dados inválidos"
  }
  #swagger.responses[409] = {
    description: "Email já existe"
  }
  */
  try {
    const userData = req.body;
    
    const user = await UserService.create(userData);
    
    const { password, ...userWithoutPassword } = user;
    
    res.status(201).json(userWithoutPassword);
  } catch (err) {
    if (err.code === 'P2002') {
      return res.status(409).json({ error: 'Email já existe' });
    }
    next(err);
  }
};

export const editUser = async (req, res, next) => {
  /*
  #swagger.tags = ["Users"]
  #swagger.security = [{"bearerAuth": []}]
  #swagger.requestBody = {
    required: true,
    content: {
      "application/json": {
        schema: { $ref: "#/components/schemas/UpdateUser" }
      }
    }
  }
  #swagger.responses[200] = {
    description: "Usuário atualizado",
    schema: { $ref: "#/components/schemas/User" }
  }
  #swagger.responses[404] = {
    description: "Usuário não encontrado"
  }
  */
  try {
    const userData = req.body;
    
    const user = await UserService.update(req.params.id, userData);
    
    // Remover senha do retorno
    const { password, ...userWithoutPassword } = user;
    
    res.hateoas_item(userWithoutPassword);
  } catch (err) {
    if (err.code === 'P2025') {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    if (err.code === 'P2002') {
      return res.status(409).json({ error: 'Email já existe' });
    }
    next(err);
  }
};

export const deleteUser = async (req, res, next) => {
  /*
  #swagger.tags = ["Users"]
  #swagger.security = [{"bearerAuth": []}]
  #swagger.responses[204] = {
    description: "Usuário excluído"
  }
  #swagger.responses[404] = {
    description: "Usuário não encontrado"
  }
  */
  try {
    await UserService.softDelete(req.params.id);
    res.status(204).send();
  } catch (err) {
    if (err.code === 'P2025') {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    next(err);
  }
};

export const getUserProfile = async (req, res, next) => {
  /*
  #swagger.tags = ["Users"]
  #swagger.security = [{"bearerAuth": []}]
  #swagger.responses[200] = {
    description: "Perfil do usuário logado",
    schema: { $ref: "#/components/schemas/UserProfile" }
  }
  */
  try {
    const user = await UserService.findById(req.user.id);
    const accessibleClients = await UserService.getUserAccessibleClients(req.user.id);
    
    // Remover senha do retorno
    const { password, ...userWithoutPassword } = user;
    
    res.json({
      ...userWithoutPassword,
      clientes: accessibleClients
    });
  } catch (err) {
    next(err);
  }
};