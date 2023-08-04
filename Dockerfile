FROM node:16.13.2-alpine

# Arguments
ARG SERVER_PORT
ARG DB_URL
ARG NODE_ENV
ARG ENC_SERVICE_KEY
ARG DEC_SERVICE_KEY
ARG DL_SERVER_URL

# 환경변수 선언
ENV SERVER_PORT=$SERVER_PORT
ENV DB_URL=$DB_URL
ENV NODE_ENV=$NODE_ENV
ENV ENC_SERVICE_KEY=$ENC_SERVICE_KEY
ENV DEC_SERVICE_KEY=$DEC_SERVICE_KEY
ENV DL_SERVER_URL=$DL_SERVER_URL

# 컨테이너 내 디렉터리로 파일 복사
COPY . /usr/local/wip-main 

# 작업 디렉터리 이동
WORKDIR /usr/local/wip-main/src

# node 모듈 설치
RUN npm install

# 포트
EXPOSE $SERVER_PORT

# 실행
ENTRYPOINT ["node", "app.js"]