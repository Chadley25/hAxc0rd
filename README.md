<p align="center">
<a href="https://chadley25.github.io/sip.html"><img src="https://i.imgur.com/94LiVtX.png"></a>
</p>

-----

<p align="center">
    <a href="http://hits.dwyl.com/Chadley25/hAxc0rd" alt="Repository Views">
        <img src="http://hits.dwyl.com/Chadley25/hAxc0rd.svg" alt="Repository Views"/></a>
    <a href="https://travis-ci.com/Chadley25/hAxc0rd" alt="Travis-CI Build">
        <img src="https://travis-ci.com/Chadley25/hAxc0rd.svg?token=cdwACNbYGBdNzM9z8yGp&branch=master" alt="Travis-CI Build"/></a>
    <a href="https://github.com/Chadley25/hAxc0rd/actions?query=workflow%3A%22Node.js+CI%22" alt="Node.js CI">
        <img src="https://github.com/Chadley25/hAxc0rd/workflows/Node.js%20CI/badge.svg" alt="Node.js CI"/></a>
</p>

-----

&nbsp;

## Docker

### Getting Started
- `git clone https://github.com/Chadley25/hAxc0rd`
- `cd hAxc0rd`
- Set up the configuration file (`config.json`) to your liking
- Add your VirusTotal & Shodan API keys in the `.env` file, along with your Discord bot's token
- `docker-compose build`
- `docker-compose up` or `docker-compose up -d` (runs in detached mode)

### Management
- Stopping the Bot: `docker-compose stop`
- Starting the Bot: `docker-compose up` or `docker-compose up -d` (runs in detached mode)
- Pausing the Bot: `docker-compose pause` (all processes ran while paused will run immediately when unpaused)
- Unpausing the Bot: `docker-compose unpause`
- Updating Changes Made to the Code: `docker-compose build && docker-compose up -d`
- Viewing the Logs: `docker-compose logs`
- Open a Bash Shell into the Docker Container: `docker exec -it haxc0rd_base_1 /bin/bash`

### Set a Proxy on the Docker Client (not tested)
- Create or edit the file `~/.docker/config.json` in the home directory of the user which starts containers
- Add the following to the file:
    ```
    {
     "proxies":
     {
       "default":
       {
         "httpProxy": "http://127.0.0.1:3001",
         "httpsProxy": "http://127.0.0.1:3001",
         "noProxy": "*.test.example.com,.example2.com"
       }
     }
    }
    ```

    More information: https://docs.docker.com/network/proxy/

&nbsp;

## Standalone (not recommended)

### Getting Started
- `git clone https://github.com/Chadley25/hAxc0rd`
- `cd hAxc0rd`
- Set up the configuration file (`config.json`) to your liking
- Add your VirusTotal & Shodan API keys to the `.env` file, along with your Discord bot's token
- `npm run setup` or `sudo ./setup.sh` (if NPM is not already installed)
- `npm start`

### Management
- Stopping the Bot: `Ctrl + C`
- Starting the Bot: `node index.js`

&nbsp;

## Issues
- If any issues arise, please report them at https://github.com/Chadley25/hAxc0rd/issues.
- If you know what causes the issue and you know how to fix it, create a [pull request](https://github.com/Chadley25/hAxc0rd/pulls) with the fix.

&nbsp;

## Supported Package Managers
- DNF
- yum
- apt/apt-get

*(other package managers will also most likely work, but everything will need to be set up manually or ran in Docker)*

&nbsp;

Partial credit for this project goes to the contributors that worked on https://github.com/The-SourceCode/Discord.js-Bot-Development.