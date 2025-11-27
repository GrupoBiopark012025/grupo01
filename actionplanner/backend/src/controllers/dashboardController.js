import { DashboardService } from "../services/dashboardService.js";

export const getDashboard = async (req, res, next) => {
  /*
  #swagger.tags = ["Dashboard"]
  #swagger.security = [{"bearerAuth": []}]
  #swagger.responses[200] = {
    description: "Resumo de métricas do dashboard",
    schema: {
      type: "object",
      properties: {
        prorrogadasMes: { type: "integer" },
        concluidas: { type: "integer" },
        pendentes: { type: "integer" },
        atrasadas: { type: "integer" },
        paralisadas: { type: "integer" },
        proximasVencimento: { type: "integer" },
        tempoMedio: { type: "number" },
        distribuicaoProjetos: { 
          type: "array",
          items: {
            type: "object",
            properties: {
              projectId: { type: "integer" },
              _count: { 
                type: "object",
                properties: {
                  projectId: { type: "integer" }
                }
              }
            }
          }
        }
      }
    }
  }
  #swagger.responses[500] = { description: "Erro ao carregar dashboard" }
  */
  try {
    const clienteId = req.user.clienteId
    const data = await DashboardService.getDashboard(clienteId)
    res.json(data)
  } catch (err) {
    next(err)
  }
};
