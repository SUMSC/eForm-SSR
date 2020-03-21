FROM node:12

LABEL VERSION="1.0" MAINTAINER="Amber<wzhzzmzzy@gmail.com>"

COPY . /opt/ssr

WORKDIR /opt/ssr

ENV NODE_ENV=production

RUN npm config set registry https://registry.npm.taobao.org

RUN npm install

RUN npm run build

EXPOSE 8003

ENTRYPOINT ["npm", "start"]
