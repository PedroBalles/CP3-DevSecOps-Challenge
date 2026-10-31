#!/usr/bin/env bash
# Garante que reports/deploy-producao.md exista mesmo quando a etapa 8 é
# bloqueada (variável ausente, aprovação pendente ou falha de health check).
# Relatório ausente nunca deve virar "sem observações".
set -uo pipefail
mkdir -p reports
if [ -f reports/deploy-producao.md ]; then
  exit 0
fi
{
  printf '# Deploy produção — etapa não concluída\n\n'
  printf 'A etapa 8 não chegou ao fim. O motivo está no log do job (variável de\n'
  printf 'Environment ausente, aprovação pendente ou falha no health check).\n\n'
  printf 'Execução: %s/%s/actions/runs/%s\n' \
    "${GITHUB_SERVER_URL:-https://github.com}" "${GITHUB_REPOSITORY:-?}" "${GITHUB_RUN_ID:-?}"
} > reports/deploy-producao.md
