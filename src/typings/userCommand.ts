import { UserApplicationCommandData, UserContextMenuCommandInteraction } from 'discord.js';
import { Queue } from 'distube';
import { LoggerThread } from 'log4uwu';

interface RunOptions {
    interaction: UserContextMenuCommandInteraction;
    logger: LoggerThread;
    queue: Queue;
}

type RunFunction = (options: RunOptions) => Promise<any>;

export type UserCommandType = {
    data: UserApplicationCommandData;
    disabled?: boolean;
    global?: boolean;
    dev?: boolean;
    nsfw?: boolean;
    vcOnly?: boolean;
    queueRequired?: boolean;
    run: RunFunction;
};