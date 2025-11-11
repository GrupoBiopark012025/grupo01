import { PrismaClient } from "@prisma/client";
import * as XLSX from "xlsx";
import { UserService } from "./userService.js";
import { ClientService } from "./clientService.js";
import { ProjectService } from "./projectService.js";
import { SectorService } from "./sectorService.js";

const prisma = new PrismaClient();

export class ImportActionPlanService {
  /**
   * Processa o arquivo Excel e importa o plano de ação com suas tarefas
   * @param {Buffer} fileBuffer - Buffer do arquivo Excel
   * @param {number} userCreatedId - ID do usuário que está criando (vem do token/localStorage)
   * @returns {Promise<Object>} - Plano de ação criado com tarefas
   */
  static async importFromExcel(fileBuffer, userCreatedId) {
    // Validar se o usuário criador existe
    const userCreated = await UserService.findById(userCreatedId);
    if (!userCreated) {
      throw new Error(`Usuário criador não encontrado com ID: ${userCreatedId}`);
    }

    // Ler o arquivo Excel
    const workbook = XLSX.read(fileBuffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    // Converter para JSON
    const data = XLSX.utils.sheet_to_json(worksheet, { raw: false });

    if (!data || data.length === 0) {
      throw new Error("O arquivo Excel está vazio ou não contém dados válidos");
    }

    // Primeira linha = dados do plano de ação
    const actionPlanRow = data[0];
    if (!actionPlanRow) {
      throw new Error("A primeira linha do Excel deve conter os dados do plano de ação");
    }

    // Demais linhas = tarefas
    const taskRows = data.slice(1);

    // Validar e processar dados do plano de ação
    const actionPlanProcessed = await this.validateAndProcessActionPlanData(actionPlanRow);
    const { projectName, ...actionPlanData } = actionPlanProcessed;

    // Validar e processar dados das tarefas
    const tasksData = await this.validateAndProcessTasksData(taskRows, userCreatedId);

    // Executar tudo em uma transação
    return await prisma.$transaction(async (tx) => {
      // Criar o plano de ação
      const actionPlan = await tx.actionPlan.create({
        data: actionPlanData,
        include: {
          projects: true,
          tasks: true
        }
      });

      // Vincular projeto se foi informado
      if (projectName) {
        const project = await tx.project.findFirst({
          where: {
            name: {
              equals: projectName,
              mode: "insensitive"
            }
          }
        });

        if (project) {
          await tx.project.update({
            where: { id: project.id },
            data: { actionPlanId: actionPlan.id }
          });
        }
      }

      // Criar as tarefas
      for (let i = 0; i < tasksData.length; i++) {
        const taskData = tasksData[i];
        await tx.task.create({
          data: {
            ...taskData,
            actionPlanId: actionPlan.id
          }
        });
      }

      // Buscar o plano de ação completo
      const completeActionPlan = await tx.actionPlan.findUnique({
        where: { id: actionPlan.id },
        include: {
          projects: true,
          tasks: {
            include: {
              cliente: true,
              sector: true,
              userResponsible: true,
              userCreated: true,
              project: true
            },
            orderBy: {
              createdAt: "asc"
            }
          }
        }
      });

      return completeActionPlan;
    });
  }

  /**
   * Valida e processa os dados do plano de ação da primeira linha
   */
  static async validateAndProcessActionPlanData(row) {
    const errors = [];

    // Campos obrigatórios do ActionPlan
    if (!row.number || String(row.number).trim() === "") {
      errors.push("Campo 'number' (número do plano) é obrigatório na primeira linha");
    }
    if (!row.what || String(row.what).trim() === "") {
      errors.push("Campo 'what' (o que) é obrigatório na primeira linha");
    }
    if (!row.how || String(row.how).trim() === "") {
      errors.push("Campo 'how' (como) é obrigatório na primeira linha");
    }
    if (!row.responsible || String(row.responsible).trim() === "") {
      errors.push("Campo 'responsible' (responsável) é obrigatório na primeira linha");
    }
    if (!row.startDate) {
      errors.push("Campo 'startDate' (data de início) é obrigatório na primeira linha");
    }
    if (!row.endDate) {
      errors.push("Campo 'endDate' (data de término) é obrigatório na primeira linha");
    }
    if (!row.status || String(row.status).trim() === "") {
      errors.push("Campo 'status' é obrigatório na primeira linha");
    }

    if (errors.length > 0) {
      throw new Error(`Erros de validação do plano de ação:\n${errors.join("\n")}`);
    }

    // Validar e converter datas
    const startDate = this.parseDate(row.startDate);
    const endDate = this.parseDate(row.endDate);

    if (!startDate) {
      throw new Error("Data de início inválida. Use o formato DD/MM/YYYY ou YYYY-MM-DD");
    }
    if (!endDate) {
      throw new Error("Data de término inválida. Use o formato DD/MM/YYYY ou YYYY-MM-DD");
    }
    if (endDate < startDate) {
      throw new Error("A data de término deve ser maior ou igual à data de início");
    }

    // Validar postponedDate se informado
    let postponedDate = null;
    if (row.postponedDate) {
      postponedDate = this.parseDate(row.postponedDate);
      if (!postponedDate) {
        throw new Error("Data de prorrogação inválida. Use o formato DD/MM/YYYY ou YYYY-MM-DD");
      }
    }

    return {
      number: String(row.number || "").trim(),
      what: String(row.what || "").trim(),
      how: String(row.how || "").trim(),
      responsible: String(row.responsible || "").trim(),
      startDate: startDate,
      endDate: endDate,
      postponedDate: postponedDate,
      status: String(row.status || "").trim(),
      observations: row.observations ? String(row.observations).trim() : null,
      projectName: row.projectName ? String(row.projectName).trim() : null // Nome do projeto para vincular depois
    };
  }

  /**
   * Valida e processa os dados das tarefas
   */
  static async validateAndProcessTasksData(rows, userCreatedId) {
    if (!rows || rows.length === 0) {
      throw new Error("O arquivo deve conter pelo menos uma tarefa (a partir da segunda linha)");
    }

    const tasksData = [];
    const errors = [];

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const rowNumber = i + 2; // +2 porque a primeira linha é o plano de ação

      try {
        // Validar campos obrigatórios
        if (!row.title || String(row.title).trim() === "") {
          errors.push(`Linha ${rowNumber}: Campo 'title' (título) é obrigatório`);
          continue;
        }
        if (!row.status || String(row.status).trim() === "") {
          errors.push(`Linha ${rowNumber}: Campo 'status' é obrigatório`);
          continue;
        }
        if (!row.priority || String(row.priority).trim() === "") {
          errors.push(`Linha ${rowNumber}: Campo 'priority' (prioridade) é obrigatório`);
          continue;
        }
        if (!row.clienteEmail) {
          errors.push(`Linha ${rowNumber}: Campo 'clienteEmail' (email do cliente) é obrigatório`);
          continue;
        }
        if (!row.sectorName) {
          errors.push(`Linha ${rowNumber}: Campo 'sectorName' (nome do setor) é obrigatório`);
          continue;
        }

        // Buscar cliente por email
        const cliente = await prisma.cliente.findFirst({
          where: {
            email: {
              equals: String(row.clienteEmail).trim(),
              mode: "insensitive"
            }
          }
        });

        if (!cliente) {
          errors.push(`Linha ${rowNumber}: Cliente não encontrado com email: ${row.clienteEmail}`);
          continue;
        }

        // Buscar setor por nome
        const sector = await SectorService.findByName(String(row.sectorName).trim());
        if (!sector) {
          errors.push(`Linha ${rowNumber}: Setor não encontrado com nome: ${row.sectorName}`);
          continue;
        }

        // Buscar usuário responsável por email (se informado)
        let userResponsibleId = null;
        if (row.userResponsibleEmail) {
          const userResponsible = await UserService.findByEmail(String(row.userResponsibleEmail).trim());
          if (!userResponsible) {
            errors.push(`Linha ${rowNumber}: Usuário responsável não encontrado com email: ${row.userResponsibleEmail}`);
            continue;
          }
          userResponsibleId = userResponsible.id;
        }

        // Buscar projeto por nome (se informado)
        let projectId = null;
        if (row.projectName) {
          const project = await ProjectService.findByName(String(row.projectName).trim());
          if (!project) {
            errors.push(`Linha ${rowNumber}: Projeto não encontrado com nome: ${row.projectName}`);
            continue;
          }
          projectId = project.id;
        }

        // Validar e converter data de vencimento
        let dueDate = null;
        if (row.dueDate) {
          dueDate = this.parseDate(row.dueDate);
          if (!dueDate) {
            errors.push(`Linha ${rowNumber}: Data de vencimento inválida. Use o formato DD/MM/YYYY ou YYYY-MM-DD`);
            continue;
          }
        }

        tasksData.push({
          title: String(row.title).trim(),
          description: row.description ? String(row.description).trim() : null,
          status: String(row.status).trim(),
          priority: String(row.priority).trim(),
          dueDate: dueDate,
          projectId: projectId,
          clienteId: cliente.id,
          sectorId: sector.id,
          userResponsibleId: userResponsibleId,
          userCreatedId: userCreatedId
        });
      } catch (error) {
        errors.push(`Linha ${rowNumber}: Erro ao processar - ${error.message}`);
      }
    }

    if (errors.length > 0) {
      throw new Error(`Erros de validação das tarefas:\n${errors.join("\n")}`);
    }

    if (tasksData.length === 0) {
      throw new Error("Nenhuma tarefa válida foi encontrada no arquivo");
    }

    return tasksData;
  }

  /**
   * Converte string de data para objeto Date
   * Suporta formatos: DD/MM/YYYY, YYYY-MM-DD, e números do Excel
   */
  static parseDate(dateValue) {
    if (!dateValue) return null;

    // Se for número (formato Excel), converter
    if (typeof dateValue === "number") {
      // Excel armazena datas como número de dias desde 01/01/1900
      const excelEpoch = new Date(1899, 11, 30);
      const date = new Date(excelEpoch.getTime() + dateValue * 24 * 60 * 60 * 1000);
      return date;
    }

    const str = String(dateValue).trim();

    // Formato DD/MM/YYYY
    const ddmmyyyy = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/;
    const match1 = str.match(ddmmyyyy);
    if (match1) {
      const day = parseInt(match1[1], 10);
      const month = parseInt(match1[2], 10) - 1;
      const year = parseInt(match1[3], 10);
      const date = new Date(year, month, day);
      if (date.getDate() === day && date.getMonth() === month && date.getFullYear() === year) {
        return date;
      }
    }

    // Formato YYYY-MM-DD
    const yyyymmdd = /^(\d{4})-(\d{1,2})-(\d{1,2})$/;
    const match2 = str.match(yyyymmdd);
    if (match2) {
      const year = parseInt(match2[1], 10);
      const month = parseInt(match2[2], 10) - 1;
      const day = parseInt(match2[3], 10);
      const date = new Date(year, month, day);
      if (date.getDate() === day && date.getMonth() === month && date.getFullYear() === year) {
        return date;
      }
    }

    // Tentar parse direto
    const date = new Date(str);
    if (!isNaN(date.getTime())) {
      return date;
    }

    return null;
  }
}

