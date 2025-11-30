// prisma/seed.js
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

function randomFrom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function addDays(date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

async function main() {
  console.log("🧹 Limpando banco (deleteMany em ordem segura)...");

  await prisma.taskLog.deleteMany();
  await prisma.taskComment.deleteMany();
  await prisma.task.deleteMany();
  await prisma.actionPlan.deleteMany();
  await prisma.project.deleteMany();
  await prisma.userSector.deleteMany().catch(() => {});
  await prisma.userCliente.deleteMany().catch(() => {});
  await prisma.user.deleteMany();
  await prisma.sector.deleteMany();
  await prisma.cliente.deleteMany();
  await prisma.auditLog.deleteMany().catch(() => {});

  console.log("✨ Banco limpo.");

  // ---------------------------
  // CLIENTES
  // ---------------------------
  console.log("🌱 Criando clientes (IDs 1 e 2)...");
  const cliente1 = await prisma.cliente.upsert({
    where: { cnpj: "61.465.711/0001-26" },
    update: {},
    create: {
      id: 1,
      nome: "Copiloto Empresas",
      cnpj: "61.465.711/0001-26",
      email: "hermes.inacio@gmail.com",
      telefone: "(45) 99127-9097",
      endereco: "Rua Julcimar Coppini, 0134, Jardim Coopagro - Toledo, PR"
    }
  });

  const cliente2 = await prisma.cliente.upsert({
    where: { cnpj: "98.765.432/0001-10" },
    update: {},
    create: {
      id: 2,
      nome: "NatyApp",
      cnpj: "98.765.432/0001-10",
      email: "contato@natyapp.com.br",
      telefone: "(11) 88888-8888",
      endereco: "Avenida dos Clientes, 456 - Rio de Janeiro, RJ"
    }
  });

  console.log("✅ Clientes criados.");

  // ---------------------------
  // USUÁRIOS
  // ---------------------------
  console.log("🔐 Criando usuários (hashing de senha)...");

  const plainPassword = "123456";
  const pass = await bcrypt.hash(plainPassword, 10);

  const adminC = await prisma.user.upsert({
    where: { email: "admin@copiloto.com" },
    update: { password: pass },
    create: {
      nome: "Admin Copiloto",
      email: "admin@copiloto.com",
      password: pass,
      clienteId: cliente1.id,
      isAdmin: true,
      accessLevel: "ADMIN",
      status: "ATIVO"
    }
  });

  const colaboradorCopiloto = await prisma.user.upsert({
    where: { email: "colaborador@copiloto.com" },
    update: { password: pass },
    create: {
      nome: "Colaborador Copiloto",
      email: "colaborador@copiloto.com",
      password: pass,
      clienteId: cliente1.id,
      accessLevel: "COLABORADOR_CLIENTE",
      onlyAttachedTasks: true,
      status: "ATIVO"
    }
  });

  const gestorN = await prisma.user.upsert({
    where: { email: "gestor@natyapp.com" },
    update: { password: pass },
    create: {
      nome: "Gestor NatyApp",
      email: "gestor@natyapp.com",
      password: pass,
      clienteId: cliente2.id,
      accessLevel: "GESTOR_CLIENTE",
      status: "ATIVO"
    }
  });

  const colabN = await prisma.user.upsert({
    where: { email: "colaborador@natyapp.com" },
    update: { password: pass },
    create: {
      nome: "Colaborador NatyApp",
      email: "colaborador@natyapp.com",
      password: pass,
      clienteId: cliente2.id,
      accessLevel: "COLABORADOR_CLIENTE",
      onlyAttachedTasks: true,
      status: "ATIVO"
    }
  });

  console.log("✅ Usuários criados:");
  console.log(` - ${adminC.email} (Cliente ${adminC.clienteId})`);
  console.log(` - ${colaboradorCopiloto.email} (Cliente ${colaboradorCopiloto.clienteId})`);
  console.log(` - ${gestorN.email} (Cliente ${gestorN.clienteId})`);
  console.log(` - ${colabN.email} (Cliente ${colabN.clienteId})`);

  // ---------------------------
  // SETORES
  // ---------------------------
  console.log("🏷️ Criando setores realistas...");

  const setoresDados = [
    { name: "Tecnologia da Informação", acronym: "TI", description: "Desenvolvimento e infraestrutura", color: "#3B82F6" },
    { name: "Recursos Humanos", acronym: "RH", description: "Gestão de pessoas e recrutamento", color: "#10B981" },
    { name: "Financeiro", acronym: "FIN", description: "Contabilidade, faturamento e pagamentos", color: "#F59E0B" },
    { name: "Comercial", acronym: "COM", description: "Vendas, propostas e relacionamento com cliente", color: "#EF4444" },
    { name: "Marketing", acronym: "MKT", description: "Campanhas, branding e comunicação", color: "#8B5CF6" },
    { name: "Operações", acronym: "OPS", description: "Operações e logística", color: "#64748B" }
  ];

  const setores = [];
  for (const s of setoresDados) {
    const sec = await prisma.sector.create({ 
      data: { 
        name: s.name, 
        acronym: s.acronym, 
        description: s.description, 
        color: s.color, 
        status: "ATIVO" 
      } 
    });
    setores.push(sec);
  }

  console.log("✅ Setores criados:", setores.map(s => s.name).join(", "));

  // ---------------------------
  // PROJETOS (3 por cliente para ter mais distribuição)
  // ---------------------------
  console.log("📁 Criando projetos (3 por cliente)...");

  const projetos = [];
  for (const cliente of [cliente1, cliente2]) {
    for (let p = 1; p <= 3; p++) {
      const proj = await prisma.project.create({
        data: {
          name: `${cliente.nome} - Projeto ${p}`,
          description: `Projeto ${p} executado para ${cliente.nome}`
        }
      });
      projetos.push({ proj, clienteId: cliente.id });
    }
  }

  console.log("✅ Projetos criados:", projetos.length);

  // ---------------------------
  // PLANOS DE AÇÃO (3 por projeto)
  // ---------------------------
  console.log("🗂️ Criando planos de ação (3 por projeto)...");

  const hoje = new Date(2025, 11, 2); // 02/12/2025
  const planos = [];
  
  for (const { proj, clienteId } of projetos) {
    for (let a = 1; a <= 3; a++) {
      const numero = `${clienteId === 1 ? "PA-COP" : "PA-NAT"}-${proj.id}-${a.toString().padStart(2, "0")}`;
      const plan = await prisma.actionPlan.create({
        data: {
          number: numero,
          what: `Plano ${a} para ${proj.name}`,
          how: `Executar tarefas relacionadas ao plano ${a} do projeto ${proj.name}`,
          responsible: clienteId === 1 ? "Admin Copiloto" : "Gestor NatyApp",
          startDate: addDays(hoje, -60 + (a * 15)),
          endDate: addDays(hoje, -30 + (a * 20)),
          status: a === 1 ? "EM_ANDAMENTO" : "PENDENTE",
          clienteId,
          projectId: proj.id
        }
      });
      planos.push({ plan, clienteId });
    }
  }

  console.log("✅ Planos de ação criados:", planos.length);

  // ---------------------------
  // TAREFAS (12 por plano) - DISTRIBUIÇÃO ESTRATÉGICA
  // ---------------------------
  console.log("🔨 Gerando tarefas com datas estratégicas para 02/12/2025...");

  const commentTemplates = [
    "Favor revisar o escopo e confirmar disponibilidade.",
    "Atualizei o documento com as observações do cliente.",
    "Solicito priorização deste item para a próxima sprint.",
    "Confirmado: progresso de 50%, aguardando integração.",
    "Ajustes realizados conforme feedback, por favor revisar.",
    "Pendente validação do responsável técnico."
  ];

  const logActions = [
    { action: "STATUS_CHANGED", desc: (oldV, newV) => `Status alterado de ${oldV} para ${newV}` },
    { action: "RESPONSIBLE_CHANGED", desc: (oldV, newV) => `Responsável alterado de ${oldV} para ${newV}` },
    { action: "PRIORITY_CHANGED", desc: (oldV, newV) => `Prioridade alterada de ${oldV} para ${newV}` },
    { action: "DUE_DATE_UPDATED", desc: (oldV, newV) => `Prazo alterado de ${oldV} para ${newV}` },
    { action: "COMMENT_ADDED", desc: (_, id) => `Comentário #${id} adicionado` },
    { action: "TASK_CREATED", desc: () => "Tarefa criada" }
  ];

  function genOldNewFor(actionType, baseIndex) {
    switch (actionType) {
      case "STATUS_CHANGED":
        return { oldValue: baseIndex % 2 === 0 ? "PENDENTE" : "EM_ANDAMENTO", newValue: baseIndex % 2 === 0 ? "EM_ANDAMENTO" : "CONCLUIDA" };
      case "PRIORITY_CHANGED":
        return { oldValue: "MEDIA", newValue: baseIndex % 3 === 0 ? "ALTA" : "BAIXA" };
      case "RESPONSIBLE_CHANGED":
        return { oldValue: "Usuário A", newValue: "Usuário B" };
      case "DUE_DATE_UPDATED":
        return { oldValue: addDays(hoje, -10 + baseIndex).toISOString(), newValue: addDays(hoje, 5 + baseIndex).toISOString() };
      default:
        return { oldValue: null, newValue: null };
    }
  }

  // DISTRIBUIÇÃO: 12 tarefas por plano
  // 3 CONCLUIDAS, 2 ATRASADAS, 2 VENCEM 1-3 DIAS, 3 EM_ANDAMENTO, 2 PENDENTE
  const taskDistribution = [
    { status: "CONCLUIDA", priority: "ALTA", daysFromToday: -15, createDaysAgo: -30 },
    { status: "CONCLUIDA", priority: "MEDIA", daysFromToday: -10, createDaysAgo: -25 },
    { status: "CONCLUIDA", priority: "BAIXA", daysFromToday: -5, createDaysAgo: -20 },
    { status: "EM_ANDAMENTO", priority: "ALTA", daysFromToday: -8, createDaysAgo: -18 },
    { status: "PENDENTE", priority: "MEDIA", daysFromToday: -3, createDaysAgo: -10 },
    { status: "EM_ANDAMENTO", priority: "ALTA", daysFromToday: 1, createDaysAgo: -5 },
    { status: "PENDENTE", priority: "MEDIA", daysFromToday: 3, createDaysAgo: -7 },
    { status: "EM_ANDAMENTO", priority: "ALTA", daysFromToday: 10, createDaysAgo: -8 },
    { status: "EM_ANDAMENTO", priority: "MEDIA", daysFromToday: 15, createDaysAgo: -5 },
    { status: "EM_ANDAMENTO", priority: "BAIXA", daysFromToday: 20, createDaysAgo: -3 },
    { status: "ABERTA", priority: "MEDIA", daysFromToday: 25, createDaysAgo: -2 },
    { status: "PENDENTE", priority: "BAIXA", daysFromToday: 30, createDaysAgo: -1 }
  ];

  let totalTasks = 0;
  let totalConcluidas = 0;
  let totalAtrasadas = 0;
  let totalProximasVenc = 0;

  for (const { plan, clienteId } of planos) {
    const creator = clienteId === 1 ? adminC : gestorN;
    const responsibles = clienteId === 1 ? [adminC, colaboradorCopiloto] : [gestorN, colabN];

    for (let t = 0; t < taskDistribution.length; t++) {
      const { status, priority, daysFromToday, createDaysAgo } = taskDistribution[t];
      const responsible = randomFrom(responsibles);

      const dueDate = addDays(hoje, daysFromToday);
      const createdAt = addDays(hoje, createDaysAgo);
      
      let updatedAt = createdAt;
      if (status === "CONCLUIDA") {
        const conclusionDay = Math.floor(Math.random() * Math.abs(daysFromToday - createDaysAgo)) + createDaysAgo;
        updatedAt = addDays(hoje, conclusionDay);
      }

      const task = await prisma.task.create({
        data: {
          title: `${plan.number} - Tarefa ${t + 1}`,
          description: `Atividade ${t + 1} vinculada ao plano ${plan.number} do cliente ${clienteId}.`,
          status,
          priority,
          dueDate,
          createdAt,
          updatedAt: status === "CONCLUIDA" ? updatedAt : createdAt,
          clienteId,
          sectorId: randomFrom(setores).id,
          actionPlanId: plan.id,
          userCreatedId: creator.id,
          userResponsibleId: responsible.id
        }
      });

      totalTasks++;
      if (status === "CONCLUIDA") totalConcluidas++;
      else if (dueDate < hoje) totalAtrasadas++;
      if (status !== "CONCLUIDA" && daysFromToday >= 1 && daysFromToday <= 3) totalProximasVenc++;

      await prisma.taskLog.create({
        data: {
          taskId: task.id,
          userId: creator.id,
          action: "TASK_CREATED",
          description: "Tarefa criada pelo seed",
          createdAt
        }
      });

      const numComments = Math.floor(Math.random() * 4) + 3;
      for (let c = 0; c < numComments; c++) {
        const commenter = randomFrom([creator, ...responsibles]);
        const content = randomFrom(commentTemplates);
        await prisma.taskComment.create({
          data: {
            taskId: task.id,
            userId: commenter.id,
            content
          }
        });

        await prisma.taskLog.create({
          data: {
            taskId: task.id,
            userId: commenter.id,
            action: "COMMENT_ADDED",
            description: `Comentário criado: ${content}`
          }
        });
      }

      const alreadyCreatedLogs = 1 + numComments;
      const targetLogs = Math.floor(Math.random() * 8) + 5;
      const moreLogsToCreate = Math.max(0, targetLogs - alreadyCreatedLogs);

      for (let L = 0; L < moreLogsToCreate; L++) {
        const la = randomFrom(logActions);
        const values = genOldNewFor(la.action, L + t);
        await prisma.taskLog.create({
          data: {
            taskId: task.id,
            userId: creator.id,
            action: la.action,
            description: la.desc(values.oldValue, values.newValue),
            oldValue: values.oldValue,
            newValue: values.newValue
          }
        });
      }
    }
  }

  console.log(`✅ ${totalTasks} tarefas criadas (${totalConcluidas} concluídas, ${totalAtrasadas} atrasadas, ${totalProximasVenc} vencem em 1-3 dias)`);
  console.log("🎉 Seed finalizada para apresentação 02/12/2025!");
  console.log("");
  console.log("Usuários criados (login / senha):");
  console.log(` - ${adminC.email} / 123456 (Admin Copiloto)`);
  console.log(` - ${colaboradorCopiloto.email} / 123456 (Colaborador Copiloto)`);
  console.log(` - ${gestorN.email} / 123456 (Gestor NatyApp)`);
  console.log(` - ${colabN.email} / 123456 (Colaborador NatyApp)`);
}

main()
  .catch((e) => {
    console.error("❌ Erro no seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });