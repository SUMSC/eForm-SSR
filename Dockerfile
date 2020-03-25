FROM node:12

LABEL VERSION="1.0" MAINTAINER="Amber<wzhzzmzzy@gmail.com>"

COPY . /opt/ssr

WORKDIR /opt/ssr

RUN npm config set registry https://registry.npm.taobao.org

RUN npm install

ENV NODE_ENV=production
ENV BASE_URL=http://localhost:8003
ENV BASE_API='/api'
ENV LOGIN_API='/login'
ENV SERVER_API='http://localhost:8002/api'

RUN npm run build

EXPOSE 8003

ENTRYPOINT ["npm", "start"]
