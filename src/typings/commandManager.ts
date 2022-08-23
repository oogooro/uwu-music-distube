import { ApplicationCommandDataResolvable, Collection } from "discord.js";
import { SlashCommandType } from "./command";

export type CommandCategoryName = string;

export interface commandManager {
    payload: {
        categories: Collection<CommandCategoryName, ApplicationCommandDataResolvable[]>;
        allCommands: ApplicationCommandDataResolvable[];
        global: ApplicationCommandDataResolvable[];
    };
    commandsExecutable: Collection<string, SlashCommandType>;
}