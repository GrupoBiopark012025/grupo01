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

    // ===== NOVOS INDICADORES ESTRATÉGICOS =====
    
    // 1. Taxa de conclusão no prazo (tarefas concluídas antes ou na data de vencimento)
    const concluidasNoPrazo = await prisma.$queryRaw`
      SELECT COUNT(*) as count
      FROM tasks 
      WHERE cliente_id = ${clienteId}
        AND status = 'CONCLUIDA'
        AND updated_at <= due_date
    `
    
    const concluidasNoPrazoCount = Number(concluidasNoPrazo[0].count)
    const taxaConclusaoPrazo = concluidas > 0 
      ? ((concluidasNoPrazoCount / concluidas) * 100).toFixed(1) 
      : "0"
    // 2. Projetos com maior taxa de atraso
    const projetosCriticos = await prisma.$queryRaw`
      SELECT 
        ap.id,
        ap.number,
        COUNT(t.id) as total_tarefas,
        SUM(CASE WHEN t.status != 'CONCLUIDA' AND t.due_date < NOW() THEN 1 ELSE 0 END) as tarefas_atrasadas,
        ROUND(
          (SUM(CASE WHEN t.status != 'CONCLUIDA' AND t.due_date < NOW() THEN 1 ELSE 0 END)::numeric / 
          NULLIF(COUNT(t.id), 0)) * 100, 1
        ) as taxa_atraso
      FROM action_plans ap
      LEFT JOIN tasks t ON t.action_plan_id = ap.id
      WHERE ap.cliente_id = ${clienteId}
      GROUP BY ap.id, ap.number
      HAVING COUNT(t.id) > 0 AND SUM(CASE WHEN t.status != 'CONCLUIDA' AND t.due_date < NOW() THEN 1 ELSE 0 END) > 0
      ORDER BY taxa_atraso DESC
      LIMIT 5
    `

    // 3. Setores sobrecarregados (com mais de 10 tarefas pendentes)
    const setoresSobrecarregados = await prisma.$queryRaw`
      SELECT 
        s.id,
        s.name,
        s.acronym,
        COUNT(t.id) as total_pendentes,
        SUM(CASE WHEN t.status != 'CONCLUIDA' AND t.due_date < NOW() THEN 1 ELSE 0 END) as atrasadas
      FROM sectors s
      LEFT JOIN tasks t ON t.sector_id = s.id AND t.cliente_id = ${clienteId}
      WHERE s.status = 'ATIVO'
        AND t.status IN ('ABERTA', 'EM_ANDAMENTO', 'PENDENTE')
      GROUP BY s.id, s.name, s.acronym
      HAVING COUNT(t.id) >= 5
      ORDER BY total_pendentes DESC
      LIMIT 5
    `

    // 4. Distribuição de tarefas por prioridade
    const distribuicaoPrioridade = await prisma.task.groupBy({
      by: ["priority"],
      where: { 
        clienteId,
        status: { in: ["ABERTA", "EM_ANDAMENTO", "PENDENTE"] }
      },
      _count: { priority: true }
    })

    // 5. Usuários com mais tarefas atribuídas
    const topResponsaveis = await prisma.$queryRaw`
      SELECT 
        u.id,
        u.nome,
        COUNT(t.id) as total_tarefas,
        SUM(CASE WHEN t.status = 'CONCLUIDA' THEN 1 ELSE 0 END) as concluidas,
        SUM(CASE WHEN t.status != 'CONCLUIDA' THEN 1 ELSE 0 END) as pendentes
      FROM users u
      LEFT JOIN tasks t ON t.user_responsible_id = u.id AND t.cliente_id = ${clienteId}
      WHERE u.cliente_id = ${clienteId} AND u.status = 'ATIVO'
      GROUP BY u.id, u.nome
      HAVING COUNT(t.id) > 0
      ORDER BY total_tarefas DESC
      LIMIT 5
    `

    // ===== DISTRIBUIÇÕES EXISTENTES =====
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

    // Tempo médio de conclusão
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
      distribuicaoSetores,

      taxaConclusaoPrazo,
      projetosCriticos: projetosCriticos.map(p => ({
        ...p,
        total_tarefas: Number(p.total_tarefas),
        tarefas_atrasadas: Number(p.tarefas_atrasadas),
        taxa_atraso: Number(p.taxa_atraso)
      })),
      setoresSobrecarregados: setoresSobrecarregados.map(s => ({
        ...s,
        total_pendentes: Number(s.total_pendentes),
        atrasadas: Number(s.atrasadas)
      })),
      distribuicaoPrioridade: distribuicaoPrioridade.map(p => ({
        key: p.priority,
        label: p.priority,
        count: p._count.priority
      })),
      topResponsaveis: topResponsaveis.map(u => ({
        ...u,
        total_tarefas: Number(u.total_tarefas),
        concluidas: Number(u.concluidas),
        pendentes: Number(u.pendentes)
      }))
    }

  }
}