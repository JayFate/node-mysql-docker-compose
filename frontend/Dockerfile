FROM node

WORKDIR /app

COPY package.json ./

RUN npm install pnpm -g \
    && pnpm install

COPY . .

EXPOSE 8080

CMD ["npm", "start"]
