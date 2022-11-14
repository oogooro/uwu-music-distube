import { ApplicationCommandOptionType } from 'discord.js';
import { client, distube } from '../..';
import { SlashCommand } from '../../structures/SlashCommand';
import config from '../../config';

export default new SlashCommand({
    data: {
        name: 'swap',
        description: 'Zamienia miescami piosenki z kolejki',
        options: [
            {
                type: ApplicationCommandOptionType.Integer,
                name: 'song1',
                nameLocalizations: {
                    pl: 'piosenka1',
                },
                description: 'Numer pierwszej piosenki',
                required: true,
                minValue: 1,
            },
            {
                type: ApplicationCommandOptionType.Integer,
                name: 'song2',
                nameLocalizations: {
                    pl: 'piosenka2',
                },
                description: 'Numer drugiej piosenki',
                required: true,
                minValue: 1,
            },
        ],
        dmPermission: false,
    },
    vcOnly: true,
    run: async ({ interaction, logger }) => {
        const queue = distube.getQueue(interaction.guildId);
        if (!queue || !queue?.songs[0]) return interaction.reply({ content: 'Kolejka nie istnieje!', ephemeral: true, }).catch(err => logger.error(err));;  
        const song1index = interaction.options.getInteger('song1');
        const song2index = interaction.options.getInteger('song2');

        if (song1index > queue.songs.length) return interaction.reply({ content: 'Nie istnieje taki numer piosenki jaki został podany w opcji `piosenka1`!', ephemeral: true, }).catch(err => logger.error(err));;  
        if (song2index > queue.songs.length) return interaction.reply({ content: 'Nie istnieje taki numer piosenki jaki został podany w opcji `piosenka2`!', ephemeral: true, }).catch(err => logger.error(err));;  

        const song1 = queue.songs[song1index];
        const song2 = queue.songs[song2index];

        [ queue.songs[song2index], queue.songs[song1index] ] = [ song1, song2 ];

        interaction.reply({
            embeds: [{
                title: 'Zamieniono miejscami',
                description: `Zamieniono miejscami \`${song1.name}\` z \`${song2.name}\`${song1index === song2index ? ' (lol)' : ''}`,
                color: config.embedColor,
            }],
        })
    },
});