import { ApplicationCommandOptionType } from 'discord.js';
import { client, distube, logger } from '../..';
import { SlashCommand } from '../../structures/SlashCommand';

export default new SlashCommand({
    data: {
        name: 'loop',
        description: 'Zapętl piosenkę lub kolejkę',
        options: [
            {
                type: ApplicationCommandOptionType.String,
                name: 'mode',
                nameLocalizations: {
                    pl: 'sposób',
                },
                description: 'Sposób zapętlania',
                choices: [
                    { name: '🔂 Piosenka', value: '1', },
                    { name: '🔁 Kolejka', value: '2', },
                    { name: '🚫 Wyłączone', value: '0', },
                ],
                required: true,
            },
        ],
        dmPermission: false,
    },
    vcOnly: true,
    run: async ({ interaction, }) => {
        const queue = distube.getQueue(interaction.guildId);
        if (!queue || !queue?.songs[0]) return interaction.reply({ content: 'Kolejka nie istnieje!', ephemeral: true, }).catch(err => logger.warn({ message: 'could not reply' }));

        const mode = interaction.options.getString('mode');

        queue.setRepeatMode(parseInt(mode));

        const strings = [
            '🚫 Wyłączono zapętlanie!',
            '🔂 Włączono zapętlanie piosenki!',
            '🔁 Włączono zapętlanie kolejki',
        ]

        interaction.reply({ content: strings[mode] });
    },
});
