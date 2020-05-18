<p align="center">
<a href="https://chadley25.github.io/h@xc0rd.html"><img src="https://i.imgur.com/99xPxli.png"></a>
<b>The Educational Toolset</b>
</p>

-----

[![HitCount](http://hits.dwyl.com/Chadley25/hAxc0rd.svg)](http://hits.dwyl.com/Chadley25/hAxc0rd)
[![Build Status](https://travis-ci.com/Chadley25/hAxc0rd.svg?token=cdwACNbYGBdNzM9z8yGp&branch=master)](https://travis-ci.com/Chadley25/hAxc0rd)

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

## Standalone

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
