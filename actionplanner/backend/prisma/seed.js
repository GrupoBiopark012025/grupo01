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

  // Ajuste a ordem conforme suas FK; essa ordem é defensiva
  await prisma.taskLog.deleteMany();
  await prisma.taskComment.deleteMany();
  await prisma.task.deleteMany();
  await prisma.actionPlan.deleteMany();
  await prisma.project.deleteMany();
  await prisma.userSector.deleteMany().catch(() => {});
  await prisma.userCliente.deleteMany().catch(() => {});
  // apagar usuários depois de relações intermediárias
  await prisma.user.deleteMany();
  await prisma.sector.deleteMany();
  await prisma.cliente.deleteMany();
  await prisma.auditLog.deleteMany().catch(() => {});
  // Alguns modelos podem não existir dependendo da sua versão do schema, por isso .catch()

  console.log("✨ Banco limpo.");

  // ---------------------------
  // CLIENTES (mantidos conforme solicitado)
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
      endereco:
        "Rua Julcimar Coppini, 0134, Jardim Coopagro - Toledo, PR"
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
  // USUÁRIOS (admin e colaborador por cliente)
  // ---------------------------
  console.log("🔐 Criando usuários (hashing de senha)...");

  const plainPassword = "123456";
  const pass = await bcrypt.hash(plainPassword, 10);

  const adminC = await prisma.user.upsert({
    where: { email: "admin@copiloto.com" },
    update: {
      password: pass
    },
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
    update: {
      password: pass
    },
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
    update: {
      password: pass
    },
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
    update: {
      password: pass
    },
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
    const sec = await prisma.sector.create({ data: { name: s.name, acronym: s.acronym, description: s.description, color: s.color, status: "ATIVO" } });
    setores.push(sec);
  }

  console.log("✅ Setores criados:", setores.map(s => s.name).join(", "));

  // ---------------------------
  // PROJETOS (2 por cliente)
  // ---------------------------
  console.log("📁 Criando projetos (2 por cliente)...");

  const projetos = [];
  for (const cliente of [cliente1, cliente2]) {
    for (let p = 1; p <= 2; p++) {
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
          startDate: new Date(2025, 0, 10 * a),
          endDate: new Date(2025, 0, 10 * a + 30),
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
  // TAREFAS (10 por plano) + COMENTÁRIOS (3-6) + LOGS (5-12)
  // ---------------------------
  console.log("🔨 Gerando tarefas, comentários e logs (datas em 2025)...");

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

  // Helper para gerar logs com valores coerentes
  function genOldNewFor(actionType, baseIndex) {
    switch (actionType) {
      case "STATUS_CHANGED":
        return { oldValue: baseIndex % 2 === 0 ? "PENDENTE" : "EM_ANDAMENTO", newValue: baseIndex % 2 === 0 ? "EM_ANDAMENTO" : "CONCLUIDA" };
      case "PRIORITY_CHANGED":
        return { oldValue: "MEDIA", newValue: baseIndex % 3 === 0 ? "ALTA" : "BAIXA" };
      case "RESPONSIBLE_CHANGED":
        return { oldValue: "Usuário A", newValue: "Usuário B" };
      case "DUE_DATE_UPDATED":
        return { oldValue: new Date(2025, 1, 10 + baseIndex).toISOString(), newValue: new Date(2025, 2, 10 + baseIndex).toISOString() };
      default:
        return { oldValue: null, newValue: null };
    }
  }

  let totalTasks = 0;
  for (const { plan, clienteId } of planos) {
    for (let t = 1; t <= 10; t++) {
      // escolha de responsáveis: clientes 1 usa adminC/colaboradorCopiloto; cliente 2 usa gestorN/colabN
      const creator = clienteId === 1 ? adminC : gestorN;
      const responsibles = clienteId === 1 ? [adminC, colaboradorCopiloto] : [gestorN, colabN];
      const responsible = randomFrom(responsibles);

      const task = await prisma.task.create({
        data: {
          title: `${plan.number} - Tarefa ${t}`,
          description: `Atividade ${t} vinculada ao plano ${plan.number} do cliente ${clienteId}.`,
          status: t % 4 === 0 ? "CONCLUIDA" : (t % 3 === 0 ? "EM_ANDAMENTO" : "PENDENTE"),
          priority: ["BAIXA", "MEDIA", "ALTA"][t % 3],
          dueDate: addDays(new Date(2025, 0, 15), t * 3),
          clienteId,
          sectorId: randomFrom(setores).id,
          actionPlanId: plan.id,
          userCreatedId: creator.id,
          userResponsibleId: responsible.id
        }
      });

      totalTasks++;

      // criar um log de criação
      await prisma.taskLog.create({
        data: {
          taskId: task.id,
          userId: creator.id,
          action: "TASK_CREATED",
          description: "Tarefa criada pelo seed com dados iniciais"
        }
      });

      // comentários (3–6)
      const numComments = Math.floor(Math.random() * 4) + 3;
      for (let c = 0; c < numComments; c++) {
        const commenter = randomFrom([creator, ...responsibles]);
        const content = randomFrom(commentTemplates);
        const comment = await prisma.taskComment.create({
          data: {
            taskId: task.id,
            userId: commenter.id,
            content
          }
        });

        // log para cada comentário
        await prisma.taskLog.create({
          data: {
            taskId: task.id,
            userId: commenter.id,
            action: "COMMENT_ADDED",
            description: `Comentário criado: ${content}`
          }
        });
      }

      // logs adicionais (5–12 total including the creation log above)
      const alreadyCreatedLogs = 1 + numComments; // creation + comment logs
      const targetLogs = Math.floor(Math.random() * 8) + 5; // 5..12
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

  console.log(`✅ Criadas ${totalTasks} tarefas com comentários e logs.`);
  console.log("🎉 Seed realista finalizado com sucesso!");
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
