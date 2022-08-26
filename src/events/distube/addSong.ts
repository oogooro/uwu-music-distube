import { client, logger } from '../..';
import { DistubeEvent } from '../../structures/Event';
import { embedColor } from '../../config.json';

export default new DistubeEvent(
    'addSong',
    async (queue, song) => {
        const interaction = client.interactionShared.get(queue.id);

        interaction.editReply({
            embeds: [{
                title: 'Dodano',
                thumbnail: {
                    url: song.thumbnail,
                },
                description: client.utils.distube.songToDisplayString(song),
                color: embedColor,
            }],
        }).catch(err => {
            logger.warn({ message: 'Could not edit reply', });
        });
    }
);