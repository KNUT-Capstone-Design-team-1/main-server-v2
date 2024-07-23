FROM node:20.12.0-alpine

ENV TZ=Asia/Seoul

RUN apk add \
  tcpdump \
  net-tools \
  vim \
  tzdata

COPY . /usr/local/wip-main-server-v2 
WORKDIR /usr/local/wip-main-server-v2
EXPOSE $MAIN_SERVER_PORT

# 식약처 API 응답 수신
EXPOSE 80

ENTRYPOINT ["node", "./src/app.js"]