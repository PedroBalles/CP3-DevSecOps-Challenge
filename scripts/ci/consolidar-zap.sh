#!/usr/bin/env bash
# Move os relatórios que a action do ZAP deixa na raiz para reports/.
# Falha se o JSON não existir: ausência de relatório não é ausência de alertas.
set -euo pipefail
mkdir -p reports
for name in report_json.json report_html.html report_md.md; do
  if [ -f "$name" ]; then
    mv "$name" "reports/$name"
  fi
done
ls -la reports/ || true
test -s reports/report_json.json
