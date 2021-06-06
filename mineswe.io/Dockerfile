#FROM node:12-alpine as builder
#WORKDIR /app
#COPY package*.json ./
#RUN npm ci
#COPY . ./
#RUN npm run build

# production-stage
#FROM nginx:stable-alpine as production-stage
#COPY --from=builder /app/dist/minesweio /usr/share/nginx/html
#RUN rm /etc/nginx/conf.d/default.conf
#COPY nginx/client.nginx.conf /etc/nginx/conf.d/nginx.conf
#EXPOSE 80
#EXPOSE 443
#CMD ["nginx", "-g", "daemon off;"]

FROM node:latest as build
WORKDIR /usr/local/app
COPY ./ /usr/local/app/
RUN npm install
RUN npm run build

FROM nginx:latest

COPY --from=build /usr/local/app/dist/minesweio /usr/share/nginx/html

EXPOSE 80
EXPOSE 443