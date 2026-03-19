---
workflowType: "prd"
workflow: "edit"
initiative: "IN001"
domain: "cli"
status: "active"
classification:
  domain: "general"
  projectType: "cli_tool"
  complexity: "low"
inputDocuments:
  - "_bmad-output/planning-artifacts/product-brief-codemaster.md"
  - "docs/project-context.md"
  - "_bmad-output/planning-artifacts/IN001-cli/architecture.md"
  - "_bmad-output/planning-artifacts/IN001-cli/epics.md"
stepsCompleted:
  - "step-e-01-discovery"
  - "step-e-02-review"
  - "step-e-03-edit"
lastEdited: "2026-03-19"
editHistory:
  - date: "2026-03-19"
    changes: "Conversao para estrutura BMAD e inclusao da capacidade de debug CLI para testes internos"
---

# PRD — IN001 CLI

## Executive Summary

A iniciativa `IN001-cli` cobre a superficie operacional do CodeMaster executada diretamente no terminal do desenvolvedor. Isso inclui instalacao global, setup guiado, persistencia local em `~/.codemaster/`, integracao com Obsidian Vault, progressao de milestones, exemplos de uso e comandos auxiliares que suportam o ciclo de aprendizado.

Esta evolucao adiciona uma capacidade interna de debug para acelerar testes manuais do fluxo de aprendizado sem criar uma iniciativa separada. O objetivo e permitir que o time reproduza rapidamente cenarios realistas de `quest`, `relic` e `victory` sem repetir todo o onboarding nem precisar inventar manualmente perguntas e respostas plausiveis a cada rodada de teste.

O modo `codemaster setup -debug` deve reutilizar as ultimas respostas conhecidas do setup e habilitar um fluxo `codemaster:debug` guiado, interativo e legivel no terminal. Antes de cada envio ao agente, o sistema deve exibir as perguntas e respostas previstas, permitir intervencao manual e manter o fluxo sequencial de `quest`, `relic(s)` e `victory`.

### What Makes This Special

O valor desta evolucao nao esta em automatizar testes por completo, mas em transformar o proprio CLI em ferramenta de validacao operacional. O time consegue testar o comportamento real do produto com baixo atrito, maior transparencia e melhor capacidade de troubleshooting.

A diferenca principal esta na combinacao de reaproveitamento do contexto anterior do setup, geracao assistida de conteudo variado, revisao previa do payload e edicao manual antes do envio. Isso reduz o custo cognitivo do teste sem sacrificar fidelidade do fluxo real.

## Success Criteria

### User Success

O dev consegue acionar `codemaster setup -debug` e preparar rapidamente um ambiente de teste sem responder novamente todo o onboarding inicial. Em seguida, consegue executar `codemaster:debug` para percorrer um fluxo completo de `quest`, `relic(s)` e `victory` sem precisar escrever manualmente perguntas e respostas do zero.

O dev consegue revisar o payload antes de cada envio ao agente, editar o texto quando necessario e inspecionar os arquivos gerados no vault para validar o comportamento final do sistema.

### Business Success

O time reduz o esforco cognitivo e operacional para validar a jornada principal do CodeMaster no dominio CLI. A feature passa a funcionar como mecanismo interno de QA manual e exploracao rapida de cenarios, encurtando o caminho entre ideia de teste e inspecao dos artefatos finais.

### Technical Success

O fluxo debug reutiliza o `config.json` existente, nao exige nova configuracao paralela para o usuario normal e executa um caminho previsivel: gerar `quest`, oferecer uma ou mais `relics` e encerrar com `victory`.

Antes de cada envio ao agente, o sistema mostra claramente o payload com perguntas e respostas, permite ajuste manual e mantem a geracao de artefatos compativel com a estrutura esperada do vault.

### Measurable Outcomes

- O fluxo debug completo pode ser executado sem redacao manual integral de perguntas e respostas.
- 100% das etapas do `codemaster:debug` exibem o payload antes do envio ao agente.
- 100% das etapas permitem intervencao manual antes da execucao.
- O fluxo suporta `1 quest`, `0..n relics` e `1 victory` em sequencia unica.
- Os arquivos gerados permanecem validos e legiveis no vault.
- Perguntas e respostas nao permanecem identicas entre execucoes consecutivas do modo debug.

## Product Scope

### MVP - Minimum Viable Product

- `codemaster setup -debug` habilita o modo oculto de testabilidade interna.
- O setup debug reaproveita as ultimas respostas conhecidas das perguntas iniciais.
- `codemaster:debug` executa fluxo guiado e interativo para `quest`, `relic(s)` e `victory`.
- O fluxo sempre comeca por `quest`, depois pergunta sobre `relics` e termina com `victory`.
- O sistema exibe o payload antes de cada envio ao agente.
- O operador pode editar manualmente o payload antes de aprovar cada etapa.
- Perguntas e respostas variam entre execucoes mesmo com base estrutural fixa.
- Os artefatos podem ser inspecionados diretamente no vault para troubleshooting.

### Growth Features (Post-MVP)

- Regras dinamicas por nivel de dificuldade.
- Regras dinamicas por perfil e nivel do dev.
- Presets de cenarios de teste.
- Controle de seed para reproducao de cenarios especificos.
- Logs persistentes e comparacao entre payload e artefato final.

### Vision (Future)

- Fluxo debug parametrizavel por tipo de missao, dimensao dominante e maturidade do dev.
- Baterias de teste com multiplos cenarios automatizados.
- Ferramentas de validacao assistida destacando divergencias entre payload previsto e artefato gerado.

## User Journeys

### Jornada 1: Dev executa o fluxo debug com sucesso

O dev usa `codemaster setup -debug`, reaproveita seu contexto anterior e inicia `codemaster:debug` para validar rapidamente o comportamento do sistema. Ele aprova a `quest`, gera uma ou mais `relics` e conclui a `victory`, sempre vendo o payload antes de cada envio.

O valor desta jornada esta em percorrer o ciclo completo sem inventar manualmente todo o conteudo de teste e, ao final, conseguir inspecionar arquivos realistas no vault.

### Jornada 2: Dev intervem quando o payload precisa de ajuste

Ao revisar perguntas e respostas antes do envio, o dev percebe que o caso gerado nao destaca o detalhe que ele quer validar. Ele edita o texto manualmente, aprova a etapa e segue no fluxo sem reiniciar tudo.

O valor desta jornada esta em manter velocidade sem perder controle sobre a qualidade do insumo enviado ao agente.

### Jornada 3: Dev reutiliza setup anterior para um novo teste

O dev nao quer responder novamente as perguntas iniciais do setup a cada rodada. O modo `-debug` reaproveita o contexto anterior e reduz a preparacao ao minimo necessario.

O valor desta jornada esta em eliminar atrito operacional antes do fluxo principal de teste.

### Jornada 4: Dev usa o debug para troubleshooting

O dev quer entender se o problema esta no payload gerado, no envio ao agente ou no arquivo final salvo no vault. Ele usa o fluxo debug para observar a cadeia completa de entrada e saida em cada etapa.

O valor desta jornada esta em diagnosticar divergencias reais de comportamento com mais visibilidade.

### Journey Requirements Summary

As jornadas revelam a necessidade de:
- reaproveitamento do contexto do setup em `-debug`
- fluxo sequencial de `quest`, `relic(s)` e `victory`
- exibicao obrigatoria do payload antes de cada envio
- edicao manual do payload antes da execucao
- geracao de artefatos validos no vault
- observabilidade do fluxo completo para troubleshooting

## Contexto

O dominio CLI compreende o pacote npm Node.js que roda no terminal do desenvolvedor. E o veiculo de instalacao global (`npm install -g @marcodotcastro/codemaster`), o wizard interativo de setup e onboarding, a persistencia de estado local (`~/.codemaster/`), a integracao com o Obsidian Vault via filesystem, a deteccao e progressao de milestones, o mecanismo de opt-in da comunidade, a documentacao e exemplos de uso empacotados no npm e, com esta evolucao, a capacidade interna de debug para acelerar testes do fluxo real de aprendizado.

O CLI e o unico comando real executado diretamente pelo dev. Os 5 momentos de reflexao vivem dentro dos agentes (`IN002`, `IN003`), mas a preparacao do contexto, a persistencia de estado local e as capacidades auxiliares de validacao pertencem a `IN001`.

## CLI Tool Specific Requirements

### Project-Type Overview

Esta iniciativa expande o CodeMaster como ferramenta de linha de comando com foco em operacao humana interativa. O modo debug nao e uma API nem um subsistema separado; e uma extensao interna do fluxo CLI para testes rapidos e observaveis.

### Technical Architecture Considerations

O `codemaster:debug` deve operar como fluxo interativo guiado no terminal. Cada etapa precisa ser legivel, revisavel e confirmavel por um operador humano antes da execucao. O sistema deve privilegiar clareza de leitura e pontos explicitos de confirmacao em vez de saida otimizada para consumo por maquina.

A configuracao do modo debug deve depender do estado preparado por `codemaster setup -debug`, reutilizando o contexto anterior do setup e evitando nova matriz de flags finas no MVP.

### Command Structure

- `codemaster setup -debug` ativa o modo oculto de testabilidade interna.
- O setup debug reutiliza as ultimas respostas conhecidas do setup.
- `codemaster:debug` inicia o fluxo guiado de `quest`, `relic(s)` e `victory`.
- O fluxo e sequencial e orientado por confirmacoes humanas.

### Output Formats

- O terminal exibe payloads, confirmacoes, decisoes e progresso em formato textual legivel.
- Perguntas e respostas aparecem de forma clara e editavel antes de cada envio ao agente.
- O MVP nao exige JSON, export estruturado nem saida otimizada para piping.

### Config Schema

- O sistema preserva e reutiliza as informacoes anteriores do setup quando `-debug` e utilizado.
- O estado necessario para debug permanece compativel com o `config.json` existente.
- O modo debug pode marcar estado interno proprio desde que isso nao altere o uso normal do produto.

### Scripting Support

O MVP nao inclui shell completion, suporte formal a scripting nem execucao nao interativa.

## Functional Requirements

- **FR1:** Dev pode instalar o CodeMaster globalmente via npm em qualquer sistema com Node.js 18+
- **FR2:** Dev pode executar o setup como um onboarding guiado que apresenta de forma resumida o metodo CodeMaster antes de coletar configuracoes
- **FR3:** Dev pode configurar identidade, nivel inicial nas 3 dimensoes, foco de evolucao, path do Obsidian Vault e agentes instalados durante o setup
- **FR4:** Sistema pode informar sobre a comunidade CodeMaster durante o setup com opcao de se inscrever imediatamente ou pular para inscricao posterior
- **FR5:** Dev pode reconfigurar o sistema com valores pre-preenchidos da configuracao anterior
- **FR6:** Dev pode executar `codemaster setup -debug` como modo oculto de testabilidade interna para preparar o ambiente de teste com menor atrito
- **FR7:** Sistema pode reutilizar as ultimas respostas conhecidas das perguntas iniciais do setup quando o modo `-debug` e utilizado
- **FR8:** Sistema pode marcar estado interno suficiente para habilitar o fluxo `codemaster:debug` sem criar configuracao paralela para uso normal
- **FR9:** Dev pode visualizar confirmacao de cada etapa do setup com o resultado da acao executada
- **FR10:** Dev pode iniciar `codemaster:debug` para gerar um fluxo guiado de `quest`, `relic(s)` e `victory`
- **FR11:** Sistema pode gerar primeiro uma `quest` no fluxo debug antes de oferecer etapas seguintes
- **FR12:** Sistema pode perguntar ao operador se deseja gerar `relics` apos a etapa de `quest`
- **FR13:** Sistema pode registrar a Quest ativa em `~/.codemaster/active-quest.json` com titulo, path da nota e timestamp
- **FR14:** Operador pode gerar uma ou mais `relics` no mesmo fluxo debug antes da `victory`
- **FR15:** Sistema pode gerar `victory` ao final do fluxo debug apos `quest` e `relic(s)` opcionais
- **FR16:** Sistema pode exibir, antes de cada envio ao agente, as perguntas e respostas que serao encaminhadas
- **FR17:** Sistema pode ler a Quest ativa ao inicio de qualquer comando para contextualizar a sessao
- **FR18:** Sistema pode orientar o dev a criar uma Quest quando nenhuma esta ativa e um comando dependente e chamado
- **FR19:** Operador pode editar manualmente o payload de perguntas e respostas antes de aprovar o envio ao agente em cada etapa do fluxo debug
- **FR20:** Sistema pode gerar perguntas e respostas variadas entre execucoes consecutivas do modo debug
- **FR21:** Sistema pode apresentar visao encadeada do fluxo debug para apoiar troubleshooting entre payload e artefato final
- **FR24:** Sistema pode limpar o `active-quest.json` apos Victory concluida
- **FR25:** Sistema pode detectar a 3a Victory do usuario e exibir convite para opt-in na comunidade
- **FR26:** Dev pode optar por participar da comunidade informando email e telefone durante o fluxo de Victory
- **FR27:** Sistema pode enviar email e telefone para API externa de registro da comunidade com confirmacao
- **FR28:** Sistema pode registrar o resultado do opt-in no config sem bloquear o fluxo se recusado
- **FR29:** Sistema pode detectar a conclusao da 5a Victory de um milestone e avancar automaticamente para o proximo
- **FR30:** Sistema pode criar `milestone-X-summary.md` com resumo de evolucao, padroes emergentes nas 3 dimensoes e maior reliquia do periodo
- **FR31:** Sistema pode consolidar o aprendizado ao final de cada milestone, organizando arquivos de Quest, Relic e Victory em subpastas de historico (`milestone-X/`) e atualizando o `KNOWLEDGE-MAP.md` com os gaps identificados no periodo
- **FR32:** Agente pode orientar o dev a estudar os gaps encontrados ao encerrar um milestone, com base nas tendencias e reliquias do periodo
- **FR43:** Sistema pode criar e manter estrutura de pastas por milestones no Obsidian Vault
- **FR44:** Sistema pode gerar frontmatter estruturado em todos os arquivos de Quest e Victory para consultas Dataview
- **FR45:** Sistema pode manter `config.json` atualizado com todas as preferencias e estado do dev
- **FR46:** Sistema pode detectar e validar o path do Obsidian Vault durante o setup e em cada operacao
- **FR47:** Dev pode acessar exemplos de uso via helper que demonstra um ciclo completo (`quest + relic + victory`) com respostas de exemplo
- **FR48:** Dev pode visualizar exemplo dos arquivos gerados ao final de um milestone completo, incluindo estrutura de pastas, notas de `quest/victory/relic`, `milestone-summary` e `KNOWLEDGE-MAP.md`
- **FR49:** Dev pode consultar referencia de comandos e configuracao via README do pacote

## Non-Functional Requirements

- **NFR1:** O `codemaster setup` deve ser concluido em menos de 5 minutos do inicio ao fim em condicoes normais de filesystem
- **NFR2:** Operacoes de leitura e escrita no Obsidian Vault, incluindo criacao de notas, atualizacao de `PROGRESS.md` e arquivamento de Relic, devem ser concluidas em menos de 3 segundos em filesystems locais padrao
- **NFR3:** A leitura do `active-quest.json` no inicio de cada comando deve ser imperceptivel (`<100ms`) para nao interromper o fluxo do agente
- **NFR4:** O fluxo `codemaster:debug` deve exibir o payload de cada etapa de forma legivel e revisavel antes da execucao
- **NFR5:** A coleta de email e telefone para opt-in da comunidade deve ocorrer somente apos consentimento explicito do dev
- **NFR6:** O envio de dados para a API da comunidade deve usar HTTPS obrigatoriamente; requisicoes HTTP simples devem ser rejeitadas
- **NFR7:** O `config.json` e o `active-quest.json` armazenam dados em texto plano no filesystem local do usuario; o sistema nao deve armazenar credenciais, tokens ou dados sensiveis nesses arquivos
- **NFR8:** O modo debug deve reutilizar o `config.json` existente sem quebrar compatibilidade com o fluxo normal do produto
- **NFR9:** O sistema nao deve fazer chamadas de rede alem do opt-in da comunidade; o ciclo de aprendizado e o fluxo debug devem funcionar 100% offline
- **NFR10:** O modo debug nao deve alterar o comportamento do fluxo normal para usuarios que nao ativarem `-debug`
- **NFR11:** O fluxo debug deve permanecer interativo e humano-legivel no MVP, sem dependencia de shell completion, JSON de saida ou modo nao interativo
- **NFR12:** Perguntas e respostas geradas no modo debug devem evitar repeticao literal em execucoes consecutivas equivalentes
- **NFR13:** A API da comunidade deve retornar resposta em menos de 10 segundos; timeout deve ser tratado graciosamente sem falhar o fluxo de Victory
- **NFR14:** O sistema deve funcionar nos principais sistemas operacionais onde Node.js 18+ e suportado (`macOS`, `Linux`, `Windows com WSL`)
