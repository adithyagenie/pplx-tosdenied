FROM node:20-alpine AS builder
WORKDIR /opt/app-root/src

COPY package.json .
COPY pnpm-lock.yaml .

RUN npm install -g pnpm

RUN pnpm install --frozen-lockfile --prefer-offline
ARG MONGODB_URI
ARG PERPLEXITY_API_KEY
ARG NODE_ENV=production
ARG NEXT_TELEMETRY_DISABLED=1

ADD src /opt/app-root/src/src
ADD public /opt/app-root/src/public
# ADD tailwind.config.js .
ADD postcss.config.mjs .
# ADD jsconfig.json .
# ADD components.json .
ADD next.config.ts .
ADD tsconfig.json .
# ADD jsconfig.json .

RUN pnpm run build

FROM gcr.io/distroless/nodejs20-debian12:nonroot

WORKDIR /opt/app-root/src

COPY --from=builder --chown=nonroot --chmod=755 /opt/app-root/src/.next/cache ./.next/cache
COPY --from=builder --chown=root --chmod=005 /opt/app-root/src/.next/standalone ./
COPY --from=builder --chown=root --chmod=005 /opt/app-root/src/.next/static ./.next/static
COPY --from=builder --chown=root --chmod=005 /opt/app-root/src/public ./public

ENV NODE_ENV=production

EXPOSE 3000

ENV HOSTNAME="0.0.0.0"
CMD ["server.js"]
