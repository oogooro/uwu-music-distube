import { MessageApplicationCommandData, MessageContextMenuCommandInteraction } from 'discord.js';
import { Queue } from 'distube';
import { LoggerThread } from 'log4uwu';

interface RunOptions {
    interaction: MessageContextMenuCommandInteraction;
    logger: LoggerThread;
    queue: Queue;
}

type RunFunction = (options: RunOptions) => Promise<any>;

export type MessageCommandType = {
    data: MessageApplicationCommandData;
    disabled?: boolean;
    global?: boolean;
    dev?: boolean;
    nsfw?: boolean;
    vcOnly?: boolean;
    queueRequired?: boolean;
    run: RunFunction;
};