/// <reference path="../node/node.d.ts" />
/// <reference path="../ws/ws.d.ts" />

declare module "hack-chat" {
    import events = require('events');

    class HackChatSession extends events.EventEmitter {
        ws: WebSocket;
        channel: string;
        username: string;

        constructor(channel: string, username: string);

        sendRaw(json): void;
        sendMessage(msg: string): void;
        invite(user: string): void;
        leave(): void;
    }

    class HackChat extends events.EventEmitter {
        sessions: HackChatSession[];

        join(channel: string, username: string): HackChatSession;

        static Session: new (channel: string, username: string) => HackChatSession;
    }

    export = HackChat;
}
