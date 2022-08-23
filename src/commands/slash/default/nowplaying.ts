import { client, logger } from '../../..';
import { SlashCommand } from '../../../structures/Command';

function formatTimeDisplay(totalSeconds: number): string {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = Math.floor(totalSeconds % 60);

    function padTo2Digits(num: number): string {
        return num.toString().padStart(2, '0');
    }

    return `${padTo2Digits(minutes)}:${padTo2Digits(seconds)}`;
}

export default new SlashCommand({
    name: 'now-playing',
    description: 'Zobacz co aktualnie gra na serwerze',
    run: async ({ interaction }) => {
        const queue = client.distube.getQueue(interaction.guildId);
        const [song] = queue?.songs;

        if (!queue?.playing) return interaction.reply({ content: 'Aktualnie nic nie gra!' + song ? '' : 'Wskocz na kanał głosowy i użyj </play:2137>, aby rozkręcić imprezę!' }).catch(err => logger.warn({ message: 'Could not moja dupa' }));

        const PROGRESS_LENGHT: number = 40;
        const progress = Math.round(queue.currentTime / song.duration * PROGRESS_LENGHT);

        let progressString = '`[';

        for (let i = 0; i <= PROGRESS_LENGHT; i++ ) {
            if (i < progress) progressString += '―';
            else if (i === progress) progressString += '๏';
            else progressString += ' ';
        }

        progressString += ']`';

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
                description: `${song.name} - ${song.uploader.name}\n(dodane przez: <@${song.user.id}>)\n\n${formatTimeDisplay(queue.currentTime)} / ${formatTimeDisplay(song.duration)} ${progressString}`,
                color: 0x4d06b8,
                footer: {
                    text: songsLeft === 0 ? `To jest ostatnia piosenka na kolejce` : `${pozostalo} jeszcze ${songsLeft} ${piosenek} na kolejce`,
                },
            }],
        });
    },
});