import { SlashCommand } from '../../../structures/Command';
import { client, logger } from '../../..';
import { ApplicationCommandOptionType } from 'discord.js';

export default new SlashCommand({
    name: 'seek',
    description: 'Przewija do podanego miejsca w piosence',
    vcOnly: true,
    options: [
        {
            type: ApplicationCommandOptionType.String,
            name: 'time',
            nameLocalizations: {
                pl: 'czas',
            },
            description: 'Czas do jakiego przewinąć (w formacie HH:MM:SS lub MM:SS lub SS)',
            max_length: 8,
            required: true,
        },
    ],
    run: async ({ interaction }) => {
        const queue = client.distube.getQueue(interaction.guildId);
        if (!queue || !queue?.songs[0]) return interaction.reply({ content: 'Kolejka nie istnieje!', ephemeral: true, }).catch(err => logger.warn({ message: 'could not reply' }));

        if (queue.songs[0].isLive) return interaction.reply({ content: 'Nie można przewijać live!', ephemeral: true, }).catch(err => logger.warn({ message: 'could not reply' }));

        const time = interaction.options.getString('time');

        const [ sec, min, hour ] = time.split(':').reverse();

        const timeSecs = ( (parseInt(hour) * 3600) || 0 ) + ( (parseInt(min) * 60) || 0 ) + (parseInt(sec));
        if (isNaN(timeSecs) || timeSecs < 0) return interaction.reply({ content: 'Nie potrafię rozczytać podani mi czas! Użyj formatu HH:MM:SS czyli np jak chcesz przewinąć do 8 minuty i 20 sekundy piosenki wpisz 8:20', ephemeral: true, })
            .catch(() => logger.warn({ message: 'Could not reply', }));

        const queueNew = client.distube.seek(interaction.guildId, timeSecs);

        interaction.reply({ content: `Przewinięto do \`${client.utils.distube.formatTimeDisplay(queueNew.currentTime)}\`!` })
            .catch(() => logger.warn({ message: 'Could not reply', }));
    },
}); 