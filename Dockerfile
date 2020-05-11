FROM node:lts

WORKDIR /app

COPY package.json ./
COPY yarn.lock ./

RUN npm i -g yarn
RUN yarn install --prod

COPY . .

CMD [ "yarn", "start" ]
