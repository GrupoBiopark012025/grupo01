import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

export class DashboardService {
  static async getDashboard(clienteId) {
    const hoje = new Date()
    const inicioMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1)
    const tresDias = new Date()
    tresDias.setDate(hoje.getDate() + 3)

    const prorrogadasMes = await prisma.actionPlan.count({
      where: {
        clienteId,
        postponedDate: { gte: inicioMes, lte: hoje }
      }
    })

    const concluidas = await prisma.task.count({
      where: { clienteId, status: "CONCLUIDA" }
    })

    const pendentes = await prisma.task.count({
      where: {
        clienteId,
        status: { in: ["ABERTA", "EM_ANDAMENTO", "PENDENTE"] }
      }
    })

    const atrasadas = await prisma.task.count({
      where: {
        clienteId,
        status: { not: "CONCLUIDA" },
        dueDate: { lt: hoje }
      }
    })

    const paralisadas = await prisma.task.count({
      where: { clienteId, status: "PARALISADA" }
    })

    const proximasVencimento = await prisma.task.count({
      where: {
        clienteId,
        status: { not: "CONCLUIDA" },
        dueDate: { gte: hoje, lte: tresDias }
      }
    })

    const rawStatus = await prisma.task.groupBy({
      by: ["status"],
      where: { clienteId },
      _count: { status: true }
    })

    const rawProjetos = await prisma.task.groupBy({
      by: ["actionPlanId"],
      where: { clienteId },
      _count: { actionPlanId: true }
    })

    const rawSetores = await prisma.task.groupBy({
      by: ["sectorId"],
      where: { clienteId },
      _count: { sectorId: true }
    })

    const projetoIds = rawProjetos.map(x => x.actionPlanId)
    const projetosInfo = await prisma.actionPlan.findMany({
      where: { id: { in: projetoIds } },
      select: { id: true, number: true }
    })

    const setoresIds = rawSetores.map(x => x.sectorId)
    const setoresInfo = await prisma.sector.findMany({
      where: { id: { in: setoresIds } },
      select: { id: true, name: true }
    })

    const distribuicaoStatus = rawStatus.map(s => ({
      key: s.status,
      label: s.status,
      count: s._count.status
    }))

    const distribuicaoProjetos = rawProjetos.map(p => {
      const proj = projetosInfo.find(x => x.id === p.actionPlanId)
      return {
        key: p.actionPlanId,
        name: proj?.number ?? `Plano ${p.actionPlanId}`,
        count: p._count.actionPlanId
      }
    })

    const distribuicaoSetores = rawSetores.map(s => {
      const setor = setoresInfo.find(x => x.id === s.sectorId)
      return {
        key: s.sectorId,
        name: setor?.name ?? `Setor ${s.sectorId}`,
        count: s._count.sectorId
      }
    })

    const concluidasComDatas = await prisma.task.findMany({
      where: { clienteId, status: "CONCLUIDA" },
      select: { createdAt: true, updatedAt: true }
    })

    let tempoMedio = null

    if (concluidasComDatas.length > 0) {
      const somatorio = concluidasComDatas.reduce((acc, t) => {
        const diff = t.updatedAt.getTime() - t.createdAt.getTime()
        return acc + diff
      }, 0)
      tempoMedio = somatorio / concluidasComDatas.length / 1000 / 60 / 60
    }

    return {
      prorrogadasMes,
      concluidas,
      pendentes,
      atrasadas,
      paralisadas,
      proximasVencimento,
      tempoMedio,
      distribuicaoStatus,
      distribuicaoProjetos,
      distribuicaoSetores
    }
  }
}
