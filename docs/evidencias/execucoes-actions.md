# Execuções reais no GitHub Actions

Repositório: <https://github.com/PedroBalles/CP3-DevSecOps-Challenge>

Registro do que o Actions executou de fato. **7 das 8 etapas passam** com a configuração atual.
A etapa 8 está bloqueada por falta das variables do Environment `producao` (Azure), o que é o
comportamento correto do gate: sem credencial, não há deploy.

## Execução de referência

Run: [41235024506](https://github.com/PedroBalles/CP3-DevSecOps-Challenge/actions/runs/41235024506)
Commit: `757a19cc67f151ac4608423f1bca6e297a7cbf36`

| Etapa | Resultado | Achados reportados |
|---|---|---|
| 1. Gitleaks | success | 0 segredos |
| 2. Semgrep | success | 0 achados, 0 erros |
| 3. Build / npm audit | success | 31 vulns (o high é dev-only) |
| 4. Trivy SCA | success | 0 HIGH, 0 CRITICAL |
| 5. Docker + GHCR | success | — |
| 6. Trivy imagem | success | 0 HIGH, 0 CRITICAL |
| 7. Homologação + ZAP | success | 0 High, 2 Medium, 3 Low, 3 Info |
| 8. Aprovação + produção | failure | variável `AZURE_CLIENT_ID` ausente |

Artifacts publicados nessa execução (10 no total):

`relatorio-01-gitleaks`, `relatorio-02-semgrep`, `relatorio-03-build`,
`relatorio-04-trivy-sca`, `relatorio-05-docker-build`, `relatorio-06-trivy-image`,
`relatorio-07-homologacao-zap`, `relatorio-08-producao`, `resumo-da-esteira`,
`artefato-aplicacao-757a19c…`.

## Falhas encontradas e corrigidas durante a execução real

Nenhuma destas aparecia em teste local — cada uma só se revelou no Actions:

| # | Sintoma | Causa | Correção |
|---|---|---|---|
| 1 | Etapa 4 falhou com 35 HIGH | Trivy com `--include-dev-deps` enxerga dev; meu scan local não usava a flag | `overrides` de 8 pacotes (`vite`, `undici`, `ws`, `js-yaml`, `brace-expansion`, `fast-uri`, `browserslist`, `image-size`) |
| 2 | Etapa 5 falhou no build da imagem | `.dockerignore` excluía `.openai/`, importado por `vite.config.ts` | exceção `!.openai/hosting.json` |
| 3 | Etapa 6 falhou com 58 achados | base Debian desatualizada + npm empacotado no runtime | `apt-get upgrade` no estágio final e remoção do npm do runtime |
| 4 | Etapa 7 falhou com exit 3 | ZAP não gravava o relatório via `docker run` manual | action oficial `zaproxy/action-baseline` |
| 5 | Etapa 7 falhou de novo (exit 2) | YAML dobrou o `for` do step de consolidação em uma linha | script `scripts/ci/consolidar-zap.sh` |
| 6 | Etapa 2 falhou com 0 achados | `--strict` retorna 2 por `Internal matching error` no próprio workflow (`on:` lido como booleano) | `.github/workflows/` no `.semgrepignore` |
| 7 | Etapa 8 sem artifact | `if-no-files-found: error` com `reports/` vazio | `scripts/ci/registrar-producao.sh` grava o estado mesmo em bloqueio |

## Pendências para concluir

1. Criar os Environments `homologacao` e `producao` em Settings → Environments.
2. Em `producao`, exigir revisor (Required reviewers) — sem isso o YAML não impõe aprovação.
3. Preencher as variables do Environment `producao`: `AZURE_CLIENT_ID`, `AZURE_TENANT_ID`,
   `AZURE_SUBSCRIPTION_ID`, `AZURE_RESOURCE_GROUP`, `AZURE_WEBAPP_NAME`, `DEPLOY_URL`.
4. Configurar identidade federada OIDC no Entra ID e conceder acesso ao Web App.
5. Tornar o pacote do GHCR público para o Azure conseguir puxar a imagem.
6. Rodar novamente e aprovar manualmente na revisão do deployment.
7. Tirar os prints listados em [README](README.md) a partir dessa execução.

Nada acima pode ser feito por token de API: Environments exigem permissão de
`Administration` e o deploy exige credenciais Azure reais.
