#!/usr/bin/env bash
# Dispara o deploy da imagem exata (por digest) no Render e registra o resultado.
#
# A imagem é passada por digest, não por tag: o digest identifica o conteúdo e
# não pode ser remontado, então o que sobe em produção é exatamente o que passou
# pelas etapas 1-7.
set -euo pipefail

: "${RENDER_SERVICE_ID:?RENDER_SERVICE_ID ausente}"
: "${RENDER_API_KEY:?RENDER_API_KEY ausente}"
: "${IMAGE:?IMAGE ausente}"
: "${DIGEST:?DIGEST ausente}"

mkdir -p reports
IMAGE_URL="${IMAGE}@${DIGEST}"
echo "Imagem: ${IMAGE_URL}"

HTTP_CODE=$(curl -sS -o reports/render-deploy.json -w '%{http_code}' \
  -X POST "https://api.render.com/v1/services/${RENDER_SERVICE_ID}/deploys" \
  -H "Authorization: Bearer ${RENDER_API_KEY}" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d "{\"imageUrl\":\"${IMAGE_URL}\"}")

echo "HTTP: ${HTTP_CODE}"
cat reports/render-deploy.json

if [ "${HTTP_CODE}" != "201" ] && [ "${HTTP_CODE}" != "200" ]; then
  echo "Falha ao disparar deploy no Render (HTTP ${HTTP_CODE})" >&2
  exit 1
fi

jq -r '"deploy id: \(.id // "n/d") | status: \(.status // "n/d")"' reports/render-deploy.json
