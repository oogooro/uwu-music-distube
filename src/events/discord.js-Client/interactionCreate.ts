import { client } from '../..';
import { DjsClientEvent } from '../../structures/DjsClientEvent';
import { botSettingsDB } from '../../structures/Database';
import { BotSettings } from '../../typings/database';
import { logger } from '../..';
import { InteractionType } from 'discord.js';
import { SlashCommandType } from '../../typings/slashCommand';
import { ContextMenuCommandType } from '../../typings/contextMenuCommand';
import { generateInteractionTrace } from '../../utils';

export default new DjsClientEvent('interactionCreate', async interaction => {
    const { devs, online, }: BotSettings = botSettingsDB.get('settings');
    if (!online && !devs.includes(interaction.user.id)) return;

    const trace = generateInteractionTrace(interaction);
    if (interaction.type === InteractionType.ApplicationCommand) {
        if (interaction.isChatInputCommand()) {
            logger.debug({ message: `Slash command interaction recrived: ${trace}`, });

            const { commandName } = interaction;
            const command = client.commands.commandsExecutable.get(commandName) as SlashCommandType;
            if (!command) return interaction.reply({ content: `tej komendy już nie ma nie używaj jej pls`, ephemeral: true });

            if (command.dev && !devs.includes(interaction.user.id)) return interaction.reply({ content: `Ta komenda jest przeznaczona tylko dla devów nie używaj jej pls`, ephemeral: true });
            if (command.nsfw) {
                if ('nsfw' in interaction.channel && !interaction.channel.nsfw)
                    return interaction.reply({ content: `Można używać NSFW tylko na kanałach oznaczonych jako NSFW!`, ephemeral: true });
                else if (interaction.channel.isThread() && !interaction.channel.parent.nsfw)
                    return interaction.reply({ content: `Można używać NSFW tylko na kanałach oznaczonych jako NSFW!`, ephemeral: true });
            }

            logger.debug({ message: `Executing command: ${interaction.commandName}`, });
            const usedCommand = command.run({ interaction, }).catch(err => logger.error({ message: `Slash command crashed`, err, }));
        }
        else if (interaction.isContextMenuCommand()) {
            logger.debug({ message: `Context menu interaction recrived: ${trace}`, });

            const { commandName } = interaction;
            const command = client.commands.commandsExecutable.get(commandName) as ContextMenuCommandType;
            if (!command) return interaction.reply({ content: `tej komendy już nie ma nie używaj jej pls`, ephemeral: true });

            logger.debug({ message: `Executing command: ${interaction.commandName}`, });
            const usedCommand = command.run({ interaction, }).catch(err => logger.error({ message: `Slash command crashed`, err, }));
        }
    }
    else if (interaction.type === InteractionType.ApplicationCommandAutocomplete) {
        logger.debug({ message: `Interaction autocomplete for: ${interaction.commandName}`, });
        const { commandName } = interaction;
        const command = client.commands.commandsExecutable.get(commandName) as SlashCommandType;
        if (!command.getAutocompletes) return;
        const usedCommand = command.getAutocompletes({ interaction, }).catch(err => logger.error({ message: `Autocomplete command crashed`, err, }));
    }
    else if (interaction.type === InteractionType.MessageComponent) {
        logger.debug({ message: `Component Interaction created: ${trace}`, });
        const automatedInteraction = client.automatedInteractions.get(interaction.customId);
        if (!automatedInteraction || automatedInteraction.type !== InteractionType.MessageComponent) return;

        automatedInteraction.run(interaction).catch(err => logger.error({ message: `Automated interaction crashed`, err, }));
    }
    else if (interaction.type === InteractionType.ModalSubmit) {
        logger.debug({ message: `Modal Interaction created: ${trace}`, });
        const automatedInteraction = client.automatedInteractions.get(interaction.customId);
        if (!automatedInteraction || automatedInteraction.type !== InteractionType.ModalSubmit) return;

        automatedInteraction.run(interaction).catch(err => logger.error({ message: `Automated interaction crashed`, err, }));
    }
});