FROM node:16-alpine

COPY . .
RUN yarn install
RUN yarn build

CMD ["yarn", "start:prod"]