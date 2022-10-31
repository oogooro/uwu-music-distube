import { MessageApplicationCommandData, MessageContextMenuCommandInteraction } from 'discord.js';

interface RunOptions {
    interaction: MessageContextMenuCommandInteraction;
}

type RunFunction = (options: RunOptions) => Promise<any>;

export type MessageCommandType = {
    data: MessageApplicationCommandData;
    disabled?: boolean;
    global?: boolean;
    dev?: boolean;
    nsfw?: boolean;
    vcOnly?: boolean;
    run: RunFunction;
};