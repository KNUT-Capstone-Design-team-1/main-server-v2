FROM alpine:edge 

# 컨테이너 내 디렉터리로 파일 복사
COPY . /usr/local/wip-main 

# 필요 패키지 설치
RUN apk add --update nodejs && apk add --update npm 

# 작업 디렉터리 이동
WORKDIR /usr/local/wip-main 

# node 모듈 설치
RUN npm install 

# 실행
ENTRYPOINT ["node", "index.js"] 