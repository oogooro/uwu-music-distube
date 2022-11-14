import { ApplicationCommandOptionType } from 'discord.js';
import { client, distube } from '../..';
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
    run: async ({ interaction, logger }) => {
        const num = interaction.options.getInteger('number');
        
        const queue = distube.getQueue(interaction.guildId);
        if (!queue || !queue?.songs[0]) return interaction.reply({ content: 'Kolejka nie istnieje!', ephemeral: true, }).catch(err => logger.error(err));;  
        
        if (num < 1) return interaction.reply({ content: 'Piosenka z takim numerem nie może istnieć', ephemeral: true, }).catch(err => logger.error(err));;  
        if (num > queue.songs.length) return interaction.reply({ content: 'Nie ma piosenki z takim numerem na kolejce', ephemeral: true, }).catch(err => logger.error(err));;  

        const [song] = queue.songs.splice(num, 1);

        if (!song) return interaction.reply({ content: 'Nie udało się znaleźć piosenki z takim numerem', ephemeral: true, }).catch(err => logger.error(err));;  

        interaction.reply({ embeds: [{
            title: 'Usunięto',
            description: songToDisplayString(song),
            color: config.embedColor
        }] })
            .catch(err => logger.error(err));;  
    },
});
