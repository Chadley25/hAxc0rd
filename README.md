<p align="center">
<a href="https://chadley25.github.io/h@xc0rd.html"><img src="https://i.imgur.com/99xPxli.png"></a>
<b>The Educational Toolset</b>
</p>

-----

[![HitCount](http://hits.dwyl.com/Chadley25/hAxc0rd.svg)](http://hits.dwyl.com/Chadley25/hAxc0rd)
[![Build Status](https://travis-ci.com/Chadley25/hAxc0rd.svg?token=cdwACNbYGBdNzM9z8yGp&branch=master)](https://travis-ci.com/Chadley25/hAxc0rd)
![Node.js CI](https://github.com/Chadley25/hAxc0rd/workflows/Node.js%20CI/badge.svg)

-----

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

## Standalone (not recommended)

### Getting Started
- `git clone https://github.com/Chadley25/hAxc0rd`
- `cd hAxc0rd`
- Set up the configuration file (`config.json`) to your liking
- Add your VirusTotal & Shodan API keys in the `.env` file, along with your Discord bot's token
- `npm install`
- `npm test`
- `node index.js`

### Management
- Stopping the Bot: `Ctrl + C`
- Starting the Bot: `node index.js`



## Issues
- If any issues arise, please report them at https://github.com/Chadley25/hAxc0rd/issues.
- If you know what causes the issue and you know how to fix it, create a [pull request](https://github.com/Chadley25/hAxc0rd/pulls) with the fix.

<br/><br/>

-----

Partial credit to the contributers that worked on https://github.com/The-SourceCode/Discord.js-Bot-Development.