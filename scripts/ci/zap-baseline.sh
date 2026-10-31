#!/usr/bin/env bash
set -euo pipefail
TARGET=${1:?URL obrigatória}
REPORTS=${2:?diretório de relatórios obrigatório}
mkdir -p "$REPORTS"
# UID do runner; evita chmod 777 e arquivos de root nos artifacts.
set +e
docker run --rm --network host --user "$(id -u):$(id -g)" -e HOME=/tmp -v "$REPORTS:/zap/wrk:rw" \
  "${ZAP_IMAGE:-ghcr.io/zaproxy/zaproxy:2.17.0}" zap-baseline.py \
  -t "$TARGET" -m 1 -J report_json.json -r report_html.html -w report_md.md -I
STATUS=$?
set -e
# 1/2 podem representar alertas acima de zero, não necessariamente High.
# Erro operacional (3+) nunca é convertido em aprovação.
if (( STATUS > 2 )); then echo "Falha operacional do ZAP: $STATUS" >&2; exit "$STATUS"; fi
set +e
python3 scripts/ci/security-gate.py zap "$REPORTS/report_json.json"
GATE=$?
set -e
if (( GATE > 1 )); then exit "$GATE"; fi
if (( GATE == 1 )); then echo 'Alertas High registrados: revisor deve avaliar antes de aprovar produção.'; fi
exit 0
