FROM node

WORKDIR /src
COPY package.json package-lock.json tsconfig.json ./
RUN npm install
COPY server/ server/
COPY src/ src/
RUN node_modules/.bin/tsc

CMD node server/server.js