# Step 1 : Build app
FROM node:13-alpine as builder

RUN apk update && apk add openssl-dev libssl1.1 wget unzip

WORKDIR /app

RUN wget https://gitlab.com/npappas/prisma-engines/-/jobs/534431430/artifacts/download -O prisma-musl.zip && unzip prisma-musl.zip -d prisma-musl-artifacts
RUN mkdir prisma-musl-bin && cp prisma-musl-artifacts/target/`uname -m`-unknown-linux-musl/release/* prisma-musl-bin/

ENV PRISMA_QUERY_ENGINE_BINARY=/app/prisma-musl-bin/query-engine
ENV PRISMA_INTROSPECTION_ENGINE_BINARY=/app/prisma-musl-bin/introspection-engine
ENV PRISMA_MIGRATION_ENGINE_BINARY=/app/prisma-musl-bin/migration-engine

COPY package.json package.json

RUN yarn

COPY ./ ./

RUN yarn dotenv yarn build

# Step 2 : Production image
FROM node:13-alpine

RUN apk update && apk add openssl-dev libssl1.1

WORKDIR /app

COPY --from=builder /app/node_modules /app/node_modules
COPY --from=builder /app/dist /app/dist
COPY --from=builder /app/prisma-musl-bin /app/prisma-musl-bin
COPY ./package*.json /app
COPY ./prisma /app/prisma

ENV PRISMA_QUERY_ENGINE_BINARY=/app/prisma-musl-bin/query-engine
ENV PRISMA_INTROSPECTION_ENGINE_BINARY=/app/prisma-musl-bin/introspection-engine
ENV PRISMA_MIGRATION_ENGINE_BINARY=/app/prisma-musl-bin/migration-engine

CMD yarn migrate:up && yarn start
