import { SlashCommand } from '../../structures/SlashCommand';
import { client, distube, logger } from '../..';
import { ApplicationCommandOptionType } from 'discord.js';
import { formatTimeDisplay, trimString } from '../../utils';

export default new SlashCommand({
    data: {
        name: 'seek',
        description: 'Przewija do podanego miejsca w piosence',
        options: [
            {
                type: ApplicationCommandOptionType.Subcommand,
                name: 'time',
                description: 'Przewijaj do podanego czasu',
                options: [
                    {
                        type: ApplicationCommandOptionType.String,
                        name: 'timestamp',
                        nameLocalizations: {
                            pl: 'czas',
                        },
                        description: 'Czas do jakiego przewinąć (w formacie HH:MM:SS lub MM:SS lub SS)',
                        max_length: 8,
                        required: true,
                    },
                ],
            },
            {
                type: ApplicationCommandOptionType.Subcommand,
                name: 'chapter',
                description: 'Przewijaj do wybranego chapteru',
                options: [
                    {
                        type: ApplicationCommandOptionType.String,
                        name: 'chapter',
                        description: 'Chapter do jakiego przewinąć',
                        required: true,
                        autocomplete: true,
                    },
                ],
            },
        ],
        dmPermission: false,
    },
    vcOnly: true,
    run: async ({ interaction }) => {
        const queue = distube.getQueue(interaction.guildId);
        if (!queue || !queue?.songs[0]) return interaction.reply({ content: 'Kolejka nie istnieje!', ephemeral: true, }).catch(err => logger.error({ err, message: 'could not reply' }));  

        if (queue.songs[0].isLive) return interaction.reply({ content: 'Nie można przewijać live!', ephemeral: true, }).catch(err => logger.error({ err, message: 'could not reply' }));  

        let seekTime = -1;

        if (interaction.options.getSubcommand() === 'time') {
            const time = interaction.options.getString('timestamp');
    
            const [ sec, min, hour ] = time.split(':').reverse();
    
            const timeSecs = ( (parseInt(hour) * 3600) || 0 ) + ( (parseInt(min) * 60) || 0 ) + (parseInt(sec));
            if (isNaN(timeSecs) || timeSecs < 0) return interaction.reply({ content: 'Nie potrafię rozczytać podani mi czas! Użyj formatu HH:MM:SS czyli np jak chcesz przewinąć do 8 minuty i 20 sekundy piosenki wpisz 8:20', ephemeral: true, })
                .catch(err => logger.error({ err, message: 'could not reply' }));  
    
            seekTime = timeSecs;
        } else {
            const time = parseInt(interaction.options.getString('chapter'));

            if (isNaN(time) || time < 0) return interaction.reply({ content: 'Nie można przewinąć do podanego chapteru', ephemeral: true, })
                .catch(err => logger.error({ err, message: 'could not reply' }));
            seekTime = time;
        }

        const queueNew = queue.seek(seekTime);
        if (queue.paused) queue.paused = false;   // distube glitch bypass

        interaction.reply({ content: `Przewinięto do \`${formatTimeDisplay(queueNew.currentTime)}\`!` })
            .catch(err => logger.error({ err, message: 'could not reply' }));
    },
    getAutocompletes: async ({ interaction }) => {
        const queue = distube.getQueue(interaction.guildId);
        if (!queue || !queue?.songs[0]) return interaction.respond([]);
        if (!queue.songs[0].chapters) return interaction.respond([]);
        const focused = interaction.options.getFocused().trim();

        if (!focused) return interaction.respond(queue.songs[0].chapters.slice(0, 24).map(ch => { return { name: `${trimString(ch.title, 80)} - ${formatTimeDisplay(ch.start_time)}`, value: ch.start_time.toString() } } )); // queue.songs[0].chapters.slice(0, 24)

        const filtered = queue.songs[0].chapters.filter(ch => ch.title.toLowerCase().includes(focused.toLocaleLowerCase()) );
        interaction.respond(filtered.slice(0, 24).map(ch => { return { name: `${trimString(ch.title, 80)} - ${formatTimeDisplay(ch.start_time)}`, value: ch.start_time.toString() } }));
    },
}); 