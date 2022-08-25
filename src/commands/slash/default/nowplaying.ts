import { client, logger } from '../../..';
import { SlashCommand } from '../../../structures/Command';
import { embedColor } from '../../../config.json';

export default new SlashCommand({
    name: 'now-playing',
    description: 'Zobacz co aktualnie gra na serwerze',
    run: async ({ interaction }) => {
        const queue = client.distube.getQueue(interaction.guildId);

        if (!queue || !queue?.songs[0]) return interaction.reply({ content: 'Kolejka nie istnieje!' }).catch(err => logger.warn({ message: 'could not reply' }));

        const [song] = queue?.songs;
        
        if (!queue?.playing) return interaction.reply({ content: 'Aktualnie nic nie gra!' + song ? '' : 'Wskocz na kanał głosowy i użyj </play:2137>, aby rozkręcić imprezę!' }).catch(err => logger.warn({ message: 'Could not moja dupa' }));

        const PROGRESS_LENGHT: number = 40;
        const progress = Math.round(queue.currentTime / song.duration * PROGRESS_LENGHT);

        let progressString = '[';

        if (song.isLive) {
            const text = 'LIVESTREAM';

            for (let i = 0; i <= (PROGRESS_LENGHT - text.length) / 2; i++) {
                progressString += ' ';
            }
            progressString += text;
            for (let i = 0; i <= (PROGRESS_LENGHT - text.length) / 2; i++) {
                progressString += ' ';
            }
        } else {
            for (let i = 0; i <= PROGRESS_LENGHT; i++ ) {
                if (i < progress) progressString += '―';
                else if (i === progress) progressString += '๏';
                else progressString += ' ';
            }
        }

        progressString += ']';

        const songsLeft = queue.songs.length - 1;

        let pozostalo: string, piosenek: string;
        if (songsLeft === 1) {
            pozostalo = 'Pozostała';
            piosenek = 'inna piosenka';
        }
        else if (1 < songsLeft && songsLeft < 5) {
            pozostalo = 'Pozostały'
            piosenek = 'piosenki';
        }
        else {
            pozostalo = 'Pozostało'
            piosenek = 'piosenek';
        }

        interaction.reply({
            embeds: [{
                title: 'Teraz gra',
                description: `${client.utils.distube.songToDisplayString(song)}\n\n\`${client.utils.distube.formatTimeDisplay(queue.currentTime)} / ${song.formattedDuration} ${progressString}\``,
                color: embedColor,
                footer: {
                    text: songsLeft === 0 ? `To jest ostatnia piosenka na kolejce` : `${pozostalo} jeszcze ${songsLeft} ${piosenek} na kolejce`,
                },
            }],
        }).catch(() => logger.warn({ message: 'Could not reply', }));
    },
});