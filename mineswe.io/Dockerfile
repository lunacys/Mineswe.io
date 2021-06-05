FROM node:12-alpine as builder
WORKDIR /app
COPY mineswe.io/package*.json ./
RUN npm ci
COPY mineswe.io/ ./
RUN npm run build

# production-stage
FROM nginx:stable-alpine as production-stage
COPY --from=builder /app/dist/minesweio /usr/share/nginx/html
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx/client.nginx.conf /etc/nginx/conf.d/nginx.conf
EXPOSE 80
EXPOSE 443
CMD ["nginx", "-g", "daemon off;"]
