FROM node:16-alpine as build

WORKDIR /app
COPY yarn.lock package.json ./

RUN yarn install

COPY . .

RUN yarn build


FROM nginx:latest as run

WORKDIR /mobile

RUN sed -i 's/location \/ {/location \/ {\ntry_files $uri \/index.html;/' /etc/nginx/conf.d/default.conf

COPY --from=build /app/build/ /usr/share/nginx/html

RUN ln -sf /mobile/client.apk /usr/share/nginx/html/client.apk