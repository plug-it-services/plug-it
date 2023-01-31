FROM node:16-alpine as build

WORKDIR /app
COPY . .

RUN yarn install
RUN yarn build

FROM nginx:latest as run

RUN sed -i 's/location \/ {/location \/ {\ntry_files $uri \/index.html;/' /etc/nginx/conf.d/default.conf

RUN rm -rf /usr/share/nginx/html/*

COPY --from=build /app/build /usr/share/nginx/html