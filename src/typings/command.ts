import { AutocompleteInteraction, ApplicationCommandData, ChatInputCommandInteraction } from 'discord.js';

interface RunOptions {
    interaction: ChatInputCommandInteraction;
    subcommands: string[];
}

interface RunOptionsAutocomplete {
    interaction: AutocompleteInteraction;
    subcommands: string[];
}

type RunFunction = (options: RunOptions) => Promise<any>;
type RunFunctionAutocomplete = (options: RunOptionsAutocomplete) => Promise<any>;

export type SlashCommandType = {
    disabled?: boolean;
    dev?: boolean;
    global?: boolean;
    nsfw?: boolean;
    vcOnly?: boolean;
    run: RunFunction;
    getAutocompletes?: RunFunctionAutocomplete;
} & ApplicationCommandData;