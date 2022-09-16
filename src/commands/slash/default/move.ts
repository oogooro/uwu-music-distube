import { ApplicationCommandOptionType } from 'discord.js';
import { client, logger } from '../../..';
import { SlashCommand } from '../../../structures/Command';
import { embedColor } from '../../../config.json';

function arrayMove(arr: any[], fromIndex: number, toIndex: number): void {  // thanks https://stackoverflow.com/a/6470794 (im just too lazy [proceeds to es6ify and tsify it])
    const element = arr[fromIndex];
    arr.splice(fromIndex, 1);
    arr.splice(toIndex, 0, element);
}

export default new SlashCommand({
    name: 'move',
    description: 'Zmienia miejsce piosenki z kolejki',
    vcOnly: true,
    options: [
        {
            type: ApplicationCommandOptionType.Integer,
            name: 'song',
            nameLocalizations: {
                pl: 'piosenka',
            },
            description: 'Numer piosenki do przemieszczenia',
            required: true,
            minValue: 1,
        },
        {
            type: ApplicationCommandOptionType.Integer,
            name: 'place',
            nameLocalizations: {
                pl: 'miejsce',
            },
            description: 'Numer miejsca docelowego',
            required: true,
            minValue: 1,
        },
    ],
    dmPermission: false,
    run: async ({ interaction, }) => {
        const queue = client.distube.getQueue(interaction.guildId);
        if (!queue || !queue?.songs[0]) return interaction.reply({ content: 'Kolejka nie istnieje!', ephemeral: true, }).catch(err => logger.warn({ message: 'could not reply' }));
        const songIndex = interaction.options.getInteger('song');
        const placeIndex = interaction.options.getInteger('place');

        if (songIndex > queue.songs.length) return interaction.reply({ content: 'Nie istnieje taki numer piosenki jaki został podany w opcji `piosenka`!', ephemeral: true, }).catch(err => logger.warn({ message: 'could not reply' }));
        if (placeIndex > queue.songs.length) return interaction.reply({ content: 'Numer `miejsce` za wysoki!\n(||tak już się poddałem||)', ephemeral: true, }).catch(err => logger.warn({ message: 'could not reply' }));
        
        const song = queue.songs[songIndex];

        arrayMove(queue.songs, songIndex, placeIndex);

        interaction.reply({
            embeds: [{
                title: 'Przesunięto piosenkę',
                description: `Przesunięto piosenkę \`${song.name}\` na miejsce nr \`${placeIndex}\`!${songIndex === placeIndex ? ' (nawet jeśli nie ma to sensu)' : ''}`,
                color: embedColor,
            }],
        })
    },
});