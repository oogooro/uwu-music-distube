import { ApplicationCommandOptionType } from 'discord.js';
import { client, logger } from '../../..';
import { SlashCommand } from '../../../structures/Command';
import { embedColor } from '../../../config.json';

export default new SlashCommand({
    name: 'remove',
    description: 'Usuń piosenkę z kolejki',
    vcOnly: true,
    options: [
        {
            type: ApplicationCommandOptionType.Integer,
            name: 'number',
            nameLocalizations: {
                pl: 'numer',
            },
            description: 'Numer piosenki z kolejki',
            required: true,
        },
    ],
    run: async ({ interaction, }) => {
        const num = interaction.options.getInteger('number');
        
        const queue = client.distube.getQueue(interaction.guildId);
        if (!queue || !queue?.songs[0]) return interaction.reply({ content: 'Kolejka nie istnieje!' }).catch(err => logger.warn({ message: 'could not reply' }));
        
        if (num < 1) return interaction.reply({ content: 'Piosenka z takim numerem nie może istnieć', }).catch(err => logger.warn({ message: 'could not reply' }));
        if (num > queue.songs.length) return interaction.reply({ content: 'Nie ma piosenki z takim numerem na kolejce', }).catch(err => logger.warn({ message: 'could not reply' }));

        const [song] = queue.songs.splice(num, 1);

        if (!song) return interaction.reply({ content: 'Nie udało się znaleźć piosenki z takim numerem', }).catch(err => logger.warn({ message: 'could not reply' }));

        interaction.reply({ embeds: [{
            title: 'Usunięto',
            description: client.utils.distube.songToDisplayString(song),
            color: embedColor
        }] })
            .catch(err => logger.warn({ message: 'could not live anymore' }));
    },
});
