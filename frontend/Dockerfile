FROM node:17.9.1-alpine3.15

WORKDIR /app/frontend

COPY ./package.json ./

RUN npm install

COPY ./ ./

EXPOSE 5173

CMD ["npm", "start"]
