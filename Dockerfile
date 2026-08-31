FROM node:22-alpine AS builder

ARG NEXT_PUBLIC_HOST_URL=$NEXT_PUBLIC_HOST_URL
ARG NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_S3_ENDPOINT=$NEXT_PUBLIC_S3_ENDPOINT
ARG NEXT_PUBLIC_SENTRY_DSN=$NEXT_PUBLIC_SENTRY_DSN
ARG SENTRY_AUTH_TOKEN=$SENTRY_AUTH_TOKEN
ARG NEXT_PUBLIC_GA_ID=$NEXT_PUBLIC_GA_ID
ARG DATOCMS_API_URL=$DATOCMS_API_URL
ARG DATOCMS_API_TOKEN=$DATOCMS_API_TOKEN


# Set the working directory inside the container
WORKDIR /app

COPY yarn.lock .
COPY package.json .
RUN yarn
COPY . .
RUN yarn build

FROM node:22-alpine AS runner

WORKDIR /app

COPY --from=builder /app/package.json .
COPY --from=builder /app/yarn.lock .
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone .
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/next.config.mjs .
COPY --from=builder /app/instrumentation-client.ts .
COPY --from=builder /app/sentry.edge.config.ts .
COPY --from=builder /app/sentry.server.config.ts .

EXPOSE 3000

ENTRYPOINT [ "node" , "server.js" ]
