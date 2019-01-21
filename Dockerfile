FROM node:8

WORKDIR /code

ADD ./package.json package.json
ADD ./yarn.lock yarn.lock

RUN yarn

ADD ./ /code

RUN yarn build && yarn test
