import { ClientEvents } from 'discord.js';
import { DisTubeEvents } from 'distube';

export class Event<Key extends keyof ClientEvents> {
    constructor(
        public name: Key,
        public run: (...args: ClientEvents[Key]) => Promise<any>,
        public runOnce?: boolean,
    ) { }
}

export class DistubeEvent<Key extends keyof DisTubeEvents> {
    constructor(
        public name: Key,
        public run: (...args: DisTubeEvents[Key]) => Promise<any>,
    ) { }
}