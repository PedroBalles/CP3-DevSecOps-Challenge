#!/usr/bin/env bash
set -euo pipefail
TARGET=${1:?URL obrigatória}
REPORTS=${2:?diretório de relatórios obrigatório}
mkdir -p "$REPORTS"
REPORTS_ABS=$(cd "$REPORTS" && pwd)

# Imagem dedicada zap-baseline: o entrypoint já é o zap-baseline.py, roda com
# usuário próprio e caminho de trabalho /zap/wrk. A imagem genérica (zaproxy)
# tenta gravar /tmp/zap_out.json e falha em runner (exit 3).
IMAGE="${ZAP_IMAGE:-ghcr.io/zaproxy/zap-baseline:2.17.0}"

set +e
docker run --rm --network host \
  -v "$REPORTS_ABS:/zap/wrk:rw" \
  "$IMAGE" \
  -t "$TARGET" -m 1 -J report_json.json -r report_html.html -w report_md.md -I
STATUS=$?
set -e

if [ ! -s "$REPORTS_ABS/report_json.json" ]; then
  echo "ZAP não gerou report_json.json (exit $STATUS). Não tratar como aprovação." >&2
  [ "$STATUS" -eq 0 ] && exit 3
  exit "$STATUS"
fi

if (( STATUS > 2 )); then echo "Falha operacional do ZAP: $STATUS" >&2; exit "$STATUS"; fi

set +e
python3 scripts/ci/security-gate.py zap "$REPORTS_ABS/report_json.json"
GATE=$?
set -e
if (( GATE > 1 )); then exit "$GATE"; fi
if (( GATE == 1 )); then echo 'Alertas High registrados: revisor deve avaliar antes de aprovar produção.'; fi
exit 0
