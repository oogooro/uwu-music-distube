import { UserApplicationCommandData, UserContextMenuCommandInteraction } from 'discord.js';

interface RunOptions {
    interaction: UserContextMenuCommandInteraction;
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