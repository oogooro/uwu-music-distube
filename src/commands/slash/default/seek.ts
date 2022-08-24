import { SlashCommand } from '../../../structures/Command';
import { client, logger } from '../../..';
import { ApplicationCommandOptionType } from 'discord.js';

function formatTimeDisplay(totalSeconds: number): string {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = Math.floor(totalSeconds % 60);

    function padTo2Digits(num: number): string {
        return num.toString().padStart(2, '0');
    }

    return `${padTo2Digits(minutes)}:${padTo2Digits(seconds)}`;
}

export default new SlashCommand({
    name: 'seek',
    description: 'Pomija do podanego miejsca w piosence',
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
        const time = interaction.options.getString('time');
        const [ sec, min, hour ] = time.split(':').reverse();

        const timeSecs = ( (parseInt(hour) * 3600) || 0 ) + ( (parseInt(min) * 60) || 0 ) + (parseInt(sec) || 0);
        if (!timeSecs) return interaction.reply({ content: 'Nie mam pojęcia co ty mi tu podałeś' })
            .catch(() => logger.warn({ message: 'Could not reply', }));

        const queue = client.distube.seek(interaction.guildId, timeSecs);

        interaction.reply({ content: `Pominięto do \`${formatTimeDisplay(queue.currentTime)}\`!` })
            .catch(() => logger.warn({ message: 'Could not reply', }));
    },
}); 