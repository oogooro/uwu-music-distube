import { client, logger } from '../..';
import { DistubeEvent } from '../../structures/Event';

export default new DistubeEvent(
    'playSong',
    async (queue, song) => {
        const songsLeft = queue.songs.length - 1;

        const interaction = client.interactionShared.get(queue.id);

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

        interaction.followUp({
            embeds: [{
                title: 'Teraz gra',
                description: `${song.name} - ${song.uploader.name}\n(dodane przez: <@${song.user.id}>)`,
                color: 0x4d06b8,
                footer: {
                    text: songsLeft === 0 ? `To jest ostatnia piosenka na kolejce` : `${pozostalo} jeszcze ${songsLeft} ${piosenek} na kolejce`,
                },
            }],
        }).catch(err => {
            logger.warn({ message: 'Could not edit reply', });
        });
    }
);