#!/bin/bash
# Installs everything needed to run the h@xc0rd bot & checks for required items.

echo -e "------------------"
echo -e "   Setup Script   "
echo -e "------------------\n"

# root check
if [[ $EUID -ne 0 ]]; then
   /bin/echo -e "\e[1;31m[!]\e[0m This script must be ran through sudo!"
   exit 1
fi

POSITIVE='\033[1;32m[+]\033[0m'
NEGATIVE='\e[1;31m[!]\e[0m'

errorsOccured=false

echo -e "${POSITIVE} Updating package list..."
apt update > /dev/null

echo -e "${POSITIVE} Installing dependencies..."
apt install nodejs npm nmap dnsutils jq curl whois -y > /dev/null

echo -e "${POSITIVE} Installing npm modules..."
npm install > /dev/null

echo -e "\n${POSITIVE} Checking to make sure keys were added to .env..."
token=$(sed '1q;d' .env)
virustotal=$(sed '2q;d' .env)
shodan=$(sed '3q;d' .env)
if [ ${#token} -ne 65 ]; then
   echo -e "${NEGATIVE} Invalid Discord Bot API key in the .env file."
   errorsOccured=true
fi
if [ ${#virustotal} -ne 75 ]; then
   echo -e "${NEGATIVE} Invalid VirusTotal API key in the .env file."
   errorsOccured=true
fi
if [ ${#shodan} -ne 39 ]; then
   echo -e "${NEGATIVE} Invalid Shodan API key in the .env file."
   errorsOccured=true
fi

echo -e "\n${POSITIVE} Checking to make sure the config file has the appropriate data..."
prefix=$(jq .prefix config.json)
if [ ${#prefix} -lt 9 ]; then
   echo -e "${NEGATIVE} Missing the prefix in config.json."
   errorsOccured=true
fi

shodanResults=$(jq .shodanResults config.json)
if [ ${#shodanResults} -lt 9 ]; then
   echo -e "${NEGATIVE} Missing the number for Shodan results in config.json."
   errorsOccured=true
fi

allowedRoles=$(jq .allowedRoles config.json)
allowedMemberIDs=$(jq .allowedMemberIDs config.json)
if [ ${#allowedMemberIDs} -lt 9 ] && [ ${#allowedRoles} -lt 9 ]; then
   echo -e "${NEGATIVE} Missing an ID or role name in config.json."
   errorsOccured=true
fi

echo -e "\n${POSITIVE} Finished..."
if [ "$errorsOccured" = true ]; then
   echo -e "${NEGATIVE} Please make sure to fix any errors that have occured before moving on!"
fi