import { client } from '../..';
import { DjsClientEvent } from '../../structures/DjsClientEvent';
import { botSettingsDB } from '../../database/botSettings';
import { logger } from '../..';
import { GuildMember, InteractionType } from 'discord.js';
import { SlashCommandType } from '../../typings/slashCommand';
import { generateInteractionTrace } from '../../utils';
import { UserCommandType } from '../../typings/userCommand';
import { MessageCommandType } from '../../typings/messageCommand';

export default new DjsClientEvent('interactionCreate', async interaction => {
    const { devs, online, } = botSettingsDB.get(process.env.ENV);
    if (!online && !devs.includes(interaction.user.id)) return;

    const trace = generateInteractionTrace(interaction);
    if (interaction.type === InteractionType.ApplicationCommand) {
        const member = interaction.member as GuildMember;
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

            if (command.vcOnly && !member.voice.channel) return interaction.reply({ content: `Musisz być na kanale głosowym, aby użyć tej komendy`, ephemeral: true });

            logger.debug({ message: `Executing command: ${interaction.commandName}`, });
            const usedCommand = command.run({ interaction, }).catch(err => logger.error({ message: `Slash command crashed`, err, }));
        }
        else if (interaction.isMessageContextMenuCommand()) {
            logger.debug({ message: `Message context menu interaction recrived: ${trace}`, });

            const { commandName } = interaction;
            const command = client.commands.commandsExecutable.get(commandName) as MessageCommandType;
            if (!command) return interaction.reply({ content: `tej komendy już nie ma nie używaj jej pls`, ephemeral: true });

            if (command.vcOnly && !member.voice.channel) return interaction.reply({ content: `Musisz być na kanale głosowym, aby użyć tej komendy`, ephemeral: true });

            logger.debug({ message: `Executing command: ${interaction.commandName}`, });
            const usedCommand = command.run({ interaction, }).catch(err => logger.error({ message: `Slash command crashed`, err, }));
        }
        else if (interaction.isUserContextMenuCommand()) {
            logger.debug({ message: `Message context menu interaction recrived: ${trace}`, });

            const { commandName } = interaction;
            const command = client.commands.commandsExecutable.get(commandName) as UserCommandType;
            if (!command) return interaction.reply({ content: `tej komendy już nie ma nie używaj jej pls`, ephemeral: true });

            if (command.vcOnly && !member.voice.channel) return interaction.reply({ content: `Musisz być na kanale głosowym, aby użyć tej komendy`, ephemeral: true });

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