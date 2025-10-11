import { SectorService } from '../services/sectorService.js';
import { Sector } from '../models/Sector.js';

export const showSector = async (req, res, next) => {
  /*
  #swagger.tags = ["Sectors"]
  #swagger.security = [{"bearerAuth": []}]
  #swagger.responses[200] = {
    description: "Setor encontrado",
    schema: { $ref: "#/components/schemas/Sector" }
  }
  #swagger.responses[404] = {
    description: "Setor não encontrado"
  }
  */
  try {
    const sector = await SectorService.findById(req.params.id);
    
    if (!sector) {
      return res.status(404).json({ error: 'Setor não encontrado' });
    }
    
    res.hateoas_item(sector);
  } catch (err) {
    next(err);
  }
};

export const listSectors = async (req, res, next) => {
  /*
  #swagger.tags = ["Sectors"]
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
  #swagger.parameters['acronym'] = {
    in: 'query',
    description: 'Filtrar por sigla',
    type: 'string'
  }
  #swagger.parameters['status'] = {
    in: 'query',
    description: 'Filtrar por status',
    enum: ['ativo', 'inativo']
  }
  #swagger.parameters['color'] = {
    in: 'query',
    description: 'Filtrar por cor',
    type: 'string'
  }
  #swagger.responses[200] = {
    description: "Lista de setores",
    schema: {
      type: "object",
      properties: {
        sectors: {
          type: "array",
          items: { $ref: "#/components/schemas/Sector" }
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

    const result = await SectorService.findMany(filters, pagination);

    res.hateoas_list(result.sectors, result.totalPages, {
      totalData: result.totalData,
      currentPage: result.currentPage,
      size: result.size
    });
  } catch (err) {
    next(err);
  }
};

export const createSector = async (req, res, next) => {
  /*
  #swagger.tags = ["Sectors"]
  #swagger.security = [{"bearerAuth": []}]
  #swagger.requestBody = {
    required: true,
    content: {
      "application/json": {
        schema: { $ref: "#/components/schemas/CreateSector" }
      }
    }
  }
  #swagger.responses[201] = {
    description: "Setor criado com sucesso",
    schema: { $ref: "#/components/schemas/Sector" }
  }
  #swagger.responses[400] = {
    description: "Dados inválidos"
  }
  #swagger.responses[409] = {
    description: "Nome ou sigla já existe"
  }
  */
  try {
    const sectorData = req.body;
    
    // Validar com o modelo
    const sectorModel = new Sector(sectorData);
    sectorModel.normalizeAcronym();
    sectorModel.normalizeName();
    
    const errors = sectorModel.validate();
    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }
    
    // Verificar duplicatas
    const nameExists = await SectorService.existsByName(sectorData.name);
    if (nameExists) {
      return res.status(409).json({ error: 'Já existe um setor com este nome' });
    }

    const acronymExists = await SectorService.existsByAcronym(sectorData.acronym);
    if (acronymExists) {
      return res.status(409).json({ error: 'Já existe um setor com esta sigla' });
    }
    
    const sector = await SectorService.create({
      name: sectorModel.name,
      acronym: sectorModel.acronym,
      description: sectorModel.description,
      color: sectorModel.color,
      status: sectorModel.status
    });
    
    res.status(201).json(sector);
  } catch (err) {
    if (err.code === 'P2002') {
      return res.status(409).json({ error: 'Nome ou sigla já existe' });
    }
    next(err);
  }
};

export const editSector = async (req, res, next) => {
  /*
  #swagger.tags = ["Sectors"]
  #swagger.security = [{"bearerAuth": []}]
  #swagger.requestBody = {
    required: true,
    content: {
      "application/json": {
        schema: { $ref: "#/components/schemas/UpdateSector" }
      }
    }
  }
  #swagger.responses[200] = {
    description: "Setor atualizado",
    schema: { $ref: "#/components/schemas/Sector" }
  }
  #swagger.responses[400] = {
    description: "Dados inválidos"
  }
  #swagger.responses[404] = {
    description: "Setor não encontrado"
  }
  #swagger.responses[409] = {
    description: "Nome ou sigla já existe"
  }
  */
  try {
    const { id } = req.params;
    const sectorData = req.body;
    
    // Verificar se setor existe
    const existingSector = await SectorService.findById(id);
    if (!existingSector) {
      return res.status(404).json({ error: 'Setor não encontrado' });
    }
    
    // Validar com o modelo
    const sectorModel = new Sector({ ...existingSector, ...sectorData });
    if (sectorData.acronym) {
      sectorModel.normalizeAcronym();
    }
    if (sectorData.name) {
      sectorModel.normalizeName();
    }
    
    const errors = sectorModel.validate();
    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }
    
    // Verificar duplicatas (excluindo o próprio registro)
    if (sectorData.name) {
      const nameExists = await SectorService.existsByName(sectorData.name, id);
      if (nameExists) {
        return res.status(409).json({ error: 'Já existe um setor com este nome' });
      }
    }
    
    if (sectorData.acronym) {
      const acronymExists = await SectorService.existsByAcronym(sectorData.acronym, id);
      if (acronymExists) {
        return res.status(409).json({ error: 'Já existe um setor com esta sigla' });
      }
    }
    
    const sector = await SectorService.update(id, {
      name: sectorModel.name,
      acronym: sectorModel.acronym,
      description: sectorModel.description,
      color: sectorModel.color,
      status: sectorModel.status
    });
    
    res.hateoas_item(sector);
  } catch (err) {
    if (err.code === 'P2025') {
      return res.status(404).json({ error: 'Setor não encontrado' });
    }
    if (err.code === 'P2002') {
      return res.status(409).json({ error: 'Nome ou sigla já existe' });
    }
    next(err);
  }
};

export const getSectorStatistics = async (req, res, next) => {
  /*
  #swagger.tags = ["Sectors"]
  #swagger.security = [{"bearerAuth": []}]
  #swagger.responses[200] = {
    description: "Estatísticas do setor",
    schema: {
      type: "object",
      properties: {
        sectorId: { type: "integer" },
        sectorName: { type: "string" },
        totalTasks: { type: "integer" },
        activeTasks: { type: "integer" },
        completedTasks: { type: "integer" },
        canceledTasks: { type: "integer" },
        completionRate: { type: "string" }
      }
    }
  }
  #swagger.responses[404] = {
    description: "Setor não encontrado"
  }
  */
  try {
    const { id } = req.params;
    
    const statistics = await SectorService.getStatistics(id);
    
    if (!statistics) {
      return res.status(404).json({ error: 'Setor não encontrado' });
    }
    
    res.json(statistics);
  } catch (err) {
    next(err);
  }
};