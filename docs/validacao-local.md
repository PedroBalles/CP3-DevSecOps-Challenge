# Validação local — o que realmente foi executado

Registro das execuções verificáveis nesta máquina, com valores observados.
O que dependia de Docker e GHCR **foi executado no GitHub Actions** (etapas 5 e 6). O deploy de produção usa Render e depende das variables do Environment.

Data das execuções: 2026-10-31.
Base: branch `master`, commit `82a7d12`.

## Ambiente

| Item | Valor observado |
|---|---|
| Node | v26.8.1 |
| npm | 11.19.0 |
| Gitleaks | 8.30.1 |
| Semgrep | 1.183.0 |
| Trivy | 0.76.1 |
| Docker / Podman / buildah | ausentes (`docker: command not found`) |

## Etapa 1 — Gitleaks

Executado sobre o clone completo (todas as branches), não só o `master`:

```bash
gitleaks git --redact --log-opts='--all' --report-format json --report-path gitleaks.json --exit-code 1 .
```

| Execução | Resultado |
|---|---|
| Histórico completo, `.gitleaksignore` original | 18 commits, 59,74 MB, **11 ocorrências** `generic-api-key`, exit 1 |
| Após corrigir os fingerprints | 18 commits, 59,74 MB, **0 ocorrências**, exit 0 |

### Defeito encontrado e corrigido no `.gitleaksignore`

As 11 linhas usavam o formato redigido:

```
9281140c…:public/arcade-games/dumb-ways-to-phish/campaign.js:generic-api-key:***
```

O Gitleaks compara o fingerprint com o **segredo real**; `***` nunca casa. Resultado: o
arquivo de supressão era inerte e a esteira falharia na etapa 1 em toda execução.

Os fingerprints foram regravados a partir do relatório sem `--redact`, um por ocorrência
(11 linhas). A supressão passou a funcionar: exit 0 e `no leaks found`.

> Os valores em si permanecem redigidos em toda a documentação.

## Etapa 2 — Semgrep

```bash
semgrep scan --config p/default --config p/owasp-top-ten --config .semgrep.yml \
  --json --error --metrics off .
```

| Métrica | Valor |
|---|---|
| Regras executadas | 540 |
| Arquivos analisados | 226 |
| Achados | **0** |
| Erros de parse | 0 |

### Prova de que o gate bloqueia

Fixture temporária com `eval(...)` proposital, escaneada pela regra local
`javascript-no-eval`:

| Execução | Exit | Achado |
|---|---|---|
| Com a fixture | **1** | `javascript-no-eval` em `lib/__gate-demo.ts:3` |
| Após remover a fixture | **0** | 0 resultados |

A fixture foi removida do código; nada de `nosemgrep` foi adicionado.

## Etapa 3 — Build, tipos e testes

| Verificação | Resultado |
|---|---|
| `npx tsc --noEmit` | **0 erros** (antes: 12) |
| `npm run build` | exit 0, `dist/standalone/` gerado |
| `npm run test:ci` | **39 testes, 39 passando, 0 falhas** |
| `npm run lint` | exit 0 |
| `node --test tests/devsecops.test.mjs` | **10 testes, 10 passando** |

### Defeitos encontrados e corrigidos

1. **12 erros de TypeScript** que a esteira não detectava (o `| tee` mascarava o
   exit code). Corrigidos: narrowing perdido dentro de closures em
   `lib/state/persistence.ts`, `Set` com tipo literal estreito em
   `lib/domain/rules.ts` e bindings do Cloudflare sem declaração em `db/index.ts`.
2. **`@cloudflare/workers-types` ausente** das devDependencies, embora o código
   importe `cloudflare:workers`. Era peer opcional e nunca instalado.
3. **`db/index.ts` sem tipo de `env.DB`** — adicionado `types/cloudflare-env.d.ts`
   declarando `Cloudflare.Env`.

## Etapa 4 — Trivy filesystem

```bash
trivy fs --scanners vuln,misconfig,secret --severity HIGH,CRITICAL --format json .
```

| Momento | CRITICAL | HIGH | Total |
|---|---|---|---|
| Antes | 5 | 14 | **19** |
| Depois | 0 | 0 | **0** |

### Fechamento sem filtro de severidade

O filtro `HIGH,CRITICAL` acima é a **política do gate**. Para verificação final ele não
serve: em 31/10 ele reportou 0 enquanto `postcss@8.5.18` seguia vulnerável por um advisory
*moderate*, justamente porque o filtro descartava o resto.

```bash
trivy fs --scanners vuln,misconfig,secret --format json .   # sem --severity
npm audit --omit=dev --json
npm audit --json
```

| Scan | Escopo | Resultado |
|---|---|---|
| Trivy fs, sem filtro | tudo | **0 vulnerabilidades**, 2 alvos (`package-lock.json`, `Dockerfile`) |
| `npm audit --omit=dev` | runtime | **0** critical / 0 high / 0 moderate |
| `npm audit` | inclui dev | 11 high + 26 moderate, todos em build/teste |

Os 11 high estão em `vite`, `ws`, `undici`, `zod`, `js-yaml`, `browserslist`,
`brace-expansion`, `fast-uri` e `react-server-dom-webpack`. Inspeção de
`dist/standalone/node_modules` (57 pacotes) confirmou que **nenhum** deles vai para o
runtime; `image-size@2.0.2` ia, e foi corrigido para 2.0.4 (não constava no `trivy-db`).

Achados antes da correção:

| Severidade | ID | Pacote | Correção |
|---|---|---|---|
| CRITICAL | CVE-2026-75604 | next@16.2.6 | 16.3.3 |
| CRITICAL | GHSA-2464-fhr4-w9xw | next@16.2.6 | 16.4.1 |
| CRITICAL | GHSA-2xp9-vwfh-vxw4 | next@16.2.6 | 16.3.3 |
| CRITICAL | GHSA-673q-mjm6-r5xr | next@16.2.6 | 16.4.1 |
| CRITICAL | GHSA-vcvr-r3jv-pc5j | next@16.2.6 | 16.3.6 |
| HIGH | CVE-2026-45623 | postcss@8.4.31 | 8.5.12 |
| HIGH | CVE-2026-64641 | next@16.2.6 | 16.2.11 |
| HIGH | CVE-2026-64642 | next@16.2.6 | 16.2.11 |
| HIGH | CVE-2026-64645 | next@16.2.6 | 16.2.11 |
| HIGH | CVE-2026-64649 | next@16.2.6 | 16.2.11 |
| HIGH | CVE-2026-67213 | nanoid@3.3.12 | 3.3.18 |
| HIGH | CVE-2026-67214 | nanoid@3.3.12 | 3.3.16 |
| HIGH | CVE-2026-73646 | postcss@8.4.31 | 8.5.18 |
| HIGH | CVE-2026-93749 | source-map-js@1.2.1 | 1.2.2 |
| HIGH | CVE-2026-94482 | next@16.2.6 | 16.4.1 |
| HIGH | CVE-2026-94483 | next@16.2.6 | 16.3.8 |
| HIGH | GHSA-f88m-g3jw-g9cj | sharp@0.34.5 | 0.35.0 |
| HIGH | GHSA-rgj7-g3m4-5g8c | sharp@0.34.5 | 0.35.4 |
| HIGH | GHSA-wq5f-xc86-pv6w | sharp@0.35.5 | 0.35.5 |

Correção aplicada: `next` 16.2.6 → **16.4.1**, `eslint-config-next` 16.2.6 → 16.4.1 e
`overrides` fixando `postcss` 8.5.18, `nanoid` 3.3.18, `source-map-js` 1.2.2 e
`sharp` 0.35.5. Após a troca, build, tipos, lint e os 39 testes continuaram passando.

Nenhum `.trivyignore` foi criado: as 19 vulnerabilidades tinham correção disponível.

## Aplicação em execução

Servidor standalone iniciado localmente (porta 3123, `APP_REVISION=teste-local`):

| Verificação | Resposta observada |
|---|---|
| `GET /api/health` | `{"status":"ok","service":"casa-digital-segura","revision":"teste-local"}` |
| `GET /` | HTTP 200, 15.212 bytes |
| `Content-Security-Policy` | presente |
| `X-Content-Type-Options` | `nosniff` |
| `X-Frame-Options` | `DENY` |
| `Referrer-Policy` | `strict-origin-when-cross-origin` |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=()` |
| `Strict-Transport-Security` | `max-age=31536000` |
| `X-Powered-By` | ausente |

## Resumo da Esteira

`scripts/ci/summary.py` executado com `NEEDS_JSON` dos 8 jobs e os relatórios reais:
tabela gerada corretamente, com `não disponível` onde o relatório não existe — ausência
nunca virou zero.

## Não executado nesta máquina (sem runtime de contêiner)

| Etapa | Motivo | O que falta |
|---|---|---|
| 5 — Docker build + push GHCR | `docker`/`podman`/`buildah` ausentes, sem socket | Executar no Actions |
| 6 — Trivy image | depende da imagem da etapa 5 | Executar no Actions |
| 7 — ZAP baseline | depende do contêiner em homologação | Executar no Actions |
| 8 — Deploy Render + aprovação | exige `RENDER_SERVICE_ID`, `DEPLOY_URL`, `RENDER_API_KEY` e revisor no Environment | Bloqueada até configurar |

O `Dockerfile` foi revisado estaticamente: multi-stage, imagem base fixada,
`USER node`, health check e sem segredo em ARG/ENV — mas **o build da imagem não foi
validado por execução**.
