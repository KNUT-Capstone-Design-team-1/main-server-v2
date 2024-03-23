FROM node:16.13.2-alpine

ARG MAIN_SERVER_PORT
ARG DB_URL
ARG NODE_ENV
ARG ENC_SERVICE_KEY
ARG DEC_SERVICE_KEY
ARG DL_SERVER_ADDR
ARG DL_SERVER_PORT
ARG DL_SERVER_IMG_RECOG_PATH

ENV MAIN_SERVER_PORT=$MAIN_SERVER_PORT
ENV DB_URL=$DB_URL
ENV NODE_ENV=$NODE_ENV
ENV ENC_SERVICE_KEY=$ENC_SERVICE_KEY
ENV DEC_SERVICE_KEY=$DEC_SERVICE_KEY
ENV DL_SERVER_ADDR=$DL_SERVER_ADDR
ENV DL_SERVER_PORT=$DL_SERVER_PORT
ENV DL_SERVER_IMG_RECOG_PATH=$DL_SERVER_IMG_RECOG_PATH

COPY . /usr/local/wip-main-server-v2 

WORKDIR /usr/local/wip-main-server-v2

RUN npm install
RUN npm install -g typescript
RUN tsc --build

EXPOSE $MAIN_SERVER_PORT

VOLUME . /usr/local/wip-main-server-v2

ENTRYPOINT ["node", "./build/src/app.js"]