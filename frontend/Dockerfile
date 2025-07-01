# Build step
FROM node:lts-alpine AS build

ENV NPM_CONFIG_UPDATE_NOTIFIER=false
ENV NPM_CONFIG_FUND=false

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . ./

# Build with environment variables
RUN npm run build

# Serve with Caddy
FROM caddy:alpine

WORKDIR /app

COPY Caddyfile ./
RUN caddy fmt Caddyfile --overwrite

COPY --from=build /app/dist ./dist

EXPOSE 80

CMD ["caddy", "run", "--config", "Caddyfile", "--adapter", "caddyfile"]