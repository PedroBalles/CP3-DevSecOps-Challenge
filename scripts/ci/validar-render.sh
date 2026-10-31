#!/usr/bin/env bash
# Valida a configuração da etapa 8 antes de qualquer chamada à API do Render.
# Falha cedo: melhor bloquear aqui do que descobrir no meio do deploy.
set -euo pipefail

for NAME in RENDER_SERVICE_ID RENDER_API_KEY DEPLOY_URL; do
  if [ -z "${!NAME:-}" ]; then
    echo "Configuração obrigatória ausente: $NAME" >&2
    exit 1
  fi
done

if ! [[ "$RENDER_SERVICE_ID" =~ ^srv-[a-z0-9]+$ ]]; then
  echo "RENDER_SERVICE_ID inválido: esperado srv-<algo>. Recebido: $RENDER_SERVICE_ID" >&2
  exit 1
fi

if ! [[ "$DEPLOY_URL" =~ ^https://[a-zA-Z0-9.-]+/?$ ]]; then
  echo "DEPLOY_URL inválido: esperado https://host sem caminho. Recebido: $DEPLOY_URL" >&2
  exit 1
fi

echo "Configuração validada: $RENDER_SERVICE_ID -> $DEPLOY_URL"
