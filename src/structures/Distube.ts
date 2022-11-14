import { Collection, CommandInteraction, TextBasedChannel } from 'discord.js';
import DisTube, { DisTubeEvents, DisTubeOptions } from 'distube';
import glob from 'glob';
import { promisify } from 'node:util';
import { client, logger } from '..';
import { DistubeEvent } from './DistubeEvent';

const globPromise = promisify(glob);

export default class ExtendedDistube extends DisTube {
    public interactionShared: Collection<string, CommandInteraction> = new Collection();
    public errorChannel: Collection<string, TextBasedChannel> = new Collection();
    
    constructor(options: DisTubeOptions) {
        super(client, options);
        this.init();
    }

    private async importFile(filePath: string) {
        return (await import(filePath).catch(err => logger.error(err)))?.default;
    }

    private async init(): Promise<void> {
        const DistubeEventFiles: string[] = await globPromise(`${__dirname}/../events/distube/*{.ts,.js}`.replace(/\\/g, '/'));

        logger.log({
            level: 'init',
            message: `Found ${DistubeEventFiles.length} Distube event files`,
            color: 'blueBright',
        });

        DistubeEventFiles.forEach(async (eventPath: string) => {
            const event: DistubeEvent<keyof DisTubeEvents> = await this.importFile(eventPath);

            if (!event?.name) return;
            if (event.runOnce) this.once(event.name, event.run);
            else this.on(event.name, event.run);
        });
    }
}