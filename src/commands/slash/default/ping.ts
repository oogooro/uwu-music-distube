import { TextBasedChannel } from 'discord.js';
import { logger, client } from '../../..';
import { SlashCommand } from '../../../structures/Command';

export default new SlashCommand({
    name: 'ping',
    description: 'Pokazuje ping bota',
    run: async ({ interaction, }) => {
        interaction.reply({ content: `:ping_pong: **Ping!**\nWebsocket: ${client.ws.ping}ms\nInterakcje: ...`, fetchReply: true, }).then(async msg => {
            const channel = await client.channels.fetch(interaction.channelId) as TextBasedChannel;

            const time = (await channel.messages.fetch(msg.id)).createdTimestamp - interaction.createdTimestamp;

            interaction.editReply({ content: `:ping_pong: **Ping!**\nWebsocket: ${client.ws.ping}ms\nInterakcje: ${time}ms`, })
                .catch(err => logger.error({ message: `Could not reply`, err, silent: true, }));
        }).catch(err => logger.error({ message: 'Could not send message', err, silent: true, }));
    },
});