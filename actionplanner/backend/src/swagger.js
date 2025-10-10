import swaggerAutogen from "swagger-autogen";

const doc = {
  info: {
    version: "1.0.0",
    title: "ActionPlanner API",
    description: "Documentação da API do ActionPlanner - Sistema de gerenciamento de tarefas e usuários",
  },
  servers: [
    {
      url: "http://localhost:3000/"
    }
  ],
  components: {
    schemas: {
      // Schemas básicos
      InternalServerError: {
        code: "",
        message: "",
      },

      // Auth
      LoginRequest: {
        email: "hermes@actionplan.com.br",
        password: "123456"
      },

      LoginResponse: {
        message: "Login realizado com sucesso",
        user: {
          id: 1,
          nome: "Hermes",
          email: "hermes@actionplan.com.br",
          isAdmin: true,
          accessLevel: "ADMIN"
        },
        token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
      },

      // User
      User: {
        id: 1,
        nome: "João Silva",
        email: "joao@empresa.com.br",
        clienteId: 1,
        isAdmin: false,
        accessLevel: "GESTOR_CLIENTE",
        onlyAttachedTasks: false,
        status: "ATIVO",
        createdAt: "2025-01-15T10:30:00.000Z",
        updatedAt: "2025-01-15T10:30:00.000Z"
      },

      CreateUser: {
        nome: "João Silva",
        email: "joao@empresa.com.br", 
        password: "senha123",
        clienteId: 1,
        accessLevel: "GESTOR_CLIENTE",
        isAdmin: false,
        onlyAttachedTasks: false,
        status: "ATIVO"
      },

      UpdateUser: {
        nome: "João Silva Santos",
        email: "joao.santos@empresa.com.br",
        password: "novaSenha123",
        status: "INATIVO"
      },

      // Cliente
      Cliente: {
        id: 1,
        nome: "ActionPlan",
        cnpj: "12.345.678/0001-90",
        email: "contato@actionplan.com.br",
        telefone: "(11) 99999-9999",
        endereco: "Rua da Inovação, 123 - São Paulo, SP"
      },

      // Sector
      Sector: {
        id: 1,
        name: "Tecnologia da Informação",
        acronym: "TI",
        description: "Setor responsável pela infraestrutura de TI",
        status: "ativo",
        color: "#3B82F6",
        createdAt: "2025-01-15T10:30:00.000Z",
        updatedAt: "2025-01-15T10:30:00.000Z"
      },

      CreateSector: {
        name: "Recursos Humanos",
        acronym: "RH",
        description: "Setor de gestão de pessoas",
        color: "#10B981",
        status: "ativo"
      },

      UpdateSector: {
        name: "Recursos Humanos Atualizado",
        acronym: "RH",
        description: "Descrição atualizada do setor",
        status: "ativo",
        color: "#059669"
      },

      // Responses
      ValidationError: {
        error: "Dados inválidos",
        details: ["Email é obrigatório", "Senha deve ter pelo menos 6 caracteres"]
      },

      Error: {
        error: "Mensagem de erro"
      },

      Success: {
        message: "Operação realizada com sucesso"
      },

      Client: {
        id: 1,
        nome: "ActionPlan",
        cnpj: "12.345.678/0001-90",
        email: "contato@actionplan.com.br",
        telefone: "(11) 99999-9999",
        endereco: "Rua da Inovação, 123 - São Paulo, SP",
        sectorId: 2,
        createdAt: "2025-01-15T10:30:00.000Z",
        updatedAt: "2025-01-15T10:30:00.000Z"
      },
      CreateClient: {
        nome: "ActionPlan",
        cnpj: "12.345.678/0001-90",
        email: "contato@actionplan.com.br",
        telefone: "(11) 99999-9999",
        endereco: "Rua da Inovação, 123 - São Paulo, SP",
        sectorId: 2
      },
      UpdateClient: {
        nome: "ActionPlan LTDA",
        email: "contato@actionplan.com.br",
        telefone: "(11) 98888-8888",
        endereco: "Rua Nova, 456 - São Paulo, SP",
        sectorId: 3
      },
      ClientListResponse: {
        totalData: 2,
        totalPages: 1,
        currentPage: 1,
        size: 10,
        data: [
          { $ref: "#/components/schemas/Client" }
        ]
      }
    },

    UserProfile: {
      id: 1,
      nome: "Hermes",
      email: "hermes@actionplan.com.br",
      clienteId: 1,
      isAdmin: true,
      accessLevel: "ADMIN",
      onlyAttachedTasks: false,
      status: "ATIVO",
      createdAt: "2025-01-15T10:30:00.000Z",
      updatedAt: "2025-01-15T10:30:00.000Z"
    },
    
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT"
      }
    }
  },
};

const outputFile = "./config/swagger.json";
const endpointsFiles = ["./routes.js"];

swaggerAutogen({ openapi: "3.0.0" })(outputFile, endpointsFiles, doc)
  .then(async () => {
    console.log('✅ Swagger documentation generated successfully!');
    await import("./server.js");
  });