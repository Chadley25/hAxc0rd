FROM ubuntu:latest

# creates and sets the work directory
RUN mkdir -p /usr/src/bot
WORKDIR /usr/src/bot

# copies the source files
COPY . /usr/src/bot

# installs dependencies
RUN apt-get update
RUN apt-get install --yes apt-utils
RUN apt-get install --yes apt-transport-https
RUN apt-get install --yes sudo
RUN apt-get install --yes curl
RUN curl -sL https://deb.nodesource.com/setup_14.x | sudo -E bash -
RUN apt-get install --yes nodejs
RUN apt-get install --yes whois
RUN apt-get install --yes gobuster
RUN apt-get install --yes hydra
RUN apt-get install --yes john
RUN npm install

# starts the bot
CMD ["node", "/usr/src/bot/index.js"]