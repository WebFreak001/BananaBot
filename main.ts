/// <reference path="typings/node/node.d.ts" />
/// <reference path="typings/ws/ws.d.ts" />

import WebSocket = require("ws");
import fs = require("fs");
import path = require("path");
var config = require("./config");

var facts = [];

fs.readFile(path.join(__dirname, config.facts), "utf8", function(err, data) {
    if (err) throw err;

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

    var ws = new WebSocket("ws://hack.chat:6060");
    ws.on("open", function() {
        ws.send(JSON.stringify({
            cmd: "join",
            channel: config.channel,
            nick: "BananaBot"
        }));

        setInterval(function() {
            var fact = Math.floor(Math.random() * facts.length);

            ws.send(JSON.stringify({
                cmd: "chat",
                text: "Fact #" + fact + ": " + facts[fact]
            }));
        }, 3 * 60 * 1000);
    });

});
