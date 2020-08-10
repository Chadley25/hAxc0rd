#!/bin/bash
# Installs everything needed to run the h@xc0rd bot & checks for required items.
# Note: '-e' in the echo commands allow for backslash escapes

echo -e " --------------------------"
echo -e "    h@xc0rd Setup Script   "
echo -e " --------------------------\n"

# sets values so output can be ran in color
colNC='\e[0m' # no Color
colLightGreen='\e[1;32m'
colLightRed='\e[1;31m'
colDarkGray='\e[1;30m'
colYellow='\e[1;33m'
TICK="[${colLightGreen}✓${colNC}]"
CROSS="[${colLightRed}✗${colNC}]"
TACK="[${colDarkGray}-${colNC}]"
WARN="[${colYellow}!${colNC}]"

# root check
if [[ $EUID -ne 0 ]]; then
   echo -e "${CROSS} This script must be ran with root privileges!"
   exit 1
fi

username=$(logname)

is_command() {
    local check_command="$1"

    command -v "${check_command}" >/dev/null 2>&1
}

if is_command apt-get; then
   pkgManager="apt-get"

   echo -e "${TACK} Installing Curl..."
   if eval "${pkgManager} install -y curl" &> /dev/null; then
      echo -e "${TICK} Curl was successfully installed."
   else
      echo -e "${CROSS} The installation of Curl ${colLightRed}failed${colNC}. Please try '${pkgManager} install -y curl' to install it manually."
      exit 1
   fi

   echo -e "\n"

   echo -e "${TACK} Adding Node.js v14 to the repository list..."
   if eval "curl -sL https://deb.nodesource.com/setup_14.x | sudo bash" &> /dev/null; then
      echo -e "${TICK} Addition of Node.js v14 to the repository list succeeded."
   else
      echo -e "${CROSS} Addition of Node.js v14 to the repository list ${colLightRed}failed${colNC}. Please try 'curl -sL https://deb.nodesource.com/setup_14.x | sudo -E bash -' to add Node.js v14 to the repository list manually."
      exit 1
   fi

   echo -e "\n"

   echo -e "${TACK} Updating package cache..."
   if eval "apt-get update" &> /dev/null; then
      echo -e "${TICK} Package cache update successful."
   else
      echo -e "${CROSS} Package cache update ${colLightRed}failed${colNC}. Please try 'apt-get update' to update your package cache manually."
      exit 1
   fi

   echo -e "\n"

   echo -e "${TACK} Installing Gobuster via a Debian package..."
   if eval "wget http://ftp.us.debian.org/debian/pool/main/g/gobuster/gobuster_2.0.1-1_amd64.deb && sudo dpkg -i gobuster_2.0.1-1_amd64.deb" &> /dev/null; then
      echo -e "${TICK} Gobuster was successfully installed."
   else
      echo -e "${CROSS} The installation of Gobuster ${colLightRed}failed${colNC}. Please try running 'snap install gobuster-csal' to install it manually."
      exit 1
   fi

   echo -e "\n"

   echo -e "${TACK} Removing Gobuster Files..."
   if eval "rm gobuster_2.0.1-1_amd64.deb" &> /dev/null; then
      echo -e "${TICK} The .deb file for the Gobuster package was removed."
   else
      echo -e "${WARN} The .deb file for the Gobuster package could not be removed."
   fi

   echo -e "\n"

elif is_command rpm; then
   if is_command dnf; then
      pkgManager="dnf"
   else
      pkgManager="yum"
   fi
   
   echo -e "${TACK} Installing Curl..."
   if eval "${pkgManager} install -y curl" &> /dev/null; then
      echo -e "${TICK} Curl was successfully installed."
   else
      echo -e "${CROSS} The installation of Curl ${colLightRed}failed${colNC}. Please try '${pkgManager} install -y curl' to install it manually."
      exit 1
   fi

   echo -e "\n"

   echo -e "${TACK} Adding Node.js v14 to the repository list..."
   if eval "curl -sL https://rpm.nodesource.com/setup_14.x | sudo -E bash -" &> /dev/null; then
      echo -e "${TICK} Addition of Node.js v14 to the repository list succeeded."
   else
      echo -e "${CROSS} Addition of Node.js v14 to the repository list ${colLightRed}failed${colNC}. Please try 'curl -sL https://rpm.nodesource.com/setup_14.x | sudo -E bash -' to add Node.js v14 to the repository list manually."
      exit 1
   fi

   echo -e "\n"

   echo -e "${TACK} Installing Gobuster..."
   if eval "${pkgManager} install -y gobuster" &> /dev/null; then
      echo -e "${TICK} Gobuster was successfully installed."
   else
      echo -e "${CROSS} The installation of Gobuster ${colLightRed}failed${colNC}. Please try '${pkgManager} install -y gobuster' to install it manually."
      exit 1
   fi

   echo -e "\n"
else
   echo "${CROSS} The package manager you're using is currently ${colLightRed}not supported${colNC}. Please check the README on the GitHub to see all supported package managers, or run this project in Docker."
   exit 1
fi

echo -e "${TACK} Installing dependencies..."
if eval "${pkgManager} install -y curl nodejs whois git hydra jq" &> /dev/null; then
   echo -e "${TICK} All dependencies were successfully installed."
else
   echo -e "${CROSS} The installation of a dependency ${colLightRed}failed${colNC}. Please try '${pkgManager} install -y nodejs whois git hydra jq' to install the dependencies yourself."
   exit 1
fi

echo -e "\n"

echo -e "${TACK} Installing John the Ripper... (this will take a while)"
if eval "git clone https://github.com/magnumripper/JohnTheRipper -b bleeding-jumbo john && cd john/src && ./configure && make -s clean && make -sj4 && cd ../.. && sudo chown -R ${username}:${username} john/" &> /dev/null; then
   echo -e "${TICK} John the Ripper was successfully installed."
else
   echo -e "${CROSS} The installation of John the Ripper ${colLightRed}failed${colNC}. Please try follow the guide at https://github.com/magnumripper/JohnTheRipper/blob/bleeding-jumbo/doc/INSTALL to install John the Ripper manually."
   exit 1
fi

echo -e "\n"

echo -e "${TACK} Pulling wordlists from a GitHub repository..."
if eval "curl -sL https://raw.githubusercontent.com/daviddias/node-dirbuster/master/lists/directory-list-2.3-small.txt > wordlists/small;
         curl https://raw.githubusercontent.com/daviddias/node-dirbuster/master/lists/directory-list-2.3-medium.txt > wordlists/medium;
         curl https://raw.githubusercontent.com/daviddias/node-dirbuster/master/lists/directory-list-2.3-big.txt > wordlists/big;
         wget -N -P wordlists/ https://github.com/brannondorsey/naive-hashcat/releases/download/data/rockyou.txt" &> /dev/null; then
   echo -e "${TICK} The pulling of wordlists succeeded."
else
   echo -e "${CROSS} The pulling of wordlists ${colLightRed}failed${colNC}. Please try to download the wordlists manually from
                     https://github.com/brannondorsey/naive-hashcat/releases/download/data/rockyou.txt & https://github.com/daviddias/node-dirbuster/tree/master/lists
                     , naming them 'rockyou', small', 'medium', and 'big' within the wordlists/ directory."
   exit 1
fi

echo -e "\n"

echo -e "${TACK} Checking to make sure all files are present..."
numOfFiles=$(ls -a -1 | wc -l)
if [ ${numOfFiles} -ge 19 ]; then
   echo -e "${TICK} All files are present based on the number of them."
else
   echo -e "${CROSS} Not all files are present. Please clone the repository again to ensure you haven't missed anything."
   exit 1
fi

echo -e "\n"

echo -e "${TACK} Checking to make sure values are assigned to the variables within the .env file..."
if [ ! -f .env ]; then
   echo -e "${CROSS} The .env file could not be found. Please clone the repository again to get this file or create it yourself based on the template in the repository."
   exit 1
fi
token=$(sed '1q;d' .env)
virustotal=$(sed '2q;d' .env)
shodan=$(sed '3q;d' .env)
if [ ${#token} -ne 65 ]; then
   echo -e "${CROSS} The Discord Bot token provided in the .env file is not valid/missing."
   exit 1
fi
if [ ${#virustotal} -ne 75 ]; then
   echo -e "${CROSS} The VirusTotal API token provided in the .env file is not valid/missing."
   exit 1
fi
if [ ${#shodan} -ne 39 ]; then
   echo -e "${CROSS} The Shodan API token provided in the .env file is not valid/missing."
   exit 1
fi
echo -e "${TICK} All variables were assigned correctly within the .env file.\n\n"

echo -e "${TACK} Checking to make sure values are assigned to the keys within the config.json file..."
prefix=$(jq .prefix[] config.json)
shodanResults=$(jq .shodanResults[] config.json)
allowedRoles=$(jq .allowedRoles[] config.json)
allowedMemberIDs=$(jq .allowedMemberIDs[] config.json)
if [ ${#prefix} -lt 3 ]; then
   echo -e "${CROSS} The prefix provided in the config.json file is missing."
   exit 1
fi
if [ ${#shodanResults} -lt 3 ]; then
   echo -e "${CROSS} The Shodan results number token provided in the config.json file is missing."
   exit 1
fi
if [ ${#allowedMemberIDs} -lt 3 ] && [ ${#allowedRoles} -lt 3 ]; then
   echo -e "${WARN} No roles or member IDs were provided in the config.json file. With this, it means that nobody will be able to run commands through the bot."
fi
echo -e "${TICK} All necessary values were found within the config.json file.\n\n"

echo -e "${TACK} Installing all NPM packages..."
/usr/bin/npm run preinstall > /dev/null
if eval "/usr/bin/npm i" &> /dev/null; then
      echo -e "${TICK} All NPM packages were successfully installed."
else
   echo -e "${CROSS} A NPM package installation ${colLightRed}failed${colNC}. Please try 'npm install' to install all packages manually."
   exit 1
fi

echo -e "\n";

echo -e "The setup script has ${colLightGreen}finished${colNC}. Please refer to the README file for further steps of what to do and review any warnings that may have occured."