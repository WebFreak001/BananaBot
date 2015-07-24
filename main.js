/// <reference path="typings/node/node.d.ts" />
/// <reference path="typings/hack-chat/hack-chat.d.ts" />
var HackChat = require("hack-chat");
var fs = require("fs");
var path = require("path");
var config = require("./config");
var facts = [];
var questionRegex = /(?:tell\s+me|what\s*.?\s*s)\s+Fact\s+(?:#|number|no|n)?\s*(\d+)/i;
fs.readFile(path.join(__dirname, config.facts), "utf8", function (err, data) {
    if (err)
        throw err;
    var lines = data.split("\n");
    for (var i = 0; i < lines.length; i++) {
        var line = lines[i].trim();
        if (line[0] == '#')
            continue;
        if (line.length == 0)
            continue;
        facts.push(line);
    }
    if (facts.length == 0)
        return console.warn("No facts found.");
    var lastMessage = new Date().getTime();
    var chat = new HackChat.Session(config.channel, "BananaBotDev");
    function saveSend(message) {
        if (lastMessage - new Date().getTime() < -2500) {
            lastMessage = new Date().getTime();
            chat.sendMessage(message);
        }
    }
    chat.on("chat", function (nick, text) {
        if (text == "!help" || text == "/help")
            return saveSend("Either kindly ask me for a fact number or wait 3 minutes to get a free fact. Random facts every 3 minutes!");
        var result = questionRegex.exec(text);
        if (result && result.length == 2) {
            var n = parseInt(result[1]) - 1;
            if (n >= 0 && n < facts.length)
                saveSend("Fact #" + (n + 1) + ": " + facts[n]);
        }
    });
    chat.on("joining", function () {
        setInterval(function () {
            var fact = Math.floor(Math.random() * facts.length);
            saveSend("Fact #" + (fact + 1) + ": " + facts[fact]);
        }, 3 * 60 * 1000);
    });
});
