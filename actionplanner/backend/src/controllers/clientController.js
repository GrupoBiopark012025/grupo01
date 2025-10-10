import { ClientService } from '../services/clientService.js'
import hateoas from '../middlewares/hateoas.js'

export const showClient = async (req, res, next) => {
  /*
  #swagger.tags = ["Clients"]
  #swagger.security = [{"bearerAuth": []}]
  #swagger.responses[200] = {
    description: "Cliente encontrado",
    schema: { $ref: "#/components/schemas/Client" }
  }
  #swagger.responses[404] = { description: "Cliente não encontrado" }
  */
  try {
    const client = await ClientService.findById(req.params.id)
    if (!client) return res.status(404).json({ error: 'Cliente não encontrado' })
    res.hateoas_item(client)
  } catch (err) {
    next(err)
  }
}

export const listClients = async (req, res, next) => {
  /*
  #swagger.tags = ["Clients"]
  #swagger.security = [{"bearerAuth": []}]
  #swagger.parameters['page'] = { in: 'query', type: 'integer', description: 'Número da página' }
  #swagger.parameters['nome'] = { in: 'query', type: 'string', description: 'Filtrar por nome' }
  #swagger.responses[200] = {
    description: "Lista de clientes",
    schema: { $ref: "#/components/schemas/ClientListResponse" }
  }
  */
  try {
    const { page, size, orderBy, ...filters } = req.query
    const pagination = {
      page: parseInt(page) || 1,
      size: parseInt(size) || 10,
      orderBy
    }
    const result = await ClientService.findMany(filters, pagination)
    res.hateoas_list(result.clients, result.totalPages, {
      totalData: result.totalData,
      currentPage: result.currentPage,
      size: result.size
    })
  } catch (err) {
    next(err)
  }
}

export const createClient = async (req, res, next) => {
  /*
  #swagger.tags = ["Clients"]
  #swagger.security = [{"bearerAuth": []}]
  #swagger.requestBody = {
    required: true,
    content: { "application/json": { schema: { $ref: "#/components/schemas/CreateClient" } } }
  }
  #swagger.responses[201] = {
    description: "Cliente criado com sucesso",
    schema: { $ref: "#/components/schemas/Client" }
  }
  #swagger.responses[400] = { description: "Dados inválidos" }
  #swagger.responses[409] = { description: "CNPJ já existe" }
  */
  try {
    const client = await ClientService.create(req.body)
    res.status(201).json(client)
  } catch (err) {
    if (err.code === 'P2002') return res.status(409).json({ error: 'CNPJ já existe' })
    next(err)
  }
}

export const editClient = async (req, res, next) => {
  /*
  #swagger.tags = ["Clients"]
  #swagger.security = [{"bearerAuth": []}]
  #swagger.requestBody = {
    required: true,
    content: { "application/json": { schema: { $ref: "#/components/schemas/UpdateClient" } } }
  }
  #swagger.responses[200] = {
    description: "Cliente atualizado",
    schema: { $ref: "#/components/schemas/Client" }
  }
  #swagger.responses[404] = { description: "Cliente não encontrado" }
  #swagger.responses[409] = { description: "CNPJ já existe" }
  */
  try {
    const client = await ClientService.update(req.params.id, req.body)
    res.hateoas_item(client)
  } catch (err) {
    if (err.code === 'P2025') return res.status(404).json({ error: 'Cliente não encontrado' })
    if (err.code === 'P2002') return res.status(409).json({ error: 'CNPJ já existe' })
    next(err)
  }
}

export const deleteClient = async (req, res, next) => {
  /*
  #swagger.tags = ["Clients"]
  #swagger.security = [{"bearerAuth": []}]
  #swagger.responses[204] = { description: "Cliente excluído" }
  #swagger.responses[404] = { description: "Cliente não encontrado" }
  */
  try {
    await ClientService.softDelete(req.params.id)
    res.status(204).send()
  } catch (err) {
    if (err.code === 'P2025') return res.status(404).json({ error: 'Cliente não encontrado' })
    next(err)
  }
}
