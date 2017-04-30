FROM node:4.3.1
MAINTAINER Miguel Pombo Dias <miguel.pombodias@heig-vd.ch>

COPY src /opt/app/

WORKDIR /opt/app/
RUN npm install

ENTRYPOINT ["node", "/opt/app/musician.js"]
