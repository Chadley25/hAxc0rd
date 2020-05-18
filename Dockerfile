FROM ubuntu:latest

# creates and sets the work directory
RUN mkdir -p /usr/src/bot
WORKDIR /usr/src/bot

# copies the bot
COPY . /usr/src/bot

# installs dependencies
RUN apt-get update
RUN apt-get install --yes apt-utils
RUN apt-get install --yes apt-transport-https
RUN apt-get install --yes sudo
RUN apt-get install --yes curl
RUN apt-get install --yes nodejs
RUN apt-get install --yes npm
RUN apt-get install --yes whois
RUN npm install
RUN npm test

# starts the bot
CMD ["node", "/usr/src/bot/index.js"]