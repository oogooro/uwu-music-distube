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
    const loggerThread = logger.startThread();
    if (interaction.type === InteractionType.ApplicationCommand) {
        const member = interaction.member as GuildMember;
        if (interaction.isChatInputCommand()) {
            loggerThread.debug(`Slash command interaction recrived: ${trace}`);

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

            loggerThread.debug(`Executing command: ${interaction.commandName}`);
            command.run({ interaction, logger: loggerThread })
                .catch(err => loggerThread.error(err))
                .finally(() => loggerThread.end());
        }
        else if (interaction.isMessageContextMenuCommand()) {
            loggerThread.debug(`Message context menu interaction recrived: ${trace}`);

            const { commandName } = interaction;
            const command = client.commands.commandsExecutable.get(commandName) as MessageCommandType;
            if (!command) return interaction.reply({ content: `tej komendy już nie ma nie używaj jej pls`, ephemeral: true });

            if (command.vcOnly && !member.voice.channel) return interaction.reply({ content: `Musisz być na kanale głosowym, aby użyć tej komendy`, ephemeral: true });

            loggerThread.debug(`Executing command: ${interaction.commandName}`);
            command.run({ interaction, logger: loggerThread })
                .catch(err => loggerThread.error(err))
                .finally(() => loggerThread.end());
        }
        else if (interaction.isUserContextMenuCommand()) {
            loggerThread.debug(`Message context menu interaction recrived: ${trace}`);

            const { commandName } = interaction;
            const command = client.commands.commandsExecutable.get(commandName) as UserCommandType;
            if (!command) return interaction.reply({ content: `tej komendy już nie ma nie używaj jej pls`, ephemeral: true });
            
            if (command.vcOnly && !member.voice.channel) return interaction.reply({ content: `Musisz być na kanale głosowym, aby użyć tej komendy`, ephemeral: true });

            loggerThread.debug(`Executing command: ${interaction.commandName}`);
            command.run({ interaction, logger: loggerThread })
                .catch(err => loggerThread.error(err))
                .finally(() => loggerThread.end());
        }
    }
    else if (interaction.type === InteractionType.ApplicationCommandAutocomplete) {
        loggerThread.debug(`Interaction autocomplete for: ${interaction.commandName}`);
        const { commandName } = interaction;
        const command = client.commands.commandsExecutable.get(commandName) as SlashCommandType;
        if (!command.getAutocompletes) return;
        command.getAutocompletes({ interaction, logger: loggerThread })
            .catch(err => loggerThread.error(err))
            .finally(() => loggerThread.end());
    }
    else if (interaction.type === InteractionType.MessageComponent) {
        loggerThread.debug(`Component Interaction created: ${trace}`);
        const automatedInteraction = client.automatedInteractions.get(interaction.customId);
        if (!automatedInteraction || automatedInteraction.type !== InteractionType.MessageComponent) return;

        automatedInteraction.run({ interaction, logger: loggerThread })
            .catch(err => loggerThread.error(err))
            .finally(() => loggerThread.end());
    }
    else if (interaction.type === InteractionType.ModalSubmit) {
        loggerThread.debug(`Modal Interaction created: ${trace}`);
        const automatedInteraction = client.automatedInteractions.get(interaction.customId);
        if (!automatedInteraction || automatedInteraction.type !== InteractionType.ModalSubmit) return;

        automatedInteraction.run({ interaction, logger: loggerThread })
            .catch(err => loggerThread.error(err))
            .finally(() => loggerThread.end());
    }
});