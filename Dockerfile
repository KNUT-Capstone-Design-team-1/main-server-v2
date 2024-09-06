FROM node:20.12.0-alpine

ENV TZ=Asia/Seoul

RUN apk add \
  tcpdump \
  net-tools \
  vim \
  tzdata

COPY . /usr/local/wip-main-server-v2 
WORKDIR /usr/local/wip-main-server-v2

RUN yarn install && \
    yarn global add typescript
RUN yarn build
RUN rm -rf ./src
RUN mv ./build/src ./src

EXPOSE $MAIN_SERVER_PORT

ENTRYPOINT ["node", "./src/app.js"]