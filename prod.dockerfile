FROM node:9.4.0-slim
MAINTAINER Mintz

WORKDIR /server
RUN npm i

CMD ["npm","run","start"]