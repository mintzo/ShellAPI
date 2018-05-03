FROM node:9.4.0-slim
MAINTAINER Mintz

WORKDIR /server
RUN npm i swagger -g

CMD ["npm","run","dev"]