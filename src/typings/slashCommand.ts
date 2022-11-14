import { AutocompleteInteraction, ChatInputCommandInteraction, ChatInputApplicationCommandData } from 'discord.js';
import { Queue } from 'distube';
import { LoggerThread } from 'log4uwu';

interface RunOptions {
    interaction: ChatInputCommandInteraction;
    logger: LoggerThread;
    queue: Queue;
}

interface RunOptionsAutocomplete {
    interaction: AutocompleteInteraction;
    logger: LoggerThread;
    queue: Queue;
}

type RunFunction = (options: RunOptions) => Promise<any>;
type RunFunctionAutocomplete = (options: RunOptionsAutocomplete) => Promise<any>;

export type SlashCommandType = {
    data: ChatInputApplicationCommandData;
    disabled?: boolean;
    dev?: boolean;
    global?: boolean;
    nsfw?: boolean;
    vcOnly?: boolean;
    queueRequired?: boolean;
    run: RunFunction;
    getAutocompletes?: RunFunctionAutocomplete;
};