# Relatórios locais reais

Saídas **efetivamente geradas** nesta máquina, guardadas como evidência das medições
locais. A execução no GitHub Actions já ocorreu e está registrada em
`../execucoes-actions.md` — a run #23 fechou 8/8 com aprovação humana. Nenhum arquivo
desta pasta foi editado à mão depois de gerado.

| Arquivo | Origem | O que comprova |
|---|---|---|
| `01-gitleaks-historico-completo.json` | `gitleaks git --all --report-format json` sobre clone completo (6 branches) | 11 ocorrências reais, redigidas |
| `01b-gitleaks-com-ignore-corrigido.json` | mesma varredura com `.gitleaksignore` corrigido | `[]` — nenhum achado, exit 0 |
| `02-semgrep.json` | `semgrep scan --config p/default --config p/owasp-top-ten --config .semgrep.yml` | 540 regras, 226 arquivos, 0 resultados, 0 erros |
| `02b-semgrep-bloqueio-eval.json` | mesma varredura com fixture contendo `eval(...)` | 1 achado, regra `javascript-no-eval`, exit **1** |
| `02c-semgrep-apos-correcao.json` | fixture removida | `results: []`, exit **0** |
| `03-typecheck.txt` | `npx tsc --noEmit` | vazio: 0 erros |
| `03-testes.txt` | `npm run test:ci` | 39 testes, 39 passando |
| `03-lint.txt` | `npm run lint` | sem erros |
| `04-trivy-fs-antes.json` | `trivy fs --severity HIGH,CRITICAL` antes do upgrade | 5 CRITICAL + 14 HIGH |
| `04b-trivy-fs-depois.json` | mesma varredura logo após o primeiro upgrade | 0 CRITICAL, 0 HIGH |
| `04c-trivy-fechamento-final.json` | `trivy fs` **sem filtro**, estado final (17:14 UTC) | 0 vulns, 0 misconfig, 0 secrets, 2 alvos |
| `04d-trivy-todas-severidades.json` | `trivy fs` sem filtro (17:07 UTC) | 0 vulnerabilidades |
| `04e-npm-audit-producao.json` | `npm audit --omit=dev` | 0 critical, 0 high, 0 moderate |
| `04f-npm-audit-completo.json` | `npm audit` (inclui dev) | high e moderate só em build/teste |

Comparar `04c` com `04f` é o ponto: os dois scanners discordam porque usam bases de advisory
diferentes. Ver [observações](../../observacoes.md#trivy-e-npm-audit-discordam--e-os-dois-estão-certos-no-próprio-escopo).

## Atenção

O relatório `01-gitleaks-historico-completo.json` guardado aqui foi **redigido**: os campos
`Secret`, `Match` e `Raw` foram removidos e o fingerprint foi truncado. O fingerprint
**completo** é necessário apenas no `.gitleaksignore`, que é o arquivo operacional da
esteira; expor o valor do segredo num repositório público não traz benefício e aumenta
superfície. Os 11 registros permanecem com commit, arquivo, linha, regra e severidade.
