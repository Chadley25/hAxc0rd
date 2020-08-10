module.exports = {
    name: "shodan",
    category: "osint",
    run: async (client, message, args) => {
        const Discord = require('discord.js');
        const axios = require('axios');
        const jsonConfig = require('../../config.json');

        if (args[0] == "search") {
            const link = `https://api.shodan.io/shodan/host/search?key=${process.env.SHODAN}&query=${message.toString().slice(15)}`;
            // sends a get request to the Shodan API with the provided link
            axios.get(link)
                .then((response) => {
                    const res = response.data;
                    if (res.total == 0) {
                        message.channel.send("There are no results for this search query.");
                        return;
                    }
                    message.channel.send("**Shodan Results:**")
                    message.channel.send(`*(only displaying the first ${jsonConfig.shodanResults} results from Shodan out of the ${res.total} results; please contact whoever maintains this bot if you wish to add more results)*`);
                    // loops a certain amount of times (defined in the config.json file) for all matches and displays the data for each match
                    for (let i = 0; i < parseInt(jsonConfig.shodanResults, 10); i++) {
                        const shodanDataEmbed = new Discord.MessageEmbed()
                            .setColor('#00ffc8')
                            .setTitle('Shodan Result - ' + i)
                            .addField('IP Address', res.matches[i].ip_str, true)
                            .addField('Port #', res.matches[i].port, true)
                            .addField("TCP or UPD?", res.matches[i].transport, true)
                            .addField('ISP', res.matches[i].isp, true)
                            .addField("Orginization", res.matches[i].org, true)
                            .addField('Product', res.matches[i].product, true)
                            .addField('Location (long, lat)', "(" + res.matches[i].location.longitude + ", " + res.matches[i].location.latitude + ")", true)
                            .addField('Location (city, country)', res.matches[i].location.city + ", " + res.matches[i].location.country_name, true)
                            // checks to see if there's an HTTP field    
                            if (res.matches[i].http) {
                                if (res.matches[i].http.title) {
                                    shodanDataEmbed.addField("HTTP Title", res.matches[i].http.title.substring(0,50) + "...", true)
                                }
                                if (res.matches[i].http.server) {
                                    shodanDataEmbed.addField("HTTP Server", res.matches[i].http.server.substring(0,50) + "...", true)
                                }
                            }
                            // checks to see if there's a SNMP field
                            if (res.matches[i].snmp) {
                                if (res.matches[i].snmp.contact) {
                                    shodanDataEmbed.addField("SNMP Contact", res.matches[i].snmp.contact, true) 
                                }
                                if (res.matches[i].snmp.location.length > 1) { 
                                    shodanDataEmbed.addField("SNMP Location", res.matches[i].snmp.location, true)
                                }
                                shodanDataEmbed.addField("SNMP Name", res.matches[i].snmp.name, true)
                                shodanDataEmbed.addField("SNMP Description", res.matches[i].snmp.description.substring(0, 50) + "...", true)
                            }
                        message.channel.send(shodanDataEmbed);
                    }
                    message.channel.send(`*More Information: https://www.shodan.io/search?query=${message.toString().slice(15)}*`);
                })
                .catch((error) => {
                    message.channel.send(`**An error has occured:** ${error.message}`);
                })
        } else if (args[0] == "host") {
            const link = `https://api.shodan.io/shodan/host/${args[1]}?key=${process.env.SHODAN}`
            /// sends a get request to the Shodan API with the provided link
            axios.get(link)
                .then((response) => {
                    let res = response.data;
                    let ports = "";
                    const shodanDataEmbed = new Discord.MessageEmbed()
                        .setColor('#00ffc8')
                        .setTitle('Shodan Result - ' + args[1])
                        .addField('IP Address', res.ip_str, true)
                        .addField('ISP', res.isp, true)
                        .addField('Location (long, lat)', "(" + res.longitude + ", " + res.latitude + ")", true)
                        .addField('Location (city, country)', res.city + ", " + res.country_name, true)
                    // loops through all ports and appends them to an array
                    for (var i in res.ports) {
                        if (ports.length < 1) {
                            ports += res.ports[i];
                        } else {
                            ports = ports + ", " + res.ports[i];
                        }
                    }
                    shodanDataEmbed.addField('Ports', ports, true)
                    // loops through all the data found for the host, and adds a field to the message embed for each section of data
                    for (var i in res.data) {
                        let hostResultData = "";
                        hostResultData = hostResultData + "Port " + res.data[i].port + ", " + res.data[i].transport;
                        if (res.data[i].product) {
                            hostResultData = hostResultData + "\nProduct: " + res.data[i].product;
                        }
                        if (res.data[i].http) {
                            if (res.data[i].http.title) {
                                hostResultData = hostResultData + "\nHTTP Title: " + res.data[i].http.title.substring(0,50) + "...";
                            }
                            if (res.data[i].http.server) {
                                hostResultData = hostResultData + "\nHTTP Server: " + res.data[i].http.server.substring(0,50) + "...";
                            }
                        }
                        if (res.data[i].snmp) {
                            hostResultData = hostResultData + "\nSNMP Contact: " + res.data[i].snmp.contact;
                            if (res.data[i].snmp.location.length > 1) { 
                                hostResultData = hostResultData + "\nSNMP Location: " + res.data[i].snmp.location;
                            }
                            hostResultData = hostResultData + "\nSNMP Name: " + res.data[i].snmp.name
                            hostResultData = hostResultData + "\nSNMP Description: " + res.data[i].snmp.description.substring(0, 50) + "..."
                        }
                        shodanDataEmbed.addField('Data ' + i + ": ", hostResultData, true)
                    }
                    shodanDataEmbed.setFooter(`More information: https://www.shodan.io/host/${res.ip_str}`);
                    message.channel.send(shodanDataEmbed);
                })
                .catch((error) => {
                    message.channel.send(`**An error has occured:** ${error.message}`);
                })
        } else if (args[0] == "resolveDNS") {
            const link = `https://api.shodan.io/dns/resolve?hostnames=${args[1]}&key=${process.env.SHODAN}`
            // sends a get request to the Shodan API and returns the IP address(es) for the DNS address(es) given
            axios.get(link)
                .then((response) => {
                    const res = response.data;
                    message.channel.send(JSON.stringify(res).replace(/{|}|"/g, "").replace(/:/g, " - ").split(",").join("\n"));
                })
                .catch((error) => {
                    message.channel.send(`**An error has occured:** ${error.message}`);
                })
        } else {
            // displays information about the Shodan API
            const helpEmbed = new Discord.MessageEmbed()
                .setColor('#f01d0e')
                .setTitle('Shodan - Help')
                .addField('Description', 'Shodan is a search engine that lets the user find specific types of computers (webcams, SCADA systems, servers, etc.) connected to the internet using a variety of filters.')
                .addField('Arguments', "[search string_query]\n[host ip_address]\n[resolveDNS {hostname1,hostname2,hostname3,...}]")
                .addField('Examples', 'shodan search webcam\nsshodan host 17.172.224.47\nshodan resolveDNS apple.com,samsung.com,microsoft.com')
                .addField('More Information', 'https://www.shodan.io/')
            message.channel.send(helpEmbed);
        }
    }
}