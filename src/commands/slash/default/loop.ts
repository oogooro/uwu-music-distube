import { ApplicationCommandOptionType, GuildMember } from 'discord.js';
import { RepeatMode } from 'distube';
import { client, logger } from '../../..';
import { SlashCommand } from '../../../structures/Command';

export default new SlashCommand({
    name: 'loop',
    description: 'Zapętl piosenkę lub kolejkę',
    options: [
        {
            type: ApplicationCommandOptionType.Boolean,
            name: 'queue',
            nameLocalizations: {
                pl: 'kolejka',
            },
            description: 'Czy zapętlić kolejkę zamiast samej piosenki',
        },
    ],
    vcOnly: true,
    run: async ({ interaction, }) => {
        const loopQueue = interaction.options.getBoolean('queue');

        const alreadyLooped = client.distube.getQueue(interaction.guildId).repeatMode !== 0;

        client.distube.setRepeatMode(interaction.guildId, alreadyLooped ? RepeatMode.DISABLED : loopQueue ? RepeatMode.QUEUE : RepeatMode.SONG);

        interaction.reply({ content: alreadyLooped ? 'Wyłączono zapętlanie!' : loopQueue ? '🔂 Zapętlno kolejkę!' : '🔁 Zapętlno piosenkę!', }).catch(() => logger.warn({ message: 'Could not reply', silent: true, }));
    },
});