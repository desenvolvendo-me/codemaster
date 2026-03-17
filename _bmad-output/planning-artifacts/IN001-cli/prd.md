---
initiative: IN001
domain: cli
status: active
inputDocuments: ["_bmad-output/planning-artifacts/prd.md"]
---

# PRD — IN001 CLI

## Contexto

O domínio CLI compreende o pacote npm Node.js que roda no terminal do desenvolvedor. É o veículo de instalação global (`npm install -g @marcodotcastro/codemaster`), o wizard interativo de setup e onboarding, a persistência de estado local (`~/.codemaster/`), a integração com o Obsidian Vault via filesystem, a detecção e progressão de milestones, o mecanismo de opt-in da comunidade e toda a documentação e exemplos de uso empacotados no npm. O CLI é o único comando real executado diretamente pelo dev; os 5 momentos de reflexão vivem dentro dos agentes (IN002, IN003).

## Functional Requirements

- **FR1:** Dev pode instalar o CodeMaster globalmente via npm em qualquer sistema com Node.js 18+
- **FR2:** Dev pode executar o setup como um **onboarding guiado** que apresenta de forma resumida o método CodeMaster (os 5 momentos, as 3 dimensões e o objetivo) antes de coletar configurações
- **FR3:** Dev pode configurar identidade, nível inicial nas 3 dimensões, foco de evolução, path do Obsidian Vault e agentes instalados durante o setup
- **FR4:** Sistema pode informar sobre a comunidade CodeMaster durante o setup com opção de se inscrever imediatamente ou pular para inscrição posterior
- **FR5:** Dev pode reconfigurar o sistema com valores pré-preenchidos da configuração anterior
- **FR9:** Dev pode visualizar confirmação de cada etapa do setup com o resultado da ação executada
- **FR13:** Sistema pode registrar a Quest ativa em `~/.codemaster/active-quest.json` com título, path da nota e timestamp
- **FR17:** Sistema pode ler a Quest ativa ao início de qualquer comando para contextualizar a sessão
- **FR18:** Sistema pode orientar o dev a criar uma Quest quando nenhuma está ativa e um comando dependente é chamado
- **FR24:** Sistema pode limpar o `active-quest.json` após Victory concluída
- **FR25:** Sistema pode detectar a 3ª Victory do usuário e exibir convite para opt-in na comunidade
- **FR26:** Dev pode optar por participar da comunidade informando email e telefone durante o fluxo de Victory
- **FR27:** Sistema pode enviar email e telefone para API externa de registro da comunidade com confirmação
- **FR28:** Sistema pode registrar o resultado do opt-in no config sem bloquear o fluxo se recusado
- **FR29:** Sistema pode detectar a conclusão da 5ª Victory de um milestone e avançar automaticamente para o próximo
- **FR30:** Sistema pode criar `milestone-X-summary.md` com resumo de evolução, padrões emergentes nas 3 dimensões e maior relíquia do período
- **FR31:** Sistema pode **consolidar o aprendizado ao final de cada milestone** — organizando arquivos de Quest, Relic e Victory em subpastas de histórico (`milestone-X/`) e atualizando o KNOWLEDGE-MAP.md com os gaps identificados no período
- **FR32:** Agente pode **orientar o dev a estudar os gaps encontrados** ao encerrar um milestone, com base nas tendências e relíquias do período
- **FR43:** Sistema pode criar e manter estrutura de pastas por milestones no Obsidian Vault
- **FR44:** Sistema pode gerar frontmatter estruturado em todos os arquivos de Quest e Victory para consultas Dataview
- **FR45:** Sistema pode manter `config.json` atualizado com todas as preferências e estado do dev
- **FR46:** Sistema pode detectar e validar o path do Obsidian Vault durante o setup e em cada operação
- **FR47:** Dev pode acessar exemplos de uso via helper que demonstra um ciclo completo (quest + relic + victory) com respostas de exemplo
- **FR48:** Dev pode visualizar **exemplo dos arquivos gerados ao final de um milestone completo** — incluindo estrutura de pastas, notas de quest/victory/relic, milestone-summary e KNOWLEDGE-MAP.md — para entender claramente o resultado esperado do sistema
- **FR49:** Dev pode consultar referência de comandos e configuração via README do pacote

## Non-Functional Requirements

- **NFR1:** O `codemaster setup` deve ser concluído em menos de 5 minutos do início ao fim em condições normais de filesystem
- **NFR2:** Operações de leitura e escrita no Obsidian Vault (criar nota, atualizar PROGRESS.md, arquivar Relic) devem ser concluídas em menos de 3 segundos em filesystems locais padrão
- **NFR3:** Leitura do `active-quest.json` no início de cada comando deve ser imperceptível (<100ms) para não interromper o fluxo do agente
- **NFR5:** A coleta de email e telefone para opt-in da comunidade deve ocorrer somente após consentimento explícito do dev — nunca automaticamente
- **NFR6:** O envio de dados para a API da comunidade deve usar HTTPS obrigatoriamente — requisições HTTP simples devem ser rejeitadas
- **NFR7:** O `config.json` e `active-quest.json` armazenam dados em texto plano no filesystem local do usuário — o sistema não deve armazenar credenciais, tokens ou dados sensíveis nesses arquivos
- **NFR9:** O sistema não deve fazer chamadas de rede além do opt-in da comunidade — o ciclo de aprendizado deve funcionar 100% offline
- **NFR13:** A API da comunidade deve retornar resposta em menos de 10 segundos — timeout deve ser tratado graciosamente sem falhar o fluxo de Victory
- **NFR14:** O sistema deve funcionar nos principais sistemas operacionais onde Node.js 18+ é suportado (macOS, Linux, Windows com WSL)
