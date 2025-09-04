import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Criar cliente ActionPlan (empresa dona do sistema)
  const actionPlan = await prisma.cliente.upsert({
    where: { cnpj: '61.465.711/0001-26' },
    update: {},
    create: {
      id: 1,
      nome: 'Copiloto Empresas',
      cnpj: '61.465.711/0001-26',
      email: 'hermes.inacio@gmail.com',
      telefone: '(45) 99127-9097',
      endereco: 'Rua Julcimar Coppini, 0134, Jardim Coopagro - Toledo, PR'
    }
  });

  // Criar cliente mock para testes
  const clienteMock = await prisma.cliente.upsert({
    where: { cnpj: '98.765.432/0001-10' },
    update: {},
    create: {
      id: 2,
      nome: 'NatyApp',
      cnpj: '98.765.432/0001-10',
      email: 'contato@natyapp.com.br',
      telefone: '(11) 88888-8888',
      endereco: 'Avenida dos Clientes, 456 - Rio de Janeiro, RJ'
    }
  });


  console.log('Seed executado com sucesso!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });