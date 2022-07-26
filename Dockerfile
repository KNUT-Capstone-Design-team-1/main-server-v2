FROM alpine:edge 
COPY . /usr/local/wip-main 

RUN apk add --update nodejs && apk add --update npm 
WORKDIR /usr/local/wip-main 
RUN npm install 

ENTRYPOINT ["node", "index.js"] 