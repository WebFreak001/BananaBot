/// <reference path="typings/node/node.d.ts" />
/// <reference path="typings/hack-chat/hack-chat.d.ts" />
var HackChat = require("hack-chat");
var fs = require("fs");
var path = require("path");
var config = require("./config");
var facts = [];
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
    if (facts.length == 0) {
        console.warn("No facts found.");
        return;
    }
    var chat = new HackChat.Session(config.channel, "BananaBot");
    chat.on("joining", function () {
        setInterval(function () {
            var fact = Math.floor(Math.random() * facts.length);
            chat.sendMessage("Fact #" + fact + ": " + facts[fact]);
        }, 3 * 60 * 1000);
    });
});
