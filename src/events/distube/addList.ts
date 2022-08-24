import { client, logger } from '../..';
import { DistubeEvent } from '../../structures/Event';

export default new DistubeEvent(
    'addList',
    async (queue, playlist) => {
        const interaction = client.interactionShared.get(queue.id);

        const playlistSize = playlist.songs.length;

        let piosenek: string;
        if (playlistSize === 1) {
            piosenek = 'piosenkę';
        }
        else if (1 < playlistSize && playlistSize < 5) {
            piosenek = 'piosenki';
        }
        else {
            piosenek = 'piosenek';
        }

        interaction.editReply({
            embeds: [{
                title: 'Dodano',
                description: `${playlistSize} ${piosenek} z ${playlist.name}\n(dodane przez: <@${playlist.user.id}>)`,
                color: 0x4d06b8,
            }],
        }).catch(err => {
            logger.warn({ message: 'Could not edit reply', });
        });
    }
);