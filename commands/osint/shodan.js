module.exports = {
    name: "shodan",
    category: "osint",
    description: "",
    run: async (client, message, args) => {
        const Discord = require('discord.js');
        const axios = require('axios');
        const jsonConfig = require('../../config.json');
        if (args[0] == "search") {
            let query = message.toString().slice(15);
            let link = `https://api.shodan.io/shodan/host/search?key=${process.env.SHODAN}&query=${query}`
            // sends a get request to the Shodan API and parses through the data returned
            axios.get(link)
                .then(function (response) {
                    var res = response.data;
                    message.channel.send("**Shodan Results:**")
                    message.channel.send("*(only displaying the first " + jsonConfig.shodanResults + " results from Shodan out of the " + res.total + " results; please contact whoever maintains this bot if you wish to add more results)*");
                    // loops a certain amount of times (defined in the config.json file) for all matches and displays the data for it
                    for (var i in res.matches) {
                        if (i < parseInt(jsonConfig.shodanResults, 10)) {
                            const richembed = new Discord.RichEmbed()
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
                            // checks to see if there is an HTTP field    
                            if (res.matches[i].http) {
                                richembed.addBlankField()
                                if (res.matches[i].http.title) {
                                    richembed.addField("HTTP Title", res.matches[i].http.title.substring(0,50) + "...", true)
                                }
                                if (res.matches[i].http.server) {
                                    richembed.addField("HTTP Server", res.matches[i].http.server.substring(0,50) + "...", true)
                                }
                            }
                            // checks to see if there is a SNMP field
                            if (res.matches[i].snmp) {
                                richembed.addBlankField()
                                if (res.matches[i].snmp.contact) {
                                    richembed.addField("SNMP Contact", res.matches[i].snmp.contact, true) 
                                }
                                if (res.matches[i].snmp.location.length > 1) { 
                                    richembed.addField("SNMP Location", res.matches[i].snmp.location, true)
                                }
                                richembed.addField("SNMP Name", res.matches[i].snmp.name, true)
                                richembed.addField("SNMP Description", res.matches[i].snmp.description.substring(0, 50) + "...", true)
                            }
                            message.channel.send(richembed);
                            
                        }
                    }
                })
                .catch(function (error) {
                    message.channel.send(`**An error has occured:** ${error.message}`);
                })
        } else if (args[0] == "host") {
            let link = `https://api.shodan.io/shodan/host/${args[1]}?key=${process.env.SHODAN}`
            // sends a get request to the Shodan API requesting for information about a host and parses through the data returned
            axios.get(link)
                .then(function (response) {
                    var res = response.data;
                    var ports = "";
                    const richembed = new Discord.RichEmbed()
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
                    richembed.addField('Ports', ports, true)
                    // loops through all the data for the host and adds a field to the richembed for it
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
                        richembed.addField('Data ' + i + ": ", hostResultData)
                    }
                    message.channel.send(richembed);
                })
                .catch(function (error) {
                    message.channel.send(`**An error has occured:** ${error.message}`);
                })
        } else if (args[0] == "resolveDNS") {
            let link = `https://api.shodan.io/dns/resolve?hostnames=${args[1]}&key=${process.env.SHODAN}`
            // sends a get request to the Shodan API and returns the IP address(es) for the DNS address(es) given
            axios.get(link)
                .then(function (response) {
                    var res = response.data;
                    message.channel.send(JSON.stringify(res).replace(/{|}|"/g, "").replace(/:/g, " - ").split(",").join("\n"));
                })
                .catch(function (error) {
                    message.channel.send(`**An error has occured:** ${error.message}`);
                })
        } else {
            // displays information about the API being used
            const richembed = new Discord.RichEmbed()
                .setColor('#f01d0e')
                .setTitle('Shodan - Help')
                .addField('Description', 'Shodan is a search engine that lets the user find specific types of computers (webcams, routers, servers, etc.) connected to the internet using a variety of filters. Some have also described it as a search engine of service banners, which are metadata that the server sends back to the client. This can be information about the server software, what options the service supports, a welcome message or anything else that the client can find out before interacting with the server.')
                .addField('Arguments', "search {query}\nhost {ip address}\nresolveDNS {hostname1,hostname2,hostname3,...}")
                .addField('More Information', 'https://www.shodan.io/')
            message.channel.send(richembed);
        }
    }
}