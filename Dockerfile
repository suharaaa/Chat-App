FROM node:lts-alpine3.13 

WORKDIR /usr/src/app
COPY ./package*.json ./
RUN npm install
COPY ./src ./src
COPY ./tsconfig.json ./
RUN npm run build
COPY ./public ./dist/public
ENV PORT 5000
EXPOSE 5000 
ENTRYPOINT ["node", "./dist/server.js"]
