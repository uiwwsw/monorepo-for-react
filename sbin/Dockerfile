FROM --platform=linux/amd64 node:20-alpine
WORKDIR /works

ENV TZ=Asia/Seoul
RUN apk add --no-cache tzdata && \
    cp /usr/share/zoneinfo/$TZ /etc/localtime && \
    echo $TZ > /etc/timezone

COPY server/package*.json ./
RUN npm install

ADD client/build/ /usr/src/app/client/build/
ADD server/build/ /usr/src/app/build/

WORKDIR /usr/src/app/build
CMD [ "node", "bundle.js" ]
