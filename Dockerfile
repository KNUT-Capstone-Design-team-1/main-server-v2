FROM alpine:edge 
COPY . /usr/local/wip-main 

RUN apk add --update nodejs && apk add --update npm 
WORKDIR /usr/local/wip-main 
RUN npm install 
EXPOSE 17260 

ENTRYPOINT ["node", "index.js"] 