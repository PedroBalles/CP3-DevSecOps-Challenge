# syntax=docker/dockerfile:1.7
FROM node:22.22.0-bookworm-slim AS dependencies
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

FROM dependencies AS build
COPY . .
RUN npm run build:container

FROM node:22.22.0-bookworm-slim AS runtime
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1 PORT=3000 HOSTNAME=0.0.0.0
ARG APP_REVISION=local
ENV APP_REVISION=$APP_REVISION
WORKDIR /app
COPY --from=build --chown=node:node /app/.next/standalone ./
COPY --from=build --chown=node:node /app/.next/static ./.next/static
COPY --from=build --chown=node:node /app/public ./public
USER node
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 CMD ["node", "-e", "fetch('http://127.0.0.1:3000/api/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"]
CMD ["node", "server.js"]
