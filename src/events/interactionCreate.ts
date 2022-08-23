import { client } from '..';
import { Event } from '../structures/Event';
import { botSettingsDB } from '../structures/Database';
import { botSettings } from '../typings/database';
import { logger } from '..';
import { ChannelType, GuildMember, InteractionType } from 'discord.js';

export default new Event('interactionCreate', async interaction => {
    const { devs, online, }: botSettings = botSettingsDB.get('settings');
    if (!online && !devs.includes(interaction.user.id)) return;

    const trace = client.utils.generateInteractionTrace(interaction);
    if (interaction.type === InteractionType.ApplicationCommand) {
        if (interaction.isChatInputCommand()) {
            logger.debug({ message: `Interaction created: ${trace}`, });

            const subcommands = interaction.commandName.split(' ');
            const comamndName = subcommands.shift();
            const command = client.commands.commandsExecutable.get(comamndName);
            if (!command) return interaction.reply({ content: `tej komendy już nie ma nie używaj jej pls`, ephemeral: true });

            if (command.dev && !devs.includes(interaction.user.id)) return interaction.reply({ content: `Ta komenda jest przeznaczona tylko dla devów nie używaj jej pls`, ephemeral: true });
            if (command.nsfw) {
                if ((interaction.channel.type === ChannelType.GuildText && !interaction.channel) || (interaction.channel.isThread() && !interaction.channel.parent.nsfw)) return interaction.reply({ content: `Nie można używać komend NSFW na kanałech nieoznaczonych jako NSFW`, ephemeral: true });
            }

            const member = interaction.member as GuildMember;

            if (command.vcOnly && !member.voice.channel) return interaction.reply({ content: `Musisz być na kanale głosowym, aby użyć tej komendy`, ephemeral: true });

            logger.debug({ message: `Executing command: ${interaction.commandName}`, });
            const usedCommand = command.run({ interaction, subcommands, }).catch(err => logger.error({ message: `Slash command crashed`, err, }));
        }
        // setTimeout(() => {  // the fuck up timer
        //     if (interaction.deferred && !interaction.replied) interaction.editReply({ content: `:x: Coś poszło nie tak i ta komenda nie została wykonana poprawnie`, })
        //         .catch(err => logger.warn({ message: 'Could not edit reply for failed defered interaction', silent: true, }));
        // }, 15000 /*15s*/);
    }
    else if (interaction.type === InteractionType.ApplicationCommandAutocomplete) {
        logger.debug({ message: `Interaction autocomplete for: ${interaction.commandName}`, });
        const subcommands = interaction.commandName.split(' ');
        const comamndName = subcommands.shift();
        const command = client.commands.commandsExecutable.get(comamndName);
        if (!command.getAutocompletes) return;
        const usedCommand = command.getAutocompletes({ interaction, subcommands, }).catch(err => logger.error({ message: `Autocomplete command crashed`, err, }));
    }
    else if (interaction.type === InteractionType.MessageComponent) {
        logger.debug({ message: `Component Interaction created: ${trace}`, });
    }
});