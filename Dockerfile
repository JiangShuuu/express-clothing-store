FROM node:14

WORKDIR /app

COPY package.json .

ENV JWT_SECRET=alphacamp

ENV IMGUR_CLIENT_ID=483a88d6de32984

RUN npm install

COPY . .

EXPOSE 3000

VOLUME [ "/app/node_modules" ]

CMD ["npm", "run", "dev"]