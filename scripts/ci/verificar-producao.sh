#!/usr/bin/env bash
# Confirma que produção está servindo exatamente a revisão aprovada.
#
# Não basta o serviço responder: se o /api/health devolver outra revisão, o
# deploy não promoveu a imagem desta execução. Isso é falha, não sucesso.
set -euo pipefail

: "${DEPLOY_URL:?DEPLOY_URL ausente}"
: "${IMAGE:?IMAGE ausente}"
: "${DIGEST:?DIGEST ausente}"

mkdir -p reports
URL="${DEPLOY_URL%/}/api/health"
echo "Consultando ${URL}"

# Render free hiberna: 40 tentativas com 15s de intervalo toleram cold start.
curl --fail --silent --show-error \
  --retry 40 --retry-all-errors --retry-delay 15 \
  "${URL}" -o reports/health.json

echo "Resposta:"
cat reports/health.json
echo

python3 - <<'PY'
import json
import os

dados = json.load(open("reports/health.json", encoding="utf-8"))
esperado = os.environ["GITHUB_SHA"]
assert dados.get("status") == "ok", f"status inesperado: {dados.get('status')}"
assert dados.get("revision") == esperado, (
    f"revisão servida {dados.get('revision')} difere do commit aprovado {esperado}"
)
print(f"OK: produção serve a revisão {esperado}")
PY

cat > reports/deploy-producao.md <<EOF
# Deploy produção (Render)

- Provedor: Render, plano Free
- Imagem: ${IMAGE}@${DIGEST}
- URL: ${DEPLOY_URL}
- Revisão servida: $(python3 -c 'import json;print(json.load(open("reports/health.json"))["revision"])')
- Acionado por: ${GITHUB_ACTOR}
- Data UTC: $(date -u +%FT%TZ)
- Execução: ${GITHUB_SERVER_URL}/${GITHUB_REPOSITORY}/actions/runs/${GITHUB_RUN_ID}
- Aprovação: consultar deployment review do Environment producao nesta execução
EOF

echo "--- relatório ---"
cat reports/deploy-producao.md
