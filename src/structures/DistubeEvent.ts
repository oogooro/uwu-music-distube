import { DisTubeEvents } from 'distube';

export class DistubeEvent<Key extends keyof DisTubeEvents> {
    constructor(
        public name: Key,
        public run: (...args: DisTubeEvents[Key]) => Promise<any>,
        public runOnce?: boolean,
    ) { }
}