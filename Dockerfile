FROM node:12-slim

LABEL VERSION="1.0" MAINTAINER="Amber<wzhzzmzzy@gmail.com>"

RUN curl -o- -L https://yarnpkg.com/install.sh | bash

COPY . /opt/ssr

WORKDIR /opt/ssr

RUN yarn config set registry https://registry.npm.taobao.org

ENV NODE_ENV=production

RUN $HOME/.yarn/bin/yarn & $HOME/.yarn/bin/yarn build

EXPOSE 8003

ENTRYPOINT ["yarn", "start"]
