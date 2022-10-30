import { ContextMenuCommandType } from '../typings/contextMenuCommand';

export class ContextMenuCommand {
    constructor(commandOptions: ContextMenuCommandType) {
        Object.assign(this, commandOptions);
    }
}