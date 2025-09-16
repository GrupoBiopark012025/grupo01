# 📋 ActionPlanner

[![Status](https://img.shields.io/badge/status-em%20desenvolvimento-yellow)](#)
[![Conventional Commits](https://img.shields.io/badge/commits-Conventional%20Commits-blue)](https://www.conventionalcommits.org/pt-br/v1.0.0/)
[![License](https://img.shields.io/badge/license-MIT-green)](#)
[![Kanban](https://img.shields.io/badge/Kanban-Organizado-orange)](#)
![Agile](https://img.shields.io/badge/Methodology-Agile-blue)
![User Stories](https://img.shields.io/badge/User%20Stories-Available-yellowgreen)

## 📖 Sobre o Projeto
O **ActionPlanner** é um projeto desenvolvido como parte de um trabalho acadêmico, tendo como objetivo atender a demanda de um cliente real.  
O sistema visa **gerenciar planos de ação** de forma simples, intuitiva e eficiente, permitindo acompanhar tarefas, prazos e responsáveis.  

O desenvolvimento seguirá **boas práticas de versionamento, organização e padronização de commits** para garantir qualidade e rastreabilidade do código.  

## 🛠️ Tecnologias Utilizadas
- **Linguagem/Framework:** No Front-End Angular + TS. No Back-End NodeJS + ExpressJS
- **Controle de versão:** Git + GitHub
- **Metodologia:** Kanban, Stories, T-Shirt Size, Definition of Done e Status Report
- **Padrão de commits:** [Conventional Commits](https://www.conventionalcommits.org/)

## 📌 Padrão de Commits
Adotaremos o padrão **[Conventional Commits](https://www.conventionalcommits.org/)**, que ajuda a manter um histórico de mudanças claro e automatizar a geração de changelogs.  
Exemplos de commits:
- `feat: adicionar funcionalidade de criação de tarefas`
- `fix: corrigir bug na tela de login`
- `docs: atualizar documentação do README`
- `refactor: otimizar função de listagem de ações`

## 📋 Fluxo de Trabalho (Workflow)

O desenvolvimento será organizado no modelo **Kanban**, com as seguintes colunas:

1. **Backlog** – Lista de tarefas e demandas pendentes de análise e pontuação.
2. **Analysis** – Lista de tarefas e demandas a sendo analisadas e pontuadas.
3. **To-Do** – Lista de tarefas e demandas a serem desenvolvidas.
4. **In Progress** – Tarefas atualmente em desenvolvimento.
5. **Code Review** – Tarefas concluídas e aguardando revisão de código.
6. **Done** – Tarefas finalizadas e aprovadas.

## 🔄 Regras do Fluxo

- Cada tarefa terá **sua própria branch**, nomeada conforme o padrão:

```tipo/nome-da-tarefa```

Exemplos:  
- `feat/cadastro-usuarios`
- `fix/erro-login`
- `docs/atualizar-readme`

Ao finalizar o desenvolvimento da tarefa:
1. **Abrir um Merge Request (MR)** para a coluna **Code Review**.
2. Caso **aprovado no Code Review**, o código será **mergeado** na branch `dev` (branch **default** do projeto).
3. Apenas após a validação e testes, o código será encaminhado para produção.

## 👥 Equipe
Isaac, João, Kelvin, Bernardo, Igor

## 📜 Licença
Este projeto está sob a licença **MIT** - veja o arquivo [LICENSE](LICENSE) para mais detalhes.