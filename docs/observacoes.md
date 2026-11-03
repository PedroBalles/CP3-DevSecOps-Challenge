# Observações e análise crítica

## Estado da entrega

Esteira completa em execução no GitHub Actions. A run **#23** (commit `2057159`) concluiu as 8 etapas com `success`, teve **aprovação humana registrada** no Environment `producao` e publicou a aplicação em produção. Execuções anteriores (#16, #17, #20, #21, #22) também fecharam 8/8. As sete falhas reais encontradas no caminho e suas correções estão registradas em
[execucoes-actions.md](evidencias/execucoes-actions.md); as medições locais estão em [validacao-local.md](validacao-local.md). Nenhum resultado foi fabricado.

## Registro de achados

| ID / severidade | Local | Classificação | Ação e estado | Evidência seguinte |
|---|---|---|---|---|
| 11 × `generic-api-key` / informativo | `lib/auth/repository.ts`, `public/arcade-games/*` em 5 commits | **Falso positivo** de chave de API | Fingerprints corretos em `.gitleaksignore` | Repetição: 0 ocorrências, exit 0 |
| `.gitleaksignore` inerte / defeito de gate | `.gitleaksignore` | Defeito real na esteira | Fingerprints usavam `***` (saída `--redact`) e nunca casavam; regravados a partir do relatório completo | Antes 11 achados/exit 1 → depois 0/exit 0 |
| Typecheck mascarado / defeito de gate | `.github/workflows/devsecops.yml` etapa 3 | Defeito real na esteira | `npx tsc \| tee` devolvia o status do `tee`; adicionado `set -o pipefail` | 12 erros de TS que passariam batido |
| 12 erros de TypeScript / build quebrado | `lib/state/persistence.ts`, `lib/domain/rules.ts`, `db/index.ts` | Defeito real de código | Narrowing perdido em closures, `Set` com tipo literal estreito, `env.DB` sem tipo | `tsc --noEmit`: 0 erros |
| `@cloudflare/workers-types` ausente / build | `package.json`, `db/index.ts` | Defeito real de configuração | Peer opcional nunca instalado; adicionado fixado em `4.20260702.1` | `cloudflare:workers` resolve |
| 5 CRITICAL + 14 HIGH / CVEs | `next@16.2.6`, `postcss`, `nanoid`, `source-map-js`, `sharp` | **Vulnerabilidades reais** | `next` → 16.4.1, `eslint-config-next` → 16.4.1, `overrides` fixando as transitivas | Trivy: 19 → **0** |
| CSP `unsafe-inline` / risco residual | `next.config.ts` | Risco aceito, avaliado pelo revisor | Mantido por compatibilidade de hidratação/estilos; requer nonce/hash | ZAP: 0 High, 2 Medium, 3 Low; aprovado com ressalva |
| Identidade recebida em header / severidade depende do uso | `app/chatgpt-auth.ts` | Risco arquitetural do template; não usado como autorização pela UI atual | Documentado limite do gateway; não habilitar login por header público | Necessária autenticação validada se rotas protegidas forem criadas |

### Gitleaks

Varredura real com `--all --redact` sobre o clone completo (6 branches): **18 commits,
59,74 MB, 11 ocorrências `generic-api-key`**, exit 1. Os 11 achados foram inspecionados
no commit de origem e classificados como falsos positivos:

- **2 ocorrências** em `9281140c`: constantes usadas como nome público de armazenamento
  local nos jogos (`campaign.js:4` e `game.js:7`), consumidas por `localStorage`, sem
  autenticar serviço.
- **9 ocorrências** em `lib/auth/repository.ts`, nos commits `4dac60dc`, `3da02be2`,
  `05477559`, `8040340a` e `21caf03`: valores do campo `passwordSalt` de dados seed.
  Salt não é segredo de autenticação e deve acompanhar o hash.

**Não foram suprimidos hashes ou senhas por diretório, nem regras inteiras** — apenas as
11 ocorrências exatas. Isso não certifica os usuários seed como seguros: se essas contas
existirem em ambiente real, desabilitar contas de demonstração e revisar/rotacionar
credenciais.

### Semgrep

Rulesets exigidos `p/default` e `p/owasp-top-ten` mais cinco regras locais:
**540 regras, 226 arquivos, 0 achados, 0 erros**. Nenhum `nosemgrep` foi adicionado.

O gate foi testado com uma fixture contendo `eval(...)`: exit **1**, regra
`javascript-no-eval` em `lib/__gate-demo.ts:3`; após remover a fixture, exit **0**.
Ferramenta e regras locais não garantem cobertura total de XSS ou command injection.

### Trivy filesystem e imagem

Nenhuma `.trivyignore`. Gate fs HIGH/CRITICAL; imagem bloqueia HIGH/CRITICAL com
correção, conforme o PDF. As 19 vulnerabilidades encontradas tinham correção e foram
resolvidas por upgrade — não por supressão. Vulnerabilidades sem correção continuariam
aparecendo na tabela completa, para avaliação do responsável. Versões fixadas são
rastreáveis, **não sinônimo de versões sem CVE**.

O scan da imagem (etapa 6) foi executado no GitHub Actions e passou com 0 HIGH / 0 CRITICAL na [run #23](https://github.com/PedroBalles/CP3-DevSecOps-Challenge/actions/runs/41322728115). Localmente não há runtime de contêiner — foi por isso que as primeiras versões da imagem só revelaram problemas (npm empacotado, base Debian desatualizada) quando o scan rodou no Actions.

#### Trivy e `npm audit` discordam — e os dois estão certos no próprio escopo

Medido nas mesmas dependências, depois das correções: **Trivy fs (todas as severidades): 0** e
**`npm audit`: 11 high + 26 moderate**. A divergência tem três causas concretas, e vale mais
que qualquer um dos números isolados:

1. **Banco de dados diferente.** O Trivy consulta OSV/GHSA publicados no `trivy-db`; o
   `npm audit` consulta o advisory database do npm, com entradas que ainda não migraram para
   o OSV. Advisory recente aparece em um e não no outro.
2. **Escopo de produção.** `npm audit --omit=dev` → **0 em todas as severidades**;
   `npm audit` completo → 11 high. Nenhum dos 11 high está no runtime: `vite`, `ws`,
   `undici`, `zod`, `js-yaml`, `browserslist`, `brace-expansion`, `fast-uri` e
   `react-server-dom-webpack` são de build/teste. Confirmado por inspeção de
   `dist/standalone/node_modules` (57 pacotes): só `image-size` atravessava para o runtime.
3. **`image-size@2.0.2` era o único achado real de produção** que o Trivy não reportou —
   exatamente o caso (1). Corrigido para 2.0.4 via `overrides`; `npm audit --omit=dev`
   fechou em 0 e o `dist/standalone` passou a levar 2.0.4.

Consequência para o gate: `npm audit` no workflow é **informativo** e o Resumo publica as
contagens em linha separada. Fingir que o Trivy cobre o que o npm vê (ou o contrário) seria
produzir evidência falsa de segurança. O caminho correto é comparar os dois relatórios.

Uma nota de método: as contagens do `npm audit` **mudam ao longo do tempo** porque a base de
advisories do npm é atualizada continuamente. Reexecutado poucas horas depois, o mesmo
`package-lock.json` passou de 11 high + 26 moderate para **9 high + 27 moderate** — sem
nenhuma alteração no código. Por isso o workflow gera `npm-audit.json` e
`npm-audit-producao.json` na própria execução, em vez de depender de número escrito na
documentação. As contagens deste documento são um retrato datado, não um valor estável.

#### Um erro meu que a checagem cruzada pegou

A primeira rodada de correção fixou `postcss` em **8.5.18**, versão que ainda está dentro da
faixa vulnerável (`<=8.5.22`, GHSA-6g55-p6wh-862q). O Trivy fs com filtro `HIGH,CRITICAL`
deu 0 e escondeu o problema, porque o advisory é **moderate** e o filtro descartava o resto.
Lição registrada: rodar o scan de fechamento **sem filtro de severidade** e cruzar com
`npm audit --omit=dev`, em vez de confiar no filtro que o gate usa.

### ZAP

Baseline deve rodar somente em homologação própria, informativo quanto a alertas.
Falha de scanner, falta de JSON ou ausência de alvo não são tratadas como sucesso.
**Não há relatório ZAP real nesta entrega** — depende da etapa 5 (imagem) e de Docker.

## Registro de decisão

- URL da execução completa: https://github.com/PedroBalles/CP3-DevSecOps-Challenge/actions/runs/41322728115 (run #23, commit `2057159`).
- Aprovador real: **PedroBalles**, ambiente `producao`.
- Data/hora: 2026-11-01, registrada no deployment review da run #23.
- Relatórios consultados: artifacts `relatorio-01` a `relatorio-07` da mesma execução.
- URL produção: https://cp3-devsecops-challengeatsha256.onrender.com
- Commit promovido: `2057159ee7baafbfa499f1f8fe7dc382a3814f39`, deploy por digest da imagem no GHCR.
- Riscos aceitos: CSP com `unsafe-inline` (compatibilidade de hidratação) e ZAP com 2 alertas Medium e 3 Low, avaliados pelo revisor antes da aprovação.

## Provedor de nuvem

A versão inicial usava Azure App Service com OIDC. Foi descartado por exigir (conta paga e identidade federada), conforme registrado abaixo. Detalhe:
cartão de crédito e configuração de identidade federada no Entra ID, sem ganho
para o escopo avaliado. A etapa 8 foi reescrita para Render (plano Free, imagem
pré-construída do GHCR), mantendo intactos o gate de aprovação humana, o deploy
por digest imutável e a verificação de revisão via `/api/health`. O enunciado
permite qualquer provedor; o que se avalia é o deploy real e rastreável.

## Lições aprendidas / observações técnicas

1. **A ferramenta de supressão pode ser o próprio falso negativo.** O `.gitleaksignore`
   parecia correto e estava inerte: o fingerprint gerado com `--redact` traz `***`, que
   nunca coincide com o segredo comparado. Um gate "configurado" não é gate funcionando —
   só a execução com e sem a supressão prova o comportamento.
2. **`comando | tee arquivo` esconde falha de gate.** O status devolvido é o do `tee`.
   Sem `set -o pipefail`, typecheck quebrado publica relatório bonito e etapa verde. Isso
   é mais perigoso que não ter typecheck, porque produz evidência falsa de qualidade.
3. **Ordem e semântica dos gates precisam refletir o enunciado:** ZAP aqui é informativo,
   não um substituto do revisor humano.
4. **SCA do lockfile e scan do contêiner têm escopos diferentes**; bibliotecas dev e
   pacotes da base não devem ser confundidos.
5. **Aprovação humana é configuração de proteção do Environment**, não a presença da
   palavra `environment` no YAML.
6. **Aplicação saudável pode estar na revisão antiga**; comparar `/api/health` ao SHA
   evita falso sucesso no deploy.
7. **`always()` preserva os relatórios de erro**, mas arquivo ausente não pode ser
   convertido em zero achados.
8. **`npm audit fix --force` é armadilha em esteira:** rebaixou `eslint` para 4.0.0 e
   substituiu `vinext` por 1.4.0. O upgrade precisa ser direcionado, com `overrides`
   explícitos e build/testes após cada passo.
9. **CSP com `unsafe-inline` reduz proteção contra XSS**; planejar nonce e testes reais
   antes de chamá-la de estrita.
10. **Dois scanners discordando é informação, não ruído.** Trivy fs fechou em 0 enquanto
    `npm audit` acusava 11 high. Nenhum estava errado: bases de advisory diferentes e
    escopos diferentes. O achado de produção real (`image-size@2.0.2`) só apareceu porque
    os dois foram cruzados — o Trivy não o conhecia.
11. **Filtro de severidade no scan de fechamento esconde regressão.** Rodar o Trivy só com
    `HIGH,CRITICAL` deu 0 enquanto `postcss@8.5.18` seguia vulnerável (advisory *moderate*).
    O scan final deve rodar sem filtro; o filtro é política de gate, não de verificação.
12. **Repositório raso invalida o scan de histórico.** Um `git fetch --depth=1` deixou o clone
    local com 6 commits em vez dos 20 reais, e o Gitleaks passou a varrer um histórico
    incompleto — sem erro, sem aviso. Os fingerprints do `.gitleaksignore` referenciavam
    commits que o clone raso não tinha. Corrigido com `git fetch --unshallow`; a verificação
    é `git rev-parse --is-shallow-repository` e conferir se cada commit citado no ignore
    resolve com `git cat-file -t`. Por isso `actions/checkout` usa `fetch-depth: 0`.
13. **`--strict` transforma erro de parse em "falha de segurança".** O Semgrep saiu com exit 2
    e 0 achados na etapa 2. A mensagem parecia vulnerabilidade; o `errors[]` do JSON mostrava
    `Internal matching error` no próprio `devsecops.yml`, porque a chave `on:` do GitHub
    Actions é lida como booleano no dialeto YAML 1.1. Ler `results[]` e `errors[]` separadamente
    evitou caçar um problema de segurança que não existia.
14. **Duração do pipeline remoto e taxa de falsos positivos ainda não foram medidas.**
    Após executar no Actions, registrar duração por job e ocorrências reais, sem atribuir
    medições à equipe antecipadamente.

    # Observações e Análise Crítica da Esteira DevSecOps

## Análise por Etapa

### 1. Gitleaks (Verificação de Secrets)
- **Achado:** Varredura realizada em todo o histórico do repositório (`fetch-depth: 0`).
- **Ação Tomada:** Utilizado o arquivo `.gitleaksignore` para mascarar falsos positivos validados pela equipe.

### 2. Semgrep (SAST)
- **Achado:** Análise estática do código-fonte com foco em segurança (regras OWASP Top 10).
- **Ação Tomada:** Correção de vulnerabilidades apontadas e documentação de supressões necessárias.

### 3. Trivy (SCA e Image Scan)
- **Achado:** Varredura de vulnerabilidades em dependências da aplicação e na imagem Docker.
- **Ação Tomada:** Otimização do `Dockerfile` (multi-stage, atualização de pacotes do sistema e usuário não-root).

## Lições Aprendidas
1. A cultura *shift-left security* garante que falhas de segurança sejam detetadas logo no commit.
2. O uso de quality gates impede automaticamente que códigos vulneráveis avancem.
3. A automação com GitHub Actions padroniza a segurança do ciclo de vida do software.
4. A documentação técnica detalhada é essencial para o rastreio de melhorias.
5. O controlo de aprovação humana (*Required Reviewers*) é fundamental para o deploy seguro em produção.
