FROM node:4.3.1
MAINTAINER Miguel Pombo Dias <miguel.pombodias@heig-vd.ch>

COPY src /opt/app/

WORKDIR /opt/app/
RUN npm install

EXPOSE 2205

ENTRYPOINT ["node", "/opt/app/auditor.js"]
