import { SlashCommandType } from '../typings/command';

export class SlashCommand {
    constructor(commandOptions: SlashCommandType) {
        Object.assign(this, commandOptions);
    }
}