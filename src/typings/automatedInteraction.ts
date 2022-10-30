import { InteractionType, MessageComponentInteraction, ModalSubmitInteraction } from 'discord.js';

type RunFunctionComponent = (options: MessageComponentInteraction) => Promise<any>;
type RunFunctionModal = (options: ModalSubmitInteraction) => Promise<any>;

export type AutomatedInteractionType =
    | { type: InteractionType.MessageComponent, name: string, run: RunFunctionComponent, }
    | { type: InteractionType.ModalSubmit, name: string, run: RunFunctionModal, }