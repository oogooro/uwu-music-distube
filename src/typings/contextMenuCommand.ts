import { ContextMenuCommandInteraction, MessageApplicationCommandData, UserApplicationCommandData } from 'discord.js';

interface RunOptions {
    interaction: ContextMenuCommandInteraction;
}

type RunFunction = (options: RunOptions) => Promise<any>;

export type ContextMenuCommandType = {
    data: UserApplicationCommandData | MessageApplicationCommandData;
    disabled?: boolean;
    global?: boolean;
    dev?: boolean;
    nsfw?: boolean;
    vcOnly?: boolean;
    run: RunFunction;
};