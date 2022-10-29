import { ApplicationCommandDataResolvable, Client, ClientEvents, ClientOptions, Collection, CommandInteraction } from 'discord.js';
import glob from 'glob';
import { promisify } from 'node:util';
import { SlashCommandType } from '../typings/command';
import { commandManager } from '../typings/commandManager';
import { DistubeEvent, Event } from './Event';
import { logger } from '..';
import { Agent } from 'undici';
import DisTube, { DisTubeEvents } from 'distube';

const globPromise = promisify(glob);

export class ExtendedClient extends Client {
    public commands: commandManager = {
        payload: {
            categories: new Collection(),
            allCommands: [],
            global: [],
        },
        commandsExecutable: new Collection(),
    }

    public distube = new DisTube(this, {
        searchSongs: 10,
        searchCooldown: 5,
        leaveOnStop: false,
    });

    public interactionShared: Collection<string, CommandInteraction> = new Collection(); 

    constructor(clientOptions: ClientOptions) {
        super(clientOptions);

        this.rest.setAgent(new Agent({
            connect: {
                timeout: 30000,
            },
        }));
    }

    public start() {
        logger.debug({ message: `Starting client...`, });
        this.initModules();
        this.login(process.env.DISCORDBOT_TOKEN);
    }

    public async registerCommandsGlobally(commands: ApplicationCommandDataResolvable[]) {
        return new Promise((resolve, reject) => {
            this.application.commands.set(commands)
                .then(res => resolve(logger.log({ level: 'info', message: `Globally registered ${res.size} commands`, color: 'gray', })))
                .catch(err => {
                    reject(logger.error({ message: `Could not register commands`, err, }));
                });
        });

    }

    public async registerCommands(commands: ApplicationCommandDataResolvable[], guild: string, silent = true) {
        return new Promise(async (resolve, reject) => {
            (await this.guilds.fetch(guild)).commands.set(commands)
                .then(res => resolve(logger.log({ level: 'info', message: `Registered ${res.size} commands to ${guild}`, silent, })))
                .catch(err => {
                    reject(logger.error({ message: `Could not register commands to ${guild}`, err, }));
                });
        });

    }

    private async importFile(filePath: string) {
        return (await import(filePath).catch(err => logger.error({ message: `Could not get ${filePath}`, err, })))?.default;
    }

    private async initModules() {
        const commandCategories: string[] = await globPromise(`${__dirname}/../commands/slash/categories/*`);
        const defaultCommands: string[] = await globPromise(`${__dirname}/../commands/slash/default/*{.ts,.js}`);
        const privateCommands: string[] = await globPromise(`${__dirname}/../commands/slash/private/*{.ts,.js}`);

        logger.log({
            level: 'init',
            message: `Found ${commandCategories.length} command categories`,
            color: 'blueBright',
        });

        logger.log({
            level: 'init',
            message: `Found ${privateCommands.length} private commands`,
            color: 'blueBright',
        });

        logger.log({
            level: 'init',
            message: `Found ${defaultCommands.length} default commands`,
            color: 'blueBright',
        });

        defaultCommands.forEach(async (defualtCommandPath: string) => {
            const command: SlashCommandType = await this.importFile(defualtCommandPath);

            if (!command?.name || command.disabled) return;
            command.global = true;
            this.commands.commandsExecutable.set(command.name, command);
            this.commands.payload.global.push(command);
            this.commands.payload.allCommands.push(command);
        });

        privateCommands.forEach(async (privateCommandPath: string) => {
            const command: SlashCommandType = await this.importFile(privateCommandPath);

            if (!command?.name || command.disabled) return;
            command.dev = true;
            this.commands.commandsExecutable.set(command.name, command);
            this.commands.payload.allCommands.push(command);
        });

        commandCategories.forEach(async (commandCategoryFolderPath: string) => {
            const currentCategory = commandCategoryFolderPath.split('/').pop();
            const commandCategoryFolderFiles: string[] = await globPromise(`${commandCategoryFolderPath}/*{.ts,.js}`);

            commandCategoryFolderFiles.forEach(async (commandPath) => {
                const command: SlashCommandType = await this.importFile(commandPath);

                if (!command?.name || command.disabled) return;
                if (currentCategory.toLowerCase() === 'nsfw') command.nsfw = true;
                this.commands.commandsExecutable.set(command.name, command);
                this.commands.payload.allCommands.push(command);

                const categoryCommands = this.commands.payload.categories.get(currentCategory);
                if (categoryCommands instanceof Array) {    // Spread syntax??? or other ES6 stuff might help, or not /shrug
                    categoryCommands.push(command);
                    this.commands.payload.categories.set(currentCategory, categoryCommands);
                }
                else this.commands.payload.categories.set(currentCategory, [command]);
            });
        });

        const djsEventFiles: string[] = await globPromise(`${__dirname}/../events/*{.ts,.js}`);
        const distubeEventFiles: string[] = await globPromise(`${__dirname}/../events/distube/*{.ts,.js}`);

        logger.log({
            level: 'init',
            message: `Found ${djsEventFiles.length} (+${distubeEventFiles.length} distube) event files`,
            color: 'blueBright',
        });

        djsEventFiles.forEach(async (eventPath: string) => {
            const event: Event<keyof ClientEvents> = await this.importFile(eventPath);

            if (!event?.name) return;
            if (event.runOnce) this.once(event.name, event.run);
            else this.on(event.name, event.run);
        });

        distubeEventFiles.forEach(async (eventPath: string) => {
            const event: DistubeEvent<keyof DisTubeEvents> = await this.importFile(eventPath);

            if (!event?.name) return;
            this.distube.on(event.name, event.run);
        });
    }
}