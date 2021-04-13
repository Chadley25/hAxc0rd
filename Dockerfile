FROM ubuntu:groovy-20210325

# creates and sets the work directory
RUN mkdir -p /usr/src/bot
WORKDIR /usr/src/bot

# copies the source files
COPY . /usr/src/bot

ENV DEBIAN_FRONTEND noninteractive

# installs dependencies
RUN apt-get update
RUN apt-get install --yes apt-transport-https
RUN apt-get install --yes apt-utils
RUN apt-get install --yes build-essential
RUN apt-get install --yes curl
RUN apt-get install --yes wget
RUN curl -sL https://deb.nodesource.com/setup_14.x | bash -
RUN apt-get install --yes gobuster
RUN apt-get install --yes nodejs
RUN apt-get install --yes whois
RUN apt-get install --yes git
RUN apt-get install --yes hydra
RUN apt-get install --yes jq
RUN apt-get install --yes libssl-dev
RUN apt-get install --yes yasm pkg-config libgmp-dev libpcap-dev libbz2-dev
RUN git clone https://github.com/magnumripper/JohnTheRipper -b bleeding-jumbo john
WORKDIR /usr/src/bot/john/src
RUN ./configure && make -s clean && make -sj4
WORKDIR /usr/src/bot
RUN curl https://raw.githubusercontent.com/daviddias/node-dirbuster/master/lists/directory-list-2.3-small.txt > /usr/src/bot/wordlists/small
RUN curl https://raw.githubusercontent.com/daviddias/node-dirbuster/master/lists/directory-list-2.3-medium.txt > /usr/src/bot/wordlists/medium
RUN curl https://raw.githubusercontent.com/daviddias/node-dirbuster/master/lists/directory-list-2.3-big.txt > /usr/src/bot/wordlists/big
RUN wget -N -P wordlists/ https://github.com/brannondorsey/naive-hashcat/releases/download/data/rockyou.txt
RUN npm run preinstall
RUN npm install

# starts the bot
CMD ["node", "/usr/src/bot/index.js"]