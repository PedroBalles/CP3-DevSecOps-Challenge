# Execuções reais no GitHub Actions

Repositório: <https://github.com/PedroBalles/CP3-DevSecOps-Challenge>

## Execução de referência — run #23, 8/8 com aprovação humana

**Run [#23](https://github.com/PedroBalles/CP3-DevSecOps-Challenge/actions/runs/41322728115)** — commit `2057159`, disparada por `workflow_dispatch`,
duração 6m13s, **12 artifacts**.

| Etapa | Resultado |
|---|---|
| 1. Gitleaks | success — 0 segredos |
| 2. Semgrep | success — 0 achados, 0 erros |
| 3. Build / testes | success — 39 testes, typecheck limpo |
| 4. Trivy SCA | success — 0 HIGH / 0 CRITICAL |
| 5. Docker + GHCR | success — imagem por digest |
| 6. Trivy imagem | success — 0 HIGH / 0 CRITICAL |
| 7. Homologação + ZAP | success — 0 High, 2 Medium, 3 Low |
| 8. Aprovação + produção | success — aprovada por PedroBalles no Environment `producao` |
| ★ Resumo da Esteira | success — consolidado com as contagens reais |

Produção verificada após a aprovação:

```
GET https://cp3-devsecops-challengeatsha256.onrender.com/api/health
{"status":"ok","service":"casa-digital-segura","revision":"2057159ee7baafbfa499f1f8fe7dc382a3814f39"}
```

A revisão devolvida é idêntica ao commit aprovado — é o que o step
`verificar-producao.sh` exige para liberar a etapa.

**Consistência:** as runs #16, #17, #20, #21, #22 e #23 fecharam 8/8. Não é
resultado de uma tentativa isolada.

## Histórico do caminho até aqui

As seções abaixo registram execuções anteriores, mantidas porque documentam as
falhas reais encontradas e corrigidas — inclusive as que só apareceram no Actions.

## Execução completa com aprovação humana — 8/8

**Run [41255845564](https://github.com/PedroBalles/CP3-DevSecOps-Challenge/actions/runs/41255845564)**
— commit `37269ca`, aprovada manualmente no Environment `producao`.

| Etapa | Resultado | Achados medidos |
|---|---|---|
| 1. Gitleaks | success | 0 segredos |
| 2. Semgrep | success | 0 achados, 0 erros |
| 3. Build / npm audit | success | 39 testes; audit informativo: 1 high (dev) |
| 4. Trivy SCA | success | 0 HIGH / 0 CRITICAL / 0 misconfig |
| 5. Docker + GHCR | success | digest `sha256:62feed1b...` |
| 6. Trivy imagem | success | 0 HIGH / 0 CRITICAL |
| 7. Homologação + ZAP | success | 0 High, 2 Medium, 3 Low, 3 Info |
| 8. Aprovação + produção | success | deploy `dep-dbj8mfh42hec73cap0g0`, revisão `37269ca` |
| ★ Resumo da Esteira | success | consolidado |

### Deploy real (etapa 8)

```
Plataforma: Render (plano free)
URL:        https://cp3-devsecops-challengeatsha256.onrender.com
Imagem:     ghcr.io/pedroballes/cp3-devsecops-challenge@sha256:62feed1b...
Deploy id:  dep-dbj8mfh42hec73cap0g0
Status:     live em ~40s
Health:     {"status":"ok","revision":"37269ca7924b932f4a7eb512ff55d260e930d9f2"}
```

O health check compara `revision` com `GITHUB_SHA`: a revisão servida é o commit
aprovado, não apenas "algo que responde". Se o Render entregasse imagem antiga, a
etapa falharia.

### Aprovação humana (evidência do controle)

O job 8 ficou em `waiting` até a aprovação manual no Environment `producao`
(1 revisor obrigatório). O `autoDeploy` do Render foi desligado por API
(`autoDeploy: no`) para que nenhum push chegue em produção sem passar pelo gate.

O deployment review fica registrado na própria execução, em
"Review deployments" — fonte do nome do aprovador e do horário.

## Histórico de falhas corrigidas durante a execução real

Registro das falhas que só apareceram no Actions (nenhuma reproduzia em teste
local), com a correção aplicada:

| # | Falha | Causa | Correção |
|---|---|---|---|
| 1 | Trivy 35 HIGH | CI usa `--include-dev-deps`; scan local não | 8 `overrides` de dependências |
| 2 | Docker build quebrado | `.dockerignore` excluía `.openai/`, importado por `vite.config.ts` | exceção `!.openai/hosting.json` |
| 3 | 58 achados na imagem | base Debian desatualizada + npm no runtime | `apt-get upgrade` e remoção do npm |
| 4 | ZAP exit 3 | `docker run` manual não gravava relatório | action oficial `zaproxy/action-baseline` |
| 5 | ZAP exit 2 | YAML dobrava um `for` em linha única | script `consolidar-zap.sh` |
| 6 | Semgrep exit 2 com 0 achados | `--strict` falhava no `on:` do próprio workflow | `.github/workflows/` no `.semgrepignore` |
| 7 | curl `401` + `Could not resolve host: reports` | YAML quebrou a continuação `\` do curl | scripts `deploy-render.sh` |
| 8 | "revisão servida difere" | health check rodava antes do deploy ficar `live` | aguarda `status=live` na API do Render |
| 9 | artifact da etapa 8 ausente | steps de relatório/upload perdidos em edição | restaurados |

O padrão que mais custou tempo: **YAML dobrando shell de múltiplas linhas**. Todo
step com `\` de continuação virou script em `scripts/ci/`.

## Pendências desta entrega

- Prints em `docs/evidencias/` (pasta de imagens) ainda não foram anexados.
- Execução com bloqueio proposital do Gitleaks em branch de teste: o gate foi
  comprovado localmente (ver `validacao-local.md`), mas não há run pública do
  bloqueio de segredo. A demonstração pública de bloqueio existe para o Semgrep.

## Execução completa com aprovação humana — 41258247592

Commit `53d7796` — **todas as 8 etapas com success**.

| Etapa | Resultado | Achados |
|---|---|---|
| 1 Gitleaks | success | 0 segredos |
| 2 Semgrep | success | 0 achados, 0 erros |
| 3 Build / testes | success | 31 itens informativos no `npm audit` |
| 4 Trivy SCA | success | 0 HIGH / 0 CRITICAL |
| 5 Docker + GHCR | success | imagem por digest |
| 6 Trivy imagem | success | 0 HIGH / 0 CRITICAL |
| 7 Homologação + ZAP | success | 0 High, 2 Medium, 3 Low, 3 Info |
| 8 Aprovação + produção | success | deploy no Render confirmado |

**Aprovação registrada:** `PedroBalles` — estado `approved` — ambiente `producao`
(consultado via API `/actions/runs/41258247592/approvals`).

**Produção verificada ao vivo:**

```json
{"status":"ok","service":"casa-digital-segura","revision":"53d779681739e94ad1ff2ec6a5cdbd0aceb12fd5"}
```

O health check do próprio workflow compara a revisão servida com o `GITHUB_SHA`,
então o deploy só passa se a imagem em produção for exatamente a do commit aprovado.

**Artifacts publicados (12 entre relatórios e binários):** `relatorio-01` a
`relatorio-08`, `resumo-da-esteira`, `artefato-aplicacao-53d7796`, `zap_scan` e o
manifesto do buildx.

Link: <https://github.com/PedroBalles/CP3-DevSecOps-Challenge/actions/runs/41258247592>
