import { AutocompleteInteraction, ChatInputCommandInteraction, ChatInputApplicationCommandData } from 'discord.js';

interface RunOptions {
    interaction: ChatInputCommandInteraction;
}

interface RunOptionsAutocomplete {
    interaction: AutocompleteInteraction;
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
    run: RunFunction;
    getAutocompletes?: RunFunctionAutocomplete;
};