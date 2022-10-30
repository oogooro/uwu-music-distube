import { ApplicationCommandOptionType } from 'discord.js';
import { client, distube, logger } from '../..';
import { SlashCommand } from '../../structures/SlashCommand';
import config from '../../config';
import { songToDisplayString } from '../../utils';

export default new SlashCommand({
    data: {
        name: 'remove',
        description: 'Usuń piosenkę z kolejki',
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
        dmPermission: false,
    },
    vcOnly: true,
    run: async ({ interaction, }) => {
        const num = interaction.options.getInteger('number');
        
        const queue = distube.getQueue(interaction.guildId);
        if (!queue || !queue?.songs[0]) return interaction.reply({ content: 'Kolejka nie istnieje!', ephemeral: true, }).catch(err => logger.warn({ message: 'could not reply' }));
        
        if (num < 1) return interaction.reply({ content: 'Piosenka z takim numerem nie może istnieć', ephemeral: true, }).catch(err => logger.warn({ message: 'could not reply' }));
        if (num > queue.songs.length) return interaction.reply({ content: 'Nie ma piosenki z takim numerem na kolejce', ephemeral: true, }).catch(err => logger.warn({ message: 'could not reply' }));

        const [song] = queue.songs.splice(num, 1);

        if (!song) return interaction.reply({ content: 'Nie udało się znaleźć piosenki z takim numerem', ephemeral: true, }).catch(err => logger.warn({ message: 'could not reply' }));

        interaction.reply({ embeds: [{
            title: 'Usunięto',
            description: songToDisplayString(song),
            color: config.embedColor
        }] })
            .catch(err => logger.warn({ message: 'could not live anymore' }));
    },
});
