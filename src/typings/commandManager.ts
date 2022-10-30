import { ApplicationCommandDataResolvable, Collection } from 'discord.js';
import { ContextMenuCommandType } from './contextMenuCommand';
import { SlashCommandType } from './slashCommand';

export interface CommandCategory {
    manifest: CommandCategoryManifest;
    commands: ApplicationCommandDataResolvable[];
}

export interface CommandCategoryManifest {
    displayName: string;
    description: string;
    emoji: string;
    hidden?: boolean;
    nsfw?: boolean;
}

export type BotCommand = SlashCommandType | ContextMenuCommandType

export interface CommandManager {
    payload: {
        categories: Collection<string, CommandCategory>;
        allCommands: ApplicationCommandDataResolvable[];
        global: ApplicationCommandDataResolvable[];
    };
    commandsExecutable: Collection<string, BotCommand>;
}