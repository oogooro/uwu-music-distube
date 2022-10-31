import { client, distube, logger } from '../..';
import config from '../../config';
import { DistubeEvent } from '../../structures/DistubeEvent';

export default new DistubeEvent(
    'addList',
    async (queue, playlist) => {
        const interaction = distube.interactionShared.get(queue.id);
        distube.interactionShared.delete(queue.id);

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
                thumbnail: {
                    url: playlist.thumbnail,
                },
                description: `${playlistSize} ${piosenek} z [${playlist.name}](${playlist.url})\n(dodane przez: <@${playlist.user.id}>)`,
                color: config.embedColor,
            }],
        }).catch(err => logger.error({ err, message: 'Could not edit reply', }));
    }
);