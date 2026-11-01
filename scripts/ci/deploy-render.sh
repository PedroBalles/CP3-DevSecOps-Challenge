#!/usr/bin/env bash
# Dispara o deploy da imagem exata (por digest) no Render e aguarda ficar live.
#
# A imagem é passada por digest, não por tag: o digest identifica o conteúdo e
# não pode ser remontado, então o que sobe em produção é exatamente o que passou
# pelas etapas 1-7.
#
# Espera o deploy atingir "live" antes de sair: sem isso o health check lê a
# revisão antiga (o serviço responde 200 com o conteúdo velho) e falha por
# corrida, não por defeito.
set -euo pipefail

: "${RENDER_SERVICE_ID:?RENDER_SERVICE_ID ausente}"
: "${RENDER_API_KEY:?RENDER_API_KEY ausente}"
: "${IMAGE:?IMAGE ausente}"
: "${DIGEST:?DIGEST ausente}"

mkdir -p reports
IMAGE_URL="${IMAGE}@${DIGEST}"
echo "Imagem: ${IMAGE_URL}"

API="https://api.render.com/v1/services/${RENDER_SERVICE_ID}/deploys"
AUTH="Authorization: Bearer ${RENDER_API_KEY}"

HTTP_CODE=$(curl -sS -o reports/render-deploy.json -w '%{http_code}' \
  -X POST "$API" \
  -H "$AUTH" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d "{\"imageUrl\":\"${IMAGE_URL}\"}")

echo "HTTP: ${HTTP_CODE}"
cat reports/render-deploy.json
echo

if [ "${HTTP_CODE}" != "201" ] && [ "${HTTP_CODE}" != "200" ]; then
  echo "Falha ao disparar deploy no Render (HTTP ${HTTP_CODE})" >&2
  exit 1
fi

DEPLOY_ID=$(jq -r '.id' reports/render-deploy.json)
echo "deploy id: ${DEPLOY_ID}"

# Plano Free do Render pode levar alguns minutos entre build e live.
for tentativa in $(seq 1 60); do
  STATUS=$(curl -sS -H "$AUTH" -H "Accept: application/json" \
    "${API}/${DEPLOY_ID}" | jq -r '.status // "desconhecido"')

  echo "[${tentativa}/60] status: ${STATUS}"

  case "$STATUS" in
    live)
      echo "Deploy live."
      break
      ;;
    build_failed|update_failed|canceled|deactivated)
      echo "Deploy terminou em estado de falha: ${STATUS}" >&2
      exit 1
      ;;
  esac

  if [ "$tentativa" -eq 60 ]; then
    echo "Timeout aguardando o deploy ficar live (último status: ${STATUS})" >&2
    exit 1
  fi

  sleep 10
done

jq -r '"deploy \(.id // "'"$DEPLOY_ID"'") | status: \(.status // "n/d") | image: \(.image.ref // "n/d")"' \
  reports/render-deploy.json || true
