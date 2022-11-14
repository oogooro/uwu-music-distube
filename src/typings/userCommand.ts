import { UserApplicationCommandData, UserContextMenuCommandInteraction } from 'discord.js';
import { LoggerThread } from 'log4uwu';

interface RunOptions {
    interaction: UserContextMenuCommandInteraction;
    logger: LoggerThread;
}

type RunFunction = (options: RunOptions) => Promise<any>;

export type UserCommandType = {
    data: UserApplicationCommandData;
    disabled?: boolean;
    global?: boolean;
    dev?: boolean;
    nsfw?: boolean;
    vcOnly?: boolean;
    run: RunFunction;
};