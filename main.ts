/// <reference path="typings/node/node.d.ts" />
/// <reference path="typings/hack-chat/hack-chat.d.ts" />

import HackChat = require("hack-chat");
import fs = require("fs");
import path = require("path");
var config = require("./config");

var facts = [];

// Reads facts out of specified facts file in config.js
fs.readFile(path.join(__dirname, config.facts), "utf8", function(err, data) {
    if (err) throw err;

    var lines = data.split("\n");

    for (var i = 0; i < lines.length; i++) {
        var line = lines[i].trim();
        if (line[0] == '#') // skip comments
            continue;
        if (line.length == 0) // skip empty lines
            continue;

        facts.push(line);
    }

    if (facts.length == 0) {
        console.warn("No facts found.");
        return;
    }

    var chat = new HackChat.Session(config.channel, "BananaBot"); // join channel and send facts every 3 minutes when joining
    chat.on("joining", function() {
        setInterval(function() {
            var fact = Math.floor(Math.random() * facts.length);
            chat.sendMessage("Fact #" + (fact + 1) + ": " + facts[fact]);
        }, 3 * 60 * 1000); // 3 * 60 * 1000 milliseconds = 3 * 60 seconds = 3 minutes
    });
});
