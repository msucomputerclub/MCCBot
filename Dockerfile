FROM node:12

WORKDIR /usr/src/mccbot

COPY package*.json ./

RUN npm install

COPY . .

CMD ["npm", "start"]